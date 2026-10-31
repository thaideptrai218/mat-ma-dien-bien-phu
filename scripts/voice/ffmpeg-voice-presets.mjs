// FFmpeg filter graphs per voice. Hệ Thống uses the "mạnh" (strong) robot preset chosen on 2026-10-31.
const TRIM = 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08';
// Trim leading and trailing silence (reverse trick for the tail), keeping 80 ms of air.
const TRIM_BOTH = `${TRIM},areverse,${TRIM},areverse`;
const LOUDNESS = 'loudnorm=I=-16:TP=-1.5:LRA=7';
const ROBOT = "afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75";

export const VOICE_FILTERS = Object.freeze({
  system: `[0:a]${TRIM_BOTH},asplit=2[dry][wet];[wet]${ROBOT}[robot];[dry][robot]amix=inputs=2:weights='0.4 0.6'[mix];` +
    `[mix]flanger=delay=2:depth=2:speed=0.3,acrusher=bits=9:mode=log:aa=1:mix=0.3,highpass=f=180,lowpass=f=6000,` +
    `aecho=0.8:0.6:7|14:0.35|0.25,${LOUDNESS}[out]`,
  quang: `[0:a]${TRIM_BOTH},highpass=f=70,${LOUDNESS}[out]`,
  narrator: `[0:a]${TRIM_BOTH},highpass=f=70,${LOUDNESS}[out]`,
});

export const TARGET_LUFS = -16;

// Step 1: voice preset → lossless WAV (single-pass loudnorm lands within ~1.5 LU on short clips).
export function presetArgs(voice, input, wavOutput) {
  const graph = VOICE_FILTERS[voice];
  if (!graph) throw new Error(`No preset for voice ${voice}`);
  return ['-v', 'error', '-y', '-i', input, '-filter_complex', graph, '-map', '[out]', '-ar', '44100', '-ac', '1', '-c:a', 'pcm_s16le', wavOutput];
}

// Step 2: measure integrated loudness (ebur128 summary is printed on stderr).
export const measureArgs = wav => ['-hide_banner', '-nostats', '-i', wav, '-af', 'ebur128', '-f', 'null', '-'];
export function parseIntegratedLufs(log) {
  const values = [...log.matchAll(/^\s+I:\s+(-?[\d.]+) LUFS/gm)].map(match => Number(match[1]));
  return values.at(-1);
}

// Step 3: exact gain to the target, limiter keeps true peak near -1.5 dBTP; mono 64 kbps MP3 for every browser.
export function encodeArgs(wav, output, measuredLufs) {
  const gain = Number.isFinite(measuredLufs) ? (TARGET_LUFS - measuredLufs).toFixed(2) : '0';
  return ['-v', 'error', '-y', '-i', wav, '-af', `volume=${gain}dB,alimiter=limit=0.84:level=false`,
    '-ar', '44100', '-ac', '1', '-codec:a', 'libmp3lame', '-b:a', '64k', output];
}
