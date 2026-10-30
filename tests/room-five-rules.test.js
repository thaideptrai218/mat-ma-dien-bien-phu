import test from 'node:test';
import assert from 'node:assert/strict';
import {createState, reduce, hasAllFragments, goalFor} from '../src/room-five/rules.js';
import {SAVE_KEY, sanitizeSave, loadSave, persistSave} from '../src/room-five/save.js';

const owned = [1, 2, 3, 4];
test('final assembly requires four actual fragments and the exact four-quadrant order', () => {
  const start = createState();
  for (const fragments of [undefined, [], [1, 2, 3], [1, 1, 2, 3], ['1', '2', '3', '4']]) {
    assert.equal(hasAllFragments(fragments), false);
    assert.equal(reduce(start, 'assembly', {order: [0, 1, 2, 3]}, fragments), start);
  }
  for (const order of [[], [0, 1, 2], [0, 1, 2, 3, 4], [1, 0, 2, 3], [0, 0, 2, 3], '0123']) {
    assert.equal(reduce(start, 'assembly', {order}, owned), start);
  }
  const assembled = reduce(start, 'assembly', {order: [0, 1, 2, 3]}, owned);
  assert.equal(assembled.assemblySolved, true);
  assert.equal(assembled.reflectionSeen, false, 'matching the image does not open the door');
  assert.equal(assembled.exitReached, false);
  assert.equal(goalFor(assembled, owned).id, 'reflection');
  assert.deepEqual(Object.keys(start), Object.keys(assembled), 'no fragments or player answers minted into room state');
});

test('blank reflection is accepted after assembly and before a separate physical exit intent', () => {
  let state = createState();
  assert.equal(reduce(state, 'reflection', {}, owned), state);
  assert.equal(reduce(state, 'exit', {}, owned), state);
  state = reduce(state, 'assembly', {order: [0, 1, 2, 3]}, owned);
  assert.equal(reduce(state, 'exit', {}, owned), state);
  const reflected = reduce(state, 'reflection', undefined, owned);
  assert.equal(reflected.reflectionSeen, true);
  assert.equal(reflected.exitReached, false);
  assert.equal(goalFor(reflected, owned).id, 'door');
  const exited = reduce(reflected, 'exit', {}, owned);
  assert.equal(exited.exitReached, true);
  assert.equal(reduce(reflected, 'exit', {}, []), reflected, 'losing inventory context cannot grant completion');
});

test('save restoration accepts only assembly-reflection-exit prefix and strips all personal text', () => {
  assert.equal(sanitizeSave({version: 1, reflectionSeen: true, exitReached: true}).exitReached, false);
  assert.equal(sanitizeSave({version: 1, assemblySolved: true, exitReached: true}).exitReached, false);
  const raw = {...createState(), assemblySolved: true, reflectionSeen: true, exitReached: true,
    personalResponse: 'NEVER-STORE', reflection: 'NEVER-STORE', order: [0, 1, 2, 3], fragments: owned};
  const restored = sanitizeSave(raw);
  assert.equal(restored.exitReached, true, 'campaign validator can independently enforce preceding rooms');
  assert.equal(JSON.stringify(restored).includes('NEVER-STORE'), false);
  assert.equal(sanitizeSave(raw, []).assemblySolved, false);
  const writes = [];
  const storage = {getItem: () => JSON.stringify(raw), setItem: (key, value) => writes.push([key, value])};
  assert.equal(loadSave(storage).state.assemblySolved, false, 'standalone load never assumes ownership');
  assert.equal(loadSave(storage, owned).state.exitReached, true);
  assert.equal(persistSave(storage, raw, owned), '');
  assert.equal(writes[0][0], SAVE_KEY);
  assert.equal(writes[0][1].includes('NEVER-STORE'), false);
  assert.ok(loadSave(null, owned).notice);
  assert.ok(persistSave(null, raw, owned));
});
