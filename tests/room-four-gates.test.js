import test from 'node:test';
import assert from 'node:assert/strict';
import {WORLD, OBJECTS} from '../src/room-four/world.js';
import {AREA_GATES, DOOR_GATES, DOOR_IDS, doorObjects, checkDoorAnswer, doorHintKey, goalDoorFor} from '../src/room-four/area-gates.js';
import {createState, reduce, goalFor, DOCUMENT_ORDER} from '../src/room-four/rules.js';
import {sanitizeSave} from '../src/room-four/save.js';
import {SYSTEM_HINTS} from '../src/room-four/content.js';
import {CROSSWORD_ROWS, BOARDS} from '../src/room-four/puzzle-data.js';
import {lockedGateIds, lockedGateRects, worldWithGates, gateById} from '../src/core/area-gates.js';
import {buildReachability, isWalkable} from '../src/core/world-geometry.js';

const entry = WORLD.checkpoints[0];
const ORDER = AREA_GATES.map(gate => gate.id); // data order = progression order
const obj = id => OBJECTS.find(object => object.id === id);
const reach = locked => {
  const walled = {...WORLD, walls: [...WORLD.walls, ...AREA_GATES.filter(g => locked.includes(g.id)).flatMap(g => g.rects)]};
  return buildReachability(walled, entry, {lockedGates: true});
};
// Which objects belong to which section: section i becomes reachable once gate i is open (section 0 is the start).
const SECTIONS = [['east-offensive', 'lamp'], ['final-assault'], ['a1', 'crossword', 'door'], ['headquarters'], ['results'],
  ['north', 'radio'], ['independence'], ['board-t', 'board-l', 'chest']];
const ANSWERS = {'a1-night': 'general-offensive', results: '1730', north: 56};
const answers = Object.fromEntries(CROSSWORD_ROWS.map(row => [row.id, row.answer]));

test('every gate has exactly one method; the room mixes auto gates and door-puzzle gates', () => {
  assert.deepEqual(ORDER, ['final-assault', 'a1-night', 'headquarters', 'results', 'north', 'independence', 'cipher-cordon']);
  for (const gate of AREA_GATES) {
    assert.ok(['auto', 'puzzle'].includes(gate.method), gate.id);
    assert.equal(Boolean(gate.door), gate.method === 'puzzle', `${gate.id}: only puzzle gates carry a door puzzle`);
    assert.match(gate.notice, gate.method === 'puzzle' ? /Nhấn E để mở khóa/ : /Hệ Thống: Ký Chủ hãy/, gate.id);
  }
  assert.ok(AREA_GATES.some(g => g.method === 'auto') && AREA_GATES.some(g => g.method === 'puzzle'));
  assert.deepEqual([...DOOR_IDS], ['a1-night', 'results', 'north']);
  assert.equal(AREA_GATES.filter(g => g.method === 'auto').length, 4);
  assert.equal(gateById(AREA_GATES, 'cipher-cordon').method, 'auto');
});

test('auto gates open from save flags only; puzzle gates never open by progress in normal play', () => {
  assert.deepEqual(lockedGateIds(AREA_GATES, createState()), ORDER);
  assert.ok(!lockedGateIds(AREA_GATES, {collectedNoteIds: ['east-offensive']}).includes('final-assault'));
  assert.ok(!lockedGateIds(AREA_GATES, {collectedNoteIds: ['east-offensive', 'final-assault', 'a1']}).includes('headquarters'));
  assert.ok(!lockedGateIds(AREA_GATES, {collectedNoteIds: DOCUMENT_ORDER.slice(0, 6)}).includes('independence'));
  assert.ok(!lockedGateIds(AREA_GATES, {columnSolved: true}).includes('cipher-cordon'));
  // Everything a player can hold WITHOUT passing a puzzle door leaves that door locked.
  const beforeDoor = {'a1-night': DOCUMENT_ORDER.slice(0, 2), results: DOCUMENT_ORDER.slice(0, 4), north: DOCUMENT_ORDER.slice(0, 5)};
  for (const [id, collectedNoteIds] of Object.entries(beforeDoor)) {
    assert.ok(lockedGateIds(AREA_GATES, {collectedNoteIds, readNoteIds: collectedNoteIds}).includes(id), id);
  }
  for (const id of DOOR_IDS) assert.ok(!lockedGateIds(AREA_GATES, {doorsSolved: [id]}).includes(id), id);
  assert.ok(lockedGateIds(AREA_GATES, {doorsSolved: ['final-assault', 'independence']}).includes('final-assault'), 'auto gates ignore doorsSolved');
});

