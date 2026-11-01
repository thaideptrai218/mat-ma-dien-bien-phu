import { createPanel as sharedPanel } from '../room-one/ui-panels.js';
import { element, button, heading } from '../room-one/ui-elements.js';
import { puzzlePanel, tokenCards } from './puzzles.js';
import { doorPanel } from './door-panel.js';

function notebook(data, emit) {
  const body = element('section', 'r3-notebook');
  body.append(heading('Sổ tay tuyến tiếp vận', 'PHÒNG 3 · HỒ SƠ CỦA LONG'), element('p', 'r1-lead', 'Những dữ kiện và giấy tờ đã đọc, xác nhận. Mở lại toàn văn bất cứ lúc nào để đối chiếu.'), element('h3', '', 'Mật mã đã khôi phục'), tokenCards(data.tokens || []), element('h3', '', 'Giấy tờ đã ghi nhận'));
  const list = element('div', 'r1-notebook-list');
  for (const doc of data.documents || []) {
    const row = button('', () => emit('document-reread', { id: doc.id }), 'r1-notebook-row');
    row.append(element('span', 'r1-notebook-code', doc.code || doc.id), element('span', '', doc.title), element('span', 'r1-notebook-read', 'Đọc toàn văn ↗'));
    list.append(row);
  }
  if (!(data.documents || []).length) list.append(element('p', 'r1-empty', 'Chưa ghi nhận giấy tờ nào. Hãy đến hồ sơ chuẩn bị ở gần lối vào.'));
  body.append(list);
  return { node: body };
}

function completed(data) {
  const body = element('section', 'r1-completed r3-completed');
  body.append(heading(data.title || 'Tuyến tiếp vận đã nối lại', 'HOÀN THÀNH PHÒNG 3'));
  const badge = element('div', 'r1-fragment-badge');
  badge.append(element('span', '', 'III'), element('p', '', 'MẢNH TRANH THỨ BA'));
  body.append(badge);
  for (const line of data.lines || []) body.append(element('p', 'r1-lead', line));
  body.append(element('p', 'r3-completion-note', 'Bạn đã tìm được riêng mảnh III của Phòng 3. Chơi hành trình năm phòng ở trang chính để mang đủ bốn mảnh tới phòng ghép tranh.'));
  const links = element('div', 'r3-completion-links');
  for (const [href, title] of [['./index.html', 'Chơi hành trình năm phòng'], ['./room-one.html', 'Phòng 1 riêng'], ['./room-four.html', 'Đến Phòng 4 riêng']]) {
    const link = element('a', 'r1-button', title); link.href = href; links.append(link);
  }
  body.append(links, element('p', 'r1-muted', 'Mỗi phòng giữ tiến độ riêng. Các liên kết không chuyển hoặc đồng bộ mảnh tranh.'));
  return { node: body };
}

export function createPanel(view, data, emit, snapshot, world) {
  if (view === 'notebook') return notebook(data, emit);
  if (view === 'completed') return completed(data);
  if (view === 'door') return { node: doorPanel(data, emit) };
  const node = puzzlePanel(view, data, emit);
  if (node) return { node };
  const panel = sharedPanel(view, data, emit, snapshot, world);
  for (const eyebrow of panel.node.querySelectorAll('.r1-eyebrow')) {
    if (eyebrow.textContent === 'PHÒNG KÝ ỨC · 01') eyebrow.textContent = 'PHÒNG KÝ ỨC · 03';
  }
  return panel;
}
