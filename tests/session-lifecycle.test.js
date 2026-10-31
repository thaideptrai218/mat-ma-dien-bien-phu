import test from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {disposeRoomSession, deferRoomExit, retainSharedAudioPreferences} from '../src/core/session-lifecycle.js';
import {handleAction as roomOneAction} from '../src/room-one/actions.js';
import {handleAction as roomThreeAction} from '../src/room-three/actions.js';
import {handleAction as roomFourAction} from '../src/room-four/actions.js';

function fixture(ownsAudio = true) {
  const calls = [], events = new EventEmitter();
  const session = {
    ownsAudio, options: {}, nonce: 4, active: {kind: 'dialogue'},
    root: {replaceChildren: () => calls.push('root'), classList: {remove: (...names) => calls.push(names)}},
    scene: {callbacks: {}, clearKeys: () => calls.push('keys'), teardown: () => calls.push('scene')},
    ui: {destroy: () => calls.push('ui')},
    audio: {destroy: () => calls.push('audio'), setMode: mode => calls.push(mode)},
    game: {events, destroy: (...args) => calls.push(args)},
  };
  return {session, calls, events};
}

test('disposal invalidates synchronously, cleans live scene first and waits until after Phaser destroy event', async () => {
  const {session, calls, events} = fixture();
  const promise = disposeRoomSession(session);
  assert.equal(disposeRoomSession(session), promise, 'repeat destroy must share pending completion');
  assert.equal(session.disposed, true);
  assert.equal(session.active, null);
  assert.equal(session.nonce, 5);
  assert.equal(session.scene.callbacks.isPaused(), true);
  assert.deepEqual(calls, ['keys', 'scene', 'ui', 'audio', [true, false]]);
  events.emit('destroy');
  calls.push('renderer-finished');
  assert.equal(calls.includes('root'), false, 'core event precedes renderer/canvas cleanup');
  await promise;
  assert.ok(calls.indexOf('root') > calls.indexOf('renderer-finished'));
  assert.deepEqual(calls.at(-1), ['r1-app', 'r2-app', 'r3-app', 'r4-app', 'r5-app']);
  await disposeRoomSession(session);
  assert.equal(calls.filter(value => value === 'scene').length, 1);
});

test('campaign audio survives child disposal and pagehide subscription is removed', async () => {
  const {session, calls, events} = fixture(false);
  const previous = globalThis.window, windowTarget = new EventTarget();
  globalThis.window = windowTarget;
  session.onPageHide = () => calls.push('pagehide');
  windowTarget.addEventListener('pagehide', session.onPageHide);
  try {
    const promise = disposeRoomSession(session);
    windowTarget.dispatchEvent(new Event('pagehide'));
    assert.equal(calls.includes('pagehide'), false);
    assert.equal(calls.includes('audio'), false);
    assert.equal(calls.includes('inactive'), true);
    events.emit('destroy'); await promise;
  } finally {
    if (previous === undefined) delete globalThis.window;
    else globalThis.window = previous;
  }
});

test('pre-create disposal permits absent scene/UI/game without leaving stale callbacks active', async () => {
  const session = {nonce: 0, ownsAudio: false};
  await disposeRoomSession(session);
  assert.equal(session.disposed, true);
  assert.equal(session.nonce, 1);
});

test('campaign exit callback runs only after the current action stack and validated exit', async () => {
  const calls = [];
  const session = {nonce: 2, state: {exitReached: true}, options: {onExit: s => calls.push(s)}};
  assert.equal(deferRoomExit(session), true);
  assert.equal(deferRoomExit(session), true, 'same physical exit queues only one transition');
  assert.deepEqual(calls, []);
  await Promise.resolve();
  assert.deepEqual(calls, [session]);
  assert.equal(deferRoomExit({options: {}}), false);
});

test('reset/disposal or missing exit prevents queued callback from changing rooms', async () => {
  for (const invalidate of [s => s.nonce++, s => {s.disposed = true;}, s => {s.state.exitReached = false;}]) {
    let count = 0;
    const session = {nonce: 2, state: {exitReached: true}, options: {onExit: () => count++}};
    deferRoomExit(session); invalidate(session);
    await Promise.resolve();
    assert.equal(count, 0);
  }
});

test('all existing action routers reject disposed and parent-paused intents', () => {
  for (const handleAction of [roomOneAction, roomThreeAction, roomFourAction]) {
    for (const flags of [{disposed: true}, {options: {isPaused: () => true}}]) {
      const session = {...flags, show: () => assert.fail('stale/paused view opened'),
        commit: () => assert.fail('stale/paused intent wrote progress')};
      handleAction(session, 'map');
      handleAction(session, 'intro-finish', {token: 1});
    }
  }
});

test('room reset retains parent-owned audio preferences and standalone reset keeps room defaults', () => {
  for (const ownsAudio of [true, false]) {
    const session = {ownsAudio, state: {audioEnabled: false, audioVolume: .5},
      audio: {getSnapshot: () => ({enabled: true, volume: .7})}};
    retainSharedAudioPreferences(session);
    assert.deepEqual(session.state, ownsAudio ? {audioEnabled: false, audioVolume: .5} : {audioEnabled: true, audioVolume: .7});
  }
});
