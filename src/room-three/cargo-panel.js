import { element } from '../room-one/ui-elements.js';
import { CARGO_ITEMS } from './puzzle-data.js';
import { activity, choiceGroup, finishForm, checked, selected } from './puzzle-controls.js';
import { cargoBoard, matchesPayload, allPlaced } from './tactile-model.js';
import { tokenBoard } from './tactile-board.js';

const ALTS = {
  bicycle: 'Tranh tái hiện chiếc xe đạp thồ có khung chở nhiều kiện hàng buộc bằng dây.',
  porters: 'Tranh tái hiện đoàn dân công dùng đòn gánh vận chuyển hàng trên đường núi.',
  artillery: 'Tranh tái hiện bộ đội cùng kéo khẩu pháo bằng dây lên đường dốc.',
  rice: 'Tranh tái hiện các bao gạo dự trữ và gạo trong bao đang mở.',
  ammunition: 'Tranh tái hiện các hòm đạn và đạn dược dùng để tiếp tế chiến đấu.',
  engineers: 'Tranh tái hiện người làm đường dùng cuốc xẻng sửa tuyến vận chuyển miền núi.',
};

function pictureCard(item, index, tail) {
  const figure = element('figure', 'r3-cargo-card');
  const image = element('img');
  image.src = new URL(`../../assets/room-three/${item.id}.svg`, import.meta.url).href;
  image.alt = ALTS[item.id];
  image.width = 600; image.height = 400; image.loading = index < 2 ? 'eager' : 'lazy';
  const caption = element('figcaption');
  caption.append(element('span', 'r3-card-index', `TRANH ${String(index + 1).padStart(2, '0')}`), ...tail);
  figure.append(image, caption);
  return figure;
}

export function cargoPanel(data, emit) {
  const body = activity('cargo', 'Nối lại tuyến tiếp vận', 'Kéo từng chú thích lên bức tranh đúng với nó, rồi xem điều gì giúp hàng hóa vượt qua địa hình khó khăn. Cũng có thể bấm một chú thích rồi bấm khung dưới tranh.', data);
  body.append(element('p', 'r3-illustration-note', 'Sáu tranh minh họa tái hiện, không phải ảnh tư liệu.'));
  if (data.solved) {
    const gallery = element('div', 'r3-cargo-gallery');
    CARGO_ITEMS.forEach((item, index) => gallery.append(pictureCard(item, index, [element('strong', '', item.label), element('p', '', item.description)])));
    body.append(gallery, element('p', '', 'Xe đạp thồ chở được nhiều hàng trên tuyến vận chuyển khó khăn; dân công, thanh niên xung phong và nhân dân cùng bộ đội bảo đảm tiếp vận.'));
    return body;
  }
  const draft = data.draft || {};
  const form = element('form', 'r3-activity-form');
  // The board owns the tray and the six drop frames; each frame is moved under its picture (it stays inside the board root).
  const board = tokenBoard({ draft, key: 'matches', make: cargoBoard, trayLabel: 'Chú thích', className: 'r3-cargo-board',
    labels: Object.fromEntries(CARGO_ITEMS.map((item, index) => [item.id, `Chú thích tranh ${index + 1}`])) });
  const gallery = element('div', 'r3-cargo-gallery');
  CARGO_ITEMS.forEach((item, index) => gallery.append(pictureCard(item, index, [board.bins[item.id]])));
  board.root.append(gallery);
  form.append(board.root);
  choiceGroup(form, draft, 'reason', 'Xe đạp thồ có vai trò gì trên tuyến tiếp vận?', [
    ['terrain-load', 'Chở nhiều lương thực, hàng hóa trên tuyến đường và địa hình khó khăn.'],
    ['replace-all', 'Thay thế hoàn toàn mọi lực lượng vận chuyển khác.'],
    ['combat', 'Là vũ khí chính dùng để tiến công cứ điểm.'],
  ]);
  choiceGroup(form, draft, 'contributors', 'Ngoài bộ đội, những lực lượng nào góp sức vận chuyển? Chọn tất cả đáp án phù hợp.', [
    ['civilians', 'Dân công và nhân dân'], ['youth', 'Thanh niên xung phong'], ['enemy', 'Quân Pháp tổ chức tuyến tiếp vận này'],
  ], true);
  finishForm(form, body, 'Nối tuyến tiếp vận', 'cargo-submit', emit,
    () => ({ matches: matchesPayload(board.getState()), reason: selected(form, 'reason'), contributors: checked(form, 'contributors') }),
    () => (allPlaced(board.getState()) ? '' : 'Hãy gắn đủ sáu chú thích lên sáu bức tranh.'));
  return body;
}
