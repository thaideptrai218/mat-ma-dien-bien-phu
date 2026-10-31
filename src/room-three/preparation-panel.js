import { element } from '../room-one/ui-elements.js';
import { PREPARATION_CARDS } from './puzzle-data.js';
import { activity, choiceGroup, finishForm, selected } from './puzzle-controls.js';
import { PREPARATION_GROUPS, preparationCardsBoard, suppliesBoard, groupsPayload, suppliesPayload, allPlaced } from './tactile-model.js';
import { tokenBoard, boardSection } from './tactile-board.js';

export function preparationPanel(data, emit) {
  const body = activity('preparation', 'Khôi phục hồ sơ chuẩn bị', 'Kéo năm thẻ vào hai mốc và giai đoạn ở giữa. Ba công việc chuẩn bị diễn ra đan xen, không cần xếp thứ tự với nhau. Cũng có thể bấm một thẻ rồi bấm ô đích.', data);
  if (data.solved) {
    const list = element('dl', 'r3-fact-list');
    for (const [group, title] of PREPARATION_GROUPS) {
      list.append(element('dt', '', title));
      for (const card of PREPARATION_CARDS.filter(item => item.group === group)) list.append(element('dd', '', card.text));
    }
    body.append(list, element('p', '', 'Lương thực, vũ khí, đạn dược và thuốc men sẵn sàng để duy trì chiến đấu lâu dài.'));
    return body;
  }
  const draft = data.draft || {};
  const form = element('form', 'r3-activity-form');
  const cards = tokenBoard({ draft, key: 'cards', make: preparationCardsBoard, trayLabel: 'Thẻ hồ sơ',
    labels: Object.fromEntries(PREPARATION_GROUPS), className: 'r3-board-wide' });
  const supplies = tokenBoard({ draft, key: 'supplies', make: suppliesBoard, trayLabel: 'Vật tư trên bãi', labels: { depot: 'Kho hậu cần' } });
  form.append(boardSection('01 · Đặt các thẻ lên dòng thời gian', '', cards),
    boardSection('02 · Vật tư nào cần chuẩn bị?', 'Kéo vào kho những thứ chiến đấu lâu dài thật sự cần.', supplies));
  choiceGroup(form, draft, 'purpose', 'Vì sao hậu cần phải sẵn sàng trước khi mở màn?', [
    ['sustain', 'Bảo đảm sức người và vật tư để duy trì chiến đấu lâu dài.'],
    ['ceremony', 'Chỉ để chuẩn bị một buổi lễ.'],
    ['end-war', 'Vì chiến tranh đã kết thúc trước khi chiến dịch bắt đầu.'],
  ]);
  finishForm(form, body, 'Khôi phục hồ sơ', 'preparation-submit', emit,
    () => ({ groups: groupsPayload(cards.getState()), supplies: suppliesPayload(supplies.getState()), purpose: selected(form, 'purpose') }),
    () => (!allPlaced(cards.getState()) ? 'Hãy đặt đủ năm thẻ vào các mốc.' : ''));
  return body;
}
