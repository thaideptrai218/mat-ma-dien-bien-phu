import {element, button, heading} from '../room-one/ui-elements.js';
import {createPanel as sharedPanel} from '../room-one/ui-panels.js';
import {PAINTING_URL, PAINTING_ALT, SOURCE_LABEL, REFLECTION_SCRIPT, DOOR_MESSAGE, CLOSING_LINE} from './content.js';

export function shuffledPieces(random = Math.random) {
  const order = [0, 1, 2, 3];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]];
  }
  return order.every((id, index) => id === index) ? [2, 0, 3, 1] : order;
}

function painting() {
  const image = element('img', 'r5-complete-painting'); image.src = PAINTING_URL; image.alt = PAINTING_ALT;
  image.width = 1200; image.height = 800; return image;
}

function assembly(data, emit) {
  const node = element('section', 'r5-assembly');
  node.append(heading('Ghép bức tranh chiến thắng', 'PHÒNG 5 · BÀN PHỤC DỰNG'),
    element('p', 'r1-lead', 'Chọn một mảnh rồi chọn mảnh khác để đổi chỗ. Dùng Tab và Enter hoặc phím cách trên các nút. Khi tranh liền mạch, xác nhận bên dưới.'));
  node.append(element('p', 'r1-muted', 'Minh họa SVG nguyên bản của dự án; không phải ảnh tư liệu hay bản sao tranh bảo tàng.'));
  if (data.solved) {node.append(painting(), element('p', 'r1-lead', 'Bốn mảnh đã khớp. Câu hỏi cuối đang chờ ở nơi ánh sáng cạnh cửa.')); return {node};}
  const order = [...data.order], board = element('div', 'r5-piece-grid');
  board.setAttribute('role', 'group'); board.setAttribute('aria-label', 'Bốn vị trí ghép tranh: hàng trên rồi hàng dưới');
  const status = element('p', 'r5-selection-status', 'Chưa chọn mảnh nào.'); status.setAttribute('aria-live', 'polite');
  let selected = null;
  const names = ['I', 'II', 'III', 'IV'];
  const slots = order.map((_, index) => {
    const slot = button('', () => {
      if (selected === null) {selected = index; status.textContent = `Đã chọn vị trí ${index + 1}. Chọn một vị trí khác để đổi chỗ.`;}
      else if (selected === index) {selected = null; status.textContent = 'Đã bỏ chọn mảnh.';}
      else {
        [order[selected], order[index]] = [order[index], order[selected]];
        selected = null; status.textContent = 'Đã đổi chỗ hai mảnh. Có thể tiếp tục sắp xếp.';
        emit('assembly-draft', {order: [...order], token: data.token});
      }
      paintSlots();
    }, 'r5-piece');
    return slot;
  });
  function paintSlots() {
    slots.forEach((slot, index) => {
      const id = order[index];
      slot.style.backgroundImage = `url("${PAINTING_URL}")`;
      slot.style.backgroundPosition = `${id % 2 ? '100%' : '0%'} ${id > 1 ? '100%' : '0%'}`;
      slot.setAttribute('aria-label', `Vị trí ${index + 1}, mảnh ${names[id]}`);
      slot.setAttribute('aria-pressed', String(selected === index));
      slot.replaceChildren(element('span', 'r5-piece-label', `${index + 1} · ${names[id]}`));
    });
  }
  paintSlots(); board.append(...slots);
  node.append(board, status, button('Xác nhận bức tranh', () => emit('assembly-submit', {order: [...order], token: data.token}), 'r1-primary'));
  return {node};
}

function reflection(data, emit) {
  const node = element('section', 'r5-reflection');
  node.append(heading('Câu hỏi không nằm trong mật mã', 'PHÒNG 5 · LỜI KỂ HƯ CẤU'), element('p', 'r1-muted', SOURCE_LABEL));
  for (const line of REFLECTION_SCRIPT) {
    const passage = element('div', `r5-script r5-speaker-${line.speaker === 'Quang' ? 'quang' : line.speaker === 'Hệ Thống' ? 'system' : 'narrator'}`);
    passage.append(element('h3', '', line.speaker), element('p', '', line.text)); node.append(passage);
  }
  node.append(element('blockquote', 'r5-door-message', DOOR_MESSAGE));
  if (data.readOnly) return {node};
  const label = element('label', 'r5-personal-label', 'Suy nghĩ riêng của bạn (không bắt buộc)');
  const textarea = element('textarea', 'r5-personal-response'); textarea.rows = 4;
  textarea.autocomplete = 'off'; textarea.setAttribute('aria-describedby', 'r5-personal-privacy');
  label.append(textarea);
  const privacy = element('p', 'r1-muted', 'Có thể để trống. Không chấm đúng/sai, không dùng để mở khóa; nội dung chỉ ở ô này và được xóa khi đóng bảng. Không gửi hoặc lưu vào tiến độ.');
  privacy.id = 'r5-personal-privacy';
  // Do not read the textarea in callbacks: the narrative acknowledgment is the sole intent.
  node.append(label, privacy, button('Tiếp tục cùng Quang · Có thể để trống', () => emit('reflection-continue', {token: data.token}), 'r1-primary'));
  return {node, cleanup: () => {textarea.value = '';}};
}

export function createPanel(view, data, emit, snapshot, world) {
  if (view === 'assembly') return assembly(data, emit);
  if (view === 'reflection') return reflection(data, emit);
  if (view === 'notebook') {
    const node = element('section');
    node.append(heading('Sổ tay · Căn phòng cuối', 'HÀNH TRÌNH PHÒNG 5'), element('p', 'r1-lead', data.inventory));
    if (snapshot.state?.reflectionSeen) node.append(button('Đọc lại toàn bộ cuộc trò chuyện', () => emit('reflection-reread')));
    else node.append(element('p', '', 'Đến bàn phục dựng để ghép tranh, rồi tìm nơi ánh sáng bên cửa.'));
    node.append(element('p', 'r1-muted', SOURCE_LABEL)); return {node};
  }
  if (view === 'completed') {
    const node = element('section', 'r1-completed');
    node.append(heading('Đã bước qua cánh cửa', 'HOÀN THÀNH PHÒNG 5'), painting(), element('blockquote', 'r5-door-message', DOOR_MESSAGE),
      element('p', 'r1-lead', CLOSING_LINE), element('p', 'r1-muted', SOURCE_LABEL)); return {node};
  }
  return sharedPanel(view, data, emit, snapshot, world);
}
