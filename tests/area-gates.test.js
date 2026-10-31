import test from 'node:test';
import assert from 'node:assert/strict';
import {lockedGates, lockedGateIds, lockedGateRects, worldWithGates, validateGates, gateById} from '../src/core/area-gates.js';
import {WORLD} from '../src/room-one/world.js';
import {buildReachability, isWalkable} from '../src/core/world-geometry.js';

// Fixture mirrors the Room 1 plan (two archive wings); the real data lives in the room phase.
const WINGS = [{
  id: 'archive-wings', style: 'bars', notice: 'then cài',
  rects: [[988, 48, 36, 96], [988, 374, 36, 146], [988, 720, 36, 380], [988, 1290, 36, 262],
    [1376, 48, 36, 96], [1376, 374, 36, 146], [1376, 720, 36, 380], [1376, 1290, 36, 262]],
  unlockedBy: state => state.envelopeOpened === true,
}];
const entry = WORLD.checkpoints[0];
const target = id => WORLD.objects.find(o => o.id === id);

test('empty gate list leaves the world and state untouched', () => {
  assert.equal(worldWithGates(WORLD, [], {}), WORLD);
  assert.deepEqual(lockedGateIds([], {}), []);
  assert.deepEqual(lockedGateRects(undefined, undefined), []);
});

test('gate state is derived from save flags only', () => {
  assert.deepEqual(lockedGateIds(WINGS, {}), ['archive-wings']);
  assert.deepEqual(lockedGateIds(WINGS, {envelopeOpened: false}), ['archive-wings']);
  assert.deepEqual(lockedGateIds(WINGS, {envelopeOpened: true}), []);
  assert.equal(lockedGateRects(WINGS, {}).length, 8);
  assert.equal(lockedGates(WINGS, undefined).length, 1, 'undefined state fails closed');
});

test('a throwing or truthy-but-not-true predicate keeps the gate locked', () => {
  const broken = [{...WINGS[0], id: 'a', unlockedBy: () => { throw new Error('boom'); }}, {...WINGS[0], id: 'b', unlockedBy: () => 'yes'}];
  assert.deepEqual(lockedGateIds(broken, {}), ['a', 'b']);
});

test('returned rects are copies (callers cannot mutate gate data)', () => {
  const [first] = lockedGateRects(WINGS, {}); first[0] = -1;
  assert.equal(WINGS[0].rects[0][0], 988);
});

test('locked gates become walls: targets behind them are unreachable, opening restores them', () => {
  assert.ok(buildReachability(WORLD, entry).canReach(target('v1')), 'baseline reachable');
  const locked = buildReachability(worldWithGates(WORLD, WINGS, {}), entry);
  for (const id of ['v1', 'v2', 'p1', 'p2', 'drawer', 'chest']) assert.equal(locked.canReach(target(id)), false, `${id} blocked`);
  for (const id of ['letter', 'map-a03', 'comparison', 'door']) assert.ok(locked.canReach(target(id)), `${id} still reachable`);
  const open = buildReachability(worldWithGates(WORLD, WINGS, {envelopeOpened: true}), entry);
  for (const object of WORLD.objects) assert.ok(open.canReach(object), `${object.id} reachable once open`);
});

test('entry never sits inside a gate rect', () => {
  const walled = worldWithGates(WORLD, WINGS, {});
  assert.ok(isWalkable(walled, entry.x, entry.y));
});

test('gate definitions are validated', () => {
  assert.equal(validateGates(WINGS), WINGS);
  assert.equal(gateById(WINGS, 'archive-wings'), WINGS[0]);
  assert.equal(gateById(WINGS, 'nope'), null);
  const bad = patch => () => validateGates([{...WINGS[0], ...patch}]);
  assert.throws(bad({id: ''}), /id/);
  assert.throws(bad({style: 'laser'}), /style/);
  assert.throws(bad({unlockedBy: true}), /unlockedBy/);
  assert.throws(bad({rects: []}), /rects/);
  assert.throws(bad({rects: [[0, 0, 0, 10]]}), /rect/);
  assert.throws(bad({rects: [[0, 0, 'x', 10]]}), /rect/);
  assert.throws(() => validateGates([WINGS[0], WINGS[0]]), /duplicate/);
});
