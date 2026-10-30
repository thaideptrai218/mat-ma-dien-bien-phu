import test from 'node:test';
import assert from 'node:assert/strict';
import { chapters, clues, beats, puzzles, roomOrder, sources } from '../src/content/story-data.js';
import { applyAction, canEnterChapter, checkFistMove, createInitialState, currentPuzzleId, evaluatePuzzle, normalizeAnswer, validateSave } from '../src/core/game-rules.js';
import { maps } from '../src/content/world-data.js';

const act = (state, type, data = {}) => applyAction(state, { type, ...data });
const open = () => act(act(createInitialState(), 'complete-beat', { beatId: 'museum-intro' }), 'enter-chapter', { chapterId: 'him-lam' });
function collectRoom(state) {
  for (const clueId of chapters[state.chapterId].clueIds) {
    state = act(state, 'discover-clue', { clueId });
    state = act(state, 'collect-clue', { clueId });
  }
  return state;
}
const solutionFor = puzzleId => structuredClone(puzzles[puzzleId].answerSpec);
function solve(state) {
  state = collectRoom(state);
  for (const puzzleId of chapters[state.chapterId].puzzleIds) state = act(state, 'submit-puzzle', { puzzleId, answer: solutionFor(puzzleId) });
  return state;
}
const openRoom2 = () => collectRoom(act(solve(open()), 'enter-chapter', { chapterId: 'navarre-plan' }));

test('the complete story progresses through four rooms and returns to the museum ending', () => {
  let state = createInitialState({ settings: { reducedMotion: true } });
  assert.equal(state.settings.reducedMotion, true);
  assert.equal(state.settings.audioEnabled, false);
  assert.equal(canEnterChapter(state, 'him-lam'), false);
  assert.equal(act(state, 'enter-chapter', { chapterId: 'him-lam' }), state);
  state = act(state, 'complete-beat', { beatId: 'museum-intro' });
  for (const roomId of roomOrder) {
    state = act(state, 'enter-chapter', { chapterId: roomId });
    assert.equal(state.chapterId, roomId);
    assert.equal(state.checkpointId, 'entry');
    state = act(state, 'complete-beat', { beatId: chapters[roomId].introBeatId });
    state = roomId === 'peace' ? act(collectRoom(state), 'finish-peace') : solve(state);
    assert.deepEqual(state.completedRoomIds, roomOrder.slice(0, roomOrder.indexOf(roomId) + 1));
    assert.ok(validateSave(state));
  }
  state = act(state, 'enter-chapter', { chapterId: 'ending' });
  state = act(state, 'complete-beat', { beatId: 'ending-intro' });
  assert.equal(state.chapterId, 'ending');
  assert.ok(state.completedBeatIds.includes('ending-intro'));
  assert.ok(validateSave(state));
  assert.equal(act(state, 'finish-peace'), state);
});

test('discovery is not collection; clue completion is atomic, resumable and idempotent', () => {
  const state = open();
  const clueId = 'him-lam-position';
  const beatId = clues[clueId].beatId;
  assert.equal(act(state, 'collect-clue', { clueId }), state);
  assert.equal(act(state, 'complete-beat', { beatId }), state);
  assert.equal(act(state, 'discover-clue', { clueId: 'command-report' }), state);
  const discovered = act(state, 'discover-clue', { clueId });
  assert.deepEqual(discovered.collectedClueIds, []);
  const resumed = validateSave(discovered);
  assert.deepEqual(resumed.discoveredClueIds, [clueId]);
  const collected = act(resumed, 'collect-clue', { clueId });
  assert.deepEqual(collected.collectedClueIds, [clueId]);
  assert.deepEqual(collected.completedBeatIds, ['museum-intro', beatId]);
  assert.equal(act(collected, 'collect-clue', { clueId }), collected);
  assert.equal(act(collected, 'discover-clue', { clueId }), collected);
  assert.equal(act(discovered, 'complete-beat', { beatId }), discovered);
  assert.deepEqual(state.discoveredClueIds, []);
});

