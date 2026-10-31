import test from 'node:test';
import assert from 'node:assert/strict';
import {WORLD, OBJECTS} from '../src/room-two/world.js';
import {AREA_GATES, DOOR_GATES, DOOR_IDS, doorObjects, checkDoorAnswer, doorHintKey} from '../src/room-two/area-gates.js';
import {createState, reduce} from '../src/room-two/rules.js';
import {sanitizeSave} from '../src/room-two/save.js';
import {goalFor} from '../src/room-two/goals.js';
import {SYSTEM_HINTS} from '../src/room-two/system-guidance.js';
import {PUZZLE_IDS, CLUE_IDS} from '../src/room-two/content.js';
import {lockedGateIds, lockedGateRects, worldWithGates, gateById} from '../src/core/area-gates.js';
import {buildReachability, isWalkable} from '../src/core/world-geometry.js';

const entry = WORLD.checkpoints[0];
const ORDER = AREA_GATES.map(gate => gate.id); // data order = progression order
const obj = id => OBJECTS.find(object => object.id === id);
const reach = (locked, extra = {}) => {
  const walled = {...WORLD, walls: [...WORLD.walls, ...AREA_GATES.filter(g => locked.includes(g.id)).flatMap(g => g.rects)]};
  return buildReachability(walled, entry, {lockedGates: true, ...extra});
};

test('every gate has exactly one method; the room mixes auto gates and door-puzzle gates', () => {
  assert.deepEqual(ORDER, ['radio-hut', 'south-west', 'south-mid', 'south-east', 'north-room']);
  for (const gate of AREA_GATES) {
    assert.ok(['auto', 'puzzle'].includes(gate.method), gate.id);
    assert.equal(Boolean(gate.door), gate.method === 'puzzle', `${gate.id}: only puzzle gates carry a door puzzle`);
    assert.ok(gate.notice.length > 10);
  }
  assert.ok(AREA_GATES.some(g => g.method === 'auto') && AREA_GATES.some(g => g.method === 'puzzle'));
  assert.equal(gateById(AREA_GATES, 'radio-hut').method, 'auto');
  assert.equal(AREA_GATES.filter(g => g.method === 'auto').length, 2);
  assert.deepEqual([...DOOR_IDS], ['south-west', 'south-east', 'north-room']);
  for (const gate of AREA_GATES) assert.match(gate.notice, gate.method === 'puzzle' ? /Nhấn E để mở khóa/ : /Hệ Thống: Ký Chủ hãy/, gate.id);
});

test('auto gates open from save flags only; puzzle gates never open by progress in normal play', () => {
  assert.deepEqual(lockedGateIds(AREA_GATES, createState()), ORDER);
  assert.ok(!lockedGateIds(AREA_GATES, {completedPuzzleIds: ['nava-balance']}).includes('radio-hut'));
  assert.ok(!lockedGateIds(AREA_GATES, {collectedClueIds: ['nava-diary']}).includes('south-mid'));
  // Everything a player can have WITHOUT passing a puzzle door leaves that door locked.
  const beforeDoor = {
    'south-west': {completedPuzzleIds: ['nava-balance', 'nava-radio'], collectedClueIds: ['nava-planner', 'nava-radio-note']},
    'south-east': {completedPuzzleIds: ['nava-balance', 'nava-radio'], collectedClueIds: ['nava-planner', 'nava-radio-note', 'nava-diary', 'nava-newspaper']},
    'north-room': {completedPuzzleIds: ['nava-balance', 'nava-radio'], collectedClueIds: ['nava-planner', 'nava-radio-note', 'nava-diary', 'nava-newspaper', 'nava-allied-telegram']},
  };
  for (const [id, partial] of Object.entries(beforeDoor)) assert.ok(lockedGateIds(AREA_GATES, partial).includes(id), id);
  for (const id of DOOR_IDS) assert.ok(!lockedGateIds(AREA_GATES, {doorsSolved: [id]}).includes(id), id);
  assert.ok(lockedGateIds(AREA_GATES, {doorsSolved: ['radio-hut', 'south-mid']}).includes('radio-hut'), 'auto gates ignore doorsSolved');
});

test('old saves are never trapped: later progress implies the gate is open', () => {
  const late = {completedPuzzleIds: PUZZLE_IDS, collectedClueIds: CLUE_IDS};
  assert.deepEqual(lockedGateIds(AREA_GATES, late), []);
  assert.deepEqual(lockedGateIds(AREA_GATES, {collectedClueIds: ['nava-calendar']}), ['radio-hut']);
});

test('door answers are checked by the reducer and persisted backward-compatibly', () => {
  assert.ok(checkDoorAnswer('south-west', 'french') && !checkDoorAnswer('south-west', 'vietbac'));
  assert.ok(checkDoorAnswer('south-east', 21) && !checkDoorAnswer('south-east', 20));
  assert.ok(checkDoorAnswer('north-room', '01') && !checkDoorAnswer('north-room', '10') && !checkDoorAnswer('nope', ''));
  const state = createState();
  assert.equal(reduce(state, 'solve-door', {doorId: 'south-west', answer: 'vietbac'}), state);
  assert.equal(reduce(state, 'solve-door', {doorId: 'radio-hut', answer: 'x'}), state, 'auto gates have no door');
  const next = reduce(state, 'solve-door', {doorId: 'south-west', answer: 'french'});
  assert.deepEqual(next.doorsSolved, ['south-west']);
  assert.equal(reduce(next, 'solve-door', {doorId: 'south-west', answer: 'french'}), next);
  assert.deepEqual(sanitizeSave(JSON.parse(JSON.stringify(next))).doorsSolved, ['south-west']);
  const old = JSON.parse(JSON.stringify(createState())); delete old.doorsSolved;
  assert.deepEqual(sanitizeSave(old).doorsSolved, []);
  assert.deepEqual(sanitizeSave({...old, doorsSolved: ['bogus', 'south-east', 'south-east']}).doorsSolved, ['south-east']);
});

