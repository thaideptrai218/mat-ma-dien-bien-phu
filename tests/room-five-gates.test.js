import test from 'node:test';
import assert from 'node:assert/strict';
import {WORLD, OBJECTS} from '../src/room-five/world.js';
import {AREA_GATES, DOOR_GATES, DOOR_IDS, doorObjects, checkDoorAnswer, doorAnswerFromPlacement, goalDoorFor, doorViewKey} from '../src/room-five/area-gates.js';
import {createState, reduce, goalFor} from '../src/room-five/rules.js';
import {sanitizeSave} from '../src/room-five/save.js';
import {SYSTEM_HINTS} from '../src/room-five/content.js';
import {lockedGateIds, lockedGateRects, worldWithGates, gateById} from '../src/core/area-gates.js';
import {buildReachability, isWalkable} from '../src/core/world-geometry.js';
import {swapPieces} from '../src/room-five/assembly-pieces.js';

const owned = [1, 2, 3, 4], entry = WORLD.checkpoints[0], ORDER = AREA_GATES.map(gate => gate.id);
const obj = id => OBJECTS.find(object => object.id === id);
const reach = locked => {
  const walled = {...WORLD, walls: [...WORLD.walls, ...AREA_GATES.filter(g => locked.includes(g.id)).flatMap(g => g.rects)]};
  return buildReachability(walled, entry);
};
const RIGHT = {I: 'room-1', II: 'room-2', III: 'room-3', IV: 'room-4'};

test('each gate has exactly one fixed method: one door puzzle, one auto curtain', () => {
  assert.deepEqual(ORDER, ['reconstruction-hall', 'light-curtain']);
  assert.deepEqual(AREA_GATES.map(g => g.method), ['puzzle', 'auto']);
  for (const gate of AREA_GATES) {
    assert.equal(Boolean(gate.door), gate.method === 'puzzle', gate.id);
    assert.match(gate.notice, gate.method === 'puzzle' ? /Nhấn E để mở khóa/ : /Hệ Thống: Ký Chủ hãy/, gate.id);
  }
  assert.deepEqual([...DOOR_IDS], ['reconstruction-hall']);
});

test('the curtain opens by itself when the painting is assembled; the rope never opens by progress before it', () => {
  assert.deepEqual(lockedGateIds(AREA_GATES, createState()), ORDER);
  const assembled = {...createState(), assemblySolved: true};
  assert.deepEqual(lockedGateIds(AREA_GATES, assembled), [], 'assembled implies the hall was passed');
  // Everything a player can hold before the rope opens leaves it locked (lamp and satchel are visible from the south).
  assert.ok(lockedGateIds(AREA_GATES, {...createState(), seenObjectIds: ['lamp', 'satchel'], introSeen: true}).includes('reconstruction-hall'));
  assert.deepEqual(lockedGateIds(AREA_GATES, {...createState(), doorsSolved: ['reconstruction-hall']}), ['light-curtain'], 'auto gate ignores doorsSolved');
  assert.deepEqual(lockedGateIds(AREA_GATES, {}), ORDER, 'corrupt state fails closed for fresh play');
});

test('old saves are never trapped: later progress implies each gate is open', () => {
  const late = {reflectionSeen: true, exitReached: true};
  assert.deepEqual(lockedGateIds(AREA_GATES, {...late, assemblySolved: true}), []);
  assert.deepEqual(lockedGateIds(AREA_GATES, {seenObjectIds: ['assembly']}), ['light-curtain']);
  const old = JSON.parse(JSON.stringify({...createState(), assemblySolved: true, reflectionSeen: true})); delete old.doorsSolved;
  assert.deepEqual(sanitizeSave(old, owned).doorsSolved, []);
  assert.deepEqual(lockedGateIds(AREA_GATES, sanitizeSave(old, owned)), []);
});

test('door answer: right plaques open the rope, wrong or partial placements do not, and it persists', () => {
  assert.equal(doorAnswerFromPlacement('reconstruction-hall', RIGHT), 'room-1,room-2,room-3,room-4');
  assert.equal(doorAnswerFromPlacement('reconstruction-hall', {I: 'room-1'}), null, 'a fragment still in the tray');
  assert.equal(doorAnswerFromPlacement('nope', RIGHT), null);
  assert.ok(checkDoorAnswer('reconstruction-hall', doorAnswerFromPlacement('reconstruction-hall', RIGHT)));
  assert.ok(!checkDoorAnswer('reconstruction-hall', doorAnswerFromPlacement('reconstruction-hall', {...RIGHT, I: 'room-2', II: 'room-1'})));
  assert.ok(!checkDoorAnswer('light-curtain', 'x'));
  const state = createState();
  assert.equal(reduce(state, 'solve-door', {doorId: 'reconstruction-hall', answer: 'room-2,room-1,room-3,room-4'}), state);
  assert.equal(reduce(state, 'solve-door', {doorId: 'light-curtain', answer: 'x'}), state, 'auto gates have no door');
  const next = reduce(state, 'solve-door', {doorId: 'reconstruction-hall', answer: 'room-1,room-2,room-3,room-4'});
  assert.deepEqual(next.doorsSolved, ['reconstruction-hall']);
  assert.equal(reduce(next, 'solve-door', {doorId: 'reconstruction-hall', answer: 'room-1,room-2,room-3,room-4'}), next);
  assert.deepEqual(sanitizeSave(JSON.parse(JSON.stringify(next)), owned).doorsSolved, ['reconstruction-hall']);
  assert.deepEqual(sanitizeSave({...JSON.parse(JSON.stringify(state)), doorsSolved: ['bogus', 'light-curtain']}, owned).doorsSolved, []);
  assert.deepEqual(lockedGateIds(AREA_GATES, next), ['light-curtain']);
});

