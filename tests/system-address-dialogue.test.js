import test from 'node:test';
import assert from 'node:assert/strict';
import * as roomOne from '../src/room-one/content.js';
import * as roomThree from '../src/room-three/content.js';
import * as roomFour from '../src/room-four/content.js';
import * as roomFive from '../src/room-five/content.js';
import {beats as voicedBeats, PUZZLE_GUIDE} from '../src/room-two/system-guidance.js';
import {beats as donorBeats, CHAPTER} from '../src/room-two/content.js';

// Hệ Thống calls Quang "Ký Chủ"; Quang calls it "Hệ Thống" and says "tao" to it.
const lists = [
  roomOne.INTRO, roomOne.ENDING, roomOne.CAMPAIGN_ENDING, ...Object.values(roomOne.GUIDE),
  roomThree.INTRO, roomThree.CAMPAIGN_INTRO, roomThree.ENDING, roomThree.CAMPAIGN_ENDING, ...Object.values(roomThree.GUIDE),
  roomFour.INTRO, roomFour.CAMPAIGN_INTRO, roomFour.ENDING, roomFour.CAMPAIGN_ENDING, ...Object.values(roomFour.GUIDE),
  roomFive.INTRO, roomFive.REFLECTION_SCRIPT, ...Object.values(roomFive.GUIDE), ...Object.values(PUZZLE_GUIDE),
];
const lines = lists.flat();
const roomTwoLines = [CHAPTER.introBeatId, CHAPTER.outroBeatId].flatMap(id => voicedBeats[id].lines)
  .map(line => ({speaker: line.speakerId === 'system' ? 'Hệ Thống' : 'Quang', text: line.text}));

test('Hệ Thống addresses Quang as Ký Chủ and never as ngươi or bạn', () => {
  const system = [...lines, ...roomTwoLines].filter(line => line.speaker === 'Hệ Thống');
  assert.ok(system.length > 30);
  for (const line of system) assert.doesNotMatch(line.text, /(^|[\s,.;:!?“"(])([Nn]gươi|[Bb]ạn)(?=$|[\s,.;:!?”")])/u, line.text);
  assert.ok(system.filter(line => line.text.includes('Ký Chủ')).length > 20);
  assert.ok(lines.every(line => line.speaker !== 'Hệ thống'), 'speaker label is the proper name Hệ Thống');
});

test('Quang says tao to Hệ Thống in the guidance conversations', () => {
  const guidance = [roomOne.GUIDE, roomThree.GUIDE, roomFour.GUIDE, roomFive.GUIDE, PUZZLE_GUIDE].flatMap(Object.values).flat();
  const quang = guidance.filter(line => line.speaker === 'Quang');
  assert.ok(quang.length >= 10);
  for (const line of quang) assert.match(line.text, /\b[Tt]ao\b|Hệ Thống/u, line.text);
});

test('Room 2 overlay only re-voices the intro and outro; recorded clue narratives stay the donor text', () => {
  for (const [id, beat] of Object.entries(donorBeats)) {
    if (id === CHAPTER.introBeatId || id === CHAPTER.outroBeatId) continue;
    assert.equal(voicedBeats[id], beat, id);
  }
  assert.ok(voicedBeats[CHAPTER.outroBeatId].lines[0].text.includes('thuộc về Ký Chủ'));
  assert.deepEqual(Object.keys(voicedBeats).sort(), Object.keys(donorBeats).sort());
});
