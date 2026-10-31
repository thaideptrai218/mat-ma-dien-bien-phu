import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {voiceIdFor, voiceOf} from '../src/audio/voice-id.js';
import {numberToWords, toTtsText} from '../scripts/voice/tts-pronunciation.mjs';
import {MANIFEST_PATH, buildManifestLines} from '../scripts/voice/voice-manifest.mjs';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('voice ids are stable, NFC-insensitive and change with voice or text', () => {
  const id = voiceIdFor('system', 'Ký Chủ');
  assert.match(id, /^[0-9a-f]{16}$/);
  assert.equal(voiceIdFor('system', 'Ký Chủ'.normalize('NFD')), id);
  assert.notEqual(voiceIdFor('quang', 'Ký Chủ'), id);
  assert.notEqual(voiceIdFor('system', 'Ký Chủ.'), id);
  assert.equal(voiceOf('Mình đọc tiếp.'), 'quang');
  assert.equal(voiceOf({speaker: 'Lời kể', text: 'x'}), 'narrator');
  assert.equal(voiceOf({speaker: 'Người lạ', text: 'x'}), null);
});

test('the committed manifest matches the current dialogue (run npm run voice:script after text edits)', () => {
  const manifest = JSON.parse(read(MANIFEST_PATH));
  const pick = ({id, voice, rooms, groups, text, ttsText, file}) => ({id, voice, rooms, groups, text, ttsText, file});
  assert.deepEqual(manifest.lines.map(pick), buildManifestLines().map(pick));
  assert.equal(new Set(manifest.lines.map(line => line.id)).size, manifest.lines.length);
  assert.ok(manifest.lines.length > 300);
  for (const voice of ['system', 'quang', 'narrator']) assert.ok(manifest.lines.some(line => line.voice === voice), voice);
});

test('every TTS payload is spelled out: no digits, slashes, dashes or all-caps runs left', () => {
  for (const line of buildManifestLines()) assert.doesNotMatch(line.ttsText, /[0-9/·—–“”]|\p{Lu}{2,}/u, line.text);
});

test('Vietnamese numbers, dates and codes read naturally', () => {
  assert.equal(numberToWords(1954), 'một nghìn chín trăm năm mươi tư');
  assert.equal(numberToWords(16200), 'mười sáu nghìn hai trăm');
  assert.equal(numberToWords(105), 'một trăm linh năm');
  assert.equal(numberToWords(1054), 'một nghìn không trăm năm mươi tư');
  assert.equal(numberToWords(21), 'hai mươi mốt');
  assert.equal(numberToWords(15), 'mười lăm');
  assert.equal(toTtsText('ngày 7/5/1954'), 'ngày mùng bảy tháng năm năm một nghìn chín trăm năm mươi tư');
  assert.equal(toTtsText('tháng 4/1954'), 'tháng tư năm một nghìn chín trăm năm mươi tư');
  assert.equal(toTtsText('Mã 2413 và ô A-03, đồi A1'), 'Mã hai bốn một ba và ô a không ba, đồi a một');
  assert.equal(toTtsText('nhận mảnh tranh số III'), 'nhận mảnh tranh số ba');
  assert.equal(toTtsText('TẬP TRUNG và PHÂN TÁN'), 'tập trung và phân tán');
});

test('session and action code passes dialogue lines from content, never inline strings', () => {
  for (const room of ['one', 'three', 'four', 'five']) {
    for (const file of ['session', 'actions']) {
      const source = read(`src/room-${room}/${file}.js`);
      assert.doesNotMatch(source, /\.dialogue\([^;]*?\[\s*['"`]/su, `src/room-${room}/${file}.js`);
    }
  }
});
