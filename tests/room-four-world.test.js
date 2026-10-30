import test from 'node:test';
import assert from 'node:assert/strict';
import {WORLD, OBJECTS} from '../src/room-four/world.js';
import {WORLD as ROOM_ONE} from '../src/room-one/world.js';
import {buildReachability, isWalkable, nearbyTarget, segmentClear} from '../src/core/world-geometry.js';

test('the larger archival room has fourteen reachable, independently selectable interaction anchors', () => {
  assert.equal(WORLD.width, 2800); assert.equal(WORLD.height, 1800);
  assert.ok(WORLD.width > ROOM_ONE.width && WORLD.height > ROOM_ONE.height);
  assert.equal(OBJECTS, WORLD.objects); assert.equal(OBJECTS.length, 14);
  assert.equal(new Set(OBJECTS.map(object => object.id)).size, 14);
  const spawn = WORLD.checkpoints[0], reachable = buildReachability(WORLD, spawn);
  assert.ok(isWalkable(WORLD, spawn.x, spawn.y));
  for (const target of OBJECTS) {
    assert.equal(target.radius, 110);
    assert.ok(reachable.canReach(target), `${target.id}: reachable with player body clearance`);
    assert.ok(reachable.points.some(point => nearbyTarget(WORLD, point, OBJECTS)?.id === target.id), `${target.id}: E selects it on reachable floor`);
  }
});

test('the chest, northern gallery and surrounding archive respect the agreed physical layout', () => {
  const point = id => { const {x, y} = OBJECTS.find(object => object.id === id); return [x, y]; };
  assert.deepEqual(point('chest'), [1400, 950]);
  assert.deepEqual(point('crossword'), [1400, 240]);
  assert.deepEqual(point('board-t'), [1080, 570]); assert.deepEqual(point('board-l'), [1720, 570]);
  assert.deepEqual(point('door'), [1400, 100]);
  assert.deepEqual(WORLD.checkpoints, [{id: 'entry', x: 1400, y: 1630}]);
  assert.deepEqual(WORLD.exits, []);
  assert.equal(nearbyTarget(WORLD, WORLD.checkpoints[0], OBJECTS), null, 'entry does not grant remote interaction');
});

test('archive partitions and furniture block walking while central and perimeter passages stay open', () => {
  for (const point of [[-1, 50], [2800, 100], [1400, 1800], [1400, 950], [1080, 570], [1134, 940], [NaN, 50]]) {
    assert.equal(isWalkable(WORLD, ...point), false, point.join(','));
  }
  assert.equal(segmentClear(WORLD, {x: 1100, y: 940}, {x: 1180, y: 940}, {wallsOnly: true}), false);
  assert.equal(nearbyTarget(WORLD, {x: 1100, y: 940}, [{id: 'behind-wall', x: 1180, y: 940, radius: 110}]), null);
  assert.equal(segmentClear(WORLD, {x: 1400, y: 470}, {x: 1400, y: 350}), true, 'gallery central entrance stays clear');
  assert.equal(segmentClear(WORLD, {x: 950, y: 900}, {x: 950, y: 1280}), true, 'western archive passage stays clear');
  assert.equal(nearbyTarget(WORLD, {x: 1400, y: 1050}, OBJECTS)?.id, 'chest');
});
