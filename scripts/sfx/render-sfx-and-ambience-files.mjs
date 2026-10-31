// Renders one SFX cue or one ambience loop: ffmpeg graph → float WAV → measure → linear gain → MP3.
// Gain is always a single linear `volume` (never dynamic loudnorm) so transients and loop seams stay intact.
import path from 'node:path';
import {ffmpeg, measureLoudness, measurePeakDb, probeDurationSec, SAMPLE_RATE as SR} from './ffmpeg-audio-process-helpers.mjs';
import {kenneyFile} from './kenney-cc0-source-packs.mjs';
import {LOOP, XFADE} from './ambience-loop-recipes.mjs';

export const SFX_PEAK_DB = -6;
export const AMBIENCE_LUFS = -30;
export const AMBIENCE_KBPS = 96;
// Ambience sits under voice: cap stray transients (crackle, clock ticks) at -12 dBFS. latency=1 keeps
// the output sample-aligned so the loop seam is not shifted.
const AMBIENCE_LIMITER = 'alimiter=limit=0.25:attack=5:release=60:level=0:latency=1';
export const SFX_MAX_BYTES = 50 * 1024;
export const AMBIENCE_MAX_BYTES = 600 * 1024;
const SFX_BITRATES = [96, 80, 64, 56, 48, 40, 32];

const MONO = `aformat=sample_fmts=flt:sample_rates=${SR}:channel_layouts=mono`;
const STEREO = `aformat=sample_fmts=flt:sample_rates=${SR}:channel_layouts=stereo`;
// Trim trailing silence and add a 30 ms tail fade without needing to know the clip length.
const TAIL_TRIM = 'areverse,silenceremove=start_periods=1:start_threshold=-60dB,afade=t=in:d=0.03,areverse';

/** Builds {inputs, graph} for a cue: Kenney layers (+ optional synth part) mixed to mono [out]. */
export function buildSfxGraph(recipe, sourcesRoot) {
  const inputs = [], parts = [], labels = [];
  (recipe.layers ?? []).forEach((layer, i) => {
    inputs.push('-i', kenneyFile(sourcesRoot, layer.pack, layer.file));
    const chain = [
      `aresample=${SR}`, MONO, 'silenceremove=start_periods=1:start_threshold=-55dB', layer.chain,
      `volume=${layer.gain ?? 0}dB`, layer.at ? `adelay=delays=${Math.round(layer.at * 1000)}:all=1` : null,
    ].filter(Boolean).join(',');
    parts.push(`[${i}:a]${chain}[l${i}]`);
    labels.push(`[l${i}]`);
  });
  if (recipe.synth) {
    parts.push(recipe.synth());
    labels.push('[syn]');
  }
  const head = labels.length > 1 ? `${labels.join('')}amix=inputs=${labels.length}:normalize=0:duration=longest,` : labels[0];
  parts.push(`${head}${MONO},highpass=f=35,${TAIL_TRIM}[out]`);
  return {inputs, graph: parts.join(';')};
}

const encodeMp3 = (wav, out, gainDb, channels, kbps, extraFilter = '') => ffmpeg([
  '-i', wav, '-af', `volume=${gainDb.toFixed(2)}dB${extraFilter ? ',' + extraFilter : ''}`, '-ac', String(channels), '-ar', String(SR),
  '-c:a', 'libmp3lame', '-b:a', `${kbps}k`, '-map_metadata', '-1', '-id3v2_version', '0', out,
]);

const renderWav = (inputs, graph, wav) => ffmpeg([...inputs, '-filter_complex', graph, '-map', '[out]', '-c:a', 'pcm_f32le', wav]);

