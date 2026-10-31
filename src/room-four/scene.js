import {RoomOneScene} from '../room-one/scene.js';
import {WORLD} from './world.js';
import {createRoomFourArtwork} from './art.js';
import {AREA_GATES, doorObjects} from './area-gates.js';

export class RoomFourScene extends RoomOneScene {
  constructor(callbacks = {}) {
    super(callbacks, {world: WORLD, artFactory: createRoomFourArtwork, sceneKey: 'room-four',
      textureKey: 'room-four-archive', initialGoal: 'east-offensive', areaGates: AREA_GATES});
    this.chestOpen = false; this.fragmentCollected = false;
  }

  create() {
    if (this.tornDown) return;
    super.create();
    if (this.tornDown || !this.player) return;
    this.chestOverlay = this.add.graphics().setDepth(-10);
    this.drawChest();
  }

  // Locked puzzle gates become interactable (E opens the lock panel); WORLD itself keeps its fourteen objects.
  setLockedGates(ids = []) {
    super.setLockedGates(ids);
    const key = doorObjects(ids).map(object => object.id).join();
    if (key === this.doorKey) return;
    this.doorKey = key;
    this.map = {...WORLD, objects: [...WORLD.objects, ...doorObjects(ids)]};
    this.updateNearby?.();
  }

  setChestOpen(open) {
    const next = Boolean(open);
    if (this.chestOpen === next) return;
    this.chestOpen = next;
    // Loading a save can set the flag before Phaser has created its display list.
    this.drawChest();
  }

  setFragmentCollected(collected) {
    const next = Boolean(collected);
    if (this.fragmentCollected === next) return;
    this.fragmentCollected = next;
    this.drawChest();
  }

  drawChest() {
    const art = this.chestOverlay;
    if (!art) return;
    art.clear();
    if (!this.chestOpen) return;
    const {x, y, w, h} = this.map.props.find(prop => prop.kind === 'chest');
    // The lid, dark interior and illuminated fragment replace the painted closed lid.
    // This immediate change also respects reduced-motion preferences without a tween.
    if (!this.fragmentCollected) art.fillStyle(0xf8d78a, .06).fillCircle(x + w / 2, y + h / 2, 135);
    art.fillStyle(0x26372f).fillRect(x - 1, y - 2, w + 2, h + 3);
    art.fillStyle(0x9a7a48).fillRect(x + 5, y + 6, w - 10, h - 12);
    art.fillStyle(0x192a25).fillRect(x + 16, y + 16, w - 32, h - 34);
    art.fillStyle(0x59472f).fillRect(x + 2, y - 39, w - 4, 48);
    art.fillStyle(0xa38450).fillRect(x + 9, y - 34, w - 18, 35);
    art.lineStyle(3, 0xd8b56b).strokeRect(x + 9, y - 34, w - 18, 35);
    for (const offset of [25, w - 37]) art.fillStyle(0xb99956).fillRect(x + offset, y - 36, 12, 42);
    if (this.fragmentCollected) return;
    art.fillStyle(0xf7df9b, .12).fillEllipse(x + w / 2, y + 58, 118, 65);
    art.fillStyle(0xf4dda1).fillRect(x + 64, y + 39, 48, 42);
    art.fillStyle(0xf4dda1).fillCircle(x + 88, y + 38, 9);
    art.fillStyle(0x192a25).fillCircle(x + 63, y + 60, 8);
    art.lineStyle(2, 0x9b743d).strokeRect(x + 68, y + 44, 39, 31);
  }

  getSnapshot() {
    return {...super.getSnapshot(), chestOpen: this.chestOpen,
      fragmentVisible: Boolean(this.chestOverlay && this.chestOpen && !this.fragmentCollected)};
  }

  teardown() {
    this.chestOverlay?.destroy(); this.chestOverlay = null;
    super.teardown();
  }
}