test('the rope puzzle works without fragments (it only needs the journey order) and never mints state beyond doorsSolved', () => {
  const next = reduce(createState(), 'solve-door', {doorId: 'reconstruction-hall', answer: 'room-1,room-2,room-3,room-4'}, []);
  assert.deepEqual(Object.keys(next), Object.keys(createState()));
  assert.equal(next.assemblySolved, false);
});

test('a locked rope exposes one interactable; the goal points at it only while it guards the assembly table', () => {
  assert.deepEqual(doorObjects(ORDER).map(o => o.id), ['door:reconstruction-hall']);
  assert.deepEqual(doorObjects(['light-curtain']), []);
  assert.equal(goalDoorFor(createState(), 'assembly'), 'door:reconstruction-hall');
  assert.equal(goalDoorFor(createState(), 'reflection'), null, 'curtain is auto: no door to solve');
  assert.equal(goalDoorFor({...createState(), doorsSolved: ['reconstruction-hall']}, 'assembly'), null);
  assert.equal(goalFor(createState(), owned).id, 'assembly');
});

test('Hệ Thống hints for the door puzzle: Ký Chủ, no digits, at least two levels', () => {
  const entryHints = SYSTEM_HINTS[doorViewKey('reconstruction-hall')];
  assert.ok(entryHints?.open && entryHints.hints.length >= 2);
  for (const line of [entryHints.open, ...entryHints.hints]) {assert.doesNotMatch(line, /\d/, line); assert.match(line, /Ký Chủ/);}
  const gate = DOOR_GATES[0];
  assert.equal(gate.door.fragments.length, 4);
  assert.notDeepEqual(gate.door.plaques.map(p => p.id), ['room-1', 'room-2', 'room-3', 'room-4'], 'plaques are out of order');
});

test('reachability per gate: locked cuts off exactly its objects, the rest stays reachable, opened reaches everything', () => {
  const stages = [
    {gate: 'reconstruction-hall', blocks: ['assembly'], before: ['lamp', 'satchel']},
    {gate: 'light-curtain', blocks: ['reflection', 'door'], before: ['assembly', 'lamp', 'satchel']},
  ];
  stages.forEach(({gate, blocks, before}, index) => {
    const map = reach(ORDER.slice(index)); // this gate and every later one still shut
    for (const id of before) assert.ok(map.canReach(obj(id)), `${id} reachable before ${gate}`);
    for (const id of blocks) assert.equal(map.canReach(obj(id)), false, `${id} blocked by ${gate}`);
    for (const id of blocks) assert.equal(reach(ORDER.slice(index + 1)).canReach(obj(id)), true, `${id} open after ${gate}`);
  });
  const open = reach([]);
  for (const object of OBJECTS) assert.ok(open.canReach(object), `${object.id} with every gate open`);
});

test('the rope door object can be selected by E from the open side, entry is outside every gate', () => {
  assert.ok(isWalkable(worldWithGates(WORLD, AREA_GATES, createState()), entry.x, entry.y));
  assert.equal(lockedGateRects(AREA_GATES, createState()).length, 4);
  const [door] = doorObjects(ORDER), [x, y, w, h] = gateById(AREA_GATES, door.gateId).rects[0], map = reach(ORDER);
  const south = [{x: x + w / 2, y: y + h + 24}, {x: x + w / 2 + 120, y: y + h + 24}, {x: x + w / 2 - 120, y: y + h + 24}];
  assert.ok(south.some(p => map.canReach(p) && Math.hypot(p.x - door.x, p.y - door.y) <= door.radius), 'reachable from the entry side');
  assert.ok(south.every(p => Math.hypot(p.x - obj('assembly').x, p.y - obj('assembly').y) > obj('assembly').radius), 'does not also select the table');
});

test('the current goal is reachable at every step of the canonical story', () => {
  const story = [
    createState(),
    {...createState(), doorsSolved: ['reconstruction-hall']},
    {...createState(), doorsSolved: ['reconstruction-hall'], assemblySolved: true},
    {...createState(), doorsSolved: ['reconstruction-hall'], assemblySolved: true, reflectionSeen: true},
  ];
  for (const state of story) {
    const locked = lockedGateIds(AREA_GATES, state), goal = goalFor(state, owned), doorGoal = goalDoorFor(state, goal.id);
    const door = doorObjects(locked).find(o => o.id === doorGoal), map = reach(locked);
    if (door) assert.ok(map.canReach({x: door.x, y: door.y + 36}), `rope goal reachable for ${goal.id}`);
    else assert.ok(map.canReach(obj(goal.id)), `goal ${goal.id} reachable`);
  }
});

test('swapPieces exchanges two valid positions and rejects everything else without mutating', () => {
  const order = [2, 0, 3, 1];
  assert.deepEqual(swapPieces(order, 0, 3), [1, 0, 3, 2]);
  assert.deepEqual(order, [2, 0, 3, 1]);
  for (const [a, b] of [[1, 1], [-1, 2], [0, 4], [0.5, 1], [undefined, 1]]) assert.equal(swapPieces(order, a, b), order);
  assert.equal(swapPieces('0123', 0, 1), '0123');
});
