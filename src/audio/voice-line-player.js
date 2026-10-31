// Plays recorded voice lines through the campaign's shared AudioContext, one channel at a time.
// Lines resolve to files via public/audio/voice/manifest.json (content-addressed ids from voice-id.js).
// Anything missing or failing is skipped silently: the game stays fully playable as text.
// The manifest lists every script line, but mastering only adds durationMs once a recording exists, so entries
// without it are treated as not recorded yet (no request, no 404 noise in the console).
import {voiceIdFor, voiceOf} from './voice-id.js';
import {voicePreferences} from './voice-preferences.js';
import {MASTER_MAKEUP} from './cue-library.js';

const MANIFEST_PATH = 'audio/voice/manifest.json';
const FILE_PATTERN = /^audio\/voice\/[0-9a-f]{16}\.mp3$/; // same-origin recordings only
const VOICE_MAKEUP = MASTER_MAKEUP; // master gain tops out at 0.45; recordings are mastered to -16 LUFS
const MANIFEST_RETRY_MS = 5000;
const noop = () => {};

export function lineVoiceId(line) {
  const voice = voiceOf(line), text = typeof line === 'string' ? line : line?.text;
  return voice && typeof text === 'string' ? voiceIdFor(voice, text) : null;
}

class BufferCache {
  constructor(max) { this.max = max; this.items = new Map(); }
  get(id) {
    const buffer = this.items.get(id);
    if (buffer) { this.items.delete(id); this.items.set(id, buffer); }
    return buffer;
  }
  set(id, buffer) {
    this.items.delete(id); this.items.set(id, buffer);
    while (this.items.size > this.max) this.items.delete(this.items.keys().next().value);
  }
}

