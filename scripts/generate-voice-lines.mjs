// npm run voice:generate -- [--voice=system|quang|narrator] [--room=r1] [--limit=N] [--force]
// Sends each manifest line's ttsText to its TTS engine and caches the raw MP3 as .cache/voice-raw/<id>.mp3.
// Existing files are skipped unless --force, so the run can be resumed after a failure.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {MANIFEST_PATH} from './voice/voice-manifest.mjs';
import {health, synthesize} from './voice/tts-engines.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const RAW_DIR = path.join(root, '.cache/voice-raw');
const args = Object.fromEntries(process.argv.slice(2).map(arg => arg.replace(/^--/, '').split('=')).map(([k, v]) => [k, v ?? true]));

const manifest = JSON.parse(fs.readFileSync(path.join(root, MANIFEST_PATH), 'utf8'));
const todo = manifest.lines
  .filter(line => !args.voice || line.voice === args.voice)
  .filter(line => !args.room || line.rooms.includes(args.room))
  .filter(line => args.force || !fs.existsSync(path.join(RAW_DIR, `${line.id}.mp3`)))
  .slice(0, args.limit ? Number(args.limit) : undefined);

const status = await health();
console.log('services', status);
const needed = new Set(todo.map(line => (line.voice === 'narrator' ? 'omnivoice' : 'capcut')));
const offline = [...needed].filter(engine => status[engine] !== 'ready');
if (offline.length) { console.error(`Not ready: ${offline.join(', ')}. Start the service(s) and rerun.`); process.exit(1); }

fs.mkdirSync(RAW_DIR, {recursive: true});
const logFile = path.join(RAW_DIR, 'log.json');
const log = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile, 'utf8')) : {};
let done = 0, failed = 0;
for (const line of todo) {
  try {
    const audio = await synthesize(line.voice, line.ttsText, line.id);
    fs.writeFileSync(path.join(RAW_DIR, `${line.id}.mp3`), audio);
    log[line.id] = {voice: line.voice, bytes: audio.length, at: new Date().toISOString()};
    done++;
  } catch (error) {
    log[line.id] = {voice: line.voice, error: error.message, at: new Date().toISOString()};
    failed++;
    console.error(`✖ ${line.id} ${line.voice}: ${error.message}`);
  }
  fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
  if ((done + failed) % 10 === 0) console.log(`${done + failed}/${todo.length}`);
}
console.log(`generated ${done}, failed ${failed}, skipped ${manifest.lines.length - todo.length}`);
process.exit(failed ? 1 : 0);
