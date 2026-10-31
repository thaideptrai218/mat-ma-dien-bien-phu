import {puzzles} from './content.js';
import {enhanceBalance} from './tactile-balance-station.js';
import {enhanceRadio} from './tactile-radio-station.js';
import {enhanceFist, enhanceFold} from './tactile-fist-and-fold-stations.js';
import './tactile-stations.css';

const ENHANCERS = {balance: enhanceBalance, interleave: enhanceRadio, fist: enhanceFist, fold: enhanceFold};

// Adds drag/dial controls to the donor PuzzleView without touching its files: wraps show() on the instance (same
// pattern as showFeedback in ui.js). Each enhancer reads and writes the donor's own form controls, so payloads and
// evaluation are unchanged. Any failure leaves the donor form as rendered, which is still fully playable.
export function installTactileStations(view) {
  const original = view.show.bind(view);
  view.show = (puzzleId, opts) => {
    original(puzzleId, opts);
    const puzzle = puzzles[puzzleId], enhance = puzzle && ENHANCERS[puzzle.type];
    const form = document.querySelector('#puzzle-form'), draft = view.drafts.get(puzzleId);
    if (!enhance || !form || !draft) return;
    try {
      enhance({view, puzzle, draft, form, opts, solved: view.getState().completedPuzzleIds.includes(puzzleId)});
    } catch (error) {
      console.error(`tactile station ${puzzleId} fell back to the donor form`, error);
    }
  };
  return view;
}
