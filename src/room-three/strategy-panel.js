import { element } from '../room-one/ui-elements.js';
import { TELEGRAMS } from './puzzle-data.js';
import { activity, choiceGroup, finishForm, orderedCards, checked, selected } from './puzzle-controls.js';

export function strategyPanel(data, emit) {
  const body = activity('strategy', 'Hai bức điện, một quyết tâm', 'Dùng nút lên và xuống để khôi phục từng mật lệnh. Hai thẻ mang cùng một từ có thể đổi chỗ cho nhau.', data);
  if (data.solved) {
    const change = element('div', 'r3-doctrine-change');
    change.append(element('p', '', 'ĐÁNH NHANH, GIẢI QUYẾT NHANH'), element('span', '', '↓'), element('strong', '', 'ĐÁNH CHẮC, TIẾN CHẮC'));
    body.append(change, element('p', '', 'Sự thay đổi dựa trên đánh giá tình hình thực tế và tương quan lực lượng, cân nhắc thận trọng, đặt yêu cầu chắc thắng lên hàng đầu.'));
    return body;
  }
  const draft = data.draft || {};
  const form = element('form', 'r3-activity-form');
  const pair = element('div', 'r3-telegram-pair');
  const sequences = {};
  for (const [key, label] of [['initial', 'Mật lệnh ban đầu'], ['final', 'Phương châm sau điều chỉnh']]) {
    const telegram = element('section', 'r3-telegram');
    telegram.append(element('h3', '', label), element('p', 'r3-order-hint', 'Đọc từ trên xuống. Dùng ↑ ↓ để đổi vị trí.'));
    sequences[key] = orderedCards(TELEGRAMS[key], draft, key, label);
    telegram.append(sequences[key].list, sequences[key].status);
    pair.append(telegram);
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
  finishForm(form, body, 'Khôi phục hai mật lệnh', 'strategy-submit', emit, () => ({ initial: sequences.initial.value(), final: sequences.final.value(), reason: selected(form, 'reason'), insights: checked(form, 'insights') }));
  return body;
}
