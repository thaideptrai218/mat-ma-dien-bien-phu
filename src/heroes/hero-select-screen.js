import {element, button, heading} from '../room-one/ui-elements.js';
import {HERO_IDS, HERO_PROFILES} from './hero-profiles.js';

/** First frame of a new journey: pick who walks into the museum. The choice is saved and locked for the run. */
export function heroSelectFrame(onChoose) {
  const section = element('section', 'campaign-story hero-select');
  const copy = element('div', 'campaign-story-copy');
  copy.append(heading('Chọn nhân vật của bạn', 'MỞ ĐẦU · HÀNH TRÌNH ĐIỆN BIÊN PHỦ'),
    element('p', '', 'Hai nhân vật cùng bước vào một hành trình, nhưng mỗi người đến với lịch sử bằng một tâm thế riêng. Lựa chọn được giữ suốt lượt chơi; muốn đổi, hãy bắt đầu hành trình mới.'));
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
