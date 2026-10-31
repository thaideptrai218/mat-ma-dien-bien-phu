import test from 'node:test';
import assert from 'node:assert/strict';
import {WORLD, OBJECTS} from '../src/room-three/world.js';
import {AREA_GATES, DOOR_GATES, DOOR_IDS, doorObjects, checkDoorAnswer, doorHintKey, goalDoorFor} from '../src/room-three/area-gates.js';
import {createState, reduce, DOCUMENT_ORDER} from '../src/room-three/rules.js';
import {sanitizeSave} from '../src/room-three/save.js';
import {goalFor} from '../src/room-three/goals.js';
import {SYSTEM_HINTS} from '../src/room-three/content.js';
import {CHALLENGES} from '../src/room-three/puzzle-data.js';
import {lockedGateIds, lockedGateRects, worldWithGates, gateById} from '../src/core/area-gates.js';
import {buildReachability, isWalkable} from '../src/core/world-geometry.js';

const entry = WORLD.checkpoints[0];
const ORDER = AREA_GATES.map(gate => gate.id); // data order = progression order
const obj = id => OBJECTS.find(object => object.id === id);
const walled = locked => ({...WORLD, walls: [...WORLD.walls, ...AREA_GATES.filter(g => locked.includes(g.id)).flatMap(g => g.rects)]});
const reach = locked => buildReachability(walled(locked), entry, {lockedGates: true});
const near = (map, id) => map.points.some(p => Math.hypot(p.x - obj(id).x, p.y - obj(id).y) <= obj(id).radius); // ignores gate walls: what E would select at runtime

test('every gate has exactly one method; the room mixes auto gates and door-puzzle gates', () => {
  assert.deepEqual(ORDER, ['depot-rope', 'cargo-pen', 'road-barrier', 'east-yard-curtain', 'radio-pen']);
  for (const gate of AREA_GATES) {
    assert.ok(['auto', 'puzzle'].includes(gate.method), gate.id);
    assert.equal(Boolean(gate.door), gate.method === 'puzzle', `${gate.id}: only puzzle gates carry a door puzzle`);
    assert.match(gate.notice, gate.method === 'puzzle' ? /Nhấn E để mở khóa/ : /Hệ Thống: Ký Chủ hãy/, gate.id);
  }
  assert.deepEqual(AREA_GATES.map(g => g.method), ['auto', 'puzzle', 'auto', 'auto', 'puzzle']);
  assert.deepEqual([...DOOR_IDS], ['cargo-pen', 'radio-pen']);
  assert.equal(gateById(AREA_GATES, 'road-barrier').method, 'auto');
});

test('auto gates open from save flags only; puzzle gates never open by progress in normal play', () => {
  assert.deepEqual(lockedGateIds(AREA_GATES, createState()), ORDER);
  const progress = (challenges, notes, extra = {}) => ({...createState(), completedChallenges: challenges, collectedNoteIds: notes, ...extra});
  assert.ok(!lockedGateIds(AREA_GATES, progress(['preparation'], ['preparation-record'])).includes('depot-rope'));
  assert.ok(!lockedGateIds(AREA_GATES, progress(['preparation', 'cargo'], DOCUMENT_ORDER.slice(0, 2))).includes('road-barrier'));
  assert.ok(!lockedGateIds(AREA_GATES, progress(['preparation', 'cargo', 'strategy'], DOCUMENT_ORDER.slice(0, 3))).includes('east-yard-curtain'));
  // Everything a player can have WITHOUT passing a puzzle door leaves that door locked.
  assert.ok(lockedGateIds(AREA_GATES, progress(['preparation'], DOCUMENT_ORDER.slice(0, 2))).includes('cargo-pen'));
  assert.ok(lockedGateIds(AREA_GATES, progress(['preparation', 'cargo', 'strategy'], DOCUMENT_ORDER)).includes('radio-pen'));
  for (const id of DOOR_IDS) assert.ok(!lockedGateIds(AREA_GATES, {doorsSolved: [id]}).includes(id), id);
  assert.ok(lockedGateIds(AREA_GATES, {doorsSolved: ['depot-rope', 'road-barrier']}).includes('depot-rope'), 'auto gates ignore doorsSolved');
});

