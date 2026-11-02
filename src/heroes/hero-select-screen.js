import {element, button, heading} from '../room-one/ui-elements.js';
import {HERO_IDS, HERO_PROFILES} from './hero-profiles.js';

/** First frame of a new journey: choose one companion for the full journey. */
export function heroSelectFrame(onChoose) {
  const section = element('section', 'campaign-story hero-select');
  const copy = element('div', 'campaign-story-copy');
  copy.append(heading('Chọn nhân vật của bạn', 'MỞ ĐẦU · HÀNH TRÌNH ĐIỆN BIÊN PHỦ'),
    element('p', '', 'Chọn Long hoặc Quang làm người đồng hành cùng bạn trong hành trình giải mật mã Điện Biên Phủ. Người bạn chọn sẽ đi cùng bạn suốt hành trình. Lựa chọn được giữ đến khi kết thúc lượt chơi; muốn đổi, hãy bắt đầu hành trình mới.'));
  const cards = element('div', 'hero-cards');
  cards.setAttribute('role', 'group'); cards.setAttribute('aria-label', 'Nhân vật');
  for (const id of HERO_IDS) {
    const hero = HERO_PROFILES[id];
    const card = button('', () => onChoose(id), 'hero-card');
    const face = element('img', 'hero-card-face'); face.src = hero.portrait; face.alt = hero.alt;
    card.append(face, element('strong', '', hero.name), element('span', '', hero.tagline));
    card.setAttribute('aria-label', `Chọn ${hero.name}. ${hero.tagline}`);
    cards.append(card);
  }
  copy.append(cards);
  section.append(copy);
  return section;
}
