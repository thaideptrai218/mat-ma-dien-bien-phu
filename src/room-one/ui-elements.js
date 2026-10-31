export function element(tag, className = '', text = '') {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}

export function button(label, onClick, className = '') {
  const node = element('button', `r1-button ${className}`, label);
  node.type = 'button';
  node.addEventListener('click', onClick);
  return node;
}

export function heading(title, eyebrow = 'PHÒNG KÝ ỨC · 01') {
  const fragment = document.createDocumentFragment();
  fragment.append(element('p', 'r1-eyebrow', eyebrow), element('h2', '', title));
  return fragment;
}

export function formField(labelText, name, options) {
  const label = element('label', 'r1-field');
  label.append(element('span', '', labelText));
  const input = element(options ? 'select' : 'input');
  input.name = name;
  if (options) {
    input.append(new Option('Chọn dữ kiện…', ''));
    for (const [value, text] of options) input.append(new Option(text, value));
  } else {
    input.type = 'text';
    input.autocomplete = 'off';
  }
  input.required = true;
  label.append(input);
  return { label, input };
}

export function submitButton(label) {
  const node = element('button', 'r1-button r1-primary', label);
  node.type = 'submit';
  return node;
}

export function sourceText(source) {
  if (typeof source === 'string') return source;
  if (Array.isArray(source)) return source.map(sourceText).join(' · ');
  return source?.label || source?.title || source?.text || '';
}

export function audioLabel(audio = {}) {
  if (!audio.enabled) return 'Bật âm thanh';
  return audio.unlocked && audio.running ? 'Tắt âm thanh' : 'Bật lại âm thanh';
}
