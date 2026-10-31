import test from 'node:test';
import assert from 'node:assert/strict';
import {createTokenBins, move, canMove, contents, trayTokens, binOf, sum, isEmpty, placementOf, returnToTray, resetTokens, TRAY}
  from '../src/ui/tactile/token-bins-model.js';
import {DIGITS, LETTERS, step, createDial, stepWheel, setWheel, dialValue, normalizeAlphabet} from '../src/ui/tactile/dial-model.js';
import {snapValue, fractionOf, stepValue} from '../src/ui/tactile/range-model.js';

const WEIGHTS = [20, 20, 10, 10, 10, 5, 5, 2, 2].map((value, i) => ({id: `w${i}`, label: String(value), value}));
const scale = () => createTokenBins({tokens: WEIGHTS, bins: [{id: 'north'}, {id: 'rest'}]});

test('weights: every token starts in the tray, sums follow the plates, original state is untouched', () => {
  let s = scale();
  assert.equal(trayTokens(s).length, 9);
  const s0 = s;
  for (const id of ['w0', 'w1', 'w7', 'w8']) s = move(s, id, 'north');
  for (const id of ['w2', 'w3', 'w4', 'w5', 'w6']) s = move(s, id, 'rest');
  assert.equal(sum(s, 'north'), 44); assert.equal(sum(s, 'rest'), 40);
  assert.equal(trayTokens(s).length, 0);
  assert.equal(trayTokens(s0).length, 9, 'immutable');
  assert.deepEqual(placementOf(s).w0, 'north');
});

test('moving between bins and back to the tray', () => {
  let s = move(scale(), 'w0', 'north');
  s = move(s, 'w0', 'rest'); assert.equal(binOf(s, 'w0'), 'rest'); assert.ok(isEmpty(s, 'north'));
  s = returnToTray(s, 'w0'); assert.equal(binOf(s, 'w0'), TRAY);
  assert.equal(canMove(s, 'w0', TRAY).reason, 'same');
  assert.equal(move(s, 'w0', TRAY), s, 'no-op returns the same object');
});

test('capacity and accepts rules reject without changing state', () => {
  const s = createTokenBins({
    tokens: [{id: 'a', label: 'A', kind: 'day'}, {id: 'b', label: 'B', kind: 'day'}, {id: 'c', label: 'C', kind: 'year'}],
    bins: [{id: 'day', capacity: 1, accepts: ['day']}, {id: 'any', accepts: t => t.id !== 'a'}],
  });
  const one = move(s, 'a', 'day');
  assert.equal(canMove(one, 'b', 'day').reason, 'full'); assert.equal(move(one, 'b', 'day'), one);
  assert.equal(canMove(s, 'c', 'day').reason, 'rejected');
  assert.equal(canMove(s, 'a', 'any').reason, 'rejected');
  assert.equal(canMove(s, 'zzz', 'day').reason, 'unknown');
  assert.equal(canMove(s, 'a', 'nowhere').reason, 'unknown');
});

test('swap mode exchanges tokens on a full bin and rolls the displaced one back to the source', () => {
  let s = createTokenBins({tokens: ['a', 'b', 'c'].map(id => ({id, label: id})), bins: [{id: 'one', capacity: 1}, {id: 'two', capacity: 1}], swap: true});
  s = move(move(s, 'a', 'one'), 'b', 'two');
  s = move(s, 'a', 'two');
  assert.equal(binOf(s, 'a'), 'two'); assert.equal(binOf(s, 'b'), 'one');
  s = move(s, 'c', 'one');                       // from the tray: displaced token returns to the tray
  assert.equal(binOf(s, 'c'), 'one'); assert.equal(binOf(s, 'b'), TRAY);
});