test('Him Lam requires four collected cards, exact order and no duplicated or unknown cards', () => {
  const answer = { orderedStageIds: ['position', 'artillery', 'infantry', 'victory'] };
  const required = chapters['him-lam'].clueIds;
  assert.equal(evaluatePuzzle('him-lam', answer, required).ok, true);
  for (let index = 0; index < required.length; index++) assert.equal(evaluatePuzzle('him-lam', answer, required.filter((_, i) => i !== index)).messageKey, 'missing-clues');
  for (const orderedStageIds of [[], ['position', 'artillery', 'infantry'], ['artillery', 'position', 'infantry', 'victory'], ['position', 'artillery', 'infantry', 'infantry'], ['position', 'artillery', 'infantry', 'unknown']]) {
    assert.equal(evaluatePuzzle('him-lam', { orderedStageIds }, required).ok, false);
  }
  let discovered = open();
  for (const clueId of required) discovered = act(discovered, 'discover-clue', { clueId });
  assert.equal(act(discovered, 'submit-puzzle', { puzzleId: 'him-lam', answer }), discovered);
  const completed = solve(discovered);
  assert.deepEqual(completed.completedRoomIds, ['him-lam']);
  assert.equal(act(completed, 'submit-puzzle', { puzzleId: 'him-lam', answer }), completed);
});

test('telegram needs its fragment order and its date', () => {
  const telegram = puzzles['command-post'];
  assert.equal(evaluatePuzzle(telegram.id, { ...telegram.answerSpec, date: '1954-03-13' }, telegram.requiredClueIds).ok, false);
  assert.equal(evaluatePuzzle(telegram.id, { ...telegram.answerSpec, orderedFragmentIds: ['advance', 'advance', 'capture'] }, telegram.requiredClueIds).ok, false);
  assert.equal(evaluatePuzzle(telegram.id, telegram.answerSpec, telegram.requiredClueIds).ok, true);
  assert.equal(evaluatePuzzle('peace', {}, [] ).messageKey, 'unknown-puzzle');
});

test('chapter gates, bounded hints, revisits and checkpoint updates preserve progress', () => {
  let state = open();
  assert.equal(act(state, 'enter-chapter', { chapterId: 'navarre-plan' }), state);
  assert.equal(act(state, 'complete-beat', { beatId: 'ending-intro' }), state);
  assert.equal(act(state, 'reach-checkpoint', { chapterId: 'museum', checkpointId: 'far' }), state);
  for (const checkpointId of ['', ' ', 1, 'x'.repeat(81)]) assert.equal(act(state, 'reach-checkpoint', { chapterId: state.chapterId, checkpointId }), state);
  state = act(state, 'reach-checkpoint', { chapterId: state.chapterId, checkpointId: 'east-safe' });
  assert.equal(state.checkpointId, 'east-safe');
  assert.equal(act(state, 'reach-checkpoint', { chapterId: state.chapterId, checkpointId: 'east-safe' }), state);
  for (let count = 0; count < 2; count++) state = act(state, 'use-hint', { puzzleId: 'him-lam' });
  assert.equal(state.hintLevels['him-lam'], 2);
  assert.equal(act(state, 'use-hint', { puzzleId: 'him-lam' }), state);
  assert.equal(act(state, 'use-hint', { puzzleId: 'command-post' }), state);
  state = solve(state);
  state = act(state, 'enter-chapter', { chapterId: 'navarre-plan' });
  state = act(state, 'enter-chapter', { chapterId: 'him-lam' });
  assert.equal(state.chapterId, 'him-lam');
  assert.equal(state.checkpointId, 'entry');
  assert.ok(validateSave(state));
});

test('peace permits continuing without optional memories, typed text or a moral answer', () => {
  let state = open();
  for (const chapterId of roomOrder.slice(0, 3)) {
    state = act(state, 'enter-chapter', { chapterId });
    state = solve(state);
  }
  state = act(state, 'enter-chapter', { chapterId: 'peace' });
  const finished = act(state, 'finish-peace');
  assert.equal(finished.collectedClueIds.some(id => id.startsWith('peace-')), false);
  assert.equal(canEnterChapter(finished, 'ending'), true);
  assert.equal(Object.hasOwn(finished, 'reflection'), false);
  assert.ok(validateSave(finished));
  const ending = act(finished, 'enter-chapter', { chapterId: 'ending' });
  assert.equal(ending.chapterId, 'ending');
  assert.ok(validateSave(ending));
});

