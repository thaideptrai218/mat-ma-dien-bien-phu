import test from 'node:test';
import assert from 'node:assert/strict';
import { AudioController } from '../src/audio/audio-controller.js';
import { CueLibrary } from '../src/audio/cue-library.js';
import { SampleCueBank, FOOTSTEP_GAIN } from '../src/audio/sample-cue-bank.js';
import { VoicePreferences, MIX_PREFERENCES_KEY } from '../src/audio/voice-preferences.js';

// Controlled Web Audio / fetch adapters: they verify routing, scheduling and cleanup, not audible output.
class Param {
  constructor() { this.value = 0; this.ramps = []; }
  setValueAtTime(v) { this.value = v; } cancelScheduledValues() {}
  exponentialRampToValueAtTime() {}
  linearRampToValueAtTime(v, t) { this.ramps.push([v, t]); }
}
class Node {
  constructor() { this.gain = new Param(); this.frequency = new Param(); this.Q = new Param(); this.connections = []; }
  connect(target) { this.connections.push(target); } disconnect() { this.disconnected = true; }
  start() { this.started = true; } stop(when) { this.stopped = true; this.stopAt = when; }
}
class Context extends EventTarget {
  constructor() { super(); this.state = 'running'; this.currentTime = 10; this.sampleRate = 8000; this.destination = {}; this.sources = []; this.gains = []; }
  createGain() { const n = new Node(); this.gains.push(n); return n; }
  createOscillator() { return new Node(); }
  createBiquadFilter() { return new Node(); }
  createBuffer() { return { getChannelData: () => new Float32Array(this.sampleRate) }; }
  createAnalyser() { const n = new Node(); n.getFloatTimeDomainData = s => s.fill(0); return n; }
  createBufferSource() { const n = new Node(); this.sources.push(n); return n; }
  async decodeAudioData(data) { return { label: new TextDecoder().decode(data) }; }
  async resume() { this.state = 'running'; this.dispatchEvent(new Event('statechange')); }
  async close() { this.state = 'closed'; }
}

const ENTRIES = {
  paper: ['sfx', 'sfx'], 'fragment-get': ['sfx', 'sfx'], 'card-place': ['sfx', 'sfx'], 'ui-open': ['sfx', 'sfx'], 'ui-close': ['sfx', 'sfx'],
  'step-stone-1': ['sfx', 'footstep'], 'step-stone-2': ['sfx', 'footstep'], 'step-stone-3': ['sfx', 'footstep'],
  'room-1': ['ambience', 'ambience'], 'room-2': ['ambience', 'ambience'],
};
function fakeFetch({ missing = [], manifestOk = true, extra = {} } = {}) {
  const calls = [];
  const cues = { ...extra };
  for (const [name, [dir, kind]] of Object.entries(ENTRIES)) cues[name] = { file: `audio/${dir}/${name}.mp3`, durationMs: 500, kind };
  const fetchImpl = async url => {
    calls.push(url);
    if (url.endsWith('manifest.json')) return manifestOk ? { ok: true, json: async () => ({ cues }) } : { ok: false, status: 404 };
    const name = url.match(/\/([a-z0-9-]+)\.mp3$/)?.[1];
    return missing.includes(name) ? { ok: false, status: 404 } : { ok: true, arrayBuffer: async () => new TextEncoder().encode(name).buffer };
  };
  return { fetchImpl, calls };
}
const tick = () => new Promise(resolve => setImmediate(resolve));

async function unlocked({ fetchOptions, scene = null, mode = 'exploration' } = {}) {
  const audio = new AudioController(); audio.Engine = Context;
  const net = fakeFetch(fetchOptions);
  audio.library.fetchImpl = net.fetchImpl;
  audio.setPreferences({ audioEnabled: true, audioVolume: 0.5 });
  audio.setScene(scene);
  await audio.unlockFromGesture();
  await tick(); await tick();
  audio.setMode(mode);
  return { audio, net, context: audio.context };
}

