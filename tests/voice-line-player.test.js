import test from 'node:test';
import assert from 'node:assert/strict';
import { VoiceLinePlayer } from '../src/audio/voice-line-player.js';
import { VoicePreferences, VOICE_PREFERENCES_KEY } from '../src/audio/voice-preferences.js';
import { createDialogueVoice } from '../src/audio/dialogue-voice.js';
import { AudioController } from '../src/audio/audio-controller.js';
import { voiceIdFor, framingLine } from '../src/audio/voice-id.js';

// Controlled Web Audio / fetch adapters: they verify sequencing, routing and cleanup, not audible output.
class FakeParam { constructor() { this.value = 0; } setValueAtTime(v) { this.value = v; } cancelScheduledValues() {} exponentialRampToValueAtTime() {} }
class FakeNode {
  constructor() { this.gain = new FakeParam(); this.frequency = new FakeParam(); this.Q = new FakeParam(); this.connections = []; }
  connect(target) { this.connections.push(target); }
  disconnect() { this.disconnected = true; }
  start() {} stop() {}
}
class FakeContext extends EventTarget {
  constructor({ autoEnd = true } = {}) {
    super(); this.state = 'running'; this.currentTime = 1; this.sampleRate = 8000; this.destination = {};
    this.autoEnd = autoEnd; this.sources = []; this.gains = [];
  }
  createGain() { const node = new FakeNode(); this.gains.push(node); return node; }
  createOscillator() { return new FakeNode(); }
  createBiquadFilter() { return new FakeNode(); }
  createBuffer() { return { getChannelData: () => new Float32Array(this.sampleRate) }; }
  createAnalyser() { const node = new FakeNode(); node.getFloatTimeDomainData = samples => samples.fill(0); return node; }
  createBufferSource() {
    const source = new FakeNode(), context = this;
    source.start = function start() {
      this.started = true; context.sources.push(this);
      if (context.autoEnd) queueMicrotask(() => this.onended?.());
    };
    source.stop = function stop() { this.stopped = true; };
    return source;
  }
  async decodeAudioData(data) {
    const label = new TextDecoder().decode(data);
    if (label === 'corrupt') throw new Error('EncodingError');
    return { label };
  }
  async resume() { this.state = 'running'; this.dispatchEvent(new Event('statechange')); }
  async close() { this.state = 'closed'; }
}

const line = (speaker, text) => ({ speaker, text });
const idOf = (voice, text) => voiceIdFor(voice, text);

// Manifest for every id in `entries`; `files` maps id → body text (absent → 404).
function fakeFetch(entries, files, { manifestOk = true } = {}) {
  const calls = [];
  const fetchImpl = async url => {
    calls.push(url);
    if (url.endsWith('manifest.json')) {
      return manifestOk
        ? { ok: true, json: async () => ({ version: 1, lines: entries.map(id => ({ id, file: `audio/voice/${id}.mp3`, durationMs: 1000 })) }) }
        : { ok: false, status: 404 };
    }
    const id = url.match(/([0-9a-f]{16})\.mp3$/)?.[1];
    return id in files
      ? { ok: true, arrayBuffer: async () => new TextEncoder().encode(files[id]).buffer }
      : { ok: false, status: 404 };
  };
  return { fetchImpl, calls };
}

function setup({ lines, autoEnd = true, audible = true, audioEnabled = true, prefs = new VoicePreferences(null), manifestOk, cacheSize } = {}) {
  const context = new FakeContext({ autoEnd });
  const controller = { context, master: new FakeNode(), preferences: { audioEnabled }, voiceAudible: () => audible };
  const ids = lines.map(l => idOf(typeof l === 'string' ? 'quang' : l.speaker === 'Hệ Thống' ? 'system' : 'quang', typeof l === 'string' ? l : l.text));
  const { fetchImpl, calls } = fakeFetch(ids, Object.fromEntries(ids.map((id, i) => [id, `line-${i}`])), { manifestOk });
  const player = new VoiceLinePlayer(controller, { fetchImpl, preferences: prefs, gapMs: 0, cacheSize });
  return { player, context, controller, ids, calls, prefs };
}

