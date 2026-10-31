import test from 'node:test';
import assert from 'node:assert/strict';
import {cellsOnLine, beginSweep, extendSweep} from '../src/room-four/shape-sweep-model.js';
import {strips, phraseFromSlots, SLOT_IDS} from '../src/room-four/final-strips-model.js';
import {createTokenBins, move, contents, trayTokens} from '../src/ui/tactile/token-bins-model.js';
import {BOARDS} from '../src/room-four/puzzle-data.js';
import {createState, reduce, normalizeAnswer, shapeCorrect} from '../src/room-four/rules.js';

test('probe pen: first cell decides add or remove, and fast sweeps leave no gaps', () => {
  assert.deepEqual(cellsOnLine(0, 4), [0, 1, 2, 3, 4]);
  assert.deepEqual(cellsOnLine(4, 0), [4, 3, 2, 1, 0]);
  assert.deepEqual(cellsOnLine(2, 27), [2, 7, 12, 17, 22, 27]);
  assert.deepEqual(cellsOnLine(5, 5), [5]);
  const diagonal = cellsOnLine(0, 12);
  assert.deepEqual(diagonal, [0, 6, 12]);

  let sweep = beginSweep(new Set(), 0);
  assert.equal(sweep.mode, 'add');
  sweep = extendSweep(sweep, 4);
  assert.deepEqual([...sweep.selected].sort((a, b) => a - b), [0, 1, 2, 3, 4]);
  assert.equal(extendSweep(sweep, 4), sweep, 'same cell is a no-op');
  sweep = extendSweep(sweep, 27); // jumps from the top-right corner to the bottom row along a straight line
  assert.deepEqual([...sweep.selected].sort((a, b) => a - b), [0, 1, 2, 3, 4, 9, 13, 18, 22, 27]);

  const erase = beginSweep(new Set(BOARDS.t.cells), 7);
  assert.equal(erase.mode, 'remove');
  assert.ok(!extendSweep(erase, 27).selected.has(17));
  assert.equal(beginSweep(new Set([3]), 3).selected.size, 0, 'a tap on a picked cell un-picks it');
});

test('a probe-pen stroke produces the same payload the old tap-by-tap UI did', () => {
  let sweep = beginSweep(new Set(), 0);
  sweep = extendSweep(sweep, 4);
  sweep = extendSweep(sweep, 27); // top row, then back along the column: not the T shape
  assert.equal(shapeCorrect('t', [...sweep.selected].sort((a, b) => a - b)), false);
  // Top row 0..4 then the stem 7, 12, 17, 22, 27 swept from the middle cell (2) down.
  const row = extendSweep(beginSweep(new Set(), 0), 4);
  const stem = extendSweep(beginSweep(row.selected, 7), 27);
  assert.equal(shapeCorrect('t', [...stem.selected].sort((a, b) => a - b)), true);
  const state = {...createState(), columnSolved: true};
  assert.equal(reduce(state, 'shape', {board: 't', selected: [...stem.selected].sort((a, b) => a - b)}).boardTSolved, true);
});

test('chest strips: both strips come from the solved boards and slot order builds the old phrase', () => {
  const list = strips(BOARDS);
  assert.deepEqual(list.map(s => s.label), ['QUYẾT THẮNG', 'QUYẾT CHIẾN'], 'tray order is not the answer order');
  let model = createTokenBins({tokens: list, bins: SLOT_IDS.map(id => ({id, capacity: 1})), swap: true});
  assert.equal(trayTokens(model).length, 2);
  const byPhrase = phrase => list.find(s => s.phrase === phrase).id;
  model = move(model, byPhrase('QUYETCHIEN'), 'slot-1');
  model = move(model, byPhrase('QUYETTHANG'), 'slot-2');
  assert.equal(trayTokens(model).length, 0);
  const phrase = phraseFromSlots(SLOT_IDS.map(id => contents(model, id)[0].phrase));
  assert.equal(phrase, 'QUYETCHIENQUYETTHANG');
  assert.equal(normalizeAnswer(phrase), 'QUYETCHIENQUYETTHANG');
  const ready = {...createState(), boardTSolved: true, boardLSolved: true};
  assert.equal(reduce(ready, 'final', {phrase}).chestOpened, true);
  // Swapped order is rejected by the unchanged reducer.
  let wrong = createTokenBins({tokens: list, bins: SLOT_IDS.map(id => ({id, capacity: 1})), swap: true});
  wrong = move(move(wrong, byPhrase('QUYETTHANG'), 'slot-1'), byPhrase('QUYETCHIEN'), 'slot-2');
  assert.equal(reduce(ready, 'final', {phrase: phraseFromSlots(SLOT_IDS.map(id => contents(wrong, id)[0].phrase))}), ready);
  // Dropping a strip on a full slot swaps instead of losing it.
  let full = move(createTokenBins({tokens: list, bins: SLOT_IDS.map(id => ({id, capacity: 1})), swap: true}), list[0].id, 'slot-1');
  full = move(full, list[1].id, 'slot-1');
  assert.deepEqual(contents(full, 'slot-1').map(s => s.id), [list[1].id]);
  assert.deepEqual(trayTokens(full).map(s => s.id), [list[0].id]);
});

test('the ruler picks the 0-based column the unchanged reducer expects', () => {
  const state = {...createState(), crosswordSolved: true};
  assert.equal(reduce(state, 'column', {column: 9 - 1}).columnSolved, true);
  assert.equal(reduce(state, 'column', {column: 8 - 1}), state);
});
