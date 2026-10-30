import {RoomOneScene} from '../room-one/scene.js';
import {WORLD} from './world.js';
import {createRoomThreeArtwork} from './art.js';

export class RoomThreeScene extends RoomOneScene {
  constructor(callbacks = {}) {
    super(callbacks, {world: WORLD, artFactory: createRoomThreeArtwork, sceneKey: 'room-three',
      textureKey: 'room-three-camp', initialGoal: 'preparation-record'});
    this.chestOpen = false; this.fragmentCollected = false;
  }

  create() {
    if (this.tornDown) return;
    super.create();
    if (this.tornDown || !this.player) return;
    this.chestOverlay = this.add.graphics().setDepth(-10);
    this.fragmentLabel = this.add.text(2390, 1738, 'III', {
      fontFamily: '"DBP Text", serif', fontSize: '22px', color: '#694c30', fontStyle: 'bold',
    }).setOrigin(.5).setDepth(-9);
    this.drawChest();
  }

  setChestOpen(open) {
    const next=Boolean(open);if(this.chestOpen===next)return;
    this.chestOpen=next;this.drawChest();
  }

  setFragmentCollected(collected) {
    const next=Boolean(collected);if(this.fragmentCollected===next)return;
    this.fragmentCollected=next;this.drawChest();
  }

  drawChest() {
    const art = this.chestOverlay;
    // Save restoration may arrive before Phaser has created the display objects.
    if (!art) return;
    art.clear();
    this.fragmentLabel?.setVisible(this.chestOpen && !this.fragmentCollected);
    if (!this.chestOpen) return;
    const {x, y, w, h} = this.map.props.find(prop => prop.kind === 'chest');
    art.fillStyle(0x39412e).fillRect(x - 2, y - 3, w + 4, h + 6);
    art.fillStyle(0x997244).fillRect(x + 5, y + 6, w - 10, h - 12);
    art.fillStyle(0x202e29).fillRect(x + 15, y + 16, w - 30, h - 32);
    art.fillStyle(0x775b3b).fillRect(x + 2, y - 40, w - 4, 49);
    art.lineStyle(3, 0xc39a61).strokeRect(x + 9, y - 33, w - 18, 34);
    for (const offset of [25, w - 37]) art.fillStyle(0xb99558).fillRect(x + offset, y - 38, 12, 45);
    if (this.fragmentCollected) return;
    art.fillStyle(0xe9cb88, .12).fillEllipse(x + w / 2, y + 61, 126, 75);
    art.fillStyle(0xf1ddb0).fillRect(x + 56, y + 33, 64, 54);
    art.fillStyle(0xf1ddb0).fillCircle(x + 88, y + 32, 10);
    art.fillStyle(0x202e29).fillCircle(x + 55, y + 60, 9);
    art.lineStyle(2, 0xa77b45).strokeRect(x + 62, y + 39, 52, 42);
  }

  getSnapshot() {
    return {...super.getSnapshot(), chestOpen: this.chestOpen,
      fragmentVisible: Boolean(this.chestOverlay && this.chestOpen && !this.fragmentCollected)};
  }

  teardown() {
    this.chestOverlay?.destroy(); this.chestOverlay = null;
    this.fragmentLabel?.destroy(); this.fragmentLabel = null;
    super.teardown();
  }
}
