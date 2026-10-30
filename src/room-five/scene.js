import {RoomOneScene} from '../room-one/scene.js';
import {WORLD} from './world.js';
import {createRoomFiveArtwork} from './art.js';

export class RoomFiveScene extends RoomOneScene {
  constructor(callbacks = {}) {
    super(callbacks, {world: WORLD, artFactory: createRoomFiveArtwork, sceneKey: 'room-five',
      textureKey: 'room-five-reconstruction', initialGoal: 'assembly'});
    this.doorOpen = false;
  }
  create() {
    super.create();
    if (this.disposed || this.tornDown || !this.player) return;
    this.doorOverlay = this.add.graphics().setDepth(-10); this.drawDoor();
  }
  setDoorOpen(open) {
    this.doorOpen = Boolean(open); this.drawDoor();
  }
  drawDoor() {
    const art = this.doorOverlay; if (!art) return;
    art.clear(); if (!this.doorOpen) return;
    const {x, y, w, h} = WORLD.props.find(p => p.kind === 'door');
    art.fillStyle(0xffe6a0, .15).fillEllipse(x + w / 2, y + h + 35, 280, 170);
    art.fillStyle(0xebe3b7).fillRect(x + 18, y + 4, w - 36, h - 9);
    art.fillStyle(0xfff3cf).fillRect(x + 52, y + 5, w - 104, h - 10);
    art.fillStyle(0x56705a).fillRect(x + 6, y + 4, 12, h - 8);
    art.fillStyle(0x56705a).fillRect(x + w - 18, y + 4, 12, h - 8);
  }
  getSnapshot() {return {...super.getSnapshot(), doorOpen: this.doorOpen};}
  teardown() {
    this.doorOverlay?.destroy(); this.doorOverlay = null; super.teardown();
  }
}
