// Shared loader for the recorded sound effects and ambience beds listed in public/audio/sfx/manifest.json.
// Lazy: nothing is fetched until audio is unlocked. Every failure resolves to "not available" so the
// synth fallback (or silence) takes over and the game stays playable.
const FILE_PATTERN = /^audio\/(sfx|ambience)\/[a-z0-9-]+\.mp3$/; // same-origin recordings only
const MANIFEST_PATH = 'audio/sfx/manifest.json';
const MANIFEST_RETRY_MS = 5000;
const MAX_AMBIENCE_BUFFERS = 2; // a decoded 44 s stereo bed is ~15 MB; keep only the current and the fading one

// Master gain tops out at 0.45; recordings are mastered for a -16 LUFS voice, -30 LUFS beds and -6 dBFS cues.
// Every bus restores that level so the designed balance (voice over bed) is kept.
export const MASTER_MAKEUP = 2.2;

export class CueLibrary {
  constructor(controller, {fetchImpl = globalThis.fetch?.bind(globalThis), baseUrl = './'} = {}) {
    this.controller = controller; this.fetchImpl = fetchImpl; this.baseUrl = baseUrl;
    this.entries = null; this.manifestPromise = null; this.retryAfter = 0;
    this.buffers = new Map(); this.pending = new Map(); this.failed = new Set();
  }
  // Resolves Map name → {file, kind}; an unreachable or malformed manifest yields an empty map.
  load() {
    // After a failed load the empty manifest is served for a short while, then the next call retries.
    if (!this.manifestPromise && this.entries && Date.now() < this.retryAfter) return Promise.resolve(this.entries);
    this.manifestPromise ??= (async () => {
      const entries = new Map();
      try {
        if (!this.fetchImpl) throw new Error('fetch unavailable');
        const response = await this.fetchImpl(`${this.baseUrl}${MANIFEST_PATH}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        for (const [name, entry] of Object.entries((await response.json())?.cues ?? {}))
          if (FILE_PATTERN.test(entry?.file) && entry.durationMs > 0) entries.set(name, {file: entry.file, kind: entry.kind});
        this.entries = entries;
        return entries;
      } catch {
        this.entries = new Map(); this.manifestPromise = null; this.retryAfter = Date.now() + MANIFEST_RETRY_MS;
        return this.entries;
      }
    })();
    return this.manifestPromise;
  }
  // Decoded buffer or null (unknown, failed, or no context yet).
  buffer(name) {
    const hit = this.buffers.get(name);
    if (hit) return Promise.resolve(hit);
    if (this.failed.has(name) || !this.controller?.context) return Promise.resolve(null);
    if (!this.pending.has(name)) {
      const request = this.fetchBuffer(name);
      this.pending.set(name, request);
      request.then(() => this.pending.delete(name));
    }
    return this.pending.get(name);
  }
  async fetchBuffer(name) {
    try {
      const entry = (await this.load()).get(name);
      if (!entry) throw new Error('not in manifest');
      const response = await this.fetchImpl(`${this.baseUrl}${entry.file}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = await this.controller.context.decodeAudioData(await response.arrayBuffer());
      this.buffers.set(name, buffer);
      if (entry.kind === 'ambience') this.pruneAmbience(name);
      return buffer;
    } catch { this.failed.add(name); return null; }
  }
  pruneAmbience(newest) {
    const beds = [...this.buffers.keys()].filter(key => this.entries.get(key)?.kind === 'ambience' && key !== newest);
    while (beds.length >= MAX_AMBIENCE_BUFFERS) this.buffers.delete(beds.shift());
  }
  // Warms every short cue (sfx and footsteps), never the long beds.
  async preload() {
    const entries = await this.load();
    await Promise.all([...entries].filter(([, entry]) => entry.kind !== 'ambience').map(([name]) => this.buffer(name)));
  }
}
