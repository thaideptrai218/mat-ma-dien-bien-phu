import test from 'node:test';
import assert from 'node:assert/strict';
import {WORLD} from '../src/room-one/world.js';
import {AREA_GATES, gateAnchors, gateIsOpen, gateIdOfAnchor} from '../src/room-one/area-gates.js';
import {DOOR_PUZZLES, doorAnswerCorrect} from '../src/room-one/door-puzzles.js';
import {createState, goalFor, reduce, comparisonCorrect, NOTE_IDS} from '../src/room-one/rules.js';
import {sanitizeSave} from '../src/room-one/save.js';
import {validateGates, worldWithGates, lockedGateIds} from '../src/core/area-gates.js';
import {buildReachability, isWalkable} from '../src/core/world-geometry.js';
import {move} from '../src/ui/tactile/token-bins-model.js';
import {createComparisonBoard, comparisonPayload, emptySlotCount, COMPARISON_TOKENS} from '../src/room-one/comparison-board-model.js';
import {SYSTEM_HINTS} from '../src/room-one/content.js';

const entry = WORLD.checkpoints[0];
const reach = state => buildReachability(worldWithGates(WORLD, AREA_GATES, state), entry);
const obj = id => WORLD.objects.find(o => o.id === id);
const anchor = (state, id) => gateAnchors(state).find(a => a.id === id);
const NOTES = [...NOTE_IDS];
const at = flags => ({...createState(), ...flags});
const SOLVED = id => ({doorsSolved: [id]});

test('Room 1 gate data is valid and the entry point is clear of it', () => {
  validateGates(AREA_GATES);
  assert.equal(AREA_GATES.length, 6);
  assert.ok(isWalkable(worldWithGates(WORLD, AREA_GATES, createState()), entry.x, entry.y));
});

test('every gate has exactly one unlock method and the room contains both types', () => {
  assert.deepEqual([...new Set(AREA_GATES.map(g => g.type))].sort(), ['auto', 'puzzle']);
  const everySolved = at({doorsSolved: Object.keys(DOOR_PUZZLES)});
  for (const gate of AREA_GATES) {
    if (gate.type === 'auto') {
      assert.equal(gate.anchors, undefined, `${gate.id}: auto gate has no door anchor`);
      assert.equal(Object.hasOwn(DOOR_PUZZLES, gate.id), false, `${gate.id}: auto gate has no puzzle`);
      assert.equal(gate.unlockedBy(everySolved), false, `${gate.id}: door puzzles never open an auto gate`);
    } else {
      assert.ok(gate.anchors?.length, `${gate.id}: puzzle gate needs an E anchor`);
      assert.ok(DOOR_PUZZLES[gate.id], `${gate.id}: puzzle gate needs puzzle data`);
      assert.equal(gate.unlockedBy(at({letterSolved: true})), false, `${gate.id}: never auto-opens`);
      assert.equal(gate.unlockedBy(at(SOLVED(gate.id))), true, `${gate.id}: opens when solved`);
    }
  }
  assert.deepEqual(AREA_GATES.map(g => g.type), ['auto', 'puzzle', 'auto', 'puzzle', 'auto', 'puzzle'], 'fixed per gate in data');
  assert.equal(new Set(AREA_GATES.map(g => g.id)).size, AREA_GATES.length);
});

test('gate 1 (auto): the lobby holds only the letter until it is read', () => {
  const r = reach(createState());
  assert.equal(r.canReach(obj('letter')), true);
  for (const id of ['map-a03', 'comparison', 'v1', 'v2', 'p1', 'p2', 'drawer', 'chest', 'lamp', 'crate']) assert.equal(r.canReach(obj(id)), false, `${id} blocked`);
  assert.equal(gateIsOpen('lobby-hall', at({letterSolved: true})), true);
  assert.ok(r.canReach(anchor(createState(), 'gate:west-archive:1')), 'lobby-side lock of the west archive is reachable');
});

test('gate 2 (puzzle): the west archive opens by its door puzzle only', () => {
  const s = at({letterSolved: true}), r = reach(s);
  for (const id of ['map-a03', 'comparison']) assert.equal(r.canReach(obj(id)), true, id);
  for (const id of ['v1', 'v2', 'p1', 'p2', 'chest', 'drawer']) assert.equal(r.canReach(obj(id)), false, `${id} blocked`);
  assert.ok(r.canReach(anchor(s, 'gate:west-archive:0')) && r.canReach(anchor(s, 'gate:west-archive:1')));
  const open = reach(at({letterSolved: true, ...SOLVED('west-archive')}));
  assert.equal(open.canReach(obj('v1')) && open.canReach(obj('v2')), true);
  assert.equal(open.canReach(obj('p1')), false); assert.equal(open.canReach(obj('chest')), false);
});

