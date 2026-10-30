import { chapterOrder, chapters, clues, beats, sources } from '../content/story-data.js';
import { element, button, paragraph, actions } from './dom-elements.js';

export class ArchiveView {
  constructor({ dialog, getState, onIntent, showBeat, showPuzzle }) {
    Object.assign(this, { dialog, getState, onIntent, showBeat, showPuzzle });
  }

  notebook() {
    const state = this.getState();
    const content = element('div', {}, paragraph('Những điều đã ghi, những câu chuyện còn dang dở. Chọn Đọc lời Quang để trở lại manh mối đã khám phá.'));
    const available = chapterOrder.filter(id => chapterOrder.indexOf(id) <= chapterOrder.indexOf(state.chapterId));
    for (const id of available) {
      const chapter = chapters[id];
      if (!chapter.clueIds.length) continue;
      const section = element('section', { className: 'notebook-chapter' }, element('h3', {}, chapter.kicker));
      const list = element('ul', { className: 'notebook-entries' });
      for (const clueId of chapter.clueIds) {
        const clue = clues[clueId], discovered = state.discoveredClueIds.includes(clueId), collected = state.collectedClueIds.includes(clueId);
        const card = element('li', { className: `notebook-entry ${collected ? 'collected' : ''}` }, element('span', { className: 'entry-state' }, collected ? '✓ ĐÃ GHI VÀO SỔ' : discovered ? '◇ ĐÃ THẤY · CHƯA GHI' : '◇ CHƯA KHÁM PHÁ'), element('h4', {}, clue.title), paragraph(collected ? clue.body : discovered ? 'Lời kể này còn dang dở. Đọc lại và ghi ở câu cuối để giữ manh mối.' : clue.direction || 'Quan sát các vật có dấu sáng trong phòng.'));
        if (collected) card.append(paragraph(clue.fictional ? 'Mẩu kể chuyện hư cấu / quy ước học tập.' : 'Dữ kiện lược thuật từ tư liệu.', 'entry-note'));
        if (discovered) card.append(button('Đọc lời Quang ↗', () => this.onIntent({ type: 'read-clue', clueId }), 'text-button'));
        if (collected) for (const sourceId of clue.sourceIds) {
          const source = sources[sourceId];
          if (source) card.append(element('a', { href: source.url, target: '_blank', rel: 'noopener noreferrer', className: 'source-link' }, source.title, ' ↗'));
        }
        list.append(card);
      }
      section.append(list); content.append(section);
    }
    if (!content.querySelector('.notebook-entry')) content.append(paragraph('Trang sổ còn mới. Bắt đầu bằng câu chuyện ở bảo tàng, rồi tìm những dấu vết trong hầm.', 'empty-note'));
    content.append(actions(button('Lời đã đọc', () => this.backlog()), button('Tư liệu', () => this.sourcePanel()), button(state.chapterId === 'peace' ? 'Cánh cửa hòa bình →' : 'Mở hồ sơ →', () => this.showPuzzle(), 'primary-button', { disabled: ['museum', 'ending'].includes(state.chapterId) })));
    this.dialog.show({ title: 'Sổ tay ký ức', kicker: 'TƯ LIỆU CỦA QUANG', content });
  }

  backlog() {
    const state = this.getState(), content = element('div');
    const visitedIntros = chapterOrder.slice(0, chapterOrder.indexOf(state.chapterId) + 1).map(id => chapters[id].introBeatId);
    const records = Object.values(beats).filter(beat => visitedIntros.includes(beat.id) || state.completedBeatIds.includes(beat.id) || state.discoveredClueIds.some(id => clues[id]?.beatId === beat.id));
    for (const beat of records) {
      const clue = Object.values(clues).find(item => item.beatId === beat.id);
      const completed = state.completedBeatIds.includes(beat.id);
      content.append(element('section', { className: 'history-entry' }, element('span', { className: 'entry-state' }, completed ? '✓ ĐÃ ĐỌC TRỌN' : '◇ LỜI KỂ DANG DỞ'), element('h3', {}, clue?.title || chapters[beat.chapterId].title), paragraph(chapters[beat.chapterId].kicker, 'entry-note'), button('Mở lại lời kể ↗', () => clue ? this.onIntent({ type: 'read-clue', clueId: clue.id }) : this.showBeat(beat.id), 'text-button')));
    }
    if (!records.length) content.append(paragraph('Chưa có lời kể trong sổ. Những câu chuyện sẽ ở lại đây khi bạn khám phá và đọc cùng Quang.'));
    content.append(paragraph('Quang và lời tự sự là sáng tác cho trò chơi, không phải lời chứng lịch sử.', 'dialog-note'));
    this.dialog.show({ title: 'Những lời còn lại', kicker: 'LỊCH SỬ LỜI KỂ', content });
  }

  sourcePanel({ onBack } = {}) {
    const content = element('div', {}, paragraph('Cốt truyện hư cấu giúp kết nối các dữ kiện lịch sử. Quang, các mảnh giấy, điện báo và kiến trúc phòng là sáng tạo cho trò chơi, không phải lời chứng hoặc bản sao hiện vật.'), paragraph('Sơ đồ dùng các ô quy ước, không theo tỷ lệ và không thể hiện một tuyến tiến công duy nhất. Thắng lợi Him Lam là trận mở màn, khác với chiến thắng toàn chiến dịch ngày 7/5/1954.'));
    for (const source of Object.values(sources)) content.append(element('p', {}, element('a', { href: source.url, target: '_blank', rel: 'noopener noreferrer' }, source.title, ' ↗')));
    content.append(paragraph('Chân dung Quang và biểu trưng là minh họa mới. Bạn có thể mở tư liệu gốc để tiếp tục tìm hiểu ngoài hành trình này.', 'dialog-note'));
    if (onBack) content.append(actions(button('Trở lại trang đầu', onBack, 'primary-button')));
    this.dialog.show({ title: 'Những trang để đọc tiếp', kicker: 'TƯ LIỆU & CÁCH KỂ', content, dismissible: !onBack });
  }
}