test('save validation rejects inconsistent progress and sanitizes session-only fields', () => {
  const state = solve(open());
  const mutations = [
    { version: 2 }, { chapterId: 'ending' }, { chapterId: ['museum'] }, { checkpointId: null },
    { completedRoomIds: ['navarre-plan'] }, { completedRoomIds: ['him-lam', 'him-lam'] },
    { discoveredClueIds: ['unknown'] }, { discoveredClueIds: [] }, { collectedClueIds: [] },
    { completedBeatIds: ['museum-intro'] }, { completedBeatIds: [...state.completedBeatIds, 'ending-intro'] },
    { hintLevels: { 'him-lam': 3 } }, { hintLevels: { 'him-lam': NaN } }, { hintLevels: { 'him-lam': 0.5 } }, { hintLevels: { unknown: 1 } },
  ];
  for (const mutation of mutations) assert.equal(validateSave({ ...state, ...mutation }), null, JSON.stringify(mutation));
  for (const audioVolume of [NaN, Infinity, -0.1, 1.1, '0.5', null]) assert.equal(validateSave({ ...state, settings: { ...state.settings, audioVolume } }), null);
  assert.equal(validateSave({ ...state, settings: { ...state.settings, audioEnabled: 'yes' } }), null);
  assert.equal(validateSave({ ...state, settings: { ...state.settings, reducedMotion: 1 } }), null);
  const sanitized = validateSave({ ...state, checkpointId: 'unknown-map-checkpoint', reflection: '<b>private</b>', activeBeatId: 'other', lineIndex: 2, audioUnlocked: true, settings: { ...state.settings, private: true } });
  assert.deepEqual(Object.keys(sanitized).sort(), Object.keys(createInitialState()).sort());
  assert.equal(sanitized.checkpointId, 'unknown-map-checkpoint');
  assert.equal(Object.hasOwn(sanitized.settings, 'private'), false);
  assert.equal(validateSave({ ...createInitialState(), discoveredClueIds: ['him-lam-position'] }), null);
});

test('settings and invalid actions cannot mutate the previous state', () => {
  const state = createInitialState();
  for (const action of [null, {}, { type: 'finish-peace' }, { type: 'enter-chapter', chapterId: ['museum'] }, { type: 'set-settings', settings: { audioVolume: NaN } }]) assert.equal(applyAction(state, action), state);
  const updated = act(state, 'set-settings', { settings: { brightness: 'bright', audioEnabled: true, audioVolume: 0 } });
  assert.deepEqual(updated.settings, { brightness: 'bright', reducedMotion: false, audioEnabled: true, audioVolume: 0 });
  assert.equal(state.settings.brightness, 'normal');
  assert.equal(act(updated, 'set-settings', { settings: { audioVolume: 0 } }), updated);
});

test('every content reference resolves and every clue has meaningful narrated dialogue', () => {
  for (const item of Object.values(clues)) {
    assert.ok(chapters[item.chapterId].clueIds.includes(item.id));
    assert.ok(beats[item.beatId].requiredDiscoveredClueIds.includes(item.id));
    assert.ok(beats[item.beatId].lines.length >= 2);
  }
  for (const item of Object.values(beats)) for (const line of item.lines) {
    assert.ok(['quang', 'system'].includes(line.speakerId));
    assert.ok(line.text.length > 40);
    for (const sourceId of line.sourceIds) assert.ok(sources[sourceId]);
  }
  for (const puzzle of Object.values(puzzles)) {
    assert.ok(chapters[puzzle.chapterId].puzzleIds.includes(puzzle.id));
    for (const clueId of puzzle.requiredClueIds) assert.equal(clues[clueId].chapterId, puzzle.chapterId);
    for (const sourceId of puzzle.sourceIds || []) assert.ok(sources[sourceId]);
  }
});