test('plays a sequence in order, reports the line being read and cleans up', async () => {
  const lines = [line('Hệ Thống', 'Chào Ký Chủ.'), 'Mình cần xem kỹ.', line('Quang', 'Đi thôi.')];
  const { player, context, controller } = setup({ lines });
  const seen = [];
  const result = await player.playSequence(lines, { onLine: index => seen.push(index) });
  assert.deepEqual(result, { played: 3, skipped: 0 });
  assert.deepEqual(seen, [0, 1, 2, -1]);
  assert.deepEqual(context.sources.map(source => source.buffer.label), ['line-0', 'line-1', 'line-2']);
  assert.ok(context.sources.every(source => source.connections[0] === context.gains[0]), 'all lines share the dedicated voice gain');
  assert.equal(context.gains[0].connections[0], controller.master, 'voice gain feeds the controller master');
  assert.equal(player.getSnapshot().playing, false);
  assert.equal(player.getSnapshot().activeSources, 0);
});

test('skips lines without a manifest entry, a file, or a decodable recording', async () => {
  const lines = ['không có trong manifest', 'file bị thiếu', 'file hỏng', 'đọc được'];
  const ids = lines.map(text => idOf('quang', text));
  const context = new FakeContext();
  const controller = { context, master: new FakeNode(), preferences: { audioEnabled: true }, voiceAudible: () => true };
  const { fetchImpl } = fakeFetch(ids.slice(1), { [ids[2]]: 'corrupt', [ids[3]]: 'ok' });
  const player = new VoiceLinePlayer(controller, { fetchImpl, preferences: new VoicePreferences(null), gapMs: 0 });
  const seen = [];
  const result = await player.playSequence(lines, { onLine: index => seen.push(index) });
  assert.deepEqual(result, { played: 1, skipped: 3 });
  assert.deepEqual(seen, [3, -1]);
  assert.equal(await player.hasVoiceFor(lines), true, 'one recording still works');
  assert.equal(await player.hasVoiceFor(lines.slice(0, 3)), false, 'known-missing and unlisted lines offer no replay');
});

test('starting a new sequence stops the previous one: a single channel', async () => {
  const first = ['một', 'hai'], second = ['ba'];
  const { player, context, ids } = setup({ lines: [...first, ...second], autoEnd: false });
  const firstSeen = [], secondSeen = [];
  const firstRun = player.playSequence(first, { onLine: index => firstSeen.push(index) });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(context.sources.length, 1);
  assert.equal(player.getSnapshot().activeSources, 1);

  const secondRun = player.playSequence(second, { onLine: index => secondSeen.push(index) });
  assert.deepEqual(await firstRun, { played: 0, skipped: 0 });
  assert.equal(context.sources[0].stopped, true);
  assert.deepEqual(firstSeen, [0, -1]);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(context.sources.length, 2, 'the interrupted sequence never starts its second line');
  assert.equal(player.getSnapshot().activeSources, 1);

  context.sources[1].onended();
  assert.deepEqual(await secondRun, { played: 1, skipped: 0 });
  assert.deepEqual(secondSeen, [0, -1]);
  assert.equal(ids.length, 3);
});

test('stop() ends playback, releases the source and notifies the panel once', async () => {
  const { player, context } = setup({ lines: ['một', 'hai'], autoEnd: false });
  const seen = [];
  const run = player.playSequence(['một', 'hai'], { onLine: index => seen.push(index) });
  await new Promise(resolve => setImmediate(resolve));
  player.stop(); player.stop();
  await run;
  assert.equal(context.sources[0].stopped, true);
  assert.equal(context.sources[0].disconnected, true);
  assert.deepEqual(seen, [0, -1]);
  assert.equal(player.getSnapshot().playing, false);
});

test('is a no-op without Web Audio, fetch, unlock, enabled sound or voice preference', async () => {
  const lines = ['một'];
  const noContext = new VoiceLinePlayer({ context: null, preferences: { audioEnabled: true }, voiceAudible: () => true },
    { fetchImpl: () => { throw new Error('must not fetch'); }, preferences: new VoicePreferences(null) });
  assert.deepEqual(await noContext.playSequence(lines), { played: 0, skipped: 0 });

  const noFetch = setup({ lines });
  noFetch.player.fetchImpl = undefined;
  assert.deepEqual(await noFetch.player.playSequence(lines), { played: 0, skipped: 0 });
  assert.equal(await noFetch.player.hasVoiceFor(lines), false);

  const locked = setup({ lines, audible: false });
  assert.deepEqual(await locked.player.playSequence(lines), { played: 0, skipped: 0 });
  assert.deepEqual(locked.calls, [], 'no network while locked, muted or in the background');

  const soundOff = setup({ lines, audioEnabled: false, audible: false });
  assert.deepEqual(await soundOff.player.playSequence(lines), { played: 0, skipped: 0 });
  assert.equal(await soundOff.player.hasVoiceFor(lines), true, 'recordings exist, so a panel may offer to turn sound on');
  assert.deepEqual(soundOff.calls, ['./audio/voice/manifest.json'], 'only the manifest, never an mp3, while sound is off');

  const voiceOff = setup({ lines, prefs: new VoicePreferences(null) });
  voiceOff.prefs.set({ enabled: false });
  assert.deepEqual(await voiceOff.player.playSequence(lines), { played: 0, skipped: 0 });
  assert.equal(await voiceOff.player.hasVoiceFor(lines), false);
});