test('gate 3 (auto): the east archive follows V-01 and V-02', () => {
  const base = {letterSolved: true, envelopeOpened: true, readNoteIds: ['v1', 'v2'], ...SOLVED('west-archive')};
  assert.equal(reach(at(base)).canReach(obj('p1')), false);
  const done = at({...base, collectedNoteIds: ['v1', 'v2']}), open = reach(done);
  assert.equal(open.canReach(obj('p1')) && open.canReach(obj('p2')), true);
  assert.equal(open.canReach(obj('drawer')), false);
  assert.ok(open.canReach(anchor(done, 'gate:drawer-alcove:1')), 'wing-side lock reachable');
});

test('gates 4-6: drawer alcove (puzzle), chest alcove (auto), exit hall (puzzle)', () => {
  const all4 = {letterSolved: true, envelopeOpened: true, readNoteIds: NOTES, collectedNoteIds: NOTES, comparisonSolved: true, doorsSolved: ['west-archive']};
  assert.equal(reach(at(all4)).canReach(obj('drawer')), false);
  const drawerOpen = at({...all4, doorsSolved: ['west-archive', 'drawer-alcove']});
  assert.equal(reach(drawerOpen).canReach(obj('drawer')), true);
  assert.equal(reach(drawerOpen).canReach(obj('chest')), false);
  const chestOpen = at({...drawerOpen, drawerOpened: true, identitySolved: true});
  assert.equal(reach(chestOpen).canReach(obj('chest')), true);
  const chestDone = at({...chestOpen, chestOpened: true});
  assert.ok(reach(chestDone).canReach(anchor(chestDone, 'gate:exit-hall:0')), 'exit lock reachable');
  const final = at({...chestDone, doorsSolved: [...chestDone.doorsSolved, 'exit-hall']});
  for (const o of WORLD.objects) assert.equal(reach(final).canReach(o), true, `${o.id} reachable once everything is open`);
  assert.deepEqual(lockedGateIds(AREA_GATES, final), []);
});

test('top openings cannot bypass the exit hall or the alcoves', () => {
  const r = reach(at({letterSolved: true, ...SOLVED('west-archive')}));
  for (const [x, y] of [[1200, 100], [1000, 100], [1400, 100], [800, 300], [1800, 300]]) {
    assert.equal(r.points.some(p => Math.abs(p.x - x) < 40 && Math.abs(p.y - y) < 40), false, `${x},${y} sealed`);
  }
});

test('the current goal is reachable at every step of the canonical playthrough', () => {
  let s = createState();
  const check = () => {
    const goal = goalFor(s), target = [...WORLD.objects, ...gateAnchors(s)].find(o => o.id === goal.id);
    assert.ok(target, `goal ${goal.id} exists`); assert.ok(reach(s).canReach(target), `goal ${goal.id} reachable`);
  };
  const steps = [['letter', {documentId: 'restored-letter'}], ['map', {cell: 'A-03'}], ['door', {id: 'west-archive', code: 'A03'}],
    ...['v1', 'v2', 'p1', 'p2'].flatMap(id => [['read', {id}], ['collect', {id}]]),
    ['comparison', {troopVN: 252000, troopFrance: 445000, equipmentVN: 'limited', equipmentFrance: 'modern',
      positionVN: 'initiative', positionFrance: 'dispersed', pressureVN: 'supply', pressureFrance: 'costs'}],
    ['door', {id: 'drawer-alcove', code: '252'}], ['drawer', {code: '2413'}], ['identity', {name: 'HENRI NAVARRE'}], ['chest', {keyword: 'NAVA'}],
    ['door', {id: 'exit-hall', code: '07'}], ['exit', {}]];
  check();
  for (const [action, payload] of steps) {
    const before = s; s = reduce(s, action, payload);
    assert.notEqual(s, before, `${action} ${JSON.stringify(payload)} advances`); check();
  }
  assert.equal(s.exitReached, true);
});

