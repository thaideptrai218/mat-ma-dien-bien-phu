import test from 'node:test';
import assert from 'node:assert/strict';
import {handleAction, handleIntent} from '../src/room-two/actions.js';
import {createState, reduce} from '../src/room-two/rules.js';
import {CLUE_IDS, PUZZLE_IDS, CHAPTER, clues, puzzles} from '../src/room-two/content.js';

function session() {
  return {state: createState(), active: null, options: {}, disposed: false, notice: '', nonce: 0,
    audio: {playCue() {}},
    ui: {narrative: {getActive: () => null, clear() {}}, puzzle: {showFeedback() {}}},
    commit(action, payload) { const next = reduce(this.state, action, payload); if (next === this.state) return false; this.state = next; return true; },
    showNarrative(beatId) { this.active = {kind: 'narrative', beatId}; },
    showPuzzle(puzzleId) { this.active = {kind: 'puzzle', puzzleId}; },
    show(view, data = {}) { this.active = {kind: view, ...data, token: ++this.nonce}; },
    close() { this.active = null; }, render() {},
  };
}
function record(s) {
  for (const clueId of CLUE_IDS) {
    s.commit('discover-clue', {clueId}); s.commit('collect-clue', {clueId});
  }
}

test('recording requires matching live final narrative cursor, not merely discovery or an old view', () => {
  const s = session(), clueId = CLUE_IDS[0], beatId = clues[clueId].beatId;
  s.commit('discover-clue', {clueId});
  handleIntent(s, {type: 'collect-clue', clueId}); assert.deepEqual(s.state.collectedClueIds, []);
  s.active = {kind: 'narrative', beatId, clueId};
  s.ui.narrative.getActive = () => ({beatId, clueId, lastLine: false});
  handleIntent(s, {type: 'collect-clue', clueId}); assert.deepEqual(s.state.collectedClueIds, []);
  s.ui.narrative.getActive = () => ({beatId: 'another', clueId, lastLine: true});
  handleIntent(s, {type: 'collect-clue', clueId}); assert.deepEqual(s.state.collectedClueIds, []);
  s.ui.narrative.getActive = () => ({beatId, clueId, lastLine: true});
  handleIntent(s, {type: 'collect-clue', clueId}); assert.deepEqual(s.state.collectedClueIds, [clueId]);
  assert.equal(s.active, null);
});

test('correct answers require active matching puzzle; disposed and parent-paused callbacks cannot commit', () => {
  const s = session(); record(s);
  const intent = {type: 'submit-puzzle', puzzleId: PUZZLE_IDS[0], answer: structuredClone(puzzles[PUZZLE_IDS[0]].answerSpec)};
  handleIntent(s, intent); assert.deepEqual(s.state.completedPuzzleIds, []);
  s.active = {kind: 'puzzle', puzzleId: PUZZLE_IDS[1]};
  handleIntent(s, intent); assert.deepEqual(s.state.completedPuzzleIds, []);
  s.active = {kind: 'puzzle', puzzleId: PUZZLE_IDS[0]}; s.options.isPaused = () => true;
  handleIntent(s, intent); assert.deepEqual(s.state.completedPuzzleIds, []);
  s.options.isPaused = () => false; s.disposed = true;
  handleIntent(s, intent); assert.deepEqual(s.state.completedPuzzleIds, []);
  s.disposed = false; handleIntent(s, intent);
  assert.deepEqual(s.state.completedPuzzleIds, [PUZZLE_IDS[0]]);
});

test('the actual final fold awards II and opens original outro without committing an exit', () => {
  const s = session(); record(s);
  for (const puzzleId of PUZZLE_IDS) {
    s.active = {kind: 'puzzle', puzzleId};
    handleIntent(s, {type: 'submit-puzzle', puzzleId, answer: structuredClone(puzzles[puzzleId].answerSpec)});
  }
  assert.equal(s.state.fragmentCollected, true); assert.equal(s.state.exitReached, false);
  assert.deepEqual(s.active, {kind: 'narrative', beatId: CHAPTER.outroBeatId});
  const before = structuredClone(s.state);
  s.disposed = true; handleAction(s, 'notebook'); handleIntent(s, {type: 'complete-beat', beatId: CHAPTER.outroBeatId});
  assert.deepEqual(s.state, before);
});

test('a solved station shows Hệ Thống guidance first; only its live token reopens the solved board', () => {
  const s = session(); record(s);
  const puzzleId = PUZZLE_IDS[0];
  s.active = {kind: 'puzzle', puzzleId};
  handleIntent(s, {type: 'submit-puzzle', puzzleId, answer: structuredClone(puzzles[puzzleId].answerSpec)});
  assert.equal(s.active.kind, 'dialogue');
  assert.equal(s.active.action, 'puzzle-review');
  assert.ok(s.active.lines.some(line => line.startsWith('Hệ Thống — ') && line.includes('Ký Chủ')));
  const {token} = s.active;
  handleAction(s, 'puzzle-review', {puzzleId, token: token + 1}); assert.equal(s.active.kind, 'dialogue');
  handleAction(s, 'puzzle-review', {puzzleId: PUZZLE_IDS[1], token}); assert.equal(s.active.kind, 'dialogue');
  handleAction(s, 'puzzle-review', {puzzleId, token});
  assert.deepEqual(s.active, {kind: 'puzzle', puzzleId});
});