test('a missing or broken manifest silently disables voice', async () => {
  const { player, calls } = setup({ lines: ['một'], manifestOk: false });
  assert.deepEqual(await player.playSequence(['một']), { played: 0, skipped: 1 });
  await player.playSequence(['một']);
  assert.equal(calls.filter(url => url.endsWith('manifest.json')).length, 1, 'manifest is requested once');
  const html = setup({ lines: ['một'] });
  html.player.fetchImpl = async () => ({ ok: true, json: async () => { throw new SyntaxError('<!doctype'); } });
  assert.deepEqual(await html.player.playSequence(['một']), { played: 0, skipped: 1 });
});

test('manifest files outside audio/voice are ignored', async () => {
  const id = idOf('quang', 'một');
  const context = new FakeContext();
  const controller = { context, master: new FakeNode(), preferences: { audioEnabled: true }, voiceAudible: () => true };
  const urls = [];
  const fetchImpl = async url => {
    urls.push(url);
    return { ok: true, json: async () => ({ lines: [{ id, file: 'https://evil.example/x.mp3', durationMs: 1000 }] }) };
  };
  const player = new VoiceLinePlayer(controller, { fetchImpl, preferences: new VoicePreferences(null), gapMs: 0 });
  assert.deepEqual(await player.playSequence(['một']), { played: 0, skipped: 1 });
  assert.deepEqual(urls, ['./audio/voice/manifest.json']);
});

test('decoded buffers are cached with an LRU limit', async () => {
  const lines = ['a', 'b', 'c'];
  const { player, calls } = setup({ lines, cacheSize: 2 });
  await player.playSequence(lines);
  assert.equal(player.getSnapshot().cached, 2, 'oldest buffer evicted');
  const before = calls.length;
  await player.playSequence(['c']);
  assert.equal(calls.length, before, 'recent line replays from cache without network');
  await player.playSequence(['a']);
  assert.equal(calls.length, before + 1, 'evicted line is fetched again');
});

test('volume and voice switch drive the voice gain; turning voice off stops playback', async () => {
  const prefs = new VoicePreferences(null);
  const { player, context } = setup({ lines: ['một'], autoEnd: false, prefs });
  prefs.set({ volume: 0.5 });
  const run = player.playSequence(['một']);
  await new Promise(resolve => setImmediate(resolve));
  const gain = context.gains[0];
  assert.ok(gain.gain.value > 0 && gain.gain.value <= 1.2);
  const half = gain.gain.value;
  prefs.set({ volume: 1 });
  assert.ok(gain.gain.value > half, 'slider changes apply live');
  prefs.set({ enabled: false });
  await run;
  assert.equal(gain.gain.value, 0);
  assert.equal(context.sources[0].stopped, true);
});

test('voice preferences persist under their own key and survive bad storage', () => {
  const store = new Map();
  const storage = { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) };
  const first = new VoicePreferences(storage);
  assert.deepEqual({ ...first.get() }, { enabled: true, volume: 1 }, 'default: on, full volume');
  first.set({ enabled: false, volume: 0.35 });
  assert.deepEqual(JSON.parse(store.get(VOICE_PREFERENCES_KEY)), { enabled: false, volume: 0.35 });
  assert.equal(VOICE_PREFERENCES_KEY, 'mat-ma-dien-bien-phu:voice:v1');
  assert.deepEqual({ ...new VoicePreferences(storage).get() }, { enabled: false, volume: 0.35 });

  first.set({ volume: 9 });
  assert.equal(first.get().volume, 1, 'volume is clamped');
  first.set({ volume: 'loud', enabled: 'yes' });
  assert.deepEqual({ ...first.get() }, { enabled: false, volume: 1 }, 'invalid values are ignored');

  store.set(VOICE_PREFERENCES_KEY, '{not json');
  assert.deepEqual({ ...new VoicePreferences(storage).get() }, { enabled: true, volume: 1 });
  const throwing = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('quota'); } };
  const blocked = new VoicePreferences(throwing);
  assert.equal(blocked.set({ volume: 0.2 }).volume, 0.2, 'storage failure keeps the change for this page');

  const seen = [];
  const stop = first.subscribe(value => seen.push(value.volume));
  first.set({ volume: 0.4 }); stop(); first.set({ volume: 0.6 });
  assert.deepEqual(seen, [0.4]);
});

