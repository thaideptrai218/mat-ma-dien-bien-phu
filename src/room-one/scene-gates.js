// Scene-side layer for area gates (data + rules in src/core/area-gates.js).
// Owns one static physics zone per rect and one Graphics per gate; the scene only calls build/setLocked/destroy.
import {paintGate} from './gate-art.js';

const BLOCK_THROTTLE_MS = 1500;
const FADE_MS = 250;

export class SceneGates {
  constructor(scene, gates = []) {
    this.scene = scene; this.gates = gates;
    this.locked = new Set(gates.map(g => g.id));      // desired state; default = everything locked until told otherwise
    this.painted = null;                              // ids currently shown locked (null until built)
    this.zones = new Map(); this.art = new Map();
    this.collider = null; this.lastBlock = -Infinity;
  }

  build(player) {
    const {scene} = this;
    if (!this.gates.length) { this.painted = new Set(); return; }
    this.group = scene.physics.add.staticGroup();
    for (const gate of this.gates) {
      const zones = gate.rects.map(([x, y, w, h]) => {
        const zone = scene.add.zone(x + w / 2, y + h / 2, w, h);
        zone.setData('gateId', gate.id);
        scene.physics.add.existing(zone, true); this.group.add(zone);
        return zone;
      });
      const graphics = scene.add.graphics().setDepth(2);
      paintGate(graphics, gate);
      this.zones.set(gate.id, zones); this.art.set(gate.id, graphics);
    }
    this.collider = scene.physics.add.collider(player, this.group, (_player, zone) => this.notifyBlocked(zone.getData('gateId')));
    this.painted = new Set();
    this.setLocked(this.locked, {initial: true});
  }

  notifyBlocked(id) {
    const now = this.scene.time?.now ?? 0;
    if (now - this.lastBlock < BLOCK_THROTTLE_MS) return;
    this.lastBlock = now;
    this.scene.callbacks.onGateBlocked?.(id);
  }

  // ids: iterable of gate ids that are locked right now. Newly opened gates fade out (instant under reduced motion).
  setLocked(ids, {initial = false} = {}) {
    this.locked = new Set(ids);
    if (this.painted === null || !this.gates.length) return;
    for (const gate of this.gates) {
      const shouldLock = this.locked.has(gate.id), wasLocked = this.painted.has(gate.id);
      if (shouldLock === wasLocked && !initial) continue;
      if (shouldLock) this.lock(gate.id); else this.unlock(gate.id, !initial && wasLocked);
    }
    this.painted = new Set(this.locked);
  }

  lock(id) {
    const player = this.scene.player;
    for (const zone of this.zones.get(id) || []) {
      if (zone.body) zone.body.enable = true;
      if (player && this.overlaps(zone, player)) this.scene.resetPosition?.(); // never trap Quang inside a re-locked gate
    }
    const art = this.art.get(id);
    this.scene.tweens?.killTweensOf(art);
    art?.setAlpha(1).setVisible(true);
  }

  unlock(id, animate) {
    for (const zone of this.zones.get(id) || []) if (zone.body) zone.body.enable = false;
    const art = this.art.get(id), {scene} = this;
    if (animate) scene.callbacks.onGateOpened?.(id);  // sfx hook; fired once per lock -> open transition
    if (!art) return;
    if (animate && !scene.reducedMotion?.matches && scene.tweens) {
      scene.tweens.add({targets: art, alpha: 0, duration: FADE_MS, onComplete: () => art.setVisible(false)});
    } else art.setVisible(false);
  }

  overlaps(zone, player) {
    const a = zone.getBounds(), b = player.body;
    return b.right > a.left && b.left < a.right && b.bottom > a.top && b.top < a.bottom;
  }

  lockedIds() { return this.gates.filter(g => this.locked.has(g.id)).map(g => g.id); }

  destroy() {
    if (this.collider?.world) this.collider.destroy();
    this.collider = null;
    if (this.group?.scene) { this.group.clear(true, true); this.group.destroy(); }
    for (const art of this.art.values()) art.destroy();
    this.zones.clear(); this.art.clear(); this.group = null;
  }
}
