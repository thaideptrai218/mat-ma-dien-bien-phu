import { createPanel as sharedPanel } from '../room-one/ui-panels.js';
import { element, heading } from '../room-one/ui-elements.js';
import { puzzlePanel } from './puzzles.js';

function completed(data) {
  const body = element('section', 'r1-completed r4-completed');
  body.append(heading(data.title || 'Mảnh ký ức thứ tư', 'HOÀN THÀNH PHÒNG 4 · TRÂM'));
  const badge = element('div', 'r1-fragment-badge');
  badge.append(element('span', '', 'IV'), element('p', '', 'MẢNH TRANH THỨ TƯ'));
  body.append(badge);
  for (const line of data.lines || []) body.append(element('p', 'r1-lead', line));
  body.append(element('p', 'r4-completion-note', 'Bạn đã tìm được riêng mảnh IV của phòng 4. Chơi hành trình năm phòng ở trang chính để mang đủ bốn mảnh tới phòng ghép tranh.'));
  const link = element('a', 'r1-button r1-primary', 'Chơi hành trình năm phòng');
  link.href = './index.html';
  const bao = element('a', 'r1-button', 'Mở bản của Bảo ↗');
  bao.href = './room-two.html'; bao.target = '_blank'; bao.rel = 'noopener noreferrer';
  body.append(link, bao, element('p', 'r1-muted', 'Các bản chơi riêng và hành trình giữ tiến độ riêng, không tự chuyển mảnh tranh.'));
  return { node: body };
}

export function createPanel(view, data, emit, snapshot, world) {
  if (view === 'completed') return completed(data);
  const node = puzzlePanel(view, data, emit);
  if (node) return {node};
  const panel = sharedPanel(view, data, emit, snapshot, world);
  for (const eyebrow of panel.node.querySelectorAll('.r1-eyebrow')) {
    if (eyebrow.textContent === 'PHÒNG KÝ ỨC · 01') eyebrow.textContent = 'PHÒNG KÝ ỨC · 04';
  }
  return panel;
}
