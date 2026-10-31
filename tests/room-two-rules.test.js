import test from 'node:test';
import assert from 'node:assert/strict';
import {createState, reduce, rendererState} from '../src/room-two/rules.js';
import {sanitizeSave, SAVE_KEY, loadSave, persistSave} from '../src/room-two/save.js';
import {CLUE_IDS, PUZZLE_IDS, puzzles, clues, CHAPTER, evaluatePuzzle, checkFistMove} from '../src/room-two/content.js';
import {getArchiveEntries} from '../src/room-two/archive.js';

const answer = id => structuredClone(puzzles[id].answerSpec);
function recorded(state = createState()) {
  for (const clueId of CLUE_IDS) {
    state = reduce(state, 'discover-clue', {clueId});
    state = reduce(state, 'collect-clue', {clueId});
  }
  return state;
}
function solved() {
  let state = recorded();
  for (const puzzleId of PUZZLE_IDS) state = reduce(state, 'submit-puzzle', {puzzleId, answer: answer(puzzleId)});
  return state;
}

test('Room 2 has no fabricated legacy progress; discovery and recording are distinct', () => {
  let state = createState();
  assert.deepEqual(rendererState(state).completedRoomIds, []);
  assert.equal(reduce(state, 'collect-clue', {clueId: CLUE_IDS[0]}), state);
  state = reduce(state, 'discover-clue', {clueId: CLUE_IDS[0]});
  assert.deepEqual(state.collectedClueIds, []);
  state = reduce(state, 'collect-clue', {clueId: CLUE_IDS[0]});
  assert.deepEqual(state.completedBeatIds, [clues[CLUE_IDS[0]].beatId]);
  assert.equal(reduce(state, 'collect-clue', {clueId: CLUE_IDS[0]}), state);
  assert.equal(state.completedBeatIds.includes('museum-intro'), false);
});

test('only the exact puzzle prefix with each own clue awards II; exit remains separate', () => {
  let state = recorded();
  for (const puzzleId of PUZZLE_IDS.slice(1)) assert.equal(reduce(state, 'submit-puzzle', {puzzleId, answer: answer(puzzleId)}), state);
  for (const [index, puzzleId] of PUZZLE_IDS.entries()) {
    assert.equal(reduce(state, 'exit'), state);
    state = reduce(state, 'submit-puzzle', {puzzleId, answer: answer(puzzleId)});
    assert.equal(state.fragmentCollected, index === 3);
    assert.equal(state.exitReached, false);
    assert.deepEqual(sanitizeSave(state), state);
  }
  assert.deepEqual(rendererState(state).completedRoomIds, ['navarre-plan']);
  assert.equal(reduce(state, 'submit-puzzle', {puzzleId: PUZZLE_IDS[3], answer: answer(PUZZLE_IDS[3])}), state);
  state = reduce(state, 'exit'); assert.equal(state.exitReached, true);
});

test('original evaluators preserve balances, channels, fist mistakes and leading-zero fold', () => {
  for (const id of PUZZLE_IDS) {
    const required = puzzles[id].requiredClueIds;
    assert.equal(evaluatePuzzle(id, answer(id), required).ok, true);
    for (const missing of required) assert.equal(evaluatePuzzle(id, answer(id), required.filter(clue => clue !== missing)).messageKey, 'missing-clues');
  }
  assert.equal(evaluatePuzzle('nava-balance', {...answer('nava-balance'), northWeights: 43}, CLUE_IDS).messageKey, 'wrong-weights');
  assert.equal(evaluatePuzzle('nava-radio', {french: 'Phân tán', vietbac: 'Tập trung'}, CLUE_IDS).messageKey, 'swapped-channels');
  assert.equal(evaluatePuzzle('nava-radio', {french: 'Tập trung', vietbac: 'Phân tán'}, CLUE_IDS).ok, true);
  assert.equal(checkFistMove('nava-fist', [{card: 'lai-chau', region: 'trung-lao'}]).error, 'wrong-region');
  assert.equal(checkFistMove('nava-fist', [{card: 'tha-khet', region: 'trung-lao'}]).error, 'wrong-turn');
  assert.equal(evaluatePuzzle('nava-fold', {target: 'dbp', code: '06/12'}, CLUE_IDS).ok, true);
  assert.equal(evaluatePuzzle('nava-fold', {target: 'dbp', code: '612'}, CLUE_IDS).messageKey, 'wrong-code');
});

test('save restore derives inventory and rejects skipped steps, unknown clues and premature outro', () => {
  const complete = solved();
  for (const raw of [
    {...createState(), fragmentCollected: true, exitReached: true},
    {...recorded(), completedPuzzleIds: ['nava-fold'], fragmentCollected: true},
    {...recorded(), completedPuzzleIds: ['nava-balance', 'nava-fist', 'nava-fold'], fragmentCollected: true},
    {...complete, collectedClueIds: complete.collectedClueIds.filter(id => id !== 'nava-dbp-dossier')},
  ]) assert.equal(sanitizeSave(raw).fragmentCollected, false);
  assert.equal(sanitizeSave({...complete, fragmentCollected: false}).fragmentCollected, true);
  const premature = sanitizeSave({...createState(), completedBeatIds: [CHAPTER.outroBeatId], hintLevels: {'nava-radio': 99, unknown: 1}});
  assert.deepEqual(premature.completedBeatIds, []);
  assert.deepEqual(premature.hintLevels, {'nava-radio': 2});
});

test('outro is only recorded after final fold and is not an added door prerequisite', () => {
  const initial = recorded();
  assert.equal(reduce(initial, 'complete-beat', {beatId: CHAPTER.outroBeatId}), initial);
  const complete = solved();
  assert.equal(reduce(complete, 'exit').exitReached, true);
  const narrated = reduce(complete, 'complete-beat', {beatId: CHAPTER.outroBeatId});
  assert.ok(narrated.completedBeatIds.includes(CHAPTER.outroBeatId));
});

test('canonical Room 2 storage key is isolated and failed storage keeps gameplay usable', () => {
  const writes = [];
  const storage = {getItem(key) { assert.equal(key, SAVE_KEY); return null; }, setItem(key, value) { writes.push([key, value]); }};
  assert.deepEqual(loadSave(storage).state, createState());
  assert.equal(persistSave(storage, solved()), '');
  assert.deepEqual(writes.map(([key]) => key), ['mat-ma-dien-bien-phu:room-two:v1']);
  assert.ok(persistSave(null, solved())); assert.ok(loadSave(null).notice);
});

test('archive includes all original earned narrative paragraphs and remains read-only', () => {
  assert.deepEqual(getArchiveEntries(createState()), []);
  const state = recorded(), before = structuredClone(state), entries = getArchiveEntries(state);
  assert.equal(entries.length, 7); assert.ok(entries.every(entry => entry.paragraphs.length >= 2));
  assert.throws(() => entries[0].paragraphs.push('not saved'), TypeError);
  assert.deepEqual(state, before);
});