export async function renderSfx(recipe, {sourcesRoot, workDir, sfxDir}) {
  const wav = path.join(workDir, `${recipe.id}.wav`), out = path.join(sfxDir, `${recipe.id}.mp3`);
  const {inputs, graph} = buildSfxGraph(recipe, sourcesRoot);
  await renderWav(inputs, graph, wav);
  const peak = await measurePeakDb(wav), seconds = await probeDurationSec(wav);
  // Highest CBR rate that keeps the file under budget (MP3 ≈ kbps × 125 bytes/s + header slack).
  const kbps = SFX_BITRATES.find(rate => seconds * rate * 125 + 2048 <= SFX_MAX_BYTES) ?? 32;
  let gain = SFX_PEAK_DB - peak;
  await encodeMp3(wav, out, gain, 1, kbps);
  // MP3's low-pass/quantization can move the peak by ~1–2 dB on bright cues: one corrective re-encode.
  const drift = SFX_PEAK_DB - (await measurePeakDb(out));
  if (Math.abs(drift) > 0.5) {
    gain += drift;
    await encodeMp3(wav, out, gain, 1, kbps);
  }
  return {out, kbps, processing: `mono ${SR / 1000} kHz, leading/trailing silence trimmed, 30 ms tail fade, linear gain to ${SFX_PEAK_DB} dBFS sample peak, MP3 CBR ${kbps} kbps`};
}

/** Tail→head equal-power crossfade of the bed, then the exact-length layers are mixed on top. */
function loopGraph(layerGains) {
  const L = LOOP, X = XFADE;
  const layers = layerGains.map((gain, i) => `[${i + 1}:a]volume=${gain.toFixed(2)}dB[y${i}]`);
  const mixLabels = ['[bedloop]', ...layerGains.map((_, i) => `[y${i}]`)].join('');
  return [
    `[0:a]asplit=3[h][b][tl]`,
    `[h]atrim=0:${X},asetpts=PTS-STARTPTS,afade=t=in:d=${X}:curve=qsin[hf]`,
    `[tl]atrim=${L}:${L + X},asetpts=PTS-STARTPTS,afade=t=out:d=${X}:curve=qsin[tf]`,
    `[hf][tf]amix=inputs=2:normalize=0[x]`,
    `[b]atrim=${X}:${L},asetpts=PTS-STARTPTS[bd]`,
    `[x][bd]concat=n=2:v=0:a=1[bedloop]`,
    ...layers,
    `${mixLabels}amix=inputs=${layerGains.length + 1}:normalize=0:duration=first,${STEREO}[out]`,
  ].join(';');
}

export async function renderAmbience(recipe, {sourcesRoot, workDir, ambienceDir}) {
  const bedWav = path.join(workDir, `amb-${recipe.id}-bed.wav`);
  await renderWav([], `${recipe.bed()};[bed]${STEREO},atrim=0:${LOOP + XFADE}[out]`, bedWav);
  const bedLufs = (await measureLoudness(bedWav)).lufs;
  if (bedLufs === null) throw new Error(`${recipe.id}: bed is silent`);

  const layerWavs = [], layerGains = [];
  for (const [i, layer] of (recipe.layers ?? []).entries()) {
    const wav = path.join(workDir, `amb-${recipe.id}-layer${i}.wav`);
    const inputs = (layer.files ?? []).flatMap(f => ['-i', kenneyFile(sourcesRoot, f.pack, f.file)]);
    await renderWav(inputs, `${layer.graph()};[lay]${STEREO},apad=whole_dur=${LOOP},atrim=0:${LOOP}[out]`, wav);
    const lufs = (await measureLoudness(wav)).lufs;
    if (lufs === null) throw new Error(`${recipe.id}: layer ${layer.notes} is silent`);
    layerWavs.push(wav);
    layerGains.push(bedLufs + layer.lu - lufs);
  }

  const loopWav = path.join(workDir, `amb-${recipe.id}-loop.wav`), out = path.join(ambienceDir, `${recipe.id}.mp3`);
  await renderWav([bedWav, ...layerWavs].flatMap(f => ['-i', f]), loopGraph(layerGains), loopWav);
  const {lufs} = await measureLoudness(loopWav);
  await encodeMp3(loopWav, out, AMBIENCE_LUFS - lufs, 2, AMBIENCE_KBPS, AMBIENCE_LIMITER);
  const layerNote = (recipe.layers ?? []).map(l => `${l.notes} ${l.lu} LU vs bed`).join(', ');
  return {out, processing: `${LOOP} s seamless loop (noise bed: ${XFADE} s equal-power tail→head crossfade; layers: ${layerNote || 'none'}), linear gain to ${AMBIENCE_LUFS} LUFS integrated, peaks limited to -12 dBFS, stereo MP3 CBR ${AMBIENCE_KBPS} kbps`};
}