test('old saves are never trapped: later progress implies the gate is open', () => {
  assert.deepEqual(lockedGateIds(AREA_GATES, {completedChallenges: CHALLENGES.map(c => c.id), collectedNoteIds: DOCUMENT_ORDER}), []);
  assert.deepEqual(lockedGateIds(AREA_GATES, {completedChallenges: ['preparation', 'cargo'], collectedNoteIds: DOCUMENT_ORDER.slice(0, 2)}), ['east-yard-curtain', 'radio-pen']);
  const old = JSON.parse(JSON.stringify(createState())); delete old.doorsSolved;
  assert.deepEqual(sanitizeSave(old).doorsSolved, []);
  assert.deepEqual(lockedGateIds(AREA_GATES, sanitizeSave(old)), ORDER, 'an old save at the start meets the gates normally');
  const full = {...createState(), readNoteIds: DOCUMENT_ORDER, collectedNoteIds: DOCUMENT_ORDER, completedChallenges: CHALLENGES.map(c => c.id), chestOpened: true, fragmentCollected: true};
  delete full.doorsSolved;
  assert.deepEqual(lockedGateIds(AREA_GATES, sanitizeSave(full)), [], 'an old finished save needs no door');
});

test('door answers are checked by the reducer and persisted backward-compatibly', () => {
  assert.ok(checkDoorAnswer('cargo-pen', 'engineers') && !checkDoorAnswer('cargo-pen', 'porters') && !checkDoorAnswer('cargo-pen', ''));
  assert.ok(checkDoorAnswer('radio-pen', 15) && checkDoorAnswer('radio-pen', '15') && !checkDoorAnswer('radio-pen', 13) && !checkDoorAnswer('nope', ''));
  const state = createState();
  assert.equal(reduce(state, 'solve-door', {doorId: 'cargo-pen', answer: 'porters'}), state);
  assert.equal(reduce(state, 'solve-door', {doorId: 'road-barrier', answer: 'x'}), state, 'auto gates have no door');
  const next = reduce(state, 'solve-door', {doorId: 'cargo-pen', answer: 'engineers'});
  assert.deepEqual(next.doorsSolved, ['cargo-pen']);
  assert.equal(reduce(next, 'solve-door', {doorId: 'cargo-pen', answer: 'engineers'}), next);
  assert.deepEqual(sanitizeSave(JSON.parse(JSON.stringify(next))).doorsSolved, ['cargo-pen']);
  assert.deepEqual(sanitizeSave({...JSON.parse(JSON.stringify(state)), doorsSolved: ['bogus', 'radio-pen', 'radio-pen']}).doorsSolved, ['radio-pen']);
});

test('locked puzzle doors expose one interactable each, none once solved', () => {
  assert.equal(doorObjects(ORDER).length, 2);
  assert.deepEqual(doorObjects(['road-barrier']), []);
  for (const door of doorObjects(ORDER)) assert.equal(door.type, 'door');
  assert.equal(goalDoorFor(createState(), 'cargo-yard'), 'door:cargo-pen');
  assert.equal(goalDoorFor({...createState(), doorsSolved: ['cargo-pen']}, 'cargo-yard'), null);
  assert.equal(goalDoorFor(createState(), 'supply-journal'), null, 'auto gates never retarget the goal');
});

test('Hệ Thống hints: every station and door puzzle has a short open line and digit-free Ký Chủ hints', () => {
  const keys = [...CHALLENGES.map(c => c.id), 'final', ...DOOR_GATES.map(g => doorHintKey(g.id))];
  for (const key of keys) {
    const entry = SYSTEM_HINTS[key];
    assert.ok(entry?.open && entry.hints.length >= 2, key);
    assert.ok(entry.open.length < 90, `${key}: open line is ${entry.open.length} chars`);
    for (const line of [entry.open, ...entry.hints]) { assert.doesNotMatch(line, /\d/, line); assert.match(line, /Ký Chủ/, line); }
  }
  for (const gate of DOOR_GATES) assert.ok(gate.door.prompt && gate.door.answer !== undefined && gate.door.title);
});