test('door puzzles: right code opens, wrong or early attempts change nothing, anchors vanish once solved', () => {
  const s = at({letterSolved: true});
  assert.equal(reduce(s, 'door', {id: 'west-archive', code: 'A02'}), s);
  assert.equal(reduce(createState(), 'door', {id: 'west-archive', code: 'A03'}).doorsSolved.length, 0, 'needs the letter first');
  assert.equal(reduce(s, 'door', {id: 'drawer-alcove', code: '252'}), s, 'needs V-02 first');
  assert.equal(reduce(s, 'door', {id: 'nope', code: 'A03'}), s);
  const open = reduce(s, 'door', {id: 'west-archive', code: ' a-03 '});
  assert.deepEqual(open.doorsSolved, ['west-archive']);
  assert.equal(reduce(open, 'door', {id: 'west-archive', code: 'A03'}), open, 'idempotent');
  assert.equal(gateAnchors(open).some(a => a.gateId === 'west-archive'), false);
  assert.equal(gateIdOfAnchor('gate:exit-hall:0'), 'exit-hall'); assert.equal(gateIdOfAnchor('v1'), null);
  assert.equal(doorAnswerCorrect('exit-hall', {code: '07'}), true);
});

test('old saves are never trapped and the new field is sanitized', () => {
  const old = {version: 1, introSeen: true, letterSolved: true, envelopeOpened: true, readNoteIds: NOTES, collectedNoteIds: NOTES,
    seenObjectIds: [], comparisonSolved: true, drawerOpened: true, identitySolved: true, chestOpened: true, exitReached: true};
  const state = sanitizeSave(old);
  assert.deepEqual(state.doorsSolved, []);
  assert.deepEqual(lockedGateIds(AREA_GATES, state), [], 'a finished legacy save sees every gate open');
  const mid = sanitizeSave({...old, exitReached: false, chestOpened: false, identitySolved: false, drawerOpened: false, comparisonSolved: false});
  assert.equal(gateIsOpen('west-archive', mid), true); assert.equal(gateIsOpen('east-archive', mid), true);
  assert.equal(gateIsOpen('drawer-alcove', mid), false, 'solvable puzzle, not a trap');
  assert.deepEqual(sanitizeSave({...old, doorsSolved: ['exit-hall', 'bad', 'exit-hall', 7]}).doorsSolved, ['exit-hall']);
});

const place = (state, pairs) => pairs.reduce((acc, [token, bin]) => move(acc, token, bin), state);
const SOLUTION = [['n252000', 'troopVN'], ['n445000', 'troopFrance'], ['limited', 'equipmentVN'], ['modern', 'equipmentFrance'],
  ['initiative', 'positionVN'], ['dispersed', 'positionFrance'], ['supply', 'pressureVN'], ['costs', 'pressureFrance']];

test('comparison board yields the exact legacy payload, only when all eight slots are filled', () => {
  const board = createComparisonBoard();
  assert.equal(COMPARISON_TOKENS.length, 8);
  assert.equal(emptySlotCount(board), 8);
  assert.equal(comparisonPayload(board), null);
  assert.equal(comparisonPayload(place(board, SOLUTION.slice(0, 7))), null);
  const full = place(board, SOLUTION);
  assert.equal(emptySlotCount(full), 0);
  const payload = comparisonPayload(full);
  assert.equal(payload.troopVN, 252000); assert.equal(payload.troopFrance, 445000);
  assert.equal(comparisonCorrect(payload), true);
});

test('comparison board rejects wrong categories and wrong placements are not accepted by the rules', () => {
  const board = createComparisonBoard();
  assert.equal(move(board, 'limited', 'troopVN'), board, 'equipment card cannot sit in a troop slot');
  assert.equal(move(place(board, [['modern', 'equipmentVN']]), 'limited', 'equipmentVN').slots.equipmentVN[0], 'modern', 'slot holds one card');
  const swapped = place(board, SOLUTION.map(([t, b]) => [t, b === 'troopVN' ? 'troopFrance' : b === 'troopFrance' ? 'troopVN' : b]));
  assert.equal(comparisonCorrect(comparisonPayload(swapped)), false);
});

test('Room 1 open hints name the new mechanics, stay free of digits and address Ký Chủ', () => {
  for (const key of ['comparison', 'drawer', 'identity', 'chest', 'door-west-archive', 'door-drawer-alcove', 'door-exit-hall']) {
    const lines = [SYSTEM_HINTS[key].open, ...SYSTEM_HINTS[key].hints];
    for (const line of lines) { assert.ok(!/\d/.test(line), `${key}: ${line}`); }
    assert.ok(lines[0].includes('Ký Chủ'));
  }
});
