// npm run audio:sfx -- [--only=system-chime,room-2] [--offline] [--keep-wav]
// Reproducible SFX + ambience pipeline (phase 04): fetches Kenney CC0 packs into .cache/sfx-sources/
// (isolated, audio-only), synthesizes the remaining cues with ffmpeg, normalizes and encodes to
// public/audio/sfx/<cue>.mp3 and public/audio/ambience/<place>.mp3, then writes manifest.json,
// credits.json and the QA table. No background music by design.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {measureLoudness, measurePeakDb, probeDurationSec} from './sfx/ffmpeg-audio-process-helpers.mjs';
import {ensureKenneyPacks} from './sfx/kenney-cc0-source-packs.mjs';
import {KENNEY_FOLEY_CUES} from './sfx/sfx-kenney-foley-cue-recipes.mjs';
import {SYNTH_CUES} from './sfx/sfx-synthesized-cue-recipes.mjs';
import {AMBIENCE_RECIPES} from './sfx/ambience-loop-recipes.mjs';
import {renderAmbience, renderSfx} from './sfx/render-sfx-and-ambience-files.mjs';
import {recipeSources, TOTAL_MAX_BYTES, writeOutputs} from './sfx/write-sfx-manifest-credits-qa-report.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map(arg => arg.replace(/^--/, '').split('=')).map(([k, v]) => [k, v ?? true]));
const dirs = {
  sourcesRoot: path.join(root, '.cache/sfx-sources'),
  workDir: path.join(root, '.cache/sfx-build'),
  sfxDir: path.join(root, 'public/audio/sfx'),
  ambienceDir: path.join(root, 'public/audio/ambience'),
};
const QA_PATH = path.join(root, 'plans/261031-1312-game-audio-voice-sfx/reports/sfx-qa.md');

// Canonical order = phase-04 table order; the build fails if any of these is missing.
const CUE_ORDER = [
  'system-chime', 'system-glitch', 'ui-advance', 'ui-open', 'ui-close', 'hint', 'notebook',
  'paper', 'drawer-open', 'chest-unlock', 'chest-open', 'door-open', 'card-place', 'map-unfold', 'typewriter', 'morse-beep', 'radio-static',
  'success', 'error', 'fragment-get', 'painting-complete', 'door-final-swell', 'time-warp', 'room-transition',
  ...['earth', 'wood', 'stone'].flatMap(s => [1, 2, 3].map(i => `step-${s}-${i}`)),
  'museum', 'bunker', 'room-1', 'room-2', 'room-3', 'room-4', 'room-5',
];

// Listening caveats recorded in the QA report (kept here so a rebuild does not drop them).
const QA_NOTES = [
  'All files were checked by measurement only (peak/LUFS/size/duration); a by-ear pass with voice-over on top is still needed (phase 04 step 4 / phase 06).',
  'Ambience loops are 44 s MP3s. MP3 encoder padding can leave a few ms gap at the loop point with `<audio loop>`; play them through Web Audio (`AudioBufferSourceNode.loop`, which uses the decoded LAME gapless info in Chromium/Firefox) for a seamless loop.',
  'Footsteps are peak-normalized like other SFX (-6 dBFS); the mixer should play them well below UI/result cues.',
  'Battlefield material (bunker thuds, room-4 artillery) is < 90 Hz, echoed and 2–5 LU under the bed — on laptop speakers it is barely audible by design; on headphones it reads as distant rumble.',
  'Loop seams verified by 10 ms RMS windows across end→start: no dip or spike (room-2 shows the clock tick at t = 0, by design). Rebuilds are bit-identical (seeded noise).',
  'Weak spot — ui-advance is a 23 ms tick (all Kenney click_001 contains); swap for select_003 if a softer, longer click is wanted.',
  'Weak spot — footstep variants are uneven: step-wood-2/3 and step-stone-* are 60–70 ms transients vs 220–260 ms for the others; step-earth uses Kenney RPG generic (dirt-like) steps, not a true earth/mud recording.',
  'Weak spot — room-3 crickets / far digging and the room-5 low hum were balanced by measurement only (crickets raised to 0 LU, hum lowered to -8 LU after band analysis); room-3 is the most synthetic-sounding bed.',
  'Weak spot — typewriter is one 0.7 s burst of six keys and morse-beep is one fixed "-.-." group; retrigger them for longer typing / transmission. door-final-swell is 4.1 s at 80 kbps (48.7 KB, close to the 50 KB cap).',
];

