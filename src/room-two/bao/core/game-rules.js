// Original pure evaluators; legacy progression/save reducers deliberately excluded.
import {chapters,puzzles} from '../content/story-data.js';
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

const lookup = (registry, id) => typeof id === 'string' && Object.hasOwn(registry, id) ? registry[id] : null;
