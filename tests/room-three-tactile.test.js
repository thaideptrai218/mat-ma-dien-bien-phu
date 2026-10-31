import test from 'node:test';
import assert from 'node:assert/strict';
import {move, binOf, TRAY} from '../src/ui/tactile/token-bins-model.js';
import {CARGO_ITEMS, OPENING_EVENTS, PREPARATION_CARDS, TELEGRAMS} from '../src/room-three/puzzle-data.js';
import {preparationCorrect, cargoCorrect, strategyCorrect, openingCorrect, finalCorrect} from '../src/room-three/answers.js';
import {recoveredTokens} from '../src/room-three/rules.js';
import * as board from '../src/room-three/tactile-model.js';

const place = (model, pairs) => pairs.reduce((state, [token, bin]) => move(state, token, bin), model);

test('preparation board: cards on the timeline and supplies in the depot rebuild the exact old payload', () => {
  let cards = board.preparationCardsBoard({});
  assert.equal(board.allPlaced(cards), false);
  cards = place(cards, PREPARATION_CARDS.map(card => [card.id, card.group]));
  assert.ok(board.allPlaced(cards));
  const supplies = place(board.suppliesBoard({}), ['food', 'weapons', 'ammunition', 'medical'].map(id => [id, 'depot']));
  const payload = {groups: board.groupsPayload(cards), supplies: board.suppliesPayload(supplies), purpose: 'sustain'};
  assert.ok(preparationCorrect(payload));
  const withBanner = place(supplies, [['banners', 'depot']]);
  assert.equal(preparationCorrect({...payload, supplies: board.suppliesPayload(withBanner)}), false, 'a decoration in the depot is wrong');
  assert.equal(preparationCorrect({...payload, groups: board.groupsPayload(move(cards, 'a', 'opening'))}), false);
});

test('cargo board: one label per picture, dropping on a taken picture swaps', () => {
  let model = board.cargoBoard({});
  assert.equal(Object.keys(model.bins).length, 6);
  model = place(model, CARGO_ITEMS.map(item => [item.id, item.id]));
  assert.ok(board.allPlaced(model));
  const payload = {matches: board.matchesPayload(model), reason: 'terrain-load', contributors: ['civilians', 'youth']};
  assert.ok(cargoCorrect(payload));
  const swapped = move(model, 'rice', 'bicycle');
  assert.equal(binOf(swapped, 'rice'), 'bicycle');
  assert.equal(binOf(swapped, 'bicycle'), 'rice');
  assert.equal(cargoCorrect({...payload, matches: board.matchesPayload(swapped)}), false);
});

test('telegram boards: slot order is the word order; the repeated words are interchangeable', () => {
  const fill = (key, ids) => place(board.telegramBoard(key)({}), ids.map((id, i) => [id, `slot-${i + 1}`]));
  const initial = fill('initial', ['attack', 'fast-first', 'resolve', 'fast-last']);
  const final = fill('final', ['attack', 'sure-first', 'advance', 'sure-last']);
  const answers = {reason: 'sure-victory', insights: ['assess-reality', 'careful-command', 'victory-first']};
  assert.ok(strategyCorrect({initial: board.telegramPayload(initial), final: board.telegramPayload(final), ...answers}));
  const swappedTwins = fill('final', ['attack', 'sure-last', 'advance', 'sure-first']);
  assert.ok(strategyCorrect({initial: board.telegramPayload(initial), final: board.telegramPayload(swappedTwins), ...answers}));
  const wrong = fill('final', ['advance', 'sure-first', 'attack', 'sure-last']);
  assert.equal(strategyCorrect({initial: board.telegramPayload(initial), final: board.telegramPayload(wrong), ...answers}), false);
  assert.equal(board.allPlaced(board.telegramBoard('initial')({})), false);
  for (const key of board.TELEGRAM_KEYS) assert.notDeepEqual(board.telegramBoard(key)({}).tokenOrder, TELEGRAMS[key].map(word => word.id), 'the first view is never pre-sorted');
});

test('opening boards: news order and per-news date cards rebuild order and dates', () => {
  const order = place(board.newsOrderBoard({}), OPENING_EVENTS.map((event, i) => [event.id, `slot-${i + 1}`]));
  const dates = place(board.datesBoard({}), OPENING_EVENTS.map(event => [`date-${event.id}`, event.id]));
  const rest = {target: 'him-lam', surrender: 'ban-keo', implications: ['break-north', 'expand-control', 'next-offensives']};
  const payload = {order: board.newsOrderPayload(order), dates: board.datesPayload(dates), ...rest};
  assert.ok(openingCorrect(payload));
  assert.deepEqual(Object.values(payload.dates).sort(), ['13/03/1954', '15/03/1954', '17/03/1954']);
  const crossed = move(dates, 'date-him-lam', 'ban-keo'); // swap: Him Lam and Bản Kéo exchange dates
  assert.equal(openingCorrect({...payload, dates: board.datesPayload(crossed)}), false);
  assert.equal(board.allPlaced(board.newsOrderBoard({})), false);
});

test('chest lock: earned reward cards fill Ngày/Tháng/Năm into 13/03/1954; anything else is a wrong, neutral date', () => {
  const tokens = recoveredTokens({completedChallenges: ['preparation', 'cargo', 'strategy', 'opening']});
  assert.equal(tokens.length, 4);
  const make = board.finalLockBoard(tokens);
  assert.equal(board.composeDate(make({})), '', 'empty lock composes nothing');
  const right = place(make({}), [['opening', 'day'], ['preparation', 'month'], ['cargo', 'year']]);
  assert.equal(board.composeDate(right), '13/03/1954');
  assert.ok(finalCorrect(board.composeDate(right)));
  const mixed = place(make({}), [['preparation', 'day'], ['opening', 'month'], ['cargo', 'year']]);
  assert.equal(finalCorrect(board.composeDate(mixed)), false, 'Tháng and Ngày cards swapped');
  const doctrine = place(make({}), [['opening', 'day'], ['strategy', 'month'], ['cargo', 'year']]);
  assert.equal(board.composeDate(doctrine), '', 'the doctrine card has no number, so the date is not formed');
  assert.equal(board.composeDate(place(make({}), [['opening', 'day'], ['cargo', 'year']])), '', 'an empty slot forms no date');
});

test('a stale saved placement never breaks a board', () => {
  const model = board.restoreBoard(board.cargoBoard, {ghost: 'bicycle', rice: 'nowhere'});
  assert.equal(binOf(model, 'rice'), TRAY);
  assert.deepEqual(board.restoreBoard(board.cargoBoard, {rice: 'rice'}).slots.rice, ['rice']);
});
