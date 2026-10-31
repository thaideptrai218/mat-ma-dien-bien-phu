import { element, button, heading, audioLabel } from './ui-elements.js';
import { documentPanel } from './document-reader.js';
import { puzzlePanel } from './ui-puzzles.js';
import { createRoomMap } from './ui-map.js';
import { attachDialogueVoice, voiceSettings } from './ui-voice-controls.js';

const portraitUrl = new URL('../../assets/images/quang-portrait.png', import.meta.url).href;

function dialogue(data, emit) {
  const panel = element('section', 'r1-dialogue');
  const portrait = element('div', 'r1-portrait');
  const image = element('img');
  image.src = portraitUrl;
  image.alt = 'Quang';
  image.width = 150;
  image.height = 180;
  image.addEventListener('error', () => { image.hidden = true; portrait.classList.add('r1-portrait-fallback'); });
  portrait.append(image, element('span', 'r1-portrait-name', data.speaker || 'Quang'));
  const prose = element('div', 'r1-dialogue-prose');
  prose.append(heading(data.title || 'Một lời tự nhủ', data.speaker || 'QUANG · SUY NGHĨ'));
  const paragraphs = (data.lines || []).map(line => element('p', '', line));
  prose.append(...paragraphs);
  const cleanup = attachDialogueVoice(prose, paragraphs, data.voice, emit);
  prose.append(button(data.buttonLabel || 'Tiếp tục', () => emit(data.action || 'dialogue-finish', data.payload || {}), 'r1-primary'));
  panel.append(portrait, prose);
  return { node: panel, cleanup };
}

function notebook(data, emit) {
  const body = element('section');
  body.append(heading('Sổ tay của Quang'), element('p', 'r1-lead', 'Những hồ sơ đã đọc và xác nhận. Mở lại để đối chiếu toàn văn.'));
  const list = element('div', 'r1-notebook-list');
  for (const doc of data.documents || []) {
    const row = button('', () => emit('document-reread', { id: doc.id }), 'r1-notebook-row');
    row.append(element('span', 'r1-notebook-code', doc.code || doc.id), element('span', '', doc.title), element('span', 'r1-notebook-read', 'Đọc lại ↗'));
    list.append(row);
  }
  if (!(data.documents || []).length) list.append(element('p', 'r1-empty', 'Chưa có hồ sơ nào. Tìm lời nhắn đầu tiên trong căn phòng.'));
  body.append(list);
  return { node: body };
}

function completed(data) {
  const body = element('section', 'r1-completed');
  body.append(heading(data.title || 'Mảnh ký ức đầu tiên', 'HOÀN THÀNH PHÒNG 1'));
  const badge = element('div', 'r1-fragment-badge');
  badge.append(element('span', '', 'I'), element('p', '', 'MẢNH TRANH ĐẦU TIÊN'));
  body.append(badge);
  for (const line of data.lines || []) body.append(element('p', 'r1-lead', line));
  body.append(element('p', 'r1-muted', 'Bạn đã hoàn thành bản chơi riêng của phòng 1. Hành trình năm phòng có phần mở đầu, tiến độ chung và phòng ghép tranh ở trang chính.'));
  const link = element('a', 'r1-button r1-primary', 'Mở bản của Bảo — Phòng 2 ↗');
  link.href = './room-two.html';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  const campaign = element('a', 'r1-button', 'Chơi hành trình năm phòng');campaign.href='./index.html';
  body.append(link, campaign, element('p', 'r1-muted', 'Các bản chơi riêng và hành trình giữ tiến độ riêng, không tự chuyển mảnh tranh.'));
  return { node: body };
}

function settings(data, emit) {
  const body = element('section');
  body.append(heading('Tùy chọn'), element('p', 'r1-lead', 'Tiến độ của phòng này được lưu trên trình duyệt hiện tại.'));
  body.append(button(audioLabel(data.audio), () => emit('audio-toggle'), 'r1-settings-audio'));
  const voice = voiceSettings();
  body.append(voice.node);
  const reset = element('div', 'r1-reset');
  reset.append(element('h3', '', 'Chơi lại từ đầu'), element('p', '', 'Xóa tiến độ phòng này và trở lại điểm bắt đầu.'));
  const confirm = element('label', 'r1-reset-confirm');
  const checkbox = element('input');
  checkbox.type = 'checkbox';
  confirm.append(checkbox, document.createTextNode('Tôi muốn xóa tiến độ phòng này.'));
  const resetButton = button('Xóa tiến độ và bắt đầu lại', () => emit('reset-confirmed'), 'r1-danger');
  resetButton.disabled = true;
  checkbox.addEventListener('change', () => { resetButton.disabled = !checkbox.checked; });
  reset.append(confirm, resetButton);
  body.append(reset);
  return { node: body, cleanup: voice.cleanup };
}

export function createPanel(view, data, emit, snapshot, world) {
  if (view === 'intro' || view === 'dialogue') return dialogue(data, emit);
  if (view === 'document') return documentPanel(data, emit);
  if (view === 'notebook') return notebook(data, emit);
  if (view === 'completed') return completed(data);
  if (view === 'settings') return settings(data, emit);
  if (view === 'map') {
    const node = element('section', 'r1-full-map');
    node.append(heading('Sơ đồ phòng ký ức'), createRoomMap(snapshot, false, world), element('p', 'r1-current-map-goal', snapshot.goal?.label || 'Khám phá căn phòng'));
    return { node };
  }
  return { node: puzzlePanel(view, data, emit) || element('p', '', 'Chưa có nội dung để hiển thị.') };
}