test('cue library keeps only same-origin, mastered entries and degrades to empty', async () => {
  const controller = { context: new Context() };
  const bad = { cues: {
    ok: { file: 'audio/sfx/ok.mp3', durationMs: 10, kind: 'sfx' },
    noDuration: { file: 'audio/sfx/no-duration.mp3', kind: 'sfx' },
    foreign: { file: 'https://evil.example/x.mp3', durationMs: 10, kind: 'sfx' },
    traversal: { file: 'audio/sfx/../../secret.mp3', durationMs: 10, kind: 'sfx' },
  } };
  const library = new CueLibrary(controller, { fetchImpl: async () => ({ ok: true, json: async () => bad }) });
  assert.deepEqual([...(await library.load()).keys()], ['ok']);
  const broken = new CueLibrary(controller, { fetchImpl: async () => { throw new Error('offline'); } });
  assert.equal((await broken.load()).size, 0);
  assert.equal(await broken.buffer('ok'), null);
  const noFetch = new CueLibrary(controller, { fetchImpl: undefined });
  assert.equal((await noFetch.load()).size, 0);
});

test('preload warms short cues but never the long ambience beds', async () => {
  const net = fakeFetch({ missing: ['paper'] });
  const library = new CueLibrary({ context: new Context() }, { fetchImpl: net.fetchImpl });
  await library.preload();
  assert.ok(library.buffers.has('fragment-get') && library.buffers.has('step-stone-1'));
  assert.equal(library.buffers.has('room-1'), false);
  assert.equal(library.failed.has('paper'), true, 'a missing file is remembered, not retried');
  assert.equal(net.calls.some(url => url.includes('/ambience/')), false);
});

test('sample bank plays loaded cues on the sfx bus, at footstep gain for steps, and reports misses', async () => {
  const context = new Context(), controller = { context, master: new Node() };
  const library = new CueLibrary(controller, { fetchImpl: fakeFetch().fetchImpl });
  await library.preload();
  const prefs = new VoicePreferences(null, MIX_PREFERENCES_KEY, { sfxVolume: 1, ambienceVolume: 1 });
  const bank = new SampleCueBank(controller, library, { preferences: prefs, random: () => 0.99 });
  assert.equal(bank.play('does-not-exist'), false);
  assert.equal(bank.play('paper'), true);
  assert.equal(context.gains[0].connections[0], controller.master, 'sfx bus feeds the master');
  assert.equal(bank.footstep('stone'), true);
  assert.equal(context.sources.at(-1).buffer.label, 'step-stone-3', 'variant chosen at random from 1..3');
  const stepGain = context.gains.at(-1);
  assert.equal(stepGain.gain.value, FOOTSTEP_GAIN);
  assert.equal(bank.footstep('wood'), false, 'surface without a recording falls back to the synth');
  prefs.set({ sfxVolume: 0.25 });
  assert.ok(context.gains[0].gain.value < 1);
  assert.equal(bank.count(), 2);
  bank.stop();
  assert.equal(bank.count(), 0);
  assert.equal(context.sources[0].stopped, true);
});

test('playCue prefers the recording (with legacy aliases) and falls back to the synth cue', async () => {
  const { audio, context } = await unlocked();
  assert.equal(audio.playCue('reveal'), true);
  assert.equal(context.sources.at(-1).buffer.label, 'fragment-get', 'reveal → fragment-get');
  assert.equal(audio.playCue('weight'), true);
  assert.equal(context.sources.at(-1).buffer.label, 'card-place', 'weight → card-place');
  assert.equal(audio.getSnapshot().cues.sfx, 2);
  const before = audio.synth.count();
  assert.equal(audio.playCue('success'), true, 'no recording loaded for success: synth cue');
  assert.ok(audio.synth.count() > before);
  assert.equal(audio.playCue('drawer-open'), true, 'renamed cue without a recording uses its synth fallback');
  assert.equal(audio.playCue('system-glitch'), false, 'cue with neither recording nor synth is silent, not an error');
  audio.destroy();
});

test('footsteps use the scene surface sample and fall back to the synth step', async () => {
  const stone = await unlocked({ scene: 'room-4' });
  assert.equal(stone.audio.getSnapshot().cues.surface, 'stone');
  stone.audio.reportMotion({ distance: 100 });
  assert.match(stone.context.sources.at(-1).buffer.label, /^step-stone-[123]$/);
  assert.equal(stone.audio.synth.count('step'), 0);
  stone.audio.destroy();
  for (const [scene, surface] of [['room-1', 'earth'], ['room-2', 'wood'], ['room-3', 'earth'], ['room-5', 'wood'], ['museum', 'earth']]) {
    const { audio } = await unlocked({ scene });
    assert.equal(audio.getSnapshot().cues.surface, surface, scene);
    audio.destroy();
  }
  const wood = await unlocked({ scene: 'room-2' }); // no wood recordings in this fake manifest
  wood.audio.reportMotion({ distance: 100 });
  assert.ok(wood.audio.synth.count('step') > 0);
  wood.audio.destroy();
});