test('old saves are never trapped: later progress implies the gate is open', () => {
  const late = {collectedNoteIds: DOCUMENT_ORDER, readNoteIds: DOCUMENT_ORDER, columnSolved: true};
  assert.deepEqual(lockedGateIds(AREA_GATES, late), []);
  // Reading a paper beyond a puzzle door (possible only in a save written before gates) opens that door.
  assert.ok(!lockedGateIds(AREA_GATES, {readNoteIds: DOCUMENT_ORDER.slice(0, 3)}).includes('a1-night'));
  assert.ok(lockedGateIds(AREA_GATES, {readNoteIds: DOCUMENT_ORDER.slice(0, 3)}).includes('results'));
  assert.ok(!lockedGateIds(AREA_GATES, {boardTSolved: true}).includes('cipher-cordon'));
  // A real old save file: no doorsSolved field, progress up to the chest.
  const old = JSON.parse(JSON.stringify({...createState(), collectedNoteIds: DOCUMENT_ORDER, readNoteIds: DOCUMENT_ORDER, crosswordSolved: true, columnSolved: true}));
  delete old.doorsSolved;
  const loaded = sanitizeSave(old);
  assert.deepEqual(loaded.doorsSolved, []);
  assert.deepEqual(lockedGateIds(AREA_GATES, loaded), []);
});

test('door answers are checked by the reducer and persisted backward-compatibly', () => {
  assert.ok(checkDoorAnswer('a1-night', 'general-offensive') && !checkDoorAnswer('a1-night', 'geneva'));
  assert.ok(checkDoorAnswer('results', '1730') && !checkDoorAnswer('results', '1703'));
  assert.ok(checkDoorAnswer('north', 56) && checkDoorAnswer('north', '56') && !checkDoorAnswer('north', 65) && !checkDoorAnswer('nope', ''));
  const state = createState();
  assert.equal(reduce(state, 'door', {doorId: 'a1-night', answer: 'geneva'}), state);
  assert.equal(reduce(state, 'door', {doorId: 'headquarters', answer: 'x'}), state, 'auto gates have no door');
  const next = reduce(state, 'door', {doorId: 'a1-night', answer: 'general-offensive'});
  assert.deepEqual(next.doorsSolved, ['a1-night']);
  assert.equal(reduce(next, 'door', {doorId: 'a1-night', answer: 'general-offensive'}), next);
  assert.deepEqual(sanitizeSave(JSON.parse(JSON.stringify(next))).doorsSolved, ['a1-night']);
  assert.deepEqual(sanitizeSave({...JSON.parse(JSON.stringify(createState())), doorsSolved: ['bogus', 'north', 'north']}).doorsSolved, ['north']);
  const old = JSON.parse(JSON.stringify(createState())); delete old.doorsSolved;
  assert.deepEqual(sanitizeSave(old).doorsSolved, []);
});

test('locked puzzle doors expose one interactable each, none once solved', () => {
  assert.equal(doorObjects(ORDER).length, 3);
  assert.deepEqual(doorObjects(['final-assault', 'independence']), []);
  for (const door of doorObjects(ORDER)) assert.equal(door.type, 'lock');
  assert.equal(OBJECTS.length, 14, 'the WORLD object list is untouched');
});

test('every door puzzle has Hệ Thống hints without digits and one right answer', () => {
  for (const gate of DOOR_GATES) {
    const entry = SYSTEM_HINTS[doorHintKey(gate.id)];
    assert.ok(entry?.open && entry.hints.length === 2, gate.id);
    assert.ok(entry.open.length < 90, entry.open);
    for (const line of [entry.open, ...entry.hints]) { assert.doesNotMatch(line, /\d/, line); assert.match(line, /Ký Chủ/); }
    assert.ok(gate.door.prompt && gate.door.answer !== undefined && ['emblem', 'ruler', 'dial'].includes(gate.door.kind));
    if (gate.door.kind === 'emblem') assert.ok(gate.door.choices.filter(c => c.id === gate.door.answer).length === 1 && gate.door.choices.length > 1);
  }
  // Updated station hints stay short, addressed to Ký Chủ and free of digits.
  for (const key of ['column', 'board-t', 'board-l', 'final']) {
    const {open, hints} = SYSTEM_HINTS[key];
    assert.ok(open.length < 90 && /Ký Chủ/.test(open) && hints.length === 2, key);
    for (const line of [open, ...hints]) assert.doesNotMatch(line, /\d/, line);
  }
});