test('Room 2 plays four steps in order; only the last one completes the room and unlocks the door', () => {
  let state = openRoom2();
  const ids = chapters['navarre-plan'].puzzleIds;
  for (const later of ids.slice(1)) assert.equal(act(state, 'submit-puzzle', { puzzleId: later, answer: solutionFor(later) }), state, later);
  ids.forEach((puzzleId, index) => {
    assert.equal(currentPuzzleId(state), puzzleId);
    assert.equal(canEnterChapter(state, 'command-post'), false);
    state = act(state, 'submit-puzzle', { puzzleId, answer: solutionFor(puzzleId) });
    assert.equal(state.completedPuzzleIds.at(-1), puzzleId);
    assert.equal(state.completedRoomIds.includes('navarre-plan'), index === ids.length - 1);
    assert.equal(act(state, 'submit-puzzle', { puzzleId, answer: solutionFor(puzzleId) }), state, 'a solved step cannot be submitted twice');
    assert.ok(validateSave(state));
  });
  assert.equal(currentPuzzleId(state), 'nava-fold');
  assert.equal(maps['navarre-plan'].exits[0].requiresRoomId, 'navarre-plan');
  assert.equal(canEnterChapter(state, 'command-post'), true);
});

test('each Room 2 step needs exactly its own recorded clues, and the room needs every clue', () => {
  for (const puzzleId of chapters['navarre-plan'].puzzleIds) {
    const required = puzzles[puzzleId].requiredClueIds;
    assert.equal(evaluatePuzzle(puzzleId, solutionFor(puzzleId), []).messageKey, 'missing-clues');
    assert.equal(evaluatePuzzle(puzzleId, solutionFor(puzzleId), required).ok, true);
    for (const clueId of required) assert.equal(evaluatePuzzle(puzzleId, solutionFor(puzzleId), required.filter(id => id !== clueId)).messageKey, 'missing-clues');
  }
  assert.deepEqual(new Set(chapters['navarre-plan'].puzzleIds.flatMap(id => puzzles[id].requiredClueIds)), new Set(chapters['navarre-plan'].clueIds));
  let discovered = act(solve(open()), 'enter-chapter', { chapterId: 'navarre-plan' });
  discovered = act(discovered, 'discover-clue', { clueId: 'nava-planner' });
  assert.equal(act(discovered, 'submit-puzzle', { puzzleId: 'nava-balance', answer: solutionFor('nava-balance') }), discovered, 'seen but unrecorded clues do not count');
});

test('balance needs every card on its step and 44 weights on the Bắc Bộ pan', () => {
  const right = solutionFor('nava-balance');
  const check = answer => evaluatePuzzle('nava-balance', answer, puzzles['nava-balance'].requiredClueIds);
  assert.equal(check(right).ok, true);
  for (const northWeights of [43, 45, '44', 40]) assert.equal(check({ ...right, northWeights }).messageKey, 'wrong-weights', String(northWeights));
  const { withdraw, ...partial } = right.cardSteps;
  for (const cardSteps of [partial, { ...right.cardSteps, withdraw: 'step-2' }, { ...right.cardSteps, extra: 'none' }, null]) assert.equal(check({ ...right, cardSteps }).messageKey, 'wrong-steps');
  assert.equal(withdraw, 'none');
});

test('the radio tape interleaves the two words; answers ignore accents and spacing but not channels', () => {
  const tape = [...puzzles['nava-radio'].tape];
  assert.equal(tape.filter((_, index) => index % 2 === 0).join(''), 'TAPTRUNG');
  assert.equal(tape.filter((_, index) => index % 2 === 1).join(''), 'PHANTAN');
  const check = answer => evaluatePuzzle('nava-radio', answer, puzzles['nava-radio'].requiredClueIds);
  for (const french of ['Tập trung', 'tap trung', 'TAPTRUNG', ' tập-trung ']) assert.equal(check({ french, vietbac: 'Phân tán' }).ok, true, french);
  assert.equal(check({ french: 'PHÂN TÁN', vietbac: 'TẬP TRUNG' }).messageKey, 'swapped-channels');
  assert.equal(check({ french: 'TAPTRUNG', vietbac: 'TAPTRUNG' }).ok, false);
  assert.equal(check({ french: 42, vietbac: 'PHANTAN' }).ok, false);
  assert.equal(normalizeAnswer('Đường 12'), 'DUONG12');
});

