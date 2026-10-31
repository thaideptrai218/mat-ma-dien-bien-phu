import { element, heading, submitButton } from '../room-one/ui-elements.js';
import { finalLockBoard, composeDate, FINAL_SLOTS } from './tactile-model.js';
import { tokenBoard } from './tactile-board.js';
import { preparationPanel } from './preparation-panel.js';
import { cargoPanel } from './cargo-panel.js';
import { strategyPanel } from './strategy-panel.js';
import { openingPanel } from './opening-panel.js';

export function tokenCards(tokens = []) {
  const cards = element('div', 'r3-token-cards');
  const dateOrder = ['opening', 'preparation', 'cargo'];
  const ordered = [...tokens.filter(token => token.id !== 'strategy')].sort((a, b) => dateOrder.indexOf(a.id) - dateOrder.indexOf(b.id));
  ordered.push(...tokens.filter(token => token.id === 'strategy'));
  for (const token of ordered) {
    const isDoctrine = token.id === 'strategy';
    const card = element('article', `r3-token${isDoctrine ? ' r3-token-doctrine' : ''}`);
    card.append(element('p', 'r3-token-title', isDoctrine ? 'PHƯƠNG CHÂM' : token.title || 'MẢNH NGÀY THÁNG'), element('strong', '', token.label));
    cards.append(card);
  }
  if (!tokens.length) cards.append(element('p', 'r1-empty', 'Chưa khôi phục được mật mã nào. Mỗi trạm hoàn thành sẽ để lại một dữ kiện trong sổ tay.'));
  return cards;
}

function finalPanel(data, emit) {
  const body = element('section', 'r3-puzzle');
  body.append(heading('Dấu niêm phong của tuyến tiếp vận', 'PHÒNG 3 · KHÓA RƯƠNG'), element('p', 'r1-lead', 'Ổ khóa rương có ba khe: Ngày, Tháng, Năm. Kéo các thẻ đã khôi phục vào khe để ghép ngày mở màn chiến dịch. Phương châm được giữ riêng như một ghi nhớ về cách chỉ huy.'));
  if (data.solved) {
    body.append(tokenCards(data.tokens || []), element('p', 'r1-success', 'Dấu niêm phong đã mở. Đến gần rương và nhận mảnh tranh III.'));
    return body;
  }
  const draft = data.draft || {};
  const form = element('form', 'r1-answer-form r3-final-form');
  const board = tokenBoard({ draft, key: 'lock', make: finalLockBoard(data.tokens || []), trayLabel: 'Thẻ đã khôi phục', className: 'r3-lock-board',
    labels: Object.fromEntries(FINAL_SLOTS.map(([id, label]) => [id, `Khe ${label}`])) });
  form.append(board.root, submitButton('Mở dấu niêm phong'));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const date = composeDate(board.getState());
    // An empty or unfinished lock is not a wrong try: Hệ Thống only reacts to a complete, wrong date.
    if (!date) { status.textContent = 'Hãy đặt thẻ vào đủ ba khe.'; return; }
    emit('final-submit', { date });
  });
  const status = element('p', 'r3-form-status');
  status.setAttribute('role', 'status');
  form.append(status);
  for (const type of ['click', 'pointerup']) form.addEventListener(type, () => { status.textContent = ''; });
  body.append(form);
  return body;
}

export function puzzlePanel(view, data, emit) {
  if (view === 'preparation') return preparationPanel(data, emit);
  if (view === 'cargo') return cargoPanel(data, emit);
  if (view === 'strategy') return strategyPanel(data, emit);
  if (view === 'opening') return openingPanel(data, emit);
  if (view === 'final') return finalPanel(data, emit);
  if (view === 'rewards') {
    const body = element('section');
    body.append(heading('Mật mã đã khôi phục', 'PHÒNG 3 · SỔ TIẾP VẬN'), tokenCards(data.tokens || []));
    return body;
  }
  return null;
}
