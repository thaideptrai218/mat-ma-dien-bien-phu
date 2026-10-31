import {MASTER_MAKEUP} from './cue-library.js';
import {mixPreferences} from './voice-preferences.js';

export const CROSSFADE_S = 1.5;
export const DUCK_LEVEL = 0.3; // bed level while a voice line is read
const DUCK_RAMP_S = 0.2;

// One looping bed per scene ('museum' | 'bunker' | 'room-1'..'room-5') on an ambience bus, crossfaded when the
// scene changes. Uses AudioBufferSourceNode.loop (gapless) rather than <audio loop>.
// Contract: the bed runs while sound is audible in exploration AND dialogue mode (museum frames and panels are
// "dialogue"), ducked to 30% under voice; it stops when audio is inactive, muted, blurred or locked.
export class AmbienceLoop {
  constructor(controller, library, {preferences = mixPreferences} = {}) {
    this.controller = controller; this.library = library; this.prefs = preferences;
    this.holdUntil = 0; this.scene = null; this.running = false; this.ducked = false; this.starting = null; this.token = 0;
    this.bus = null; this.tracks = new Set(); this.current = null;
    this.unsubscribe = this.prefs.subscribe(() => this.applyBus(0));
  }
  setScene(scene) { this.scene = scene || null; }
  // 'none': no bed will play for this scene (synth fallback should run); otherwise a bed plays or is loading.
  status() {
    if (!this.scene || this.library.failed.has(this.scene)) return 'none';
    const entries = this.library.entries;
    if (!entries) return 'pending';
    return entries.get(this.scene)?.kind === 'ambience' ? 'ready' : 'none';
  }
  busLevel() { return this.prefs.get().ambienceVolume * MASTER_MAKEUP * (this.ducked ? DUCK_LEVEL : 1); }
  applyBus(ramp = DUCK_RAMP_S) {
    if (!this.bus) return;
    const gain = this.bus.gain, now = this.controller.context.currentTime;
    gain.cancelScheduledValues(now); gain.setValueAtTime(gain.value, now);
    if (ramp > 0) gain.linearRampToValueAtTime(this.busLevel(), now + ramp); else gain.setValueAtTime(this.busLevel(), now);
  }
  output() {
    if (!this.bus) {
      this.bus = this.controller.context.createGain();
      this.bus.gain.value = this.busLevel();
      this.bus.connect(this.controller.master);
    }
    return this.bus;
  }
  setDuck(on) { if (this.ducked !== on) { this.ducked = on; this.applyBus(); } }
  // Called by the controller on every sync; `audible` says whether a bed may sound right now.
  update(audible) {
    this.running = audible;
    if (!audible || !this.scene) { this.stopAll(); return; }
    const scene = this.scene;
    if (this.current?.scene !== scene && this.starting !== scene && !this.library.failed.has(scene) && Date.now() >= this.holdUntil) this.start(scene);
  }
  async start(scene) {
    this.starting = scene; const token = ++this.token;
    let buffer = null;
    try { await this.library.load(); buffer = this.library.entries.get(scene)?.kind === 'ambience' ? await this.library.buffer(scene) : null; }
    catch { buffer = null; }
    if (token !== this.token) return;
    this.starting = null;
    if (!buffer) { this.holdUntil = Date.now() + 5000; this.controller.sync(); return; } // synth bed takes over; retry later
    if (!this.running || this.scene !== scene) return;
    this.crossfadeTo(scene, buffer);
  }
  crossfadeTo(scene, buffer) {
    const context = this.controller.context, now = context.currentTime;
    const gain = context.createGain(), source = context.createBufferSource();
    source.buffer = buffer; source.loop = true;
    gain.gain.value = 0; gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(1, now + CROSSFADE_S);
    source.connect(gain); gain.connect(this.output());
    const track = {scene, source, gain};
    const previous = this.current;
    this.current = track; this.tracks.add(track);
    source.start();
    if (previous) this.fadeOut(previous, now);
  }
  fadeOut(track, now) {
    const level = track.gain.gain;
    level.cancelScheduledValues(now); level.setValueAtTime(level.value, now); level.linearRampToValueAtTime(0, now + CROSSFADE_S);
    try { track.source.stop(now + CROSSFADE_S); } catch { this.release(track); return; }
    track.source.onended = () => this.release(track);
  }
  release(track) {
    if (!this.tracks.delete(track)) return;
    track.source.onended = null;
    try { track.source.stop(); } catch { /* already ended */ }
    try { track.source.disconnect(); track.gain.disconnect(); } catch { /* already detached */ }
    if (this.current === track) this.current = null;
  }
  stopAll() {
    this.token++; this.starting = null;
    for (const track of [...this.tracks]) this.release(track);
  }
  count() { return this.tracks.size; }
  destroy() {
    this.stopAll(); this.unsubscribe();
    try { this.bus?.disconnect(); } catch { /* context already closed */ }
    this.bus = null;
  }
}
