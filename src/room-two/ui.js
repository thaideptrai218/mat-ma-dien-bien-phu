import {RoomOneUI} from '../room-one/ui.js';
import {PuzzleView} from './bao/ui/puzzle-view.js';
import {NarrativeView} from './bao/ui/narrative-view.js';
import {createPanel} from './panels.js';
import {installTactileStations} from './tactile-stations.js';
import {DoorPuzzleView} from './door-puzzle-view.js';
import {WORLD} from './world.js';
import {SYSTEM_HINTS} from './system-guidance.js';
import {puzzles} from './content.js';
import {revealOddHighlight} from './tactile-radio-station.js';

import {NEUTRAL_WRONG} from '../ui/neutral-notice.js';
import {renameHero, installHeroName} from './hero-name.js';

export class RoomTwoUI extends RoomOneUI {
  constructor({root, onAction, getState, onIntent, audio}) {
    super({root, onAction, audio, hints: SYSTEM_HINTS}, {subtitle: 'PHÒNG 2 · BÀN CỜ ĐÔNG DƯƠNG', date: '1953 — 1954',
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
      super.show('bao-content', {...data, kicker: renameHero(data.kicker)}); // donor kicker "LỜI QUANG" → LONG
      this.dialog.classList.add('r2-modal');
      if (data.variant) this.dialog.classList.add(data.variant);
    }, close: () => this.close()};
    this.getState = getState;
    this.puzzle = new PuzzleView({dialog, getState, onIntent});
    // Instance-level wrap (donor file untouched): every error feedback, including the donor's own fist-move
    // errors, becomes the neutral notice and advances the Hệ Thống hint.
    const showFeedback = this.puzzle.showFeedback.bind(this.puzzle);
    this.puzzle.showFeedback = (text, tone) => {
      if (tone !== 'error') { showFeedback(text, tone); return; }
      showFeedback(NEUTRAL_WRONG, tone); this.noteMistake();
    };
    installTactileStations(this.puzzle); // drag/dial controls over the donor forms (donor files untouched)
    this.door = new DoorPuzzleView({dialog, onAttempt: (doorId, answer) => onIntent({type: 'solve-door', doorId, answer})});
    this.narrative = new NarrativeView({dialog, getState, onIntent});
    installHeroName(this.narrative); // donor view still says "QUANG"; shown as Long (donor files untouched)
    this.openNotebook = () => { if (!this.destroyed) this.emit('notebook'); };
    document.addEventListener('game-open-notebook', this.openNotebook);
  }

  // The donor puzzle view reports its open puzzle in puzzle.activeId; solved stations get no card.
  hintKeyFor(view) {
    const id = this.puzzle?.activeId;
    return view === 'bao-content' && id && !this.getState().completedPuzzleIds.includes(id) ? id : null;
  }

  // A wrong radio try gives Hệ Thống's level-1 hint and with it the odd-letter highlighter (tactile station).
  noteMistake() {
    super.noteMistake();
    const id = this.puzzle?.activeId;
    if (!this.destroyed && id && puzzles[id]?.type === 'interleave') revealOddHighlight(this.puzzle, id);
  }

  destroy() {
    if (this.destroyed) return;
    document.removeEventListener('game-open-notebook', this.openNotebook);
    this.puzzle.clearDrafts(); this.narrative.clear();
    this.announcement.remove();
    super.destroy();
  }
}
