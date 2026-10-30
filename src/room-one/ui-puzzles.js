import { element, button, heading, formField, submitButton } from './ui-elements.js';

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
  const form = element('form', 'r1-comparison');
  const table = element('table');
  const head = element('thead');
  const header = element('tr');
  for (const title of ['Dữ kiện', 'Phía Việt Nam', 'Phía Pháp']) header.append(element('th', '', title));
  head.append(header);
  table.append(head);
  const rows = [
    ['Quân số', 'troop', null],
    ['Trang bị', 'equipment', [['limited', 'Còn hạn chế'], ['modern', 'Hiện đại']]],
    ['Thế chiến lược', 'position', [['initiative', 'Giữ thế chủ động'], ['dispersed', 'Lực lượng phân tán']]],
    ['Sức ép', 'pressure', [['supply', 'Tiếp tế, hậu cần'], ['costs', 'Tài chính, chi phí chiến tranh']]],
  ];
  const tbody = element('tbody');
  for (const [title, name, options] of rows) {
    const row = element('tr');
    row.append(element('th', '', title));
    for (const side of ['VN', 'France']) {
      const cell = element('td');
      const field = formField(`${title} — ${side === 'VN' ? 'Việt Nam' : 'Pháp'}`, name + side, options);
      field.label.classList.add('r1-table-field');
      if (!options) {
        field.input.type = 'number';
        field.input.min = '0';
        field.input.step = '1';
        field.input.inputMode = 'numeric';
      }
      cell.append(field.label);
      row.append(cell);
    }
    tbody.append(row);
  }
  table.append(tbody);
  form.append(table, submitButton('Đối chiếu bốn hồ sơ'));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    values.troopVN = Number(values.troopVN);
    values.troopFrance = Number(values.troopFrance);
    emit('comparison-submit', values);
  });
  body.append(form);
  return body;
}

function answerForm(view, emit) {
  const config = {
    drawer: ['Ngăn kéo khóa số', 'Mã bốn chữ số', 'code', 'drawer-submit', 'Mở ngăn kéo'],
    identity: ['Danh tính trong mật điện', 'Họ tên được giải mã', 'name', 'identity-submit', 'Xác nhận danh tính'],
    chest: ['Chiếc rương ký ức', 'Từ khóa mở rương', 'keyword', 'chest-submit', 'Mở rương'],
  }[view];
  const [title, label, name, action, submit] = config;
  const body = element('section');
  body.append(heading(title));
  if (view === 'identity') {
    body.append(element('p', 'r1-lead', 'Mỗi số thay cho vị trí của một chữ trong bảng chữ cái Latin: A = 01, B = 02… Ghép các chữ để tìm một họ tên.'));
    const alphabet = element('div', 'r1-alphabet');
    for (let i = 0; i < 26; i++) alphabet.append(element('span', '', `${String.fromCharCode(65 + i)} · ${String(i + 1).padStart(2, '0')}`));
    body.append(alphabet, element('p', 'r1-cipher', '08 05 14 18 09 / 14 01 22 01 18 18 05'));
  }
  const form = element('form', 'r1-answer-form');
  const field = formField(label, name);
  if (view === 'drawer') {
    field.input.inputMode = 'numeric';
    field.input.pattern = '[0-9]{4}';
    field.input.maxLength = 4;
  }
  form.append(field.label, submitButton(submit));
  form.addEventListener('submit', event => {
    event.preventDefault();
    emit(action, { [name]: field.input.value });
  });
  body.append(form);
  return body;
}

export function puzzlePanel(view, data, emit) {
  if (view === 'a03') return wallMap(emit);
  if (view === 'comparison') return comparison(data, emit);
  if (['drawer', 'identity', 'chest'].includes(view)) return answerForm(view, emit);
  return null;
}
