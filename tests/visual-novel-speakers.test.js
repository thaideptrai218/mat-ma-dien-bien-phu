import test from 'node:test';
import assert from 'node:assert/strict';
import {SPEAKERS, normalizeLine} from '../src/ui/visual-novel-speakers.js';
import {voiceOf} from '../src/audio/voice-id.js';
import {selectHero} from '../src/heroes/hero-profiles.js';

test('plain strings are Long; named speakers keep their portrait, the narrator has none', () => {
  assert.deepEqual(normalizeLine('Mình cần xem kỹ.'), {speaker: 'Long', text: 'Tôi cần xem kỹ.'}, "Long says 'tôi' when thinking");
  assert.deepEqual(normalizeLine({speaker: 'Hệ Thống', text: 'Ký Chủ.'}), {speaker: 'Hệ Thống', text: 'Ký Chủ.'});
  assert.equal(normalizeLine({speaker: 'Lạ', text: 'x'}).speaker, 'Lời kể', 'unknown speakers fall back to the narrator card');
  assert.match(SPEAKERS.Long.portrait, /long-portrait\.png$/);
  assert.match(SPEAKERS['Hệ Thống'].portrait, /game-emblem\.png$/);
  assert.equal(SPEAKERS['Lời kể'].portrait, null);
});

test("the chosen hero decides the hero's name and face; Hệ Thống keeps its emblem", () => {
  try {
    selectHero('quang', {persist: false});
    assert.equal(SPEAKERS.Long.name, 'QUANG');
    assert.match(SPEAKERS.Long.portrait, /quang-portrait\.png$/);
    assert.match(SPEAKERS['Hệ Thống'].portrait, /game-emblem\.png$/);
  } finally { selectHero('long', {persist: false}); }
});

test('every speaker shown by the dialogue resolves to a voice id speaker', () => {
  for (const name of Object.keys(SPEAKERS)) assert.ok(voiceOf({speaker: name, text: 'x'}), name);
});
