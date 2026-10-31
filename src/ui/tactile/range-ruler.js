// Sliding ruler built on a native <input type="range"> (keyboard, touch and screen-reader support for free).
// Exposes --rr-fraction (0..1) and data-value on the root so a room can align an overlay (e.g. a column highlight).
import {element} from '../dom-elements.js';
import {snapValue, fractionOf} from './range-model.js';
import './tactile.css';

const MAX_TICKS = 40;

export function createRangeRuler({min = 0, max = 10, step = 1, value = min, label = 'Thước trượt', formatValue = v => String(v),
  showTicks = true, onChange, disabled = false} = {}) {
  const range = {min, max, step};
  let current = snapValue(value, range);
  const input = element('input', {type: 'range', className: 'rr-input', min: String(min), max: String(max), step: String(step),
    value: String(current), 'aria-label': label, disabled: Boolean(disabled)});
  const output = element('output', {className: 'rr-output'});
  const root = element('div', {className: 'rr'}, element('span', {className: 'rr-label'}, label), input, output);

  if (showTicks) {
    const count = Math.floor((max - min) / step) + 1;
    if (count <= MAX_TICKS) {
      const ticks = element('div', {className: 'rr-ticks', 'aria-hidden': 'true'});
      for (let i = 0; i < count; i++) ticks.append(element('span', {className: 'rr-tick'}, formatValue(snapValue(min + i * step, range))));
      root.insertBefore(ticks, output);
    }
  }

  function paint() {
    input.value = String(current);
    input.setAttribute('aria-valuetext', formatValue(current));
    output.textContent = formatValue(current);
    root.style.setProperty('--rr-fraction', String(fractionOf(current, range)));
    root.dataset.value = String(current);
  }
  input.addEventListener('input', () => {
    const next = snapValue(input.value, range);
    if (next === current) return;
    current = next; paint(); onChange?.(current);
  });
  paint();
  return {
    element: root, input,
    getValue: () => current,
    setValue(next) { current = snapValue(next, range); paint(); },
    setDisabled(flag) { input.disabled = Boolean(flag); root.classList.toggle('is-disabled', input.disabled); },
    destroy() { root.remove(); },
  };
}
