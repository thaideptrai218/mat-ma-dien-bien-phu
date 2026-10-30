import { element, button, heading, formField, submitButton } from '../room-one/ui-elements.js';
import { CHALLENGES } from './puzzle-data.js';

export function activity(id, title, lead, data) {
  const body = element('section', 'r3-puzzle');
  const index = CHALLENGES.findIndex(item => item.id === id);
  body.append(heading(title, `PHÒNG 3 · HỒ SƠ ${String(index + 1).padStart(2, '0')}`), element('p', 'r1-lead', lead));
  if (data.solved) {
    body.append(element('p', 'r3-stamp', 'HỒ SƠ ĐÃ KHÔI PHỤC'), element('p', 'r3-earned-code', CHALLENGES[index]?.reward || ''));
  }
  return body;
}

export function choiceGroup(form, draft, name, legend, choices, multiple = false) {
  const fieldset = element('fieldset', 'r3-choice-group');
  fieldset.append(element('legend', '', legend));
  for (const [id, text] of choices) {
    const label = element('label', 'r3-choice');
    const input = element('input');
    input.type = multiple ? 'checkbox' : 'radio';
    input.name = name;
    input.value = id;
    input.checked = multiple ? (draft[name] || []).includes(id) : draft[name] === id;
    if (!multiple) input.required = true;
    label.append(input, element('span', '', text));
    fieldset.append(label);
  }
  fieldset.addEventListener('change', () => {
    draft[name] = multiple ? [...fieldset.querySelectorAll('input:checked')].map(input => input.value) : fieldset.querySelector('input:checked')?.value || '';
  });
  form.append(fieldset);
}

export function selectField(text, name, choices, draft, key = name) {
  const field = formField(text, name, choices);
  field.input.value = draft[key] || '';
  field.input.addEventListener('change', () => { draft[key] = field.input.value; });
  return field;
}

export function finishForm(form, body, label, action, emit, payload) {
  form.append(submitButton(label));
  form.addEventListener('submit', event => {
    event.preventDefault();
    emit(action, payload());
  });
  body.append(form);
}

export function checked(form, name) {
  return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
}

export function selected(form, name) { return form.elements.namedItem(name)?.value || ''; }

function shuffledIds(items) {
  const ids = items.map(item => item.id);
  for (let index = ids.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [ids[index], ids[other]] = [ids[other], ids[index]];
  }
  // The first visit should always present an actual ordering activity.
  if (ids.every((id, index) => id === items[index].id)) ids.reverse();
  return ids;
}

/** Move existing rows instead of recreating them, retaining the active keyboard control. */
export function orderedCards(items, draft, key, label) {
  const known = new Set(items.map(item => item.id));
  const order = Array.isArray(draft[key]) && draft[key].length === items.length && new Set(draft[key]).size === items.length && draft[key].every(id => known.has(id))
    ? [...draft[key]] : shuffledIds(items);
  draft[key] = order;
  const list = element('ol', 'r3-order-list');
  list.setAttribute('aria-label', label);
  const status = element('p', 'r3-order-status');
  status.setAttribute('role', 'status');
  const rows = new Map();
  const update = () => {
    for (const [index, id] of order.entries()) {
      const row = rows.get(id);
      row.querySelector('.r3-order-number').textContent = String(index + 1).padStart(2, '0');
      row.querySelector('[data-direction="up"]').setAttribute('aria-disabled', String(index === 0));
      row.querySelector('[data-direction="down"]').setAttribute('aria-disabled', String(index === order.length - 1));
      list.append(row);
    }
    draft[key] = [...order];
  };
  for (const item of items) {
    const row = element('li', 'r3-order-card');
    const controls = element('div', 'r3-order-buttons');
    for (const [direction, delta, arrow] of [['up', -1, '↑'], ['down', 1, '↓']]) {
      const control = button(arrow, () => {
        const from = order.indexOf(item.id), to = from + delta;
        if (to < 0 || to >= order.length) return;
        [order[from], order[to]] = [order[to], order[from]];
        update();
        control.focus({ preventScroll: true });
        status.textContent = `${item.text} ở vị trí ${to + 1} trên ${order.length}.`;
      }, 'r3-order-arrow');
      control.dataset.direction = direction;
      control.setAttribute('aria-label', `${direction === 'up' ? 'Đưa lên' : 'Đưa xuống'}: ${item.text}`);
      controls.append(control);
    }
    row.append(element('span', 'r3-order-number'), element('span', 'r3-order-text', item.text), controls);
    rows.set(item.id, row);
  }
  update();
  return { list, status, value: () => [...order] };
}
