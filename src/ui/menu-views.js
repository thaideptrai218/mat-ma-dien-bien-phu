import portraitUrl from '../../assets/images/quang-portrait.png';
import emblemUrl from '../../assets/images/game-emblem.png';
import { element, button, paragraph, actions } from './dom-elements.js';

export function mainMenuContent({ canContinue, notice, onStart, onContinue, onSources }) {
  const copy = element('div', { className: 'cover-copy' }, element('span', { className: 'eyebrow' }, 'MỘT HÀNH TRÌNH QUA NHỮNG DẤU VẾT'), element('div', { className: 'cover-wordmark' }, element('span', {}, 'MẬT MÃ'), 'ĐIỆN BIÊN PHỦ'), paragraph('Một trang sổ trong bảo tàng. Bốn căn phòng ký ức. Theo chân Quang tìm manh mối, đọc những câu chuyện và ghép lại điều lịch sử để lại.'), paragraph('Khám phá bằng WASD / phím mũi tên. Đọc và giải đố bằng chuột hoặc bàn phím.', 'cover-controls'));
  if (notice) copy.append(paragraph(notice, 'feedback hint'));
  copy.append(actions(button(canContinue ? 'Bắt đầu lại' : 'Bắt đầu hành trình →', onStart, canContinue ? 'quiet-button' : 'primary-button', { id: 'new-game-button' }), canContinue ? button('Tiếp tục hành trình →', onContinue, 'primary-button', { id: 'continue-button' }) : null), button('Tư liệu & cách kể ↗', onSources, 'text-button'));
  const art = element('div', { className: 'cover-art' }, element('img', { src: emblemUrl, className: 'cover-emblem', alt: '', width: 130, height: 130 }), element('img', { src: portraitUrl, className: 'cover-portrait', alt: 'Quang, nhân vật hư cấu với áo màu kem và khăn đỏ', width: 280, height: 390 }));
  return element('div', { className: 'cover-layout' }, copy, art);
}

export function endingContent({ onNotebook, onAgain }) {
  return element('div', { className: 'ending-layout' }, element('img', { src: portraitUrl, alt: 'Quang trở về trước trang sổ', width: 180, height: 245 }), element('div', {}, element('span', { className: 'eyebrow' }, 'BỐN KÝ ỨC · MỘT ĐIỀU MANG VỀ'), element('h3', {}, 'Lịch sử ở lại trong cách mình sống.'), paragraph('Quang đã trở về bảo tàng. Những manh mối vẫn còn trong sổ tay, cùng lòng biết ơn và những câu hỏi để tìm hiểu tiếp.'), paragraph('Trân trọng hòa bình từ việc học, lắng nghe và đối xử với nhau hôm nay.'), actions(button('Mở lại sổ tay', onNotebook), button('Bắt đầu hành trình mới', onAgain, 'primary-button'))));
}
