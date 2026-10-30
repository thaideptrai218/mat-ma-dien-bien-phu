import { element } from '../room-one/ui-elements.js';
import { OPENING_EVENTS } from './puzzle-data.js';
import { activity, choiceGroup, selectField, finishForm, orderedCards, checked, selected } from './puzzle-controls.js';

const DATES = [['13/03/1954', '13/3/1954'], ['15/03/1954', '15/3/1954'], ['17/03/1954', '17/3/1954']];

export function openingPanel(data, emit) {
  const body = activity('opening', 'Điện báo từ cửa ngõ phía Bắc', 'Khôi phục trình tự ba tin chiến sự, đối chiếu ngày và nhận ra ý nghĩa của đợt mở màn.', data);
  if (data.solved) {
    const list = element('ol', 'r3-fact-list');
    for (const event of OPENING_EVENTS) list.append(element('li', '', `${event.date} · ${event.text}`));
    body.append(list, element('p', '', 'Him Lam là mục tiêu mở màn. Quân Pháp ở Bản Kéo đầu hàng ngày 17/3. Đợt tiến công phá tuyến phòng ngự Bắc và Đông Bắc, mở khu vực kiểm soát và tạo tiền đề cho những đợt tiếp theo.'));
    return body;
  }
  const draft = data.draft || {};
  draft.dates ||= {};
  const form = element('form', 'r3-activity-form');
  form.append(element('h3', 'r3-section-title', '01 · Khôi phục thứ tự điện báo'), element('p', 'r3-order-hint', 'Đọc từ trên xuống; dùng nút ↑ ↓ để sắp xếp.'));
  const ordering = orderedCards(OPENING_EVENTS, draft, 'order', 'Trình tự ba sự kiện mở màn');
  form.append(ordering.list, ordering.status);
  const dateFields = element('div', 'r3-date-matches');
  dateFields.append(element('h3', 'r3-section-title', '02 · Đối chiếu ngày diễn ra'));
  for (const event of [...OPENING_EVENTS].reverse()) dateFields.append(selectField(event.text, `date-${event.id}`, DATES, draft.dates, event.id).label);
  form.append(dateFields);
  const places = [['him-lam', 'Him Lam'], ['doc-lap', 'Độc Lập'], ['ban-keo', 'Bản Kéo']];
  form.append(selectField('Mục tiêu mở màn chiến dịch là đâu?', 'target', places, draft).label, selectField('Quân Pháp ở đâu đầu hàng ngày 17/3?', 'surrender', places, draft).label);
  choiceGroup(form, draft, 'implications', 'Đợt mở màn có ý nghĩa gì? Chọn tất cả đáp án phù hợp.', [
    ['break-north', 'Phá hệ thống phòng ngự phía Bắc và Đông Bắc.'],
    ['expand-control', 'Mở khu vực kiểm soát, mở đường xuống lòng chảo và Mường Thanh.'],
    ['next-offensives', 'Tạo tiền đề cho các đợt tiến công tiếp theo.'],
    ['campaign-complete', 'Toàn bộ chiến dịch đã kết thúc ngày 17/3.'],
    ['peace-signed', 'Hiệp định hòa bình được ký ngay ngày 17/3.'],
  ], true);
  finishForm(form, body, 'Xác nhận điện báo', 'opening-submit', emit, () => ({ order: ordering.value(), dates: { ...draft.dates }, target: selected(form, 'target'), surrender: selected(form, 'surrender'), implications: checked(form, 'implications') }));
  return body;
}
