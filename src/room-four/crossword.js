import { element, button, heading, formField, submitButton } from '../room-one/ui-elements.js';
import { CROSSWORD_ROWS } from './puzzle-data.js';
import { createRangeRuler } from '../ui/tactile/range-ruler.js';

const SOLVED_COLUMN = 9;

function letters(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'D').toUpperCase().replace(/[^A-Z]/g, '');
}

/** One shared geometry for both the fill-in sheet and the later column deduction. */
function diagram(values, columnMode = false) {
  const scroll = element('div', 'r4-grid-scroll');
  scroll.tabIndex = 0;
  scroll.setAttribute('aria-label', 'Ô chữ 17 cột; cuộn ngang để xem đủ sơ đồ');
  const table = element('table', `r4-crossword${columnMode ? ' r4-crossword-columns' : ''}`);
  const caption = element('caption', 'r4-table-caption', columnMode ? 'Đọc từng cột từ trên xuống, bỏ qua những ô trống.' : 'Sơ đồ ô chữ — các hàng giữ đúng vị trí của bản mật mã.');
  const columns = Array.from({ length: 17 }, () => []);
  const head = element('thead');
  const header = element('tr');
  const corner = element('th', '', 'Hàng');
  corner.scope = 'col';
  header.append(corner);
  for (let column = 0; column < 17; column++) {
    const th = element('th', '', String(column + 1));
    th.scope = 'col';
    columns[column].push(th);
    header.append(th);
  }
  head.append(header);
  table.append(caption, head);
  const body = element('tbody');
  const cells = [];
  for (const [index, row] of CROSSWORD_ROWS.entries()) {
    const tr = element('tr');
    const label = element('th', '', String(index + 1));
    label.scope = 'row';
    tr.append(label);
    const rowCells = [];
    for (let column = 0; column < 17; column++) {
      const offset = column - row.start;
      const active = offset >= 0 && offset < row.answer.length;
      const cell = element('td', active ? 'r4-letter-cell' : 'r4-grid-gap', active ? values[index]?.[offset] || '' : '');
      if (active) cell.setAttribute('aria-label', `Hàng ${index + 1}, cột ${column + 1}: ${cell.textContent || 'trống'}`);
      tr.append(cell);
      columns[column].push(cell);
      rowCells.push(active ? cell : null);
    }
    cells.push(rowCells);
    body.append(tr);
  }
  table.append(body);
  scroll.append(table);
  return {
    node: scroll,
    // Marks the column the sliding ruler is on (header + every cell, gaps included).
    highlight: column => columns.forEach((nodes, index) => nodes.forEach(item => item.classList.toggle('is-picked', index === column))),
    update: (index, value) => {
      const row = CROSSWORD_ROWS[index];
      for (let column = row.start; column < row.start + row.answer.length; column++) {
        const cell = cells[index][column];
        cell.textContent = value[column - row.start] || '';
        cell.setAttribute('aria-label', `Hàng ${index + 1}, cột ${column + 1}: ${cell.textContent || 'trống'}`);
      }
    },
  };
}

export function crosswordPanel(data, emit) {
  const body = element('section', 'r4-puzzle');
  body.append(heading('Bảy hàng chữ, một chỉ dẫn', 'PHÒNG 4 · Ô CHỮ'));
  if (data.solved) {
    body.append(element('p', 'r1-success', 'Bảy hàng đã khớp với các tư liệu.'), diagram(CROSSWORD_ROWS.map(row => row.answer)).node);
    return body;
  }
  body.append(element('p', 'r1-lead', 'Dùng bảy tư liệu trong sổ tay để trả lời. Viết chữ hoa, không dấu và không cách; bạn cũng có thể nhập tiếng Việt có dấu.'));
  const preview = diagram([]);
  body.append(preview.node);
  const form = element('form', 'r4-crossword-form');
  const fields = [];
  for (const [index, row] of CROSSWORD_ROWS.entries()) {
    const field = formField(`${index + 1}. ${row.question}`, row.id);
    field.label.classList.add('r4-crossword-question');
    field.input.maxLength = 80;
    field.input.spellcheck = false;
    field.input.autocapitalize = 'characters';
    field.input.setAttribute('aria-describedby', `r4-length-${index}`);
    const length = element('span', 'r4-answer-length', `${row.answer.length} chữ cái`);
    length.id = `r4-length-${index}`;
    field.label.append(length);
    field.input.addEventListener('input', () => preview.update(index, letters(field.input.value)));
    fields.push([row.id, field.input]);
    form.append(field.label);
  }
  form.append(submitButton('Kiểm tra bảy hàng chữ'));
  form.addEventListener('submit', event => {
    event.preventDefault();
    emit('crossword-submit', { answers: Object.fromEntries(fields.map(([id, input]) => [id, input.value])) });
  });
  body.append(form);
  return body;
}

export function columnPanel(data, emit) {
  const body = element('section', 'r4-puzzle');
  body.append(heading('Tìm chỉ dẫn theo chiều dọc', 'PHÒNG 4 · CỘT CHỮ'));
  body.append(element('p', 'r1-lead', 'Các câu trả lời đã nằm đúng vị trí. Đọc mỗi cột từ trên xuống, bỏ ô trống. Trượt thước tới cột tạo thành một lời chỉ dẫn có nghĩa, rồi bấm Đọc cột này.'));
  const grid = diagram(CROSSWORD_ROWS.map(row => row.answer), true);
  const start = data.solved ? SOLVED_COLUMN : 1;
  const ruler = createRangeRuler({ min: 1, max: 17, value: start, label: 'Thước đọc cột · số cột', disabled: Boolean(data.solved), onChange: value => grid.highlight(value - 1) });
  grid.highlight(start - 1);
  body.append(grid.node, ruler.element);
  if (data.solved) {
    body.append(element('p', 'r1-success', 'Chỉ dẫn đã giải: TÌM T VÀ L. Hãy tìm hai bảng chữ phía sau rương.'));
    return body;
  }
  body.append(button('Đọc cột này', () => emit('column-submit', { column: ruler.getValue() - 1 }), 'r1-primary'),
    element('p', 'r1-muted', 'Kéo thước bằng chuột hoặc ngón tay, hoặc dùng phím mũi tên. Cột sáng là cột đang đọc.'));
  return body;
}