test('AudioController owns the player: voice stops when the dialogue closes, sound is muted or the tab is hidden', async () => {
  const audio = new AudioController();
  audio.Engine = FakeContext;
  const files = {};
  const ids = ['một', 'hai'].map(text => idOf('quang', text));
  ids.forEach((id, i) => { files[id] = `line-${i}`; });
  audio.voice.fetchImpl = fakeFetch(ids, files).fetchImpl;
  audio.voice.gapMs = 0;
  audio.voice.prefs = new VoicePreferences(null);
  audio.setPreferences({ audioEnabled: true, audioVolume: 0.5 });
  audio.setMode('dialogue');
  assert.equal(audio.getSnapshot().voice.playing, false);
  assert.deepEqual(await audio.voice.playSequence(['một']), { played: 0, skipped: 0 }, 'silent until unlocked by a gesture');

  await audio.unlockFromGesture();
  audio.context.autoEnd = false;
  for (const stopper of [
    () => audio.setMode('exploration'),
    () => audio.setPreferences({ audioEnabled: false }),
    () => { audio.context.state = 'suspended'; audio.context.dispatchEvent(new Event('statechange')); },
  ]) {
    audio.context.state = 'running'; audio.unlocked = true;
    audio.setPreferences({ audioEnabled: true }); audio.setMode('dialogue');
    const run = audio.voice.playSequence(['một', 'hai']);
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(audio.getSnapshot().voice.activeSources, 1);
    stopper();
    await run;
    assert.equal(audio.getSnapshot().voice.activeSources, 0);
    assert.equal(audio.getSnapshot().voice.playing, false);
  }
  audio.destroy();
});

test('createDialogueVoice is null without a player; enable() runs the room audio toggle and waits for the unlock', async () => {
  assert.equal(createDialogueVoice({}, ['một']), null);
  assert.equal(createDialogueVoice({ voice: {} }, []), null);
  const calls = [];
  const audio = {
    unlocked: false, preferences: { audioEnabled: false }, lastUnlock: null,
    voiceReady() { return this.unlocked && this.preferences.audioEnabled; },
    toggle() { // what the rooms' audio-toggle action does synchronously inside the click
      calls.push('toggle'); this.preferences.audioEnabled = true;
      this.lastUnlock = Promise.resolve().then(() => { calls.push('unlock'); this.unlocked = true; });
    },
    voice: { hasVoiceFor: async lines => lines.length === 1, playSequence: async (lines, options) => { calls.push('play'); options.onLine(0); return { played: 1, skipped: 0 }; } },
  };
  const handle = createDialogueVoice(audio, ['một']);
  const marks = [];
  handle.onLine = index => marks.push(index);
  assert.equal(await handle.available(), true);
  assert.equal(handle.soundReady(), false);
  assert.equal(await handle.enable(action => { assert.equal(action, 'audio-toggle'); audio.toggle(); }), true);
  assert.deepEqual(calls, ['toggle', 'unlock'], 'enable() does not start playback itself');
  assert.equal(handle.soundReady(), true);
  await handle.replay();
  assert.deepEqual(calls, ['toggle', 'unlock', 'play']);
  assert.deepEqual(marks, [0]);
});

test('framing paragraphs map to the speaker named by their prefix', () => {
  assert.deepEqual(framingLine('Hệ Thống: Chào.'), { speaker: 'Hệ Thống', text: 'Chào.' });
  assert.deepEqual(framingLine('Quang: Khoan đã.'), { speaker: 'Quang', text: 'Khoan đã.' });
  assert.deepEqual(framingLine('Một đoạn kể.'), { speaker: 'Lời kể', text: 'Một đoạn kể.' });
});