export class VoiceLinePlayer {
  // controller needs: context, master, preferences.audioEnabled, voiceAudible() (see AudioController).
  constructor(controller, {fetchImpl = globalThis.fetch?.bind(globalThis), baseUrl = './', preferences = voicePreferences,
    cacheSize = 16, gapMs = 220, chimeGapMs = 300} = {}) {
    this.controller = controller; this.fetchImpl = fetchImpl; this.baseUrl = baseUrl; this.prefs = preferences; this.gapMs = gapMs; this.chimeGapMs = chimeGapMs;
    this.cache = new BufferCache(cacheSize); this.pending = new Map(); this.failed = new Set();
    this.manifest = new Map(); this.manifestPromise = null; this.retryAfter = 0; this.gain = null; this.session = null; this.current = null;
    this.unsubscribe = this.prefs.subscribe(({enabled}) => { if (!enabled) this.stop(); this.applyGain(); });
  }
  canPlay() {
    return Boolean(this.fetchImpl && this.controller?.context && this.prefs.get().enabled && this.controller.voiceAudible?.());
  }
  applyGain() {
    if (!this.gain) return;
    const {enabled, volume} = this.prefs.get();
    this.gain.gain.value = enabled ? volume * VOICE_MAKEUP : 0;
  }
  output() {
    if (!this.gain) {
      this.gain = this.controller.context.createGain();
      this.gain.connect(this.controller.master);
      this.applyGain();
    }
    return this.gain;
  }
  loadManifest() {
    // After a failed load the empty manifest is served for a short while, then the next call retries.
    if (!this.manifestPromise && Date.now() < this.retryAfter) return Promise.resolve(this.manifest);
    this.manifestPromise ??= (async () => {
      const files = new Map();
      try {
        if (!this.fetchImpl) throw new Error('fetch unavailable');
        const response = await this.fetchImpl(`${this.baseUrl}${MANIFEST_PATH}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        for (const entry of (await response.json())?.lines ?? [])
          if (typeof entry?.id === 'string' && FILE_PATTERN.test(entry.file) && entry.durationMs > 0) files.set(entry.id, entry.file);
        this.manifest = files;
      } catch { // no manifest → voice stays off until the retry delay passes
        this.manifest = new Map(); this.manifestPromise = null; this.retryAfter = Date.now() + MANIFEST_RETRY_MS;
        return this.manifest;
      }
      return files;
    })();
    return this.manifestPromise;
  }
  // True when voice is on in the settings and at least one line has a recording that has not already failed.
  // Independent of the sound switch, so panels can offer to turn sound on.
  async hasVoiceFor(lines) {
    if (!this.fetchImpl || !this.prefs.get().enabled) return false;
    const manifest = await this.loadManifest();
    return lines.some(line => { const id = lineVoiceId(line); return Boolean(id) && manifest.has(id) && !this.failed.has(id); });
  }
  load(id) {
    const hit = this.cache.get(id);
    if (hit) return Promise.resolve(hit);
    if (this.failed.has(id)) return Promise.resolve(null);
    if (!this.pending.has(id)) {
      const request = this.fetchBuffer(id);
      this.pending.set(id, request);
      request.then(() => this.pending.delete(id));
    }
    return this.pending.get(id);
  }
  async fetchBuffer(id) {
    try {
      const response = await this.fetchImpl(`${this.baseUrl}${this.manifest.get(id)}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = await this.controller.context.decodeAudioData(await response.arrayBuffer());
      this.cache.set(id, buffer);
      return buffer;
    } catch { this.failed.add(id); return null; }
  }
  isCurrent(session) { return this.session === session; }
  playBuffer(buffer, onStart) {
    return new Promise(resolve => {
      const source = this.controller.context.createBufferSource();
      const current = {source, done: resolve};
      source.buffer = buffer; source.connect(this.output());
      source.onended = () => { if (this.current === current) this.finishCurrent(); else resolve(); };
      this.current = current; onStart(); source.start();
    });
  }
  finishCurrent() {
    const current = this.current; this.current = null;
    if (!current) return;
    current.source.onended = null;
    try { current.source.stop(); } catch { /* already ended */ }
    try { current.source.disconnect(); } catch { /* already detached */ }
    current.done();
  }
  // Starts a new sequence (stopping any previous one). Resolves {played, skipped} when it ends or is stopped; never rejects.
  // onLine(index) fires as each line starts, and onLine(-1) once when the sequence ends or is stopped.
  async playSequence(lines, {onLine = noop} = {}) {
    this.stop();
    const result = {played: 0, skipped: 0};
    if (!Array.isArray(lines) || !this.canPlay()) return result;
    const session = {onLine: index => { try { onLine(index); } catch { /* highlight failures never stop audio */ } }};
    this.session = session; this.controller.voiceActivity?.(true);
    try {
      const manifest = await this.loadManifest();
      const ids = lines.map(line => { const id = lineVoiceId(line); return id && manifest.has(id) ? id : null; });
      for (let i = 0; i < ids.length && this.isCurrent(session); i++) {
        if (!ids[i]) { result.skipped++; continue; }
        const ahead = ids.findIndex((id, j) => j > i && id);
        if (ahead > -1) this.load(ids[ahead]); // warm the next line while this one is fetched/played
        const buffer = await this.load(ids[i]);
        if (!this.isCurrent(session) || !this.canPlay()) break;
        if (!buffer) { result.skipped++; continue; }
        // Hệ Thống's lines are announced by its chime, which gets a moment to sound before the voice.
        if (voiceOf(lines[i]) === 'system' && this.controller.cues?.play('system-chime') && this.chimeGapMs > 0) {
          await new Promise(resolve => setTimeout(resolve, this.chimeGapMs));
          if (!this.isCurrent(session)) break;
        }
        await this.playBuffer(buffer, () => session.onLine(i));
        if (!this.isCurrent(session)) break;
        result.played++;
        if (this.gapMs > 0 && i < ids.length - 1) await new Promise(resolve => setTimeout(resolve, this.gapMs));
      }
    } catch { /* a closed context or decode failure ends the sequence quietly */ }
    if (this.isCurrent(session)) this.stop();
    return result;
  }
  stop() {
    const session = this.session; this.session = null;
    this.finishCurrent();
    if (session) { this.controller.voiceActivity?.(false); session.onLine(-1); }
  }
  getSnapshot() {
    const {enabled, volume} = this.prefs.get();
    return Object.freeze({enabled, volume, playing: Boolean(this.session), activeSources: this.current ? 1 : 0,
      lines: this.manifest?.size || 0, cached: this.cache.items.size, failed: this.failed.size});
  }
  destroy() {
    this.stop(); this.unsubscribe();
    try { this.gain?.disconnect(); } catch { /* context already closed */ }
    this.gain = null;
  }
}