test('fist: a wrong region bounces, a right pair out of turn closes the hand, four moves in order finish', () => {
  const moves = puzzles['nava-fist'].answerSpec.moves.map(({ card, region }) => ({ card, region }));
  assert.deepEqual(checkFistMove('nava-fist', moves.slice(0, 1)), { ok: true, done: false, error: null });
  assert.deepEqual(checkFistMove('nava-fist', moves), { ok: true, done: true, error: null });
  assert.equal(checkFistMove('nava-fist', [{ card: 'lai-chau', region: 'trung-lao' }]).error, 'wrong-region');
  assert.equal(checkFistMove('nava-fist', [{ card: 'unknown', region: 'tay-bac' }]).error, 'wrong-region');
  assert.equal(checkFistMove('nava-fist', [moves[1]]).error, 'wrong-turn');
  assert.equal(checkFistMove('nava-fist', [moves[0], moves[2]]).error, 'wrong-turn');
  assert.equal(checkFistMove('nava-fist', [...moves, moves[0]]).ok, false);
  assert.equal(checkFistMove('nava-balance', moves).ok, false);
  const check = answer => evaluatePuzzle('nava-fist', answer, puzzles['nava-fist'].requiredClueIds);
  assert.equal(check({ moves }).ok, true);
  for (const wrong of [[moves[1], moves[0], moves[2], moves[3]], moves.slice(0, 3), 'moves']) assert.equal(check({ moves: wrong }).ok, false);
});

test('fold must reach Điện Biên Phủ, and the lock takes the day and month 0612', () => {
  const check = answer => evaluatePuzzle('nava-fold', answer, puzzles['nava-fold'].requiredClueIds);
  for (const code of ['0612', '06/12', '06 12', '06-12']) assert.equal(check({ target: 'dbp', code }).ok, true, code);
  for (const target of ['pleiku', 'seno', 'luang-prabang', '']) assert.equal(check({ target, code: '0612' }).messageKey, 'wrong-target', target);
  for (const code of ['0712', '612', '', 612]) assert.equal(check({ target: 'dbp', code }).messageKey, 'wrong-code', String(code));
  const fold = puzzles['nava-fold'];
  // The flap shows even-indexed characters, each strip its odd ones: only the right strip completes the line, every wrong one breaks
  // it at every strip character, and neither half alone reads as the line.
  for (const target of fold.targets) {
    target.text.forEach((line, row) => {
      const truth = [...fold.foldText[row]], chars = [...line];
      assert.equal(chars.length, truth.length, `${target.id} line ${row} keeps the cell count`);
      chars.forEach((char, index) => { if (index % 2) assert.equal(char === truth[index], target.id === fold.answerSpec.target, `${target.id} ${row}:${index}`); });
    });
  }
});

test('the Room 2 outro opens only after the room is complete', () => {
  let state = openRoom2();
  assert.equal(act(state, 'complete-beat', { beatId: 'navarre-plan-outro' }), state);
  state = solve(state);
  state = act(state, 'complete-beat', { beatId: 'navarre-plan-outro' });
  assert.ok(state.completedBeatIds.includes('navarre-plan-outro'));
  assert.ok(validateSave(state));
});

test('saves keep step progress, reject skipped or unknown steps and still load older saves', () => {
  const state = act(openRoom2(), 'submit-puzzle', { puzzleId: 'nava-balance', answer: solutionFor('nava-balance') });
  assert.deepEqual(validateSave(state).completedPuzzleIds, ['him-lam', 'nava-balance']);
  for (const completedPuzzleIds of [['him-lam', 'nava-radio'], ['him-lam', 'nava-balance', 'unknown'], ['him-lam', 'nava-balance', 'nava-balance'], ['nava-balance'], ['him-lam', ...chapters['navarre-plan'].puzzleIds], 'him-lam', null]) {
    assert.equal(validateSave({ ...state, completedPuzzleIds }), null, JSON.stringify(completedPuzzleIds));
  }
  assert.equal(validateSave({ ...state, completedBeatIds: [...state.completedBeatIds, 'navarre-plan-outro'] }), null);
  const { completedPuzzleIds: _done, ...legacy } = solve(open());
  assert.deepEqual(validateSave(legacy).completedPuzzleIds, ['him-lam']);
  const { completedPuzzleIds: _step, ...legacyRoom2 } = state;
  assert.deepEqual(validateSave(legacyRoom2).completedPuzzleIds, ['him-lam']);
});
