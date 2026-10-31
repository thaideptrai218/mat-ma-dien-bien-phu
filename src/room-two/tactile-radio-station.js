// Hai giọng trên một sóng: a selector knob picks the headphone; tape letters are tokens that go to the selected
// headphone on a click/Enter, or to any headphone when dragged. The donor text inputs become read-only readouts.
import {element} from '../ui/dom-elements.js';
import {createTokenBinsView} from '../ui/tactile/token-bins-view.js';
import {TRAY, binOf, move} from '../ui/tactile/token-bins-model.js';
import {createTapeBins, wordOf, solvedTapePlacement, tapePlacementFromWords} from './tactile-station-models.js';
import {hide, setControl, focusToken} from './tactile-dom.js';

const DRAG_PX = 6;

export function enhanceRadio({puzzle, draft, form, solved}) {
  const workspace = form.querySelector('.radio-workspace'), tape = workspace?.querySelector('.radio-tape');
  const inputs = Object.fromEntries(puzzle.channels.map(channel => [channel.id, form.querySelector(`.radio-channels input[name="${channel.id}"]`)]));
  if (!workspace || !tape || Object.values(inputs).some(input => !input)) return; // donor markup changed: keep the donor UI
  const locked = Object.values(inputs).every(input => input.disabled);
  hide(tape);
  for (const input of Object.values(inputs)) input.readOnly = true;

  const channelIds = puzzle.channels.map(channel => channel.id);
  const labelOf = id => puzzle.channels.find(channel => channel.id === id).label;
  let armed = channelIds[0];
  const placement = solved ? solvedTapePlacement(puzzle) : tapePlacementFromWords(puzzle, draft);
  const apply = model => { for (const id of channelIds) setControl(inputs[id], wordOf(model, id)); };
  const bins = createTokenBinsView({state: createTapeBins(puzzle, placement), trayLabel: 'Cuộn băng điện báo', disabled: locked, className: 'r2-tape',
    labels: Object.fromEntries(channelIds.map(id => [id, `Tai nghe “${labelOf(id)}”`])),
    describeToken: token => `${token.label} ${token.pos}`, onChange: apply});

  // Odd tape positions (1st, 3rd, ...) get a class so the donor "Tô chữ ở vị trí lẻ" toggle can light them up.
  const decorate = () => bins.root.querySelectorAll('.tb-token').forEach(node =>
    node.classList.toggle('r2-odd', Number(node.dataset.token.slice(1)) % 2 === 0));
  const mirrorHighlight = () => bins.root.classList.toggle('r2-highlight-odd', tape.classList.contains('highlight-odd'));
  new MutationObserver(decorate).observe(bins.root, {childList: true, subtree: true});
  new MutationObserver(mirrorHighlight).observe(tape, {attributes: true, attributeFilter: ['class']});
  decorate(); mirrorHighlight();

  // Knob: two detents. Arrow keys turn it; the chosen headphone is marked on the board.
  const stops = channelIds.map(id => element('button', {type: 'button', role: 'radio', className: 'r2-knob-stop', disabled: locked,
    'aria-checked': 'false', onClick: () => setArmed(id)}, labelOf(id)));
  const pointer = element('span', {className: 'r2-knob-pointer', 'aria-hidden': 'true'});
  const knob = element('div', {className: 'r2-knob', role: 'radiogroup', 'aria-label': 'Núm chọn tai nghe',
    onKeyDown: event => {
      if (locked || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault(); setArmed(channelIds[(channelIds.indexOf(armed) + 1) % channelIds.length], true);
    }}, stops[0], element('span', {className: 'r2-knob-dial'}, pointer), stops[1]);
  function setArmed(id, focus = false) {
    armed = id;
    stops.forEach((node, index) => node.setAttribute('aria-checked', String(channelIds[index] === id)));
    pointer.style.transform = `rotate(${channelIds.indexOf(id) ? 40 : -40}deg)`;
    for (const key of channelIds) bins.bins[key].classList.toggle('is-armed', key === id);
    if (focus) stops[channelIds.indexOf(id)].focus();
  }

  // Quick placement: a plain click/Enter on a tape letter sends it to the armed headphone, on a placed letter back
  // to the tape. Real drags are left to the token-bins view.
  let down = null;
  bins.root.addEventListener('pointerdown', event => { down = {x: event.clientX, y: event.clientY}; }, true);
  bins.root.addEventListener('click', event => {
    const node = event.target.closest?.('.tb-token');
    if (!node || locked) return;
    if (event.detail !== 0 && down && Math.hypot(event.clientX - down.x, event.clientY - down.y) >= DRAG_PX) return;
    event.stopPropagation(); event.preventDefault();
    const model = bins.getState(), id = node.dataset.token, next = move(model, id, binOf(model, id) === TRAY ? armed : TRAY);
    if (next === model) return;
    bins.setState(next); apply(next); focusToken(bins.root, id);
    bins.root.querySelector('.tb-live').textContent = binOf(next, id) === TRAY ? `Đã trả chữ ${model.tokens[id].label} về băng.`
      : `Đã đặt chữ ${model.tokens[id].label} vào tai nghe “${labelOf(armed)}”.`;
  }, true);
  setArmed(armed);

  const help = 'Xoay núm để chọn tai nghe. Bấm một chữ trên băng để đặt vào tai nghe đang chọn, hoặc kéo chữ vào tai nghe bất kỳ. Bấm chữ đã đặt để trả về băng. Các chữ ghép theo thứ tự đặt.';
  workspace.append(knob, bins.root, element('p', {className: 'form-help'}, help));
  if (!locked) apply(bins.getState());
}