test('locked puzzle doors expose one interactable each, none once solved', () => {
  assert.equal(doorObjects(ORDER).length, 3);
  assert.deepEqual(doorObjects(['radio-hut']), []);
  for (const door of doorObjects(ORDER)) assert.equal(door.type, 'door');
});

test('every door puzzle has Hệ Thống hints without digits, and an unlock by the right answer only', () => {
  for (const gate of DOOR_GATES) {
    const entry = SYSTEM_HINTS[doorHintKey(gate.id)];
    assert.ok(entry?.open && entry.hints.length >= 2, gate.id);
    for (const line of [entry.open, ...entry.hints]) { assert.doesNotMatch(line, /\d/, line); assert.match(line, /Ký Chủ/); }
    assert.ok(gate.door.prompt && gate.door.answer !== undefined);
  }
});

test('reachability per gate: its own blockers are cut off, the clues that teach its puzzle are reachable first', () => {
  const stages = [
    {gate: 'radio-hut', blocks: ['nava-radio-note', 'nava-radio-station'], before: ['nava-planner', 'nava-balance-station']},
    {gate: 'south-west', blocks: ['nava-diary'], before: ['nava-radio-note', 'nava-radio-station']}, // radio note teaches the emblem door
    {gate: 'south-mid', blocks: ['nava-newspaper'], before: ['nava-diary']},
    {gate: 'south-east', blocks: ['nava-allied-telegram'], before: ['nava-newspaper']}, // newspaper teaches the day
    {gate: 'north-room', blocks: ['nava-calendar'], before: ['nava-allied-telegram']}, // telegram teaches the month
  ];
  stages.forEach(({gate, blocks, before}, index) => {
    const locked = ORDER.slice(index); // this gate and every later one still shut, earlier ones opened
    const map = reach(locked);
    for (const id of before) assert.ok(map.canReach(obj(id)), `${id} reachable before ${gate}`);
    for (const id of blocks) assert.equal(map.canReach(obj(id)), false, `${id} blocked by ${gate}`);
    for (const id of blocks) assert.equal(reach(ORDER.slice(index + 1)).canReach(obj(id)), true, `${id} open after ${gate}`);
  });
  const open = reach([]);
  for (const object of OBJECTS) assert.ok(open.canReach(object), `${object.id} with every gate open`);
});

function outsidePoints(door, map) {
  const [x, y, w, h] = gateById(AREA_GATES, door.gateId).rects[0];
  return [{x: x + w / 2, y: y - 24}, {x: x + w / 2, y: y + h + 24}].filter(p => map.canReach(p) && Math.hypot(p.x - door.x, p.y - door.y) <= door.radius);
}

test('door objects sit on the hall side of the gap, within reach of a player standing outside it', () => {
  for (const door of doorObjects(ORDER)) {
    const map = reach(ORDER), gate = gateById(AREA_GATES, door.gateId), [x, y, w, h] = gate.rects[0];
    const outside = [{x: x + w / 2, y: y - 24}, {x: x + w / 2, y: y + h + 24}].filter(p => map.canReach(p));
    assert.ok(outside.some(p => Math.hypot(p.x - door.x, p.y - door.y) <= door.radius), door.gateId);
  }
});

test('entry is outside every gate and the current goal is reachable at every step of the canonical story', () => {
  assert.ok(isWalkable(worldWithGates(WORLD, AREA_GATES, createState()), entry.x, entry.y));
  assert.equal(lockedGateRects(AREA_GATES, createState()).length, 5);
  // Events in play order; each step applies one more fact, a gate state is derived from the state alone.
  const events = [
    s => ({...s, collectedClueIds: [...s.collectedClueIds, 'nava-planner']}),
    s => ({...s, completedPuzzleIds: ['nava-balance']}),
    s => ({...s, collectedClueIds: [...s.collectedClueIds, 'nava-radio-note']}),
    s => ({...s, completedPuzzleIds: ['nava-balance', 'nava-radio']}),
    s => ({...s, doorsSolved: ['south-west']}),
    s => ({...s, collectedClueIds: [...s.collectedClueIds, 'nava-diary']}),
    s => ({...s, collectedClueIds: [...s.collectedClueIds, 'nava-newspaper'], doorsSolved: [...s.doorsSolved, 'south-east']}),
    s => ({...s, collectedClueIds: [...s.collectedClueIds, 'nava-allied-telegram'], doorsSolved: [...s.doorsSolved, 'north-room']}),
    s => ({...s, collectedClueIds: [...s.collectedClueIds, 'nava-calendar']}),
    s => ({...s, completedPuzzleIds: ['nava-balance', 'nava-radio', 'nava-fist']}),
    s => ({...s, completedPuzzleIds: PUZZLE_IDS, fragmentCollected: true}),
  ];
  let state = createState();
  for (const event of [s => s, ...events]) {
    state = event(state);
    const goal = goalFor(state), locked = lockedGateIds(AREA_GATES, state), door = doorObjects(locked).find(o => o.id === goal.id);
    const object = door || obj(goal.id);
    if (!object) continue;
    const map = reach(locked, {lockedGates: !state.fragmentCollected});
    // A door goal is reached from the hall side of its gap; any other goal is reached directly.
    const reachable = door ? outsidePoints(door, map).length > 0 : map.canReach(object);
    assert.ok(reachable, `goal ${goal.id} reachable (${JSON.stringify(state.collectedClueIds.length)} clues)`);
  }
});
