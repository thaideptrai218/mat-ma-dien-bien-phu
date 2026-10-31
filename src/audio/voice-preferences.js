// Voice-over preferences, persisted on their own so room/campaign save schemas stay untouched.
// One store per browser: every audio controller and the shared settings panel read the same values.
export const VOICE_PREFERENCES_KEY = 'mat-ma-dien-bien-phu:voice:v1';
const DEFAULTS = Object.freeze({enabled: true, volume: 1});

const sanitize = (raw, base = DEFAULTS) => Object.freeze({
  enabled: typeof raw?.enabled === 'boolean' ? raw.enabled : base.enabled,
  volume: Number.isFinite(raw?.volume) ? Math.max(0, Math.min(1, raw.volume)) : base.volume,
});

function browserStorage() {
  try { return typeof window === 'undefined' ? null : window.localStorage; } catch { return null; }
}

export class VoicePreferences {
  // storage === undefined → use window.localStorage lazily; null → keep values in memory only.
  constructor(storage = undefined, key = VOICE_PREFERENCES_KEY) {
    this.storage = storage; this.key = key; this.value = null; this.listeners = new Set();
  }
  get() {
    if (this.value) return this.value;
    this.value = DEFAULTS;
    try {
      const storage = this.storage === undefined ? browserStorage() : this.storage;
      const stored = storage?.getItem(this.key);
      if (stored) this.value = sanitize(JSON.parse(stored));
    } catch { this.value = DEFAULTS; }
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