test('reachability per gate: its own blockers are cut off, the papers that teach its puzzle are reachable first', () => {
  const stages = [
    {gate: 'depot-rope', blocks: ['supply-journal', 'cargo-yard', 'command-telegrams', 'radio-station'], before: ['preparation-record', 'archive-cabinet']},
    {gate: 'cargo-pen', blocks: ['cargo-yard'], before: ['supply-journal']}, // the journal teaches the engineers lock
    {gate: 'road-barrier', blocks: ['command-telegrams', 'command-tent', 'opening-letter', 'radio-station', 'chest', 'door'], before: ['cargo-yard', 'road-tools']},
    {gate: 'east-yard-curtain', blocks: ['opening-letter', 'north-report', 'radio-station', 'door'], before: ['command-telegrams', 'command-tent']},
    {gate: 'radio-pen', blocks: ['radio-station'], before: ['opening-letter', 'north-report']}, // the letter teaches the day
  ];
  stages.forEach(({gate, blocks, before}, index) => {
    const map = reach(ORDER.slice(index)); // this gate and every later one still shut, earlier ones opened
    for (const id of before) assert.ok(map.canReach(obj(id)), `${id} reachable before ${gate}`);
    for (const id of blocks) {
      assert.equal(map.canReach(obj(id)), false, `${id} blocked by ${gate}`);
      assert.equal(near(map, id), false, `${id}: no E approach at all while ${gate} is shut`);
    }
  });
  const open = reach([]);
  for (const object of OBJECTS) assert.ok(open.canReach(object), `${object.id} with every gate open`);
  for (const id of ['supply-journal', 'cargo-yard', 'command-telegrams', 'opening-letter', 'radio-station']) {
    const gate = AREA_GATES.find(g => g.guards.includes(id)), index = ORDER.indexOf(gate.id);
    assert.ok(reach(ORDER.slice(index + 1)).canReach(obj(id)), `${id} reachable once ${gate.id} opens (later gates still shut)`);
  }
});

test('door objects sit in the gate rect and a player standing outside it can reach them', () => {
  for (const door of doorObjects(ORDER)) {
    const gate = gateById(AREA_GATES, door.gateId), [x, y, w, h] = gate.rects[0], map = reach(ORDER.slice(ORDER.indexOf(gate.id))); // earlier gates already open
    // Both faces of the door rect; at least one is open ground and within E range.
    const outside = [{x: x + w / 2, y: y - 24}, {x: x + w / 2, y: y + h + 24}].filter(p => map.points.some(q => q.x === Math.round(p.x / 16) * 16 && q.y === Math.round(p.y / 16) * 16));
    assert.ok(outside.some(p => Math.hypot(p.x - door.x, p.y - door.y) <= door.radius), door.gateId);
  }
});

test('entry is outside every gate and the current goal is reachable at every step of the canonical story', () => {
  assert.ok(isWalkable(worldWithGates(WORLD, AREA_GATES, createState()), entry.x, entry.y));
  assert.equal(lockedGateRects(AREA_GATES, createState()).length, 1 + 4 + 3 + 1 + 4);
  const note = (s, id) => ({...s, readNoteIds: [...s.readNoteIds, id], collectedNoteIds: [...s.collectedNoteIds, id]});
  const done = (s, id) => ({...s, completedChallenges: [...s.completedChallenges, id]});
  const events = [
    s => note(s, 'preparation-record'), s => done(s, 'preparation'),
    s => note(s, 'supply-journal'), s => ({...s, doorsSolved: ['cargo-pen']}), s => done(s, 'cargo'),
    s => note(s, 'command-telegrams'), s => done(s, 'strategy'),
    s => note(s, 'opening-letter'), s => note(s, 'north-report'),
    s => ({...s, doorsSolved: ['cargo-pen', 'radio-pen']}), s => done(s, 'opening'),
    s => ({...s, chestOpened: true}), s => ({...s, fragmentCollected: true}),
  ];
  let state = createState();
  for (const event of [s => s, ...events]) {
    state = event(state);
    const goal = goalFor(state), locked = lockedGateIds(AREA_GATES, state), door = doorObjects(locked).find(o => o.id === goal.id);
    const target = door || obj(goal.id), map = reach(locked);
    assert.ok(target, `goal ${goal.id} exists`);
    const reachable = door
      ? [{x: door.x, y: door.y - 36}, {x: door.x, y: door.y + 36}].some(p => map.points.some(q => q.x === Math.round(p.x / 16) * 16 && q.y === Math.round(p.y / 16) * 16))
      : map.canReach(target);
    assert.ok(reachable, `goal ${goal.id} reachable after ${state.completedChallenges.length} challenges / ${state.collectedNoteIds.length} papers`);
    assert.equal(goal.id.startsWith('door:'), Boolean(door), 'door goals are exactly the locked puzzle doors');
  }
});
