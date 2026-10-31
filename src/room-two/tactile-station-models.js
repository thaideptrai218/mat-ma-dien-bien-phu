// Pure models behind the Room 2 tactile stations (no DOM). They only translate dragged tokens into the exact
// draft values the donor puzzle view already understands (northWeights, channel words, card/region ids, code).
import {createTokenBins, contents, sum, trayTokens, placementOf} from '../ui/tactile/token-bins-model.js';

// Weights on the tray: 84 battalions in nine weights, many ways to reach 44.
export const WEIGHT_VALUES = Object.freeze([20, 20, 10, 10, 10, 5, 5, 2, 2]);
export const BALANCE_BINS = Object.freeze({north: 'north', rest: 'rest'});

export function createWeightBins(placement = {}) {
  const tokens = WEIGHT_VALUES.map((value, index) => ({id: `w${index}`, label: `${value} tiểu đoàn`, value}));
  return createTokenBins({tokens, bins: [{id: BALANCE_BINS.north}, {id: BALANCE_BINS.rest}], placement});
}

// The layout shown on a solved scale: 20 + 20 + 2 + 2 north (44), the other five weights south (40).
const SOLVED_NORTH = new Set([0, 1, 7, 8]);
export const solvedWeightPlacement = () => Object.fromEntries(WEIGHT_VALUES.map((_, index) =>
  [`w${index}`, SOLVED_NORTH.has(index) ? BALANCE_BINS.north : BALANCE_BINS.rest]));

export function balanceTotals(state) {
  const north = sum(state, BALANCE_BINS.north), rest = sum(state, BALANCE_BINS.rest);
  const tray = trayTokens(state).reduce((total, token) => total + token.value, 0);
  return {north, rest, tray, placedAll: tray === 0};
}

// Beam tilt in degrees; positive = north (left pan) lower. Capped so the picture never flips.
export const beamAngle = ({north, rest}, limit = 14) => {
  const total = north + rest;
  return total === 0 ? 0 : Math.round(Math.max(-1, Math.min(1, (north - rest) / total)) * limit * 10) / 10;
};

// Step cards: placement is just draft.cardSteps (cardId -> stepId), filtered to known ids.
export function createStepBins(puzzle, cardSteps = {}) {
  const tokens = puzzle.cards.map(card => ({id: card.id, label: card.label}));
  const stepIds = new Set(puzzle.steps.map(step => step.id));
  const placement = Object.fromEntries(Object.entries(cardSteps).filter(([card, step]) => stepIds.has(step) && puzzle.cards.some(c => c.id === card)));
  return createTokenBins({tokens, bins: puzzle.steps.map(step => ({id: step.id})), placement});
}
export const stepsOf = state => placementOf(state);

// Radio tape: each letter is a token worn by its 1-based position; a headphone word is the letters in drop order.
export function createTapeBins(puzzle, placement = {}) {
  const tokens = [...puzzle.tape].map((letter, index) => ({id: `t${index}`, label: letter, pos: index + 1}));
  return createTokenBins({tokens, bins: puzzle.channels.map(channel => ({id: channel.id})), placement});
}
export const wordOf = (state, channelId) => contents(state, channelId).map(token => token.label).join('');

// Solved layout: the first channel reads the odd positions, the second the even ones (matches the donor answer).
export function solvedTapePlacement(puzzle) {
  const placement = {};
  [...puzzle.tape].forEach((_, index) => { placement[`t${index}`] = puzzle.channels[index % 2].id; });
  return placement;
}

// Restore a tape layout from the words held in the draft (used after the view re-renders).
export function tapePlacementFromWords(puzzle, words) {
  const used = new Set(), placement = {};
  const letters = [...puzzle.tape];
  for (const channel of puzzle.channels) {
    for (const char of [...(words[channel.id] || '')]) {
      const at = letters.findIndex((letter, index) => letter === char && !used.has(index));
      if (at >= 0) { used.add(at); placement[`t${at}`] = channel.id; }
    }
  }
  return placement;
}

// Fist: four arrow cards onto four regions (one card per region). Cards of accepted moves sit in their regions.
export function createFistBins(puzzle, moves = []) {
  const tokens = puzzle.cards.map(card => ({id: card.id, label: card.short}));
  const placement = Object.fromEntries(moves.map(move => [move.card, move.region]));
  return createTokenBins({tokens, bins: puzzle.regions.map(region => ({id: region.id, capacity: 1})), placement});
}