test('ambience bed loops through Web Audio, crossfades 1.5 s on scene change and replaces the synth bed', async () => {
  const { audio, context } = await unlocked({ scene: 'room-1' });
  await tick(); await tick();
  const first = context.sources.find(source => source.loop);
  assert.ok(first && first.started, 'bed started');
  assert.equal(first.buffer.label, 'room-1');
  assert.equal(audio.synth.count('ambient'), 0, 'recorded bed replaces the synth bed');
  assert.equal(audio.getSnapshot().ambientSources, 0);

  audio.setScene('room-2'); await tick(); await tick();
  const beds = context.sources.filter(source => source.loop);
  assert.equal(beds.length, 2);
  assert.equal(first.stopAt, context.currentTime + 1.5, 'old bed stops after the crossfade');
  assert.deepEqual(context.gains.at(-1).gain.ramps.at(-1), [1, context.currentTime + 1.5], 'new bed fades in');
  assert.equal(audio.getSnapshot().cues.ambience, 2);

  audio.voiceActivity(true);
  const bus = context.gains.find(gain => gain.connections[0] === audio.master && gain !== context.gains[0]);
  assert.ok(bus.gain.ramps.at(-1)[0] < 1.0 && bus.gain.ramps.at(-1)[1] === context.currentTime + 0.2, 'ducked to 30% in 200 ms');
  audio.voiceActivity(false);
  assert.ok(bus.gain.ramps.at(-1)[0] > 2, 'restored when the voice ends');

  audio.setMode('dialogue');
  assert.equal(first.stopped, true);
  assert.equal(audio.getSnapshot().cues.ambience, 2, 'bed keeps running under dialogue');
  audio.setMode('inactive');
  assert.equal(audio.getSnapshot().cues.ambience, 0, 'stopped when inactive');
  audio.destroy();
});

test('scenes without a loadable bed use the synth ambience', async () => {
  const { audio } = await unlocked({ scene: 'room-3' }); // not in the fake manifest
  await tick(); await tick();
  assert.equal(audio.getSnapshot().ambientSources, 2);
  audio.destroy();
  const offline = await unlocked({ scene: 'room-1', fetchOptions: { manifestOk: false } });
  await tick(); await tick();
  assert.equal(offline.audio.getSnapshot().ambientSources, 2, 'manifest failure → synth bed');
  offline.audio.destroy();
});

test('opening and closing a panel over the map plays ui-open / ui-close', async () => {
  const { audio, context } = await unlocked();
  const label = () => context.sources.at(-1).buffer.label;
  audio.setMode('dialogue'); assert.equal(label(), 'ui-open');
  audio.setMode('exploration'); assert.equal(label(), 'ui-close');
  const count = context.sources.length;
  audio.setMode('inactive'); audio.setMode('dialogue');
  assert.equal(context.sources.length, count, 'no panel sound when coming from inactive');
  audio.destroy();
});

test('effects and ambience volumes persist in their own key', () => {
  const store = new Map();
  const storage = { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) };
  const defaults = { sfxVolume: 1, ambienceVolume: 1 };
  const prefs = new VoicePreferences(storage, MIX_PREFERENCES_KEY, defaults);
  assert.deepEqual({ ...prefs.get() }, defaults);
  prefs.set({ sfxVolume: 0.3, ambienceVolume: 2 });
  assert.deepEqual(JSON.parse(store.get('mat-ma-dien-bien-phu:mix:v1')), { sfxVolume: 0.3, ambienceVolume: 1 });
  assert.deepEqual({ ...new VoicePreferences(storage, MIX_PREFERENCES_KEY, defaults).get() }, { sfxVolume: 0.3, ambienceVolume: 1 });
});

test('a failed manifest load is retried after the delay instead of being cached forever', async () => {
  let online = false, calls = 0;
  const library = new CueLibrary({ context: new Context() }, { fetchImpl: async url => {
    calls++;
    if (!online) throw new Error('offline');
    return { ok: true, json: async () => ({ cues: { paper: { file: 'audio/sfx/paper.mp3', durationMs: 5, kind: 'sfx' } } }), arrayBuffer: async () => new ArrayBuffer(1) };
  } });
  assert.equal((await library.load()).size, 0);
  assert.equal((await library.load()).size, 0);
  assert.equal(calls, 1, 'no request storm inside the retry delay');
  online = true; library.retryAfter = 0;
  assert.equal((await library.load()).size, 1, 'later call retries and succeeds');
});
