import test from 'node:test';
import assert from 'node:assert/strict';
import {handleAction} from '../src/room-five/actions.js';
import {createState, reduce} from '../src/room-five/rules.js';

function session() {
  return {disposed: false, options: {}, fragments: [1, 2, 3, 4], state: createState(), active: null, intents: [],
    audio: {playCue() {}}, commit(action, payload) {
      this.intents.push([action, payload]);
      const next = reduce(this.state, action, payload, this.fragments); if (next === this.state) return false;
      this.state = next; return true;
    }, dialogue(title, lines) {this.active = {kind: 'dialogue', title, lines};},
    show(kind, data) {this.active = {kind, ...data};}, close() {this.active = null;}, error(message) {this.notice = message;}};
}

test('assembly and reflection reject wrong views, stale callbacks, disposed and parent-paused input', () => {
  const s = session();
  handleAction(s, 'assembly-submit', {token: 1, order: [0, 1, 2, 3]}); assert.equal(s.state.assemblySolved, false);
  s.active = {kind: 'assembly', token: 2};
  handleAction(s, 'assembly-submit', {token: 1, order: [0, 1, 2, 3]}); assert.equal(s.state.assemblySolved, false);
  s.options.isPaused = () => true;
  handleAction(s, 'assembly-submit', {token: 2, order: [0, 1, 2, 3]}); assert.equal(s.state.assemblySolved, false);
  s.options.isPaused = () => false;
  handleAction(s, 'assembly-submit', {token: 2, order: [0, 1, 2, 3]}); assert.equal(s.state.assemblySolved, true);
  assert.equal(s.state.reflectionSeen, false);
  handleAction(s, 'reflection-continue', {token: 2}); assert.equal(s.state.reflectionSeen, false);
  s.active = {kind: 'reflection', token: 3};
  handleAction(s, 'reflection-continue', {token: 2}); assert.equal(s.state.reflectionSeen, false);
  s.disposed = true; handleAction(s, 'reflection-continue', {token: 3}); assert.equal(s.state.reflectionSeen, false);
});

test('deliberate blank continuation emits no personal response and cannot exit remotely', () => {
  const s = session(); s.state.assemblySolved = true; s.active = {kind: 'reflection', token: 3};
  handleAction(s, 'reflection-continue', {token: 3});
  assert.equal(s.state.reflectionSeen, true); assert.equal(s.state.exitReached, false);
  assert.deepEqual(s.intents, [['reflection', undefined]]);
  s.active = {kind: 'reflection', token: 4, readOnly: true};
  handleAction(s, 'reflection-continue', {token: 4}); assert.equal(s.intents.length, 1);
});
