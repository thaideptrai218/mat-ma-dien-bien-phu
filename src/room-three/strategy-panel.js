import { element } from '../room-one/ui-elements.js';
import { choiceGroup, activity, finishForm, checked, selected } from './puzzle-controls.js';
import { TELEGRAM_KEYS, telegramBoard, telegramPayload, allPlaced } from './tactile-model.js';
import { tokenBoard, boardSection } from './tactile-board.js';

const TELEGRAM_TITLES = { initial: 'Mật lệnh ban đầu', final: 'Phương châm sau điều chỉnh' };

export function strategyPanel(data, emit) {
  const body = activity('strategy', 'Hai bức điện, một quyết tâm', 'Kéo từng từ vào khe để khôi phục hai mật lệnh, đọc từ trái sang phải. Hai thẻ mang cùng một từ có thể đổi chỗ cho nhau.', data);
  if (data.solved) {
    const change = element('div', 'r3-doctrine-change');
    change.append(element('p', '', 'ĐÁNH NHANH, GIẢI QUYẾT NHANH'), element('span', '', '↓'), element('strong', '', 'ĐÁNH CHẮC, TIẾN CHẮC'));
    body.append(change, element('p', '', 'Sự thay đổi dựa trên đánh giá tình hình thực tế và tương quan lực lượng, cân nhắc thận trọng, đặt yêu cầu chắc thắng lên hàng đầu.'));
    return body;
  }
  const draft = data.draft || {};
  const form = element('form', 'r3-activity-form');
  const pair = element('div', 'r3-telegram-pair');
  const boards = {};
  for (const key of TELEGRAM_KEYS) {
    boards[key] = tokenBoard({ draft, key, make: telegramBoard(key), trayLabel: 'Các từ trong bức điện', className: 'r3-word-board',
      labels: Object.fromEntries([1, 2, 3, 4].map(n => [`slot-${n}`, `Từ thứ ${n}`])) });
    pair.append(boardSection(TELEGRAM_TITLES[key], 'Đọc từ trái sang phải.', boards[key]));
  }
  form.append(pair);
  choiceGroup(form, draft, 'reason', 'Vì sao phải điều chỉnh phương châm?', [
    ['lack-food', 'A · Chỉ vì thiếu lương thực.'],
    ['sure-victory', 'B · Bảo đảm chắc thắng, phù hợp tình hình thực tế và tương quan lực lượng.'],
    ['enemy-left', 'C · Vì quân Pháp đã rút khỏi Điện Biên Phủ.'],
    ['cancelled', 'D · Vì quyết định hủy chiến dịch.'],
  ]);
  choiceGroup(form, draft, 'insights', 'Sự điều chỉnh cho thấy điều gì? Chọn tất cả đáp án phù hợp.', [
    ['assess-reality', 'Đánh giá tình hình thực tế.'], ['careful-command', 'Chỉ huy thận trọng, cân nhắc điều kiện chiến đấu.'],
    ['victory-first', 'Đặt yêu cầu chắc thắng lên hàng đầu.'], ['rigid', 'Giữ nguyên mọi dự kiến dù điều kiện thay đổi.'], ['cancel', 'Từ bỏ mục tiêu của chiến dịch.'],
  ], true);
  finishForm(form, body, 'Khôi phục hai mật lệnh', 'strategy-submit', emit,
    () => ({ initial: telegramPayload(boards.initial.getState()), final: telegramPayload(boards.final.getState()), reason: selected(form, 'reason'), insights: checked(form, 'insights') }),
    () => (TELEGRAM_KEYS.every(key => allPlaced(boards[key].getState())) ? '' : 'Hãy điền đủ cả hai bức điện.'));
  return body;
}