test('reachability per gate: the section chain opens strictly in order and nothing is skipped', () => {
  ORDER.forEach((_gate, openCount) => {
    const map = reach(ORDER.slice(openCount));
    SECTIONS.forEach((ids, section) => {
      for (const id of ids) assert.equal(map.canReach(obj(id)), section <= openCount, `${id} with ${openCount} gate(s) open`);
    });
  });
  const open = reach([]);
  for (const object of OBJECTS) assert.ok(open.canReach(object), `${object.id} with every gate open`);
  assert.deepEqual(SECTIONS.flat().sort(), OBJECTS.map(o => o.id).sort(), 'every object belongs to a section');
});

test('door objects sit on the earlier side of their gate, within reach of a player standing outside it', () => {
  ORDER.forEach((id, index) => {
    const door = doorObjects(ORDER).find(item => item.gateId === id);
    if (!door) return;
    const map = reach(ORDER.slice(index)), [x, y, w, h] = gateById(AREA_GATES, id).rects[0];
    const side = [{x: x + w / 2, y: y - 24}, {x: x + w / 2, y: y + h + 24}].filter(p => map.canReach(p) && Math.hypot(p.x - door.x, p.y - door.y) <= door.radius);
    assert.ok(side.length > 0, `${id}: reachable before it opens`);
  });
});

test('entry is outside every gate; the current goal is reachable at every step of the canonical story', () => {
  assert.ok(isWalkable(worldWithGates(WORLD, AREA_GATES, createState()), entry.x, entry.y));
  assert.equal(lockedGateRects(AREA_GATES, createState()).length, AREA_GATES.reduce((n, g) => n + g.rects.length, 0));
  const check = state => {
    const goal = goalFor(state), locked = lockedGateIds(AREA_GATES, state);
    const door = doorObjects(locked).find(o => o.id === goal.id), object = door || obj(goal.id);
    assert.ok(object, `goal ${goal.id} exists`);
    const map = reach(locked);
    const ok = door
      ? [0, 1].some(i => { const [x, y, w, h] = gateById(AREA_GATES, door.gateId).rects[0]; const p = {x: x + w / 2, y: i ? y + h + 24 : y - 24}; return map.canReach(p) && Math.hypot(p.x - door.x, p.y - door.y) <= door.radius; })
      : map.canReach(object);
    assert.ok(ok, `goal ${goal.id} reachable (${state.collectedNoteIds.length} papers, ${state.doorsSolved.length} doors)`);
  };
  let state = createState();
  check(state);
  for (const id of DOCUMENT_ORDER) {
    const doorId = DOOR_IDS.find(d => gateById(AREA_GATES, d).guards[0] === id);
    if (doorId) {
      assert.equal(goalFor(state).id, `door:${doorId}`, `goal points at the lock before ${id}`);
      assert.equal(goalDoorFor(state, id), `door:${doorId}`);
      check(state);
      state = reduce(state, 'door', {doorId, answer: ANSWERS[doorId]});
      assert.deepEqual(state.doorsSolved.at(-1), doorId);
    }
    check(state);
    state = reduce(reduce(state, 'read', {id}), 'collect', {id});
    check(state);
  }
  for (const next of [reduce(state, 'crossword', {answers}), null]) {
    state = next || state;
    check(state);
  }
  state = reduce(state, 'column', {column: 8}); check(state);
  state = reduce(state, 'shape', {board: 't', selected: BOARDS.t.cells}); check(state);
  state = reduce(state, 'shape', {board: 'l', selected: BOARDS.l.cells}); check(state);
  state = reduce(state, 'final', {phrase: 'QUYETCHIENQUYETTHANG'}); check(state);
  state = reduce(state, 'fragment', {}); check(state);
  assert.equal(goalFor(state).id, 'door');
  assert.deepEqual(lockedGateIds(AREA_GATES, state), []);
});
