// Cán cân 84: drag weights onto two pans and drop step cards into three columns. The donor's number field and
// selects stay in the DOM (hidden) and receive the same values, so the answer payload is unchanged.
import {element} from '../ui/dom-elements.js';
import {createTokenBinsView} from '../ui/tactile/token-bins-view.js';
import {placementOf, trayTokens} from '../ui/tactile/token-bins-model.js';
import {createWeightBins, solvedWeightPlacement, balanceTotals, beamAngle, createStepBins, BALANCE_BINS} from './tactile-station-models.js';
import {hide, setControl} from './tactile-dom.js';

const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

export function enhanceBalance({puzzle, draft, form, solved}) {
  const workspace = form.querySelector('.balance-workspace'), input = form.querySelector('#balance-weights');
  const cardsBox = form.querySelector('.balance-cards'), submit = form.querySelector('#puzzle-submit');
  if (!workspace || !input || !cardsBox || !submit) return; // donor markup changed: keep the donor UI
  const locked = input.disabled;
  hide(workspace.querySelector('.balance-scale')); hide(workspace.querySelector('.balance-controls')); hide(cardsBox);
  input.readOnly = true;
  form.closest('.puzzle-content')?.querySelector('details.clue-panel')?.removeAttribute('open'); // keep pans and tray on one screen

  if (!draft.r2Weights || solved) draft.r2Weights = solved ? solvedWeightPlacement() : {};
  const weightLabels = {[BALANCE_BINS.north]: 'Đĩa Đồng bằng Bắc Bộ', [BALANCE_BINS.rest]: 'Đĩa Các chiến trường khác'};
  const bar = element('div', {className: 'r2-beam-bar', 'aria-hidden': 'true'});
  const readout = element('p', {className: 'r2-balance-readout', role: 'status', 'aria-live': 'polite'});
  const notice = element('p', {className: 'form-help r2-balance-notice'});
  let weights, steps;

  const refresh = () => {
    const totals = balanceTotals(weights.getState());
    bar.style.transform = `rotate(${-beamAngle(totals)}deg)`;
    if (reducedMotion()) bar.style.transition = 'none';
    readout.textContent = `Bắc Bộ: ${totals.north} · Chiến trường khác: ${totals.rest} · Còn trên khay: ${totals.tray}`;
    const cardsLeft = trayTokens(steps.getState()).length;
    const missing = [totals.placedAll ? '' : 'đặt hết quả cân lên hai đĩa', cardsLeft ? 'xếp hết các việc vào bước' : ''].filter(Boolean);
    notice.textContent = locked ? '' : missing.length ? `Cần ${missing.join(' và ')} trước khi đối chiếu.` : 'Đã đặt đủ. Đối chiếu khi sẵn sàng.';
    if (!locked) { submit.disabled = missing.length > 0; setControl(input, totals.north); } // donor set() clamps + updates its draft
  };

  weights = createTokenBinsView({state: createWeightBins(draft.r2Weights), labels: weightLabels, trayLabel: 'Khay quả cân',
    disabled: locked, className: 'r2-weights', describeToken: token => String(token.value), onChange: state => { draft.r2Weights = placementOf(state); refresh(); }});
  steps = createTokenBinsView({state: createStepBins(puzzle, draft.cardSteps), trayLabel: 'Các việc cần xếp', disabled: locked, className: 'r2-steps',
    labels: Object.fromEntries(puzzle.steps.map(step => [step.id, step.label])),
    onChange: state => {
      const placed = placementOf(state);
      for (const card of puzzle.cards) {
        const select = cardsBox.querySelector(`select[name="${card.id}"]`);
        if (select) setControl(select, placed[card.id] ?? '', 'change');
      }
      refresh();
    }});

  const beam = element('div', {className: 'r2-beam', 'aria-hidden': 'true'}, bar, element('div', {className: 'r2-beam-post'}));
  const help = 'Mỗi quả cân ghi số tiểu đoàn cơ động. Kéo quả cân lên đĩa, hoặc bấm quả cân rồi bấm đĩa. Phím Enter nhấc quả cân, Tab chọn đĩa, Enter thả.';
  workspace.append(element('div', {className: 'r2-balance'}, beam, readout, element('p', {className: 'form-help'}, help), weights.root,
    element('fieldset', {className: 'r2-steps-box'}, element('legend', {}, 'Mỗi việc thuộc bước nào của kế hoạch?'), steps.root), notice));
  refresh();
}
