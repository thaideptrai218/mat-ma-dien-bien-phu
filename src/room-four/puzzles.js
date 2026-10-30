import { element, button, heading, formField, submitButton } from '../room-one/ui-elements.js';
import { BOARDS } from './puzzle-data.js';
import { crosswordPanel, columnPanel } from './crossword.js';

function boardPanel(data, emit) {
  const boardId = data.board === 'l' ? 'l' : 't';
  const board = BOARDS[boardId];
  const body = element('section', 'r4-puzzle');
  body.append(heading(`Bảng chữ ${boardId.toUpperCase()}`, 'PHÒNG 4 · MẬT MÃ HÌNH CHỮ'));
  body.append(element('p', 'r1-lead', `Chọn các ô tạo thành hình chữ ${boardId.toUpperCase()}. Đọc những ô được chọn từ trái sang phải, từ hàng trên xuống hàng dưới. Bấm lại một ô để bỏ chọn.`));
  const selected = new Set(data.solved ? board.cells : []);
  const grid = element('div', 'r4-shape-grid');
  grid.setAttribute('role', 'group');
  grid.setAttribute('aria-label', `Bảng chữ ${boardId.toUpperCase()}, 6 hàng, 5 cột`);
  const buttons = [];
  const reading = element('output', 'r4-reading-order');
  reading.setAttribute('aria-live', 'polite');
  const count = element('p', 'r4-selection-count');
  const update = () => {
    const ordered = [...selected].sort((a, b) => a - b);
    for (const [index, cell] of buttons.entries()) {
      const order = ordered.indexOf(index);
      cell.classList.toggle('is-selected', order >= 0);
      cell.setAttribute('aria-pressed', String(order >= 0));
      cell.querySelector('.r4-cell-order').textContent = order >= 0 ? String(order + 1) : '';
      cell.setAttribute('aria-label', `Hàng ${Math.floor(index / 5) + 1}, cột ${index % 5 + 1}: ${board.rows[Math.floor(index / 5)][index % 5]}${order >= 0 ? `, thứ tự đọc ${order + 1}` : ', chưa chọn'}`);
    }
    count.textContent = `Đã chọn ${ordered.length} ô. Số nhỏ trên ô cho biết thứ tự đọc.`;
    reading.textContent = ordered.length ? ordered.map(index => board.rows[Math.floor(index / 5)][index % 5]).join(' · ') : 'Chưa chọn ô chữ nào.';
  };
  for (const [rowIndex, row] of board.rows.entries()) {
    for (const [column, letter] of [...row].entries()) {
      const index = rowIndex * 5 + column;
      const cell = button('', () => {
        if (selected.has(index)) selected.delete(index);
        else selected.add(index);
        update();
      }, 'r4-shape-cell');
      cell.disabled = Boolean(data.solved);
      cell.append(element('span', 'r4-cell-letter', letter), element('span', 'r4-cell-order'));
      buttons.push(cell);
      grid.append(cell);
    }
  }
  body.append(grid, count, element('p', 'r4-reading-label', 'CHỮ ĐANG ĐỌC'), reading);
  update();
  if (data.solved) {
    body.append(element('p', 'r1-success', `Đã giải bảng chữ ${boardId.toUpperCase()}.`), element('p', 'r4-board-phrase', board.phrase));
  } else {
    body.append(button('Kiểm tra hình chữ', () => emit('shape-submit', { board: boardId, selected: [...selected].sort((a, b) => a - b) }), 'r1-primary'));
  }
  return body;
}

function finalPanel(data, emit) {
  const body = element('section', 'r4-puzzle');
  body.append(heading('Lời quyết tâm trên nắp rương', 'PHÒNG 4 · MẬT KHẨU CUỐI'));
  body.append(element('p', 'r1-lead', 'Ghép hai lời đã tìm được ở bảng chữ T và L thành một câu, rồi nhập vào khóa rương. Có thể dùng tiếng Việt có dấu hoặc không dấu.'));
  if (data.solved) {
    body.append(element('p', 'r1-success', 'Khóa đã mở. Hãy đến chiếc rương để nhận mảnh tranh thứ tư.'));
    return body;
  }
  const form = element('form', 'r1-answer-form');
  const field = formField('Câu mở khóa rương', 'phrase');
  field.input.maxLength = 100;
  field.input.spellcheck = false;
  form.append(field.label, submitButton('Mở khóa rương'));
  form.addEventListener('submit', event => {
    event.preventDefault();
    emit('final-submit', { phrase: field.input.value });
  });
  body.append(form);
  return body;
}

export function puzzlePanel(view, data, emit) {
  if (view === 'crossword') return crosswordPanel(data, emit);
  if (view === 'column') return columnPanel(data, emit);
  if (view === 'board') return boardPanel(data, emit);
  if (view === 'final') return finalPanel(data, emit);
  return null;
}
