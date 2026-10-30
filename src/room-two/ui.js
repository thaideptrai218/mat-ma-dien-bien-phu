import {RoomOneUI} from '../room-one/ui.js';
import {PuzzleView} from './bao/ui/puzzle-view.js';
import {NarrativeView} from './bao/ui/narrative-view.js';
import {createPanel} from './panels.js';
import {WORLD} from './world.js';

export class RoomTwoUI extends RoomOneUI {
  constructor({root, onAction, getState, onIntent}) {
    super({root, onAction}, {subtitle: 'PHÒNG 2 · BÀN CỜ ĐÔNG DƯƠNG', date: '1953 — 1954',
      roomLabel: 'HÀNH TRÌNH PHÒNG 2', world: WORLD, panelFactory: createPanel});
    root.classList.add('r2-app');
    this.announcement = document.createElement('div');
    this.announcement.id = 'game-announcement';
    this.announcement.className = 'r2-sr-only';
    this.announcement.setAttribute('role', 'status');
    this.announcement.setAttribute('aria-live', 'polite');
    root.append(this.announcement);
    const dialog = {show: data => {
      if (this.destroyed) return;
      super.show('bao-content', data);
      this.dialog.classList.add('r2-modal');
      if (data.variant) this.dialog.classList.add(data.variant);
    }, close: () => this.close()};
    this.puzzle = new PuzzleView({dialog, getState, onIntent});
    this.narrative = new NarrativeView({dialog, getState, onIntent});
    this.openNotebook = () => { if (!this.destroyed) this.emit('notebook'); };
    document.addEventListener('game-open-notebook', this.openNotebook);
  }

  destroy() {
    if (this.destroyed) return;
    document.removeEventListener('game-open-notebook', this.openNotebook);
    this.puzzle.clearDrafts(); this.narrative.clear();
    this.announcement.remove();
    super.destroy();
  }
}
