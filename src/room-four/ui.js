import { RoomOneUI } from '../room-one/ui.js';
import { WORLD } from './world.js';
import { createPanel } from './panels.js';

/** Reuse the room controls and full paper reader with this room's world and panels. */
export class RoomFourUI extends RoomOneUI {
  constructor(options) {
    super(options, {
      subtitle: 'PHÒNG 4 · NHỮNG NGÀY QUYẾT ĐỊNH',
      date: '30/3 — 7/5/1954',
      roomLabel: 'HÀNH TRÌNH PHÒNG 4',
      world: WORLD,
      panelFactory: createPanel,
    });
    this.root.classList.add('r4-app');
  }

  // Door puzzles key their Hệ Thống hints on the gate; boards on T/L (inherited).
  hintKeyFor(view, data) { return view === 'door' ? `door-${data.gateId}` : super.hintKeyFor(view, data); }
}