const recipes = [...SYNTH_CUES, ...KENNEY_FOLEY_CUES, ...AMBIENCE_RECIPES.map(r => ({...r, kind: 'ambience'}))];
const byId = new Map(recipes.map(r => [r.id, r]));
const missingRecipes = CUE_ORDER.filter(id => !byId.has(id));
if (missingRecipes.length) throw new Error(`no recipe for: ${missingRecipes.join(', ')}`);

for (const dir of Object.values(dirs)) fs.mkdirSync(dir, {recursive: true});
await ensureKenneyPacks(dirs.sourcesRoot, {offline: Boolean(args.offline)});

const only = typeof args.only === 'string' ? new Set(args.only.split(',')) : null;
const queue = CUE_ORDER.filter(id => !only || only.has(id)).map(id => byId.get(id));
const processing = new Map();
let failed = 0;
async function renderOne(recipe) {
  try {
    const result = recipe.kind === 'ambience' ? await renderAmbience(recipe, dirs) : await renderSfx(recipe, dirs);
    processing.set(recipe.id, result.processing);
    console.log(`✓ ${recipe.id}`);
  } catch (error) {
    failed++;
    console.error(`✖ ${recipe.id}: ${error.message}`);
  }
}
await Promise.all(Array.from({length: Math.max(1, Math.min(4, os.cpus().length - 1))}, async () => {
  while (queue.length) await renderOne(queue.shift());
}));

// Measure every final file (also those not rebuilt this run) for manifest, credits and QA.
const entries = [];
for (const id of CUE_ORDER) {
  const recipe = byId.get(id);
  const rel = recipe.kind === 'ambience' ? `audio/ambience/${id}.mp3` : `audio/sfx/${id}.mp3`;
  const file = path.join(root, 'public', rel);
  if (!fs.existsSync(file)) {
    failed++;
    console.error(`✖ missing ${rel}`);
    continue;
  }
  const [seconds, peakDb, loud] = await Promise.all([probeDurationSec(file), measurePeakDb(file), measureLoudness(file)]);
  const previous = (() => {
    try { return JSON.parse(fs.readFileSync(path.join(dirs.sfxDir, 'credits.json'), 'utf8')).files.find(f => f.cue === id); } catch { return null; }
  })();
  const mastering = processing.get(id) ?? previous?.processing.split(' Mastering: ')[1]?.replace(/\.$/, '') ?? 'see scripts/build-sfx.mjs';
  entries.push({
    id, kind: recipe.kind, file: rel, durationMs: Math.round(seconds * 1000), bytes: fs.statSync(file).size,
    peakDb, lufs: loud.lufs, truePeak: loud.truePeak, sources: recipeSources(recipe), notes: recipe.notes, processing: mastering,
  });
}

const {total, over} = writeOutputs({root, entries, qaPath: QA_PATH, qaNotes: QA_NOTES});
if (!args['keep-wav']) fs.rmSync(dirs.workDir, {recursive: true, force: true});
console.log(`built ${CUE_ORDER.length - failed}/${CUE_ORDER.length} · total ${(total / 1024 / 1024).toFixed(2)} MB · over budget: ${over.map(e => e.id).join(', ') || 'none'}`);
process.exit(failed || over.length || total > TOTAL_MAX_BYTES ? 1 : 0);
