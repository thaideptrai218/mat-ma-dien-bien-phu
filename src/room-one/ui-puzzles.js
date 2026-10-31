import { element, button, heading, formField, submitButton } from './ui-elements.js';
import { DIGITS, LETTERS } from '../ui/tactile/dial-model.js';
import { DOOR_PUZZLES } from './door-puzzles.js';
import { comparisonBoard } from './ui-comparison-board.js';

function wallMap(emit) {
  const body = element('section');
  body.append(heading('Bản đồ trên vách'), element('p', 'r1-lead', 'Tìm ô mang ký hiệu trên nhãn lưu trữ của lá thư.'));
  const grid = element('div', 'r1-coordinate-grid');
  grid.append(element('span'));
  for (const col of ['A', 'B', 'C', 'D']) grid.append(element('span', 'r1-grid-label', col));
  for (let row = 1; row <= 4; row++) {
    grid.append(element('span', 'r1-grid-label', String(row).padStart(2, '0')));
    for (const col of ['A', 'B', 'C', 'D']) {
      const cell = `${col}-${String(row).padStart(2, '0')}`;
      grid.append(button(cell, () => emit('map-submit', { cell }), 'r1-coordinate'));
    }
  }
  body.append(grid);
  return body;
}

function comparison(data, emit) {
  const body = element('section');
  body.append(heading('Hai phía của bàn cờ'), element('p', 'r1-lead', 'Dùng bốn hồ sơ đã ghi trong sổ tay để đối chiếu tình thế hai phía.'));
  if (data.solved) {
    body.append(element('p', 'r1-success', 'Đã hoàn tất đối chiếu.'), element('p', 'r1-code-label', 'MẬT MÃ NGĂN KÉO'), element('output', 'r1-revealed-code', '2413'));
    return body;
  }
  body.append(comparisonBoard(emit));
  return body;
}

// Drawer (4 digit wheels) and chest (4 letter wheels): the dial emits the same string the old text input held.
function dialForm(emit, {title, label, name, action, submit, alphabet, wheelWord, wheels = 4, value = '', lead = 'Bấm mũi tên trên và dưới mỗi bánh, hoặc chọn bánh rồi dùng phím mũi tên lên xuống.', extra = {}}) {
  const body = element('section');
  body.append(heading(title));
  const form = element('form', 'r1-answer-form r1-dial-form');
  const holder = element('div', 'r1-dial-holder');
  let dial = null;
  const submitControl = submitButton(submit);
  submitControl.disabled = true;
  form.append(element('p', 'r1-muted', lead), holder, submitControl);
  // Loaded on demand: the dial module imports CSS, which node tests that reach this file cannot load.
  import('../ui/tactile/combination-dial.js').then(({createCombinationDial}) => {
    dial = createCombinationDial({wheels, alphabet, value, label, wheelLabel: (i, total) => `${wheelWord} ${i + 1} trên ${total}`});
    holder.replaceChildren(dial.element); submitControl.disabled = false;
  }).catch(() => holder.replaceChildren(element('p', 'r1-notice-inline', 'Không tải được khóa. Hãy tải lại trang.')));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (dial) emit(action, {...extra, [name]: dial.getValue()});
  });
  body.append(form);
  return body;
}

// Cipher form: the typed answer stays, a letter keypad (same A-Z table as the key) inserts letters for touch users.
function identityForm(emit) {
  const body = element('section');
  body.append(heading('Danh tính trong mật điện'));
  body.append(element('p', 'r1-lead', 'Mỗi số thay cho vị trí của một chữ trong bảng chữ cái Latin: A = 01, B = 02… Ghép các chữ để tìm một họ tên.'));
  const form = element('form', 'r1-answer-form');
  const field = formField('Họ tên được giải mã', 'name');
  const insert = text => { field.input.value += text; field.input.focus(); };
  const alphabet = element('div', 'r1-alphabet');
  alphabet.setAttribute('role', 'group');
  alphabet.setAttribute('aria-label', 'Bảng chữ cái');
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);
    alphabet.append(button(`${letter} · ${String(i + 1).padStart(2, '0')}`, () => insert(letter), 'r1-key'));
  }
  const tools = element('div', 'r1-keypad-tools');
  tools.append(button('Dấu cách', () => insert(' '), 'r1-key'),
    button('Xóa một chữ', () => { field.input.value = field.input.value.slice(0, -1); field.input.focus(); }, 'r1-key'));
  body.append(alphabet, tools, element('p', 'r1-cipher', '08 05 14 18 09 / 14 01 22 01 18 18 05'));
  form.append(field.label, submitButton('Xác nhận danh tính'));
  form.addEventListener('submit', event => {
    event.preventDefault();
    emit('identity-submit', {name: field.input.value});
  });
  body.append(form);
  return body;
}

// Door puzzles (view 'door-<gateId>'): one short tactile dial built from DOOR_PUZZLES data.
function doorPanel(gateId, emit) {
  const puzzle = DOOR_PUZZLES[gateId];
  if (!puzzle) return null;
  return dialForm(emit, {title: puzzle.title, label: puzzle.title, name: 'code', action: 'door-submit', submit: puzzle.submit,
    alphabet: puzzle.alphabets, wheels: puzzle.alphabets.length, value: puzzle.initial, wheelWord: 'Bánh', lead: puzzle.lead, extra: {id: gateId}});
}

export function puzzlePanel(view, data, emit) {
  if (view.startsWith('door-')) return doorPanel(view.slice(5), emit);
  if (view === 'a03') return wallMap(emit);
  if (view === 'comparison') return comparison(data, emit);
  if (view === 'drawer') return dialForm(emit, {title: 'Ngăn kéo khóa số', label: 'Khóa số bốn bánh', name: 'code', action: 'drawer-submit', submit: 'Mở ngăn kéo', alphabet: DIGITS, wheelWord: 'Bánh số'});
  if (view === 'chest') return dialForm(emit, {title: 'Chiếc rương ký ức', label: 'Khóa chữ bốn bánh', name: 'keyword', action: 'chest-submit', submit: 'Mở rương', alphabet: LETTERS, wheelWord: 'Bánh chữ'});
  if (view === 'identity') return identityForm(emit);
  return null;
}
