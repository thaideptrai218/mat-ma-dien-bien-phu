// npm run voice:master -- [--voice=system] [--force]
// Applies the per-voice FFmpeg preset to .cache/voice-raw/<id>.mp3 → public/audio/voice/<id>.mp3
// and records durationMs in the manifest (the runtime uses it to pace highlighting).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {MANIFEST_PATH} from './voice/voice-manifest.mjs';
import {presetArgs, measureArgs, parseIntegratedLufs, encodeArgs} from './voice/ffmpeg-voice-presets.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map(arg => arg.replace(/^--/, '').split('=')).map(([k, v]) => [k, v ?? true]));
const manifestFile = path.join(root, MANIFEST_PATH), rawDir = path.join(root, '.cache/voice-raw');
const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));

const run = (command, argv) => new Promise((resolve, reject) => {
  const child = spawn(command, argv, {windowsHide: true});
  let output = '';
  child.stdout.on('data', chunk => { output += chunk; });
  child.stderr.on('data', chunk => { output += chunk; });
  child.on('error', reject);
  child.on('close', code => (code === 0 ? resolve(output) : reject(new Error(`${command} exited ${code}: ${output.slice(0, 400)}`))));
});

const jobs = manifest.lines.filter(line => !args.voice || line.voice === args.voice).filter(line => {
  const raw = path.join(rawDir, `${line.id}.mp3`), out = path.join(root, 'public', line.file);
  if (!fs.existsSync(raw)) return false;
  return args.force || !fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(raw).mtimeMs || !line.durationMs;
});

let done = 0, failed = 0;
async function master(line) {
  const raw = path.join(rawDir, `${line.id}.mp3`), out = path.join(root, 'public', line.file);
  const wav = path.join(rawDir, `${line.id}.master.wav`);
  try {
    await run('ffmpeg', presetArgs(line.voice, raw, wav));
    const lufs = parseIntegratedLufs(await run('ffmpeg', measureArgs(wav)));
    await run('ffmpeg', encodeArgs(wav, out, lufs));
    fs.rmSync(wav, {force: true});
    const seconds = Number(await run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out]));
    line.durationMs = Math.round(seconds * 1000);
    done++;
  } catch (error) {
    failed++;
    console.error(`✖ ${line.id}: ${error.message}`);
  }
}

// Small worker pool: FFmpeg is CPU-bound and each clip is short.
const queue = [...jobs];
await Promise.all(Array.from({length: Math.max(1, Math.min(4, os.cpus().length - 1))}, async () => {
  while (queue.length) await master(queue.shift());
}));
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
const missing = manifest.lines.filter(line => !fs.existsSync(path.join(root, 'public', line.file))).length;
console.log(`mastered ${done}, failed ${failed}, still missing ${missing}/${manifest.lines.length}`);
process.exit(failed ? 1 : 0);
