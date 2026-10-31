import test from 'node:test';
import assert from 'node:assert/strict';
import {puzzles, evaluatePuzzle} from '../src/room-two/content.js';
import {move} from '../src/ui/tactile/token-bins-model.js';
import {WEIGHT_VALUES, createWeightBins, solvedWeightPlacement, balanceTotals, beamAngle, createStepBins, stepsOf,
  createTapeBins, wordOf, solvedTapePlacement, tapePlacementFromWords, createFistBins} from '../src/room-two/tactile-station-models.js';

test('the nine weights add up to 84 and the solved layout gives the donor answer 44 / 40', () => {
  assert.equal(WEIGHT_VALUES.reduce((a, b) => a + b, 0), puzzles['nava-balance'].totalWeights);
  const totals = balanceTotals(createWeightBins(solvedWeightPlacement()));
  assert.deepEqual([totals.north, totals.rest, totals.tray, totals.placedAll], [44, 40, 0, true]);
  const answer = {cardSteps: {...puzzles['nava-balance'].answerSpec.cardSteps}, northWeights: totals.north};
  assert.ok(evaluatePuzzle('nava-balance', answer, ['nava-planner']).ok);
});

test('weights on the tray count as unplaced; moving one changes the totals; beam tilts toward the heavy pan', () => {
  let state = createWeightBins();
  assert.deepEqual(balanceTotals(state), {north: 0, rest: 0, tray: 84, placedAll: false});
  state = move(state, 'w0', 'north');
  assert.equal(balanceTotals(state).north, 20);
  assert.ok(beamAngle({north: 44, rest: 40}) > 0 && beamAngle({north: 40, rest: 44}) < 0);
  assert.equal(beamAngle({north: 0, rest: 0}), 0);
});

test('step cards restore from the donor draft', () => {
  const puzzle = puzzles['nava-balance'];
  const state = createStepBins(puzzle, {'defend-north': 'step-1', bogus: 'step-2', 'attack-south': 'nope'});
  assert.deepEqual(stepsOf(state), {'defend-north': 'step-1'});
});

test('radio tape: letters dropped in order spell the donor words; solved layout reads odd and even positions', () => {
  const puzzle = puzzles['nava-radio'];
  const solved = createTapeBins(puzzle, solvedTapePlacement(puzzle));
  assert.equal(wordOf(solved, 'french'), 'TAPTRUNG');
  assert.equal(wordOf(solved, 'vietbac'), 'PHANTAN');
  assert.ok(evaluatePuzzle('nava-radio', {french: wordOf(solved, 'french'), vietbac: wordOf(solved, 'vietbac')}, ['nava-radio-note']).ok);
  const restored = createTapeBins(puzzle, tapePlacementFromWords(puzzle, {french: 'TAPTRUNG', vietbac: 'PHANTAN'}));
  assert.equal(wordOf(restored, 'french'), 'TAPTRUNG');
  assert.equal(wordOf(restored, 'vietbac'), 'PHANTAN');
  assert.equal(wordOf(createTapeBins(puzzle, tapePlacementFromWords(puzzle, {french: 'ZZZ'})), 'french'), '');
});

test('fist board shows accepted moves in their regions, one card per region', () => {
  const puzzle = puzzles['nava-fist'];
  const state = createFistBins(puzzle, [{card: 'lai-chau', region: 'tay-bac'}]);
  assert.equal(state.slots['tay-bac'][0], 'lai-chau');
  assert.equal(move(state, 'tha-khet', 'tay-bac'), state, 'full region rejects a second card');
  assert.notEqual(move(state, 'tha-khet', 'trung-lao'), state);
});