test('Room 2 narrative hook voices the shown line (or whole scene) without touching the donor view', async () => {
  const { attachNarrativeVoice } = await import('../src/room-two/narrative-voice.js');
  const { beats } = await import('../src/room-two/system-guidance.js');
  const beat = beats['navarre-plan-intro'];
  const played = [];
  const audio = { voice: { playSequence: lines => played.push(lines) } };
  const narrative = { active: { beatId: beat.id, lineIndex: 1 }, wholeScene: false, rendered: 0, renderLine() { this.rendered++; } };
  attachNarrativeVoice(narrative, () => audio);
  narrative.renderLine(false);
  assert.equal(narrative.rendered, 1, 'the donor renderLine still runs');
  assert.deepEqual(played, [], 'playback waits a microtask for the session to enter dialogue mode');
  await Promise.resolve();
  const expected = beat.lines[1];
  assert.deepEqual(played, [[{ speaker: expected.speakerId === 'system' ? 'Hệ Thống' : 'Quang', text: expected.text }]]);

  narrative.active.lineIndex = 0; narrative.renderLine(); narrative.active.lineIndex = 2; // moved on before the microtask ran
  await Promise.resolve();
  assert.equal(played.length, 1, 'a stale line is never voiced');

  narrative.active.lineIndex = beat.lines.length - 1; narrative.wholeScene = true; narrative.renderLine();
  await Promise.resolve();
  assert.equal(played.at(-1).length, beat.lines.length);
  narrative.active = null; narrative.renderLine();
  await Promise.resolve();
  assert.equal(played.length, 2, 'cleared view voices nothing');
});

test('lines not mastered yet (no durationMs in the manifest) are not requested', async () => {
  const [recorded, pending] = ['đã thu', 'chưa thu'].map(text => idOf('quang', text));
  const context = new FakeContext();
  const controller = { context, master: new FakeNode(), preferences: { audioEnabled: true }, voiceAudible: () => true };
  const urls = [];
  const fetchImpl = async url => {
    urls.push(url);
    if (url.endsWith('manifest.json')) {
      return { ok: true, json: async () => ({ lines: [
        { id: recorded, file: `audio/voice/${recorded}.mp3`, durationMs: 900 }, { id: pending, file: `audio/voice/${pending}.mp3` }] }) };
    }
    return { ok: true, arrayBuffer: async () => new TextEncoder().encode('ok').buffer };
  };
  const player = new VoiceLinePlayer(controller, { fetchImpl, preferences: new VoicePreferences(null), gapMs: 0 });
  assert.deepEqual(await player.playSequence(['đã thu', 'chưa thu']), { played: 1, skipped: 1 });
  assert.deepEqual(urls, ['./audio/voice/manifest.json', `./audio/voice/${recorded}.mp3`]);
});

test('campaign store setAudio switches sound on for every room save and persists it', async () => {
  const { CampaignStore } = await import('../src/campaign/store.js');
  const saved = new Map();
  const store = new CampaignStore({ getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) });
  assert.equal(store.state.settings.audioEnabled, false);
  store.setAudio(true);
  assert.equal(store.state.settings.audioEnabled, true);
  assert.equal(JSON.parse([...saved.values()][0]).settings.audioEnabled, true);
  assert.equal(JSON.parse(store.adapter(1, 'k').getItem('k')).audioEnabled, true, 'rooms read the campaign sound setting');
});

test('Hệ Thống lines are announced by the system chime and ducking follows the voice', async () => {
  const lines = [line('Hệ Thống', 'Chào Ký Chủ.'), line('Quang', 'Đi thôi.')];
  const { player, controller } = setup({ lines });
  const events = [];
  controller.cues = { play: name => { events.push(name); return true; } };
  controller.voiceActivity = on => events.push(`duck:${on}`);
  player.chimeGapMs = 1;
  await player.playSequence(lines, { onLine: index => { if (index >= 0) events.push(`line:${index}`); } });
  assert.deepEqual(events, ['duck:true', 'system-chime', 'line:0', 'line:1', 'duck:false'],
    'chime only before the system line; duck released at the end');
});

test('voice manifest failure is retried after the delay', async () => {
  const { player, calls } = setup({ lines: ['một'], manifestOk: false });
  assert.deepEqual(await player.playSequence(['một']), { played: 0, skipped: 1 });
  const ok = setup({ lines: ['một'] });
  player.fetchImpl = ok.player.fetchImpl; player.retryAfter = 0;
  assert.deepEqual(await player.playSequence(['một']), { played: 1, skipped: 0 });
  assert.equal(calls.length, 1);
});
