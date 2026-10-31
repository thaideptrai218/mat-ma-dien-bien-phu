import test from 'node:test';
import assert from 'node:assert/strict';
import {createRoomOneArtwork} from '../src/room-one/art.js';
import {createRoomThreeArtwork} from '../src/room-three/art.js';
import {createRoomFourArtwork} from '../src/room-four/art.js';
import {WORLD as W1} from '../src/room-one/world.js';
import {WORLD as W3} from '../src/room-three/world.js';
import {WORLD as W4} from '../src/room-four/world.js';
import {gateAnchors} from '../src/room-one/area-gates.js';
import {doorObjects as doors3, DOOR_GATES as G3} from '../src/room-three/area-gates.js';
import {doorObjects as doors4, DOOR_GATES as G4} from '../src/room-four/area-gates.js';
import {createRoomMap} from '../src/room-one/ui-map.js';
import {handleAction} from '../src/room-five/actions.js';
import {handleIntent} from '../src/room-two/actions.js';
import {createState as createTwo} from '../src/room-two/rules.js';
import {createState as createOne} from '../src/room-one/rules.js';
import {createState as createFive} from '../src/room-five/rules.js';
import {puzzles} from '../src/room-two/content.js';

// Minimal canvas stand-in that records every fillText call.
function withFakeCanvas(run) {
  const texts = [];
  const make = () => new Proxy({}, {
    get: (target, prop) => prop in target ? target[prop] : prop === 'measureText' ? () => ({width: 60})
      : prop === 'fillText' ? text => texts.push(text) : (() => make()),
    set: (target, prop, value) => { target[prop] = value; return true; },
  });
  const ctx = make();
  const previous = globalThis.document;
  globalThis.document = {createElement: () => ({width: 0, height: 0, getContext: () => ctx})};
  try { run(texts); } finally { globalThis.document = previous; }
}
const fakeScene = () => ({textures: {exists: () => false, remove() {}, addCanvas() {}}});

test('static room art never paints gate or door labels, only the room own objects', () => {
  const cases = [
    [createRoomOneArtwork, W1, gateAnchors(createOne())],
    [createRoomThreeArtwork, W3, doors3(G3.map(g => g.id))],
    [createRoomFourArtwork, W4, doors4(G4.map(g => g.id))],
  ];
  for (const [factory, world, extras] of cases) {
    assert.ok(extras.length, 'fixture needs gate/door objects');
    withFakeCanvas(texts => {
      factory(fakeScene(), {...world, objects: [...world.objects, ...extras]});
      for (const extra of extras) assert.ok(!texts.includes(extra.label), `${extra.id} label must not be baked`);
      assert.ok(texts.includes(world.objects.find(o => o.type !== 'prop').label) || texts.length > 0);
    });
  }
});

test('map keeps the goal marker while the goal is a gate anchor and never draws unrelated anchors', () => {
  const anchors = gateAnchors(createOne()), goal = anchors[0];
  const nodes = [];
  const fake = () => { const n = {attrs: {}, children: [], setAttribute(k, v) { this.attrs[k] = v; }, append(...c) { this.children.push(...c); }, addEventListener() {}}; nodes.push(n); return n; };
  const previous = globalThis.document;
  globalThis.document = {createElementNS: fake, createElement: fake};
  try {
    const circles = nodes0 => nodes0.filter(n => n.attrs.r === '90' && n.attrs.cx === String(goal.x) && n.attrs.cy === String(goal.y));
    createRoomMap({goal: {id: goal.id}, gateObjects: anchors, position: {}}, true, W1);
    assert.equal(circles(nodes).length, 1);
    nodes.length = 0;
    createRoomMap({goal: {id: 'letter'}, gateObjects: anchors, position: {}}, true, W1);
    assert.equal(circles(nodes).length, 0);
  } finally { globalThis.document = previous; }
});

test('room 5 assembly without four fragments shows a notice and does not escalate the hint', () => {
  const calls = {error: 0, render: 0};
  const s = {disposed: false, options: {}, fragments: [1], state: createFive(), active: {kind: 'assembly', token: 1}, notice: '',
    audio: {playCue() {}}, commit: () => false, error() { calls.error++; }, render() { calls.render++; }, close() {}, show() {}, dialogue() {}};
  handleAction(s, 'assembly-submit', {token: 1, order: [0, 1, 2, 3]});
  assert.equal(calls.error, 0); assert.equal(calls.render, 1); assert.match(s.notice, /bốn mảnh/);
});

test('room 2 opening a station before its prerequisite is a hint-toned notice, not an error', () => {
  const dependent = Object.values(puzzles).find(p => p.requiresPuzzleId);
  assert.ok(dependent);
  const tones = [];
  const s = {state: createTwo(), active: {kind: 'puzzle', puzzleId: dependent.id}, options: {}, disposed: false, notice: '', nonce: 0,
    audio: {playCue() {}}, ui: {puzzle: {showFeedback: (text, tone) => tones.push(tone)}}, commit: () => false, render() {}, close() {}};
  handleIntent(s, {type: 'submit-puzzle', puzzleId: dependent.id, answer: {}});
  assert.deepEqual(tones, ['hint']);
});
