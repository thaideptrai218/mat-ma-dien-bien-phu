import { element } from '../room-one/ui-elements.js';
import { PREPARATION_CARDS } from './puzzle-data.js';
import { activity, choiceGroup, selectField, finishForm, checked, selected } from './puzzle-controls.js';

const GROUPS = [['decision', 'Mốc đầu · 6/12/1953'], ['preparation', 'Giai đoạn chuẩn bị · các việc đan xen'], ['opening', 'Mốc mở màn · 13/3/1954']];

export function preparationPanel(data, emit) {
  const body = activity('preparation', 'Khôi phục hồ sơ chuẩn bị', 'Đặt năm thẻ vào hai mốc và giai đoạn ở giữa. Ba công việc chuẩn bị diễn ra đan xen, không cần xếp thứ tự với nhau.', data);
  if (data.solved) {
    const list = element('dl', 'r3-fact-list');
    for (const [group, title] of GROUPS) {
      list.append(element('dt', '', title));
      for (const card of PREPARATION_CARDS.filter(item => item.group === group)) list.append(element('dd', '', card.text));
    }
    body.append(list, element('p', '', 'Lương thực, vũ khí, đạn dược và thuốc men sẵn sàng để duy trì chiến đấu lâu dài.'));
    return body;
  }
  const draft = data.draft || {};
  draft.groups ||= {};
  const form = element('form', 'r3-activity-form');
  const timeline = element('div', 'r3-timeline');
  for (const [index, [, text]] of GROUPS.entries()) {
    const stop = element('div', 'r3-timeline-stop');
    stop.append(element('span', '', String(index + 1).padStart(2, '0')), element('strong', '', text));
    timeline.append(stop);
  }
  form.append(timeline);
  const cards = element('div', 'r3-preparation-cards');
  for (const [index, card] of PREPARATION_CARDS.entries()) {
    const row = element('div', 'r3-preparation-card');
    const field = selectField(card.text, `group-${card.id}`, GROUPS, draft.groups, card.id);
    row.append(element('span', 'r3-card-index', `THẺ ${String(index + 1).padStart(2, '0')}`), field.label);
    cards.append(row);
  }
  form.append(cards);
  choiceGroup(form, draft, 'supplies', 'Những vật tư nào cần chuẩn bị? Chọn tất cả đáp án phù hợp.', [
    ['food', 'Lương thực'], ['weapons', 'Vũ khí'], ['ammunition', 'Đạn dược'], ['medical', 'Thuốc men'],
  ], true);
  choiceGroup(form, draft, 'purpose', 'Vì sao hậu cần phải sẵn sàng trước khi mở màn?', [
    ['sustain', 'Bảo đảm sức người và vật tư để duy trì chiến đấu lâu dài.'],
    ['ceremony', 'Chỉ để chuẩn bị một buổi lễ.'],
    ['end-war', 'Vì chiến tranh đã kết thúc trước khi chiến dịch bắt đầu.'],
  ]);
  finishForm(form, body, 'Khôi phục hồ sơ', 'preparation-submit', emit, () => ({ groups: { ...draft.groups }, supplies: checked(form, 'supplies'), purpose: selected(form, 'purpose') }));
  return body;
}
