import { element } from '../room-one/ui-elements.js';
import { CARGO_ITEMS } from './puzzle-data.js';
import { activity, choiceGroup, selectField, finishForm, checked, selected } from './puzzle-controls.js';

const ALTS = {
  bicycle: 'Tranh tái hiện chiếc xe đạp thồ có khung chở nhiều kiện hàng buộc bằng dây.',
  porters: 'Tranh tái hiện đoàn dân công dùng đòn gánh vận chuyển hàng trên đường núi.',
  artillery: 'Tranh tái hiện bộ đội cùng kéo khẩu pháo bằng dây lên đường dốc.',
  rice: 'Tranh tái hiện các bao gạo dự trữ và gạo trong bao đang mở.',
  ammunition: 'Tranh tái hiện các hòm đạn và đạn dược dùng để tiếp tế chiến đấu.',
  engineers: 'Tranh tái hiện người làm đường dùng cuốc xẻng sửa tuyến vận chuyển miền núi.',
};

export function cargoPanel(data, emit) {
  const body = activity('cargo', 'Nối lại tuyến tiếp vận', 'Đối chiếu từng cảnh với chú thích đúng, rồi xem điều gì giúp hàng hóa vượt qua địa hình khó khăn.', data);
  body.append(element('p', 'r3-illustration-note', 'Sáu tranh minh họa tái hiện, không phải ảnh tư liệu.'));
  const draft = data.draft || {};
  draft.matches ||= {};
  const form = element('form', 'r3-activity-form');
  const gallery = element('div', 'r3-cargo-gallery');
  const choices = [...CARGO_ITEMS].reverse().map(item => [item.id, item.label]);
  for (const [index, item] of CARGO_ITEMS.entries()) {
    const figure = element('figure', 'r3-cargo-card');
    const image = element('img');
    image.src = new URL(`../../assets/room-three/${item.id}.svg`, import.meta.url).href;
    image.alt = ALTS[item.id];
    image.width = 600; image.height = 400; image.loading = index < 2 ? 'eager' : 'lazy';
    const caption = element('figcaption');
    caption.append(element('span', 'r3-card-index', `TRANH ${String(index + 1).padStart(2, '0')}`));
    if (data.solved) caption.append(element('strong', '', item.label), element('p', '', item.description));
    else caption.append(selectField(`Chú thích tranh ${index + 1}`, `match-${item.id}`, choices, draft.matches, item.id).label);
    figure.append(image, caption); gallery.append(figure);
  }
  form.append(gallery);
  if (data.solved) {
    body.append(gallery, element('p', '', 'Xe đạp thồ chở được nhiều hàng trên tuyến vận chuyển khó khăn; dân công, thanh niên xung phong và nhân dân cùng bộ đội bảo đảm tiếp vận.'));
    return body;
  }
  choiceGroup(form, draft, 'reason', 'Xe đạp thồ có vai trò gì trên tuyến tiếp vận?', [
    ['terrain-load', 'Chở nhiều lương thực, hàng hóa trên tuyến đường và địa hình khó khăn.'],
    ['replace-all', 'Thay thế hoàn toàn mọi lực lượng vận chuyển khác.'],
    ['combat', 'Là vũ khí chính dùng để tiến công cứ điểm.'],
  ]);
  choiceGroup(form, draft, 'contributors', 'Ngoài bộ đội, những lực lượng nào góp sức vận chuyển? Chọn tất cả đáp án phù hợp.', [
    ['civilians', 'Dân công và nhân dân'], ['youth', 'Thanh niên xung phong'], ['enemy', 'Quân Pháp tổ chức tuyến tiếp vận này'],
  ], true);
  finishForm(form, body, 'Nối tuyến tiếp vận', 'cargo-submit', emit, () => ({ matches: { ...draft.matches }, reason: selected(form, 'reason'), contributors: checked(form, 'contributors') }));
  return body;
}
