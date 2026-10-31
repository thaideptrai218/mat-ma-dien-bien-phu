// Voice-over and mixer preferences, persisted on their own so room/campaign save schemas stay untouched.
// One store per browser: every audio controller and the shared settings panel read the same values.
// Field types come from the defaults: booleans stay booleans, numbers are clamped to 0..1.
export const VOICE_PREFERENCES_KEY = 'mat-ma-dien-bien-phu:voice:v1';
export const MIX_PREFERENCES_KEY = 'mat-ma-dien-bien-phu:mix:v1';
const DEFAULTS = Object.freeze({enabled: true, volume: 1});
const MIX_DEFAULTS = Object.freeze({sfxVolume: 1, ambienceVolume: 1});

const sanitize = (raw, base) => Object.freeze(Object.fromEntries(Object.keys(base).map(field => [field,
  typeof base[field] === 'boolean'
    ? (typeof raw?.[field] === 'boolean' ? raw[field] : base[field])
    : (Number.isFinite(raw?.[field]) ? Math.max(0, Math.min(1, raw[field])) : base[field])])));

function browserStorage() {
  try { return typeof window === 'undefined' ? null : window.localStorage; } catch { return null; }
}

export class VoicePreferences {
  // storage === undefined → use window.localStorage lazily; null → keep values in memory only.
  constructor(storage = undefined, key = VOICE_PREFERENCES_KEY, defaults = DEFAULTS) {
    this.storage = storage; this.key = key; this.defaults = defaults; this.value = null; this.listeners = new Set();
  }
  get() {
    if (this.value) return this.value;
    this.value = this.defaults;
    try {
      const storage = this.storage === undefined ? browserStorage() : this.storage;
      const stored = storage?.getItem(this.key);
      if (stored) this.value = sanitize(JSON.parse(stored), this.defaults);
    } catch { this.value = this.defaults; }
    return this.value;
  }
  set(patch = {}) {
    this.value = sanitize(patch, this.get());
    try {
      const storage = this.storage === undefined ? browserStorage() : this.storage;
      storage?.setItem(this.key, JSON.stringify(this.value));
    } catch { /* private mode or quota: the choice still applies for this page */ }
    for (const listener of [...this.listeners]) listener(this.value);
    return this.value;
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const voicePreferences = new VoicePreferences();
// Sound-effect and ambience volumes (relative to the master volume).
export const mixPreferences = new VoicePreferences(undefined, MIX_PREFERENCES_KEY, MIX_DEFAULTS);
