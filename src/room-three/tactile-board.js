// DOM glue for the Room 3 boards: builds a token-bins view whose placement survives re-opening the panel
// (kept in the in-memory panel draft only, never in the save) and hands the model back after every move.
import {element} from '../ui/dom-elements.js';
import {createTokenBinsView} from '../ui/tactile/token-bins-view.js';
import {placementOf} from '../ui/tactile/token-bins-model.js';
import {restoreBoard} from './tactile-model.js';

// key: name of this board inside the draft; make: placement => model (see tactile-model.js).
export function tokenBoard({draft, key, make, labels = {}, trayLabel, className = '', describeToken, onChange}) {
  draft.boards ||= {};
  const view = createTokenBinsView({state: restoreBoard(make, draft.boards[key]), labels, trayLabel, className, describeToken,
    onChange: (model, info) => { draft.boards[key] = placementOf(model); onChange?.(model, info); }});
  return view;
}

// Readable text-only caption/fieldset around a board.
export function boardSection(title, hint, view) {
  return element('section', {className: 'r3-board'}, element('h3', {className: 'r3-section-title'}, title),
    hint ? element('p', {className: 'r3-order-hint'}, hint) : null, view.root);
}
