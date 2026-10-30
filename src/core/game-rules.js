import { beats, chapters, chapterOrder, clues, puzzles, roomOrder } from '../content/story-data.js';
import { copySettings, defaultSettings, validCheckpoint, validSettings } from './save-validation.js';
export { validateSave } from './save-validation.js';

export function createInitialState(options = {}) {
  const settings = { ...defaultSettings, ...(options.settings ?? options) };
  return {
    version: 1, chapterId: 'museum', checkpointId: 'entry', completedRoomIds: [], completedPuzzleIds: [],
    discoveredClueIds: [], collectedClueIds: [], completedBeatIds: [], hintLevels: {},
    settings: validSettings(settings) ? copySettings(settings) : { ...defaultSettings },
  };
}

export function canEnterChapter(state, chapterId) {
  if (typeof chapterId !== 'string' || !Object.hasOwn(chapters, chapterId)) return false;
  if (chapterId === 'museum') return true;
  if (!state.completedBeatIds.includes('museum-intro')) return false;
  return chapterOrder.indexOf(chapterId) <= state.completedRoomIds.length + 1;
}

// The first unsolved step of the current room, or its last step once all are solved.
export function currentPuzzleId(state) {
  const ids = chapters[state?.chapterId]?.puzzleIds || [];
  return ids.find(id => !state.completedPuzzleIds.includes(id)) ?? ids.at(-1) ?? null;
}

// Accents, spaces and punctuation never decide an answer: "Tập trung" === "TAPTRUNG", "06/12" === "0612".
export function normalizeAnswer(value) {
  if (typeof value !== 'string') return '';
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'D').replace(/[^a-z0-9]/gi, '').toUpperCase();
}

// Checks fist moves made so far: a card in the wrong region bounces, a right pair out of turn resets the hand.
export function checkFistMove(puzzleId, moves) {
  const puzzle = lookup(puzzles, puzzleId);
  if (puzzle?.type !== 'fist' || !Array.isArray(moves) || moves.length > puzzle.answerSpec.moves.length) return { ok: false, done: false, error: 'wrong-turn' };
  const expected = puzzle.answerSpec.moves;
  for (const [index, move] of moves.entries()) {
    const pair = expected.find(item => item.card === move?.card);
    if (!pair || move.region !== pair.region) return { ok: false, done: false, error: 'wrong-region', index };
    if (expected[index].card !== move.card) return { ok: false, done: false, error: 'wrong-turn', index };
  }
  return { ok: true, done: moves.length === expected.length, error: null };
}

const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const sameSequence = (actual, expected) => Array.isArray(actual) && actual.length === expected.length && actual.every((id, index) => id === expected[index]);
const sameRecord = (actual, expected) => isRecord(actual) && Object.keys(actual).length === Object.keys(expected).length
  && Object.entries(expected).every(([id, value]) => Object.hasOwn(actual, id) && actual[id] === value);
const failure = messageKey => ({ ok: false, messageKey });

export function evaluatePuzzle(puzzleId, answer, collectedClueIds) {
  const puzzle = typeof puzzleId === 'string' && Object.hasOwn(puzzles, puzzleId) ? puzzles[puzzleId] : null;
  if (!puzzle) return failure('unknown-puzzle');
  if (!Array.isArray(collectedClueIds) || puzzle.requiredClueIds.some(id => !collectedClueIds.includes(id))) return failure('missing-clues');
  if (!isRecord(answer)) return failure('incorrect-answer');
  const expected = puzzle.answerSpec;
  let ok = false;
  if (puzzle.type === 'sequence') ok = sameSequence(answer.orderedStageIds, expected.orderedStageIds);
  if (puzzle.type === 'telegram') ok = sameSequence(answer.orderedFragmentIds, expected.orderedFragmentIds) && answer.date === expected.date;
  if (puzzle.type === 'balance') {
    if (!sameRecord(answer.cardSteps, expected.cardSteps)) return failure('wrong-steps');
    if (answer.northWeights !== expected.northWeights) return failure('wrong-weights');
    ok = true;
  }
  if (puzzle.type === 'interleave') {
    const french = normalizeAnswer(answer.french), vietbac = normalizeAnswer(answer.vietbac);
    if (french === expected.vietbac && vietbac === expected.french) return failure('swapped-channels');
    ok = french === expected.french && vietbac === expected.vietbac;
  }
  if (puzzle.type === 'fist') ok = checkFistMove(puzzle.id, answer.moves).done;
  if (puzzle.type === 'fold') {
    if (answer.target !== expected.target) return failure('wrong-target');
    if (normalizeAnswer(answer.code) !== expected.code) return failure('wrong-code');
    ok = true;
  }
  return { ok, messageKey: ok ? 'puzzle-complete' : 'incorrect-answer' };
}

