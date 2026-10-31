import {MASTER_MAKEUP} from './cue-library.js';
import {mixPreferences} from './voice-preferences.js';

// Cue names the game already uses → recorded cue; unlisted names are looked up as they are.
export const CUE_ALIASES = Object.freeze({reveal: 'fragment-get', weight: 'card-place', static: 'radio-static',
  chain: 'morse-beep', fold: 'map-unfold', unlock: 'chest-unlock'});
// Synth cue to use when a recording is missing or not decoded yet (only for cues that have no synth of their own).
export const SYNTH_FALLBACK = Object.freeze({'drawer-open': 'success', 'chest-unlock': 'unlock', 'chest-open': 'reveal',
  'fragment-get': 'reveal', 'painting-complete': 'success', 'door-final-swell': 'reveal', 'door-open': 'fold',
  'time-warp': 'reveal', hint: 'weight', 'card-place': 'weight', 'map-unfold': 'fold', 'morse-beep': 'chain',
  'radio-static': 'static', notebook: 'paper', typewriter: 'chain'});
export const FOOTSTEP_GAIN = 0.4; // recorded steps are peak-normalized like other cues; keep them well below
const MAX_ACTIVE = 12;

// Plays decoded sound effects on an sfx bus (gain under the controller master). play() returns false when the
// cue has no decoded recording yet, so the caller can fall back to the synth cue.
export class SampleCueBank {
  constructor(controller, library, {preferences = mixPreferences, random = Math.random} = {}) {
    this.controller = controller; this.library = library; this.prefs = preferences; this.random = random;
    this.bus = null; this.active = new Set();
    this.unsubscribe = this.prefs.subscribe(() => this.applyGain());
  }
  applyGain() { if (this.bus) this.bus.gain.value = this.prefs.get().sfxVolume * MASTER_MAKEUP; }
  output() {
    if (!this.bus) {
      this.bus = this.controller.context.createGain();
      this.bus.connect(this.controller.master);
      this.applyGain();
    }
    return this.bus;
  }
  preload() { return this.library.preload().catch(() => {}); }
  play(name, {gain = 1} = {}) {
    const buffer = this.library.buffers.get(name), context = this.controller.context;
    if (!buffer || !context || this.active.size >= MAX_ACTIVE) return false;
    try {
      const source = context.createBufferSource(), nodes = [source];
      source.buffer = buffer;
      if (gain === 1) source.connect(this.output());
      else { const level = context.createGain(); level.gain.value = gain; source.connect(level); level.connect(this.output()); nodes.push(level); }
      const voice = {source, nodes};
      this.active.add(voice);
      source.onended = () => this.release(voice);
      source.start();
      return true;
    } catch { return false; }
  }
  // surface: 'earth' | 'wood' | 'stone'; picks one of three recorded variants at random.
  footstep(surface) {
    return this.play(`step-${surface}-${1 + Math.floor(this.random() * 3)}`, {gain: FOOTSTEP_GAIN});
  }
  release(voice) {
    if (!this.active.delete(voice)) return;
    voice.source.onended = null;
    try { voice.source.stop(); } catch { /* already ended */ }
    voice.nodes.forEach(node => { try { node.disconnect(); } catch { /* already detached */ } });
  }
  stop() { for (const voice of [...this.active]) this.release(voice); }
  count() { return this.active.size; }
  destroy() {
    this.stop(); this.unsubscribe();
    try { this.bus?.disconnect(); } catch { /* context already closed */ }
    this.bus = null;
  }
}