test('ordered bins honour the insertion index (timeline use)', () => {
  let s = createTokenBins({tokens: ['a', 'b', 'c'].map(id => ({id, label: id})), bins: [{id: 'line'}]});
  s = move(move(move(s, 'a', 'line'), 'b', 'line'), 'c', 'line', {index: 0});
  assert.deepEqual(contents(s, 'line').map(t => t.id), ['c', 'a', 'b']);
  assert.deepEqual(contents(move(s, 'c', 'line', {index: 99}), 'line').map(t => t.id), ['a', 'b', 'c'], 'reorder inside a bin');
  assert.equal(move(s, 'c', 'line'), s, 'dropping on the same bin without an index is a no-op');
});

test('initial placement is validated and reset restores the tray', () => {
  const tokens = [{id: 'a', label: 'A'}], bins = [{id: 'x', capacity: 1}];
  assert.equal(binOf(createTokenBins({tokens, bins, placement: {a: 'x'}}), 'a'), 'x');
  assert.throws(() => createTokenBins({tokens, bins, placement: {q: 'x'}}), /unknown token/);
  assert.throws(() => createTokenBins({tokens, bins, placement: {a: 'y'}}), /unknown bin/);
  assert.throws(() => createTokenBins({tokens: [...tokens, {id: 'a', label: 'dup'}], bins}), /duplicate/);
  assert.throws(() => createTokenBins({tokens, bins: [...bins, {id: 'x'}]}), /duplicate/);
  assert.equal(trayTokens(resetTokens(createTokenBins({tokens, bins, placement: {a: 'x'}}))).length, 1);
});

test('dial: wrap-around stepping on digits and letters', () => {
  assert.equal(step('9', 1, DIGITS), '0'); assert.equal(step('0', -1, DIGITS), '9');
  assert.equal(step('Z', 1, LETTERS), 'A'); assert.equal(step('A', -27, LETTERS), 'Z');
  assert.equal(step('?', 1, DIGITS), '1', 'unknown symbol starts at the first symbol');
  assert.throws(() => normalizeAlphabet('A'), TypeError); assert.throws(() => normalizeAlphabet('AAB'), TypeError);
});

test('dial: composing the codes used by the rooms', () => {
  let d = createDial({wheels: 4});
  assert.equal(dialValue(d), '0000');
  for (const [wheel, digit] of [[0, 2], [1, 4], [2, 1], [3, 3]]) for (let i = 0; i < digit; i++) d = stepWheel(d, wheel, 1);
  assert.equal(dialValue(d), '2413');
  let l = createDial({wheels: 4, alphabet: LETTERS, value: 'ABCD'});
  for (const [i, letter] of [...'NAVA'].entries()) l = setWheel(l, i, letter);
  assert.equal(dialValue(l), 'NAVA');
  assert.equal(dialValue(setWheel(l, 0, 'q')), 'QAVA', 'case-insensitive');
  assert.equal(setWheel(l, 0, '5'), l, 'unknown symbol is ignored');
  assert.equal(dialValue(createDial({wheels: 4, value: '06x2'})), '0602', 'bad symbols fall back to the first');
  assert.throws(() => stepWheel(d, 4, 1), RangeError);
  assert.throws(() => createDial({wheels: 0}), TypeError);
});

test('dial: per-wheel alphabets (two-position headphone knob)', () => {
  let d = createDial({wheels: 2, alphabet: ['AB', 'XYZ']});
  d = stepWheel(stepWheel(d, 0, 1), 1, -1);
  assert.equal(dialValue(d), 'BZ');
});

test('ruler snapping, clamping and fractions', () => {
  const r = {min: 1, max: 17, step: 1};
  assert.equal(snapValue(8.4, r), 8); assert.equal(snapValue(99, r), 17); assert.equal(snapValue(-3, r), 1);
  assert.equal(snapValue('abc', r), 1); assert.equal(snapValue(0.3, {min: 0, max: 1, step: 0.1}), 0.3);
  assert.equal(fractionOf(9, r), 0.5); assert.equal(stepValue(17, 1, r), 17);
  assert.throws(() => snapValue(1, {min: 5, max: 5}), RangeError);
});
