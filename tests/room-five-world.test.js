import test from 'node:test';
import assert from 'node:assert/strict';
import {WORLD, OBJECTS} from '../src/room-five/world.js';
import {buildReachability, isWalkable, nearbyTarget} from '../src/core/world-geometry.js';

test('final 2000x1400 room has reachable reconstruction, reflection, real door and optional props', () => {
  assert.equal(WORLD.width, 2000); assert.equal(WORLD.height, 1400);
  assert.equal(OBJECTS, WORLD.objects);
  const spawn = WORLD.checkpoints[0], reachability = buildReachability(WORLD, spawn);
  assert.equal(isWalkable(WORLD, spawn.x, spawn.y), true);
  assert.equal(nearbyTarget(WORLD, spawn, OBJECTS), null);
  for (const target of OBJECTS) {
    assert.equal(target.radius, 110);
    assert.ok(reachability.canReach(target), `${target.id} has an approach with body clearance`);
    assert.ok(reachability.points.some(p => nearbyTarget(WORLD, p, OBJECTS)?.id === target.id), `${target.id} can be selected by E`);
  }
  assert.equal(isWalkable(WORLD, 1000, 770), false, 'reconstruction furniture is a real obstacle');
  assert.equal(isWalkable(WORLD, 1000, 75), false, 'door is physical furniture rather than a map shortcut');
  assert.deepEqual(WORLD.exits, [], 'walking over a zone does not finish the room');
});
