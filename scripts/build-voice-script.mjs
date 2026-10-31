// npm run voice:script — regenerates the voice manifest and the listening/reading review CSV from game content.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {MANIFEST_PATH, REVIEW_CSV_PATH, buildManifestLines, mergeManifest, toReviewCsv} from './voice/voice-manifest.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestFile = path.join(root, MANIFEST_PATH), csvFile = path.join(root, REVIEW_CSV_PATH);

let previous = null;
try { previous = JSON.parse(fs.readFileSync(manifestFile, 'utf8')); } catch { /* first build */ }
const manifest = mergeManifest(previous, buildManifestLines());
const removed = (previous?.lines || []).filter(old => !manifest.lines.some(line => line.id === old.id));

fs.mkdirSync(path.dirname(manifestFile), {recursive: true});
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
fs.mkdirSync(path.dirname(csvFile), {recursive: true});
fs.writeFileSync(csvFile, toReviewCsv(manifest.lines));

const byVoice = manifest.lines.reduce((count, line) => ({...count, [line.voice]: (count[line.voice] || 0) + 1}), {});
console.log(`${manifest.lines.length} lines`, byVoice, removed.length ? `· ${removed.length} stale ids dropped` : '');
console.log(`→ ${MANIFEST_PATH}\n→ ${REVIEW_CSV_PATH}`);
