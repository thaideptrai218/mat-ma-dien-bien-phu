// Nắm đấm thép: drag an arrow card onto a region; the donor selects + play button run the move, so the donor
// still validates the order and shows its own feedback. Hòm sắt: a four-wheel number dial replaces the code field.
import {element} from '../ui/dom-elements.js';
import {createTokenBinsView} from '../ui/tactile/token-bins-view.js';
import {createCombinationDial} from '../ui/tactile/combination-dial.js';
import {DIGITS} from '../ui/tactile/dial-model.js';
import {createFistBins} from './tactile-station-models.js';
import {hide, setControl, focusToken} from './tactile-dom.js';

export function enhanceFist({view, puzzle, draft, form, opts}) {
  const controls = form.querySelector('.fist-controls'), play = form.querySelector('#fist-play');
  const cardSelect = form.querySelector('#fist-card'), regionSelect = form.querySelector('#fist-region');
  if (!controls || !play || !cardSelect || !regionSelect) return; // donor markup changed: keep the donor UI
  const finished = cardSelect.disabled || draft.moves.length >= puzzle.answerSpec.moves.length;
  hide(controls);
  const bins = createTokenBinsView({state: createFistBins(puzzle, draft.moves), trayLabel: 'Thẻ mũi tên', disabled: finished, className: 'r2-fist',
    labels: Object.fromEntries(puzzle.regions.map(region => [region.id, `Vùng ${region.label}`])),
    onChange: (_model, {tokenId, binId}) => {
      // Cards of accepted moves stay put: anything else is replayed through the donor's own move check.
      if (binId === null || draft.moves.some(move => move.card === tokenId)) { view.show(puzzle.id, {focus: '#fist-card'}); return; }
      setControl(cardSelect, tokenId, 'change'); setControl(regionSelect, binId, 'change');
      play.click();
    }});
  const names = puzzle.cards.map(card => card.label).join('; ');
  const help = `Kéo thẻ mũi tên vào vùng tiến công, hoặc bấm thẻ rồi bấm vùng. Phím Enter nhấc thẻ, Tab chọn vùng, Enter thả. Các thẻ: ${names}.`;
  controls.before(element('div', {className: 'r2-fist-board'}, bins.root, element('p', {className: 'form-help'}, help)));
  if (opts?.focus === '#fist-card' && !finished) focusToken(bins.root);
}

export function enhanceFold({draft, form}) {
  const input = form.querySelector('#fold-code'), holder = input?.closest('.form-field');
  if (!input || !holder) return; // donor markup changed: keep the donor UI
  const locked = input.disabled;
  hide(holder); input.readOnly = true;
  const dial = createCombinationDial({wheels: 4, alphabet: DIGITS, value: /^\d{4}$/.test(draft.code) ? draft.code : '', label: 'Khóa hòm sắt, bốn bánh số',
    disabled: locked, wheelLabel: (index, total) => `Bánh số ${index + 1} trên ${total}`, onChange: code => setControl(input, code)});
  holder.after(element('div', {className: 'r2-fold-dial'},
    element('p', {className: 'form-help'}, 'Khóa hòm sắt: ngày và tháng. Xoay từng bánh số, hoặc gõ số khi bánh đang chọn.'), dial.element));
  if (!locked) setControl(input, dial.getValue());
}
