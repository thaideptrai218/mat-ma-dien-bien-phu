import { element, button, heading } from '../room-one/ui-elements.js';
import { BOARDS } from './puzzle-data.js';
import { crosswordPanel, columnPanel } from './crossword.js';
import { finalPanel } from './final-strips-panel.js';
import { doorPanel } from './door-puzzle-panel.js';
import { beginSweep, extendSweep } from './shape-sweep-model.js';

function boardPanel(data, emit) {
  const boardId = data.board === 'l' ? 'l' : 't';
  const board = BOARDS[boardId];
  const body = element('section', 'r4-puzzle');
  body.append(heading(`Bảng chữ ${boardId.toUpperCase()}`, 'PHÒNG 4 · MẬT MÃ HÌNH CHỮ'));
  body.append(element('p', 'r1-lead', `Chọn các ô tạo thành hình chữ ${boardId.toUpperCase()}. Đọc những ô được chọn từ trái sang phải, từ hàng trên xuống hàng dưới. Bấm lại một ô để bỏ chọn. Giữ chuột hoặc ngón tay rồi quét bút dò qua nhiều ô để chọn liền một nét; quét qua ô đã chọn sẽ bỏ chọn.`));
  let selected = new Set(data.solved ? board.cells : []);
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
      // Pointer input is handled by the probe-pen sweep below; click only fires for keyboard activation (detail 0).
      const cell = button('', event => {
        if (event.detail !== 0) return;
        selected = beginSweep(selected, index).selected;
        update();
      }, 'r4-shape-cell');
      cell.dataset.index = String(index);
      cell.disabled = Boolean(data.solved);
      cell.append(element('span', 'r4-cell-letter', letter), element('span', 'r4-cell-order'));
      buttons.push(cell);
      grid.append(cell);
    }
  }
  // Bút dò: press on a cell and sweep across others; the first cell decides whether the stroke picks or un-picks.
  let sweep = null;
  const cellAt = event => {
    const hit = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-index]');
    return hit && grid.contains(hit) ? Number(hit.dataset.index) : null;
  };
  const endSweep = () => { sweep = null; };
  if (!data.solved) {
    grid.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      const index = cellAt(event);
      if (index === null) return;
      sweep = beginSweep(selected, index); selected = sweep.selected; update();
      try { grid.setPointerCapture(event.pointerId); } catch { /* capture is optional */ }
      event.preventDefault();
    });
    grid.addEventListener('pointermove', event => {
      if (!sweep) return;
      const index = cellAt(event);
      if (index === null) return;
      const next = extendSweep(sweep, index);
      if (next !== sweep) { sweep = next; selected = sweep.selected; update(); }
    });
    grid.addEventListener('pointerup', endSweep);
    grid.addEventListener('pointercancel', endSweep);
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

export function puzzlePanel(view, data, emit) {
  if (view === 'crossword') return crosswordPanel(data, emit);
  if (view === 'column') return columnPanel(data, emit);
  if (view === 'board') return boardPanel(data, emit);
  if (view === 'final') return finalPanel(data, emit);
  if (view === 'door') return doorPanel(data, emit);
  return null;
}
