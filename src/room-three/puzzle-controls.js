import { element, heading, formField, submitButton } from '../room-one/ui-elements.js';
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

// incomplete(): message while the tactile boards are not fully filled (no wrong try is counted for an unfinished board).
export function finishForm(form, body, label, action, emit, payload, incomplete = () => '') {
  const status = element('p', 'r3-form-status');
  status.setAttribute('role', 'status');
  form.append(submitButton(label), status);
  // Any later move on a board makes the old reminder stale.
  for (const type of ['click', 'pointerup']) form.addEventListener(type, () => { status.textContent = ''; });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const message = incomplete();
    status.textContent = message;
    if (!message) emit(action, payload());
  });
  body.append(form);
}

export function checked(form, name) {
  return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
}

export function selected(form, name) { return form.elements.namedItem(name)?.value || ''; }
