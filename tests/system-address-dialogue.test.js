import test from 'node:test';
import assert from 'node:assert/strict';
import * as roomOne from '../src/room-one/content.js';
import * as roomThree from '../src/room-three/content.js';
import * as roomFour from '../src/room-four/content.js';
import * as roomFive from '../src/room-five/content.js';
import {beats as voicedBeats, PUZZLE_GUIDE, SYSTEM_HINTS as roomTwoHints} from '../src/room-two/system-guidance.js';
import {beats as donorBeats, CHAPTER} from '../src/room-two/content.js';

// Hệ Thống calls Quang "Ký Chủ"; Quang calls it "Hệ Thống" and says "tao" to it.
const lists = [
  roomOne.INTRO, roomOne.ENDING, roomOne.CAMPAIGN_ENDING, ...Object.values(roomOne.GUIDE),
  roomThree.INTRO, roomThree.CAMPAIGN_INTRO, roomThree.ENDING, roomThree.CAMPAIGN_ENDING, ...Object.values(roomThree.GUIDE),
  roomFour.INTRO, roomFour.CAMPAIGN_INTRO, roomFour.ENDING, roomFour.CAMPAIGN_ENDING, ...Object.values(roomFour.GUIDE),
  roomFive.INTRO, roomFive.REFLECTION_SCRIPT, ...Object.values(roomFive.GUIDE), ...Object.values(PUZZLE_GUIDE),
];
// Hệ Thống's hint cards: {open, hints[]} per puzzle, all spoken by Hệ Thống to Ký Chủ.
const hintSets = [roomOne, roomTwoHints, roomThree, roomFour, roomFive].map(m => m.SYSTEM_HINTS ?? m);
const hintLines = hintSets.flatMap(set => Object.values(set)).flatMap(({open, hints}) => [open, ...hints])
  .map(text => ({speaker: 'Hệ Thống', text}));
const lines = [...lists.flat(), ...hintLines];
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

test('SYSTEM_HINTS: every puzzle has a short reminder and two gentle levels, addressed to Ký Chủ', () => {
  const expected = [
    [roomOne.SYSTEM_HINTS, ['a03', 'comparison', 'drawer', 'identity', 'chest']],
    [roomTwoHints, ['nava-balance', 'nava-radio', 'nava-fist', 'nava-fold']],
    [roomThree.SYSTEM_HINTS, ['preparation', 'cargo', 'strategy', 'opening', 'final']],
    [roomFour.SYSTEM_HINTS, ['crossword', 'column', 'board-t', 'board-l', 'final']],
    [roomFive.SYSTEM_HINTS, ['assembly']],
  ];
  let count = 0;
  for (const [hints, ids] of expected) {
    assert.deepEqual(Object.keys(hints).sort(), [...ids].sort());
    for (const {open, hints: levels} of Object.values(hints)) {
      assert.equal(levels.length, 2, 'level 1 (very light) and level 2 (a bit more specific)');
      assert.ok(open.length < 90, `short reminder: ${open}`);
      assert.match(open, /Ký Chủ/u, open);
      count += 1 + levels.length;
    }
  }
  assert.equal(count, 60, '20 puzzles x (reminder + 2 levels)');
});

test('hints stay light: no codes, numbers, dates or revealed answers in any hint', () => {
  for (const {text} of hintLines) {
    assert.doesNotMatch(text, /\d/u, `no digits: ${text}`);
    assert.doesNotMatch(text, /\b(NAVA|2413|TẬP TRUNG|PHÂN TÁN|QUYẾT)\b/u, text);
  }
});
