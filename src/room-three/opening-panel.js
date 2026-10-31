import { element } from '../room-one/ui-elements.js';
import { OPENING_EVENTS } from './puzzle-data.js';
import { activity, choiceGroup, selectField, finishForm, checked, selected } from './puzzle-controls.js';
import { newsOrderBoard, datesBoard, newsOrderPayload, datesPayload, allPlaced } from './tactile-model.js';
import { tokenBoard, boardSection } from './tactile-board.js';

export function openingPanel(data, emit) {
  const body = activity('opening', 'Điện báo từ cửa ngõ phía Bắc', 'Kéo ba tin vào dòng thời gian, kéo mỗi ngày lên tin của nó, rồi nhận ra ý nghĩa của đợt mở màn.', data);
  if (data.solved) {
    const list = element('ol', 'r3-fact-list');
    for (const event of OPENING_EVENTS) list.append(element('li', '', `${event.date} · ${event.text}`));
    body.append(list, element('p', '', 'Him Lam là mục tiêu mở màn. Quân Pháp ở Bản Kéo đầu hàng ngày 17/3. Đợt tiến công phá tuyến phòng ngự Bắc và Đông Bắc, mở khu vực kiểm soát và tạo tiền đề cho những đợt tiếp theo.'));
    return body;
  }
  const draft = data.draft || {};
  const form = element('form', 'r3-activity-form');
  const order = tokenBoard({ draft, key: 'order', make: newsOrderBoard, trayLabel: 'Các tin điện báo', className: 'r3-board-wide',
    labels: { 'slot-1': 'Tin đến trước nhất', 'slot-2': 'Tin ở giữa', 'slot-3': 'Tin đến sau cùng' } });
  const dates = tokenBoard({ draft, key: 'dates', make: datesBoard, trayLabel: 'Các ngày', className: 'r3-board-wide',
    labels: Object.fromEntries(OPENING_EVENTS.map(event => [event.id, event.text])) });
  form.append(boardSection('01 · Khôi phục thứ tự điện báo', 'Tin đến trước đặt ở khe đầu.', order),
    boardSection('02 · Đối chiếu ngày diễn ra', 'Kéo mỗi ngày vào tin tương ứng.', dates));
  const places = [['him-lam', 'Him Lam'], ['doc-lap', 'Độc Lập'], ['ban-keo', 'Bản Kéo']];
  form.append(selectField('Mục tiêu mở màn chiến dịch là đâu?', 'target', places, draft).label, selectField('Quân Pháp ở đâu đầu hàng ngày 17/3?', 'surrender', places, draft).label);
  choiceGroup(form, draft, 'implications', 'Đợt mở màn có ý nghĩa gì? Chọn tất cả đáp án phù hợp.', [
    ['break-north', 'Phá hệ thống phòng ngự phía Bắc và Đông Bắc.'],
    ['expand-control', 'Mở khu vực kiểm soát, mở đường xuống lòng chảo và Mường Thanh.'],
    ['next-offensives', 'Tạo tiền đề cho các đợt tiến công tiếp theo.'],
    ['campaign-complete', 'Toàn bộ chiến dịch đã kết thúc ngày 17/3.'],
    ['peace-signed', 'Hiệp định hòa bình được ký ngay ngày 17/3.'],
  ], true);
  finishForm(form, body, 'Xác nhận điện báo', 'opening-submit', emit,
    () => ({ order: newsOrderPayload(order.getState()), dates: datesPayload(dates.getState()), target: selected(form, 'target'), surrender: selected(form, 'surrender'), implications: checked(form, 'implications') }),
    () => (allPlaced(order.getState()) && allPlaced(dates.getState()) ? '' : 'Hãy đặt đủ ba tin và ba ngày.'));
  return body;
}
