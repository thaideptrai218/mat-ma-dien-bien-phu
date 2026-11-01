import test from 'node:test';
import assert from 'node:assert/strict';
import {WORLD, OBJECTS} from '../src/room-one/world.js';
import {movementVelocity, bindRoomOneInput} from '../src/room-one/input.js';
import {buildReachability, isWalkable, nearbyTarget, segmentClear} from '../src/core/world-geometry.js';

test('all thirteen fixed anchors have reachable, unobstructed interaction approaches', () => {
  assert.equal(WORLD.width, 2400); assert.equal(WORLD.height, 1600);
  assert.equal(OBJECTS, WORLD.objects); assert.equal(OBJECTS.length, 13);
  const spawn = WORLD.checkpoints[0], reachable = buildReachability(WORLD, spawn);
  assert.ok(isWalkable(WORLD, spawn.x, spawn.y)); assert.ok(reachable.size > 9000);
  for (const target of OBJECTS) {
    assert.equal(target.radius, 110);
    assert.ok(reachable.canReach(target), `${target.id} is reachable from entry`);
    assert.ok(reachable.points.some(p => nearbyTarget(WORLD, p, OBJECTS)?.id === target.id), `${target.id} can actually be selected by E`);
  }
});

test('world bounds, wall dividers and furniture have real body clearance', () => {
  for (const point of [[-1, 50], [2400, 100], [1200, 1600], [10, 500], [1000, 600], [1200, 810], [NaN, 50]]) {
    assert.equal(isWalkable(WORLD, ...point), false, point.join(','));
  }
  assert.equal(segmentClear(WORLD, {x: 960, y: 600}, {x: 1060, y: 600}, {wallsOnly: true}), false);
  assert.equal(nearbyTarget(WORLD, {x: 980, y: 600}, [{id: 'hidden', x: 1050, y: 600, radius: 110}]), null);
  assert.equal(nearbyTarget(WORLD, {x: 1200, y: 1410}, OBJECTS), null, 'spawn cannot open the letter remotely');
  assert.equal(nearbyTarget(WORLD, {x: 1200, y: 1310}, OBJECTS)?.id, 'letter');
  assert.equal(segmentClear(WORLD, {x: 960, y: 450}, {x: 1450, y: 450}, {wallsOnly: true}), true, 'wide side passages stay open');
});

test('walking and sprint diagonals normalize, opposing keys cancel, idle Shift does not sprint', () => {
  for (const keys of [['KeyW'], ['ArrowLeft'], ['KeyW', 'KeyD'], ['ArrowDown', 'ArrowLeft']]) {
    assert.ok(Math.abs(Math.hypot(...['x', 'y'].map(k => movementVelocity(new Set(keys))[k])) - 260) < 1e-9);
    const sprint = movementVelocity(new Set([...keys, 'ShiftLeft']));
    assert.ok(Math.abs(Math.hypot(sprint.x, sprint.y) - 390) < 1e-9); assert.equal(sprint.sprinting, true);
  }
  assert.deepEqual(movementVelocity(new Set(['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ShiftRight'])), {x: 0, y: 0, sprinting: false});
});

test('focus interruption clears sprint and rejects held repeats; text inputs cannot move Long', () => {
  const originalWindow = globalThis.window, originalDocument = globalThis.document;
  const canvas = new EventTarget(); canvas.setAttribute = () => {};
  globalThis.window = new EventTarget(); globalThis.document = new EventTarget();
  document.activeElement = canvas;
  let paused = false, interactions = 0;
  const scene = {game: {canvas}, input: {}, heldKeys: new Set(), callbacks: {},
    focus() {}, motionUnavailable: () => paused || document.activeElement !== canvas,
    clearKeys() { this.heldKeys.clear(); }, interactNearby() { interactions++; }};
  const send = (code, repeat = false) => {
    const event = new Event('keydown', {cancelable: true}); Object.assign(event, {code, repeat}); canvas.dispatchEvent(event);
  };
  const cleanup = bindRoomOneInput(scene);
  try {
    send('KeyW'); send('ShiftLeft'); assert.equal(movementVelocity(scene.heldKeys).sprinting, true);
    window.dispatchEvent(new Event('blur')); assert.equal(scene.heldKeys.size, 0);
    send('KeyW', true); send('ShiftLeft', true); assert.equal(scene.heldKeys.size, 0);
    send('KeyW'); assert.ok(scene.heldKeys.has('KeyW'));
    paused = true; send('KeyD'); assert.equal(scene.heldKeys.size, 0); paused = false;
    document.activeElement = {tagName: 'INPUT'}; send('KeyW'); send('KeyE');
    assert.equal(scene.heldKeys.size, 0); assert.equal(interactions, 0);
    document.activeElement = canvas; send('KeyE', true); assert.equal(interactions, 0);
    send('KeyE'); assert.equal(interactions, 1);
  } finally { cleanup(); globalThis.window = originalWindow; globalThis.document = originalDocument; }
});