const add = (values, id) => values.includes(id) ? values : [...values, id];
const lookup = (registry, id) => typeof id === 'string' && Object.hasOwn(registry, id) ? registry[id] : null;
const clueBeatIds = new Set(Object.values(clues).map(clue => clue.beatId));

export function applyAction(state, action) {
  if (!action || typeof action !== 'object') return state;
  switch (action.type) {
    case 'discover-clue': {
      const clue = lookup(clues, action.clueId);
      if (!clue || clue.chapterId !== state.chapterId || state.discoveredClueIds.includes(clue.id)) return state;
      return { ...state, discoveredClueIds: [...state.discoveredClueIds, clue.id] };
    }
    case 'collect-clue': {
      const clue = lookup(clues, action.clueId);
      if (!clue || clue.chapterId !== state.chapterId || !state.discoveredClueIds.includes(clue.id) || state.collectedClueIds.includes(clue.id)) return state;
      return { ...state, collectedClueIds: [...state.collectedClueIds, clue.id], completedBeatIds: add(state.completedBeatIds, clue.beatId) };
    }
    case 'complete-beat': {
      const beat = lookup(beats, action.beatId);
      if (!beat || beat.chapterId !== state.chapterId || clueBeatIds.has(beat.id) || state.completedBeatIds.includes(beat.id)
        || (beat.requiresRoomCompletion && !state.completedRoomIds.includes(beat.chapterId))
        || beat.requiredDiscoveredClueIds.some(id => !state.discoveredClueIds.includes(id))) return state;
      return { ...state, completedBeatIds: [...state.completedBeatIds, beat.id] };
    }
    case 'use-hint': {
      const puzzle = lookup(puzzles, action.puzzleId);
      const level = state.hintLevels[action.puzzleId] ?? 0;
      if (!puzzle || puzzle.chapterId !== state.chapterId || level >= puzzle.hints.length) return state;
      return { ...state, hintLevels: { ...state.hintLevels, [puzzle.id]: level + 1 } };
    }
    case 'submit-puzzle': {
      const puzzle = lookup(puzzles, action.puzzleId);
      if (!puzzle || puzzle.chapterId !== state.chapterId || state.completedPuzzleIds.includes(puzzle.id)
        || state.completedRoomIds.includes(puzzle.chapterId) || roomOrder[state.completedRoomIds.length] !== puzzle.chapterId
        || (puzzle.requiresPuzzleId && !state.completedPuzzleIds.includes(puzzle.requiresPuzzleId))
        || !evaluatePuzzle(puzzle.id, action.answer, state.collectedClueIds).ok) return state;
      const completedPuzzleIds = [...state.completedPuzzleIds, puzzle.id];
      const roomComplete = chapters[puzzle.chapterId].puzzleIds.every(id => completedPuzzleIds.includes(id));
      return { ...state, completedPuzzleIds, completedRoomIds: roomComplete ? [...state.completedRoomIds, puzzle.chapterId] : state.completedRoomIds };
    }
    case 'enter-chapter': {
      if (action.chapterId === state.chapterId || !canEnterChapter(state, action.chapterId)) return state;
      if (action.checkpointId !== undefined && !validCheckpoint(action.checkpointId)) return state;
      return { ...state, chapterId: action.chapterId, checkpointId: action.checkpointId ?? 'entry' };
    }
    case 'reach-checkpoint': {
      if (action.chapterId !== state.chapterId || !validCheckpoint(action.checkpointId) || action.checkpointId === state.checkpointId) return state;
      return { ...state, checkpointId: action.checkpointId };
    }
    case 'finish-peace': {
      if (state.chapterId !== 'peace' || state.completedRoomIds.length !== 3) return state;
      return { ...state, completedRoomIds: [...state.completedRoomIds, 'peace'] };
    }
    case 'set-settings': {
      if (!action.settings || typeof action.settings !== 'object' || Array.isArray(action.settings)) return state;
      const settings = { ...state.settings, ...action.settings };
      if (!validSettings(settings) || Object.keys(defaultSettings).every(key => state.settings[key] === settings[key])) return state;
      return { ...state, settings: copySettings(settings) };
    }
    default: return state;
  }
}
