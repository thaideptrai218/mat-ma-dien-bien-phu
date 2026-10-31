import { RoomOneUI } from '../room-one/ui.js';
import { WORLD } from './world.js';
import { createPanel } from './panels.js';
import { doorHintKey } from './area-gates.js';

/** Shared controls and complete paper reader, configured for the rear supply camp. */
export class RoomThreeUI extends RoomOneUI {
  constructor(options) {
    const drafts = new Map();
    super(options, {
      subtitle: 'PHÒNG 3 · MẬT MÃ HẬU PHƯƠNG',
      date: '12/1953 — 17/3/1954',
      roomLabel: 'HÀNH TRÌNH PHÒNG 3',
      world: WORLD,
      panelFactory: (view, data, emit, snapshot, world) => {
        if (data.solved) drafts.delete(view);
        const draft = drafts.get(view) || {};
        drafts.set(view, draft);
        return createPanel(view, { ...data, draft }, emit, snapshot, world);
      },
    });
    this.drafts = drafts;
    this.root.classList.add('r3-app');
  }

  // Door puzzles key their Hệ Thống hints on the gate id (see SYSTEM_HINTS).
  hintKeyFor(view, data) { return view === 'door' ? doorHintKey(data.gateId) : super.hintKeyFor(view, data); }

  emit(action, payload = {}) {
    if (action === 'reset-confirmed') this.drafts.clear();
    super.emit(action, payload);
  }
}
