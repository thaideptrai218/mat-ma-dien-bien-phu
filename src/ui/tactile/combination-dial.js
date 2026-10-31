// Rotating combination lock. Each wheel is role="spinbutton" (ArrowUp/Down, PageUp/Down, Home/End, type a symbol)
// with explicit up/down buttons for touch. Emits the same string a text input would have produced.
import {element} from '../dom-elements.js';
import {DIGITS, createDial, stepWheel, setWheel, dialValue, wheelSymbol} from './dial-model.js';
import './tactile.css';

export function createCombinationDial({wheels = 4, alphabet = DIGITS, value = '', label = 'Khóa số', onChange, disabled = false,
  wheelLabel = (index, total) => `Bánh ${index + 1} trên ${total}`} = {}) {
  let model = createDial({wheels, alphabet, value}), isDisabled = Boolean(disabled);
  const root = element('div', {className: 'cd', role: 'group', 'aria-label': label});
  const spinners = [], readout = element('span', {className: 'tb-live', role: 'status', 'aria-live': 'polite'});

  function apply(next, index) {
    if (next === model) return;
    model = next; paint(index);
    onChange?.(dialValue(model), index);
  }

  function paint(announceIndex) {
    model.indexes.forEach((at, i) => {
      const spin = spinners[i], size = model.alphabets[i].length, symbol = wheelSymbol(model, i);
      spin.textContent = symbol;
      spin.setAttribute('aria-valuenow', String(at));
      spin.setAttribute('aria-valuetext', symbol);
      spin.setAttribute('aria-valuemax', String(size - 1));
      spin.classList.remove('is-ticked'); void spin.offsetWidth; // restart the (reduced-motion-safe) tick animation
      if (i === announceIndex) spin.classList.add('is-ticked');
    });
    if (announceIndex !== undefined) readout.textContent = `${wheelLabel(announceIndex, model.indexes.length)}: ${wheelSymbol(model, announceIndex)}`;
  }

  function onKey(event, index) {
    if (isDisabled || event.ctrlKey || event.metaKey || event.altKey) return;
    const key = event.key, size = model.alphabets[index].length;
    let next = null;
    if (key === 'ArrowUp') next = stepWheel(model, index, 1);
    else if (key === 'ArrowDown') next = stepWheel(model, index, -1);
    else if (key === 'PageUp') next = stepWheel(model, index, Math.min(5, size - 1));
    else if (key === 'PageDown') next = stepWheel(model, index, -Math.min(5, size - 1));
    else if (key === 'Home') next = setWheel(model, index, model.alphabets[index][0]);
    else if (key === 'End') next = setWheel(model, index, model.alphabets[index][size - 1]);
    else if (key === 'ArrowLeft' || key === 'ArrowRight') {
      const target = spinners[index + (key === 'ArrowLeft' ? -1 : 1)];
      if (target) { event.preventDefault(); target.focus(); }
      return;
    } else if (key.length === 1) { // typing a symbol sets the wheel and advances, like entering a PIN
      const typed = setWheel(model, index, key);
      const known = model.alphabets[index].some(s => s.toLowerCase() === key.toLowerCase());
      if (!known) return;
      event.preventDefault(); apply(typed, index); spinners[index + 1]?.focus();
      return;
    } else return;
    event.preventDefault(); apply(next, index);
  }

  for (let i = 0; i < model.indexes.length; i++) {
    const nudge = delta => { if (!isDisabled) { apply(stepWheel(model, i, delta), i); spinners[i].focus(); } };
    const spin = element('div', {className: 'cd-wheel', role: 'spinbutton', tabIndex: 0, 'aria-label': wheelLabel(i, model.indexes.length),
      'aria-valuemin': '0', onKeyDown: e => onKey(e, i)});
    spinners.push(spin);
    root.append(element('div', {className: 'cd-column'},
      element('button', {type: 'button', className: 'cd-step', tabIndex: -1, 'aria-label': `${wheelLabel(i, model.indexes.length)}: tăng`, onClick: () => nudge(1)}, '▲'),
      spin,
      element('button', {type: 'button', className: 'cd-step', tabIndex: -1, 'aria-label': `${wheelLabel(i, model.indexes.length)}: giảm`, onClick: () => nudge(-1)}, '▼')));
  }
  root.append(readout); paint();

  const setDisabled = flag => {
    isDisabled = Boolean(flag); root.classList.toggle('is-disabled', isDisabled);
    root.querySelectorAll('.cd-step').forEach(b => { b.disabled = isDisabled; });
    spinners.forEach(s => s.setAttribute('aria-disabled', String(isDisabled)));
  };
  setDisabled(isDisabled);
  return {
    element: root,
    getValue: () => dialValue(model),
    setValue(next) { model = createDial({wheels, alphabet, value: next}); paint(); },
    setDisabled,
    destroy() { root.remove(); spinners.length = 0; },
  };
}
