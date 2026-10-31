import {RoomOneScene} from '../room-one/scene.js';
import {createRoomTexture} from './bao/game/room-art.js';
import {WORLD, EXIT} from './world.js';
import {AREA_GATES, doorObjects} from './area-gates.js';

export class RoomTwoScene extends RoomOneScene {
  constructor(callbacks = {}) {
    super(callbacks, {world: WORLD, artFactory: (scene, world) => createRoomTexture(scene, world),
      sceneKey: 'room-two', textureKey: 'room-navarre-plan', initialGoal: 'nava-planner', areaGates: AREA_GATES});
    this.roomComplete = false;
  }

  create() {
    if (this.tornDown) return;
    super.create();
    if (this.tornDown || !this.solids) return;
    const [x, y, w, h] = EXIT.gate;
    this.exitGate = this.add.zone(x + w / 2, y + h / 2, w, h);
    this.physics.add.existing(this.exitGate, true);
    this.solids.add(this.exitGate);
    this.gateArt = this.add.graphics().setDepth(2);
    this.gateArt.fillStyle(0x8b7044, 1).fillRect(x - 4, y, w + 8, h);
    this.gateArt.fillStyle(0xceae6f, 1);
    for (let yy = y + 8; yy < y + h; yy += 26) this.gateArt.fillRect(x, yy, w, 5);
    this.setRoomComplete(this.roomComplete);
  }

  setRoomComplete(value) {
    this.roomComplete = Boolean(value);
    if (this.exitGate?.body) this.exitGate.body.enable = !this.roomComplete;
    this.gateArt?.setVisible(!this.roomComplete);
  }

  // Locked puzzle doors become interactable (E opens the door panel); WORLD itself stays the donor map.
  setLockedGates(ids = []) {
    super.setLockedGates(ids);
    const key = doorObjects(ids).map(object => object.id).join();
    if (key === this.doorKey) return;
    this.doorKey = key;
    this.map = {...WORLD, objects: [...WORLD.objects, ...doorObjects(ids)]};
    this.updateNearby?.();
  }

  getSnapshot() { return {...super.getSnapshot(), gateLocked: !this.roomComplete}; }

  teardown() {
    this.gateArt?.destroy(); this.gateArt = null;
    this.exitGate = null;
    super.teardown();
  }
}
