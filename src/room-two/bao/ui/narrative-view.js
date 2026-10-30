import portraitUrl from '../../../../assets/images/quang-portrait.png';
import emblemUrl from '../../../../assets/images/game-emblem.png';
import { beats, clues, chapters } from '../content/story-data.js';
import { element, button, paragraph } from '../../../ui/dom-elements.js';

const speakers = {
  quang: { name: 'QUANG', portrait: portraitUrl, alt: 'Quang, nhân vật hư cấu' },
  system: { name: 'HỆ THỐNG', portrait: emblemUrl, alt: 'Giọng nói của căn phòng ký ức' },
};

export class NarrativeView {
  constructor({ dialog, onIntent, getState }) {
    this.dialog = dialog;
    this.onIntent = onIntent;
    this.getState = getState;
    this.active = null;
    this.wholeScene = false;
  }

  show(beatId, { clueId } = {}) {
    const beat = beats[beatId];
    if (!beat?.lines?.length) return;
    this.active = { beatId, clueId, lineIndex: 0, lastLine: beat.lines.length === 1 };
    this.wholeScene = false;
    this.frame = element('div', { className: 'vn-layout' });
    this.portrait = element('img', { src: portraitUrl, alt: speakers.quang.alt, width: 180, height: 235 });
    const portrait = element('div', { className: 'vn-portrait' }, this.portrait);
    this.copy = element('div', { className: 'vn-copy' });
    this.frame.append(portrait, this.copy);
    this.dialog.show({ title: clueId ? clues[clueId].title : chapters[beat.chapterId].title, kicker: `${chapters[beat.chapterId].kicker} · LỜI QUANG`, content: this.frame, variant: 'vn-dialog' });
    this.renderLine(false);
  }

  renderLine(focusNext = true) {
    const beat = beats[this.active.beatId];
    this.active.lastLine = this.active.lineIndex === beat.lines.length - 1;
    const line = beat.lines[this.active.lineIndex];
    const alreadyCollected = this.active.clueId && this.getState().collectedClueIds.includes(this.active.clueId);
    const voice = speakers[line.speakerId] || speakers.quang;
    this.portrait.src = voice.portrait; this.portrait.alt = voice.alt;
    const speaker = element('div', { className: 'vn-speaker' }, element('strong', {}, voice.name), element('span', {}, `${this.active.lineIndex + 1} / ${beat.lines.length}`));
    const text = element('div', { className: 'vn-text', id: 'narrative-text' });
    for (const item of this.wholeScene ? beat.lines : [line]) text.append(paragraph(item.text));
    const previous = button('← Trước', () => {
      this.wholeScene = false; this.active.lineIndex--; this.renderLine();
    }, 'quiet-button', { disabled: this.active.lineIndex === 0 });
    const all = button('Đọc toàn cảnh', () => {
      this.wholeScene = true; this.active.lineIndex = beat.lines.length - 1; this.renderLine();
    });
    const next = button(this.active.lastLine ? alreadyCollected ? 'Trở lại bản đồ →' : this.active.clueId ? 'Ghi manh mối ✓' : 'Hoàn tất lời kể →' : 'Tiếp lời →', () => {
      if (!this.active.lastLine) { this.active.lineIndex++; this.renderLine(); return; }
      if (alreadyCollected) { this.dialog.close(); return; }
      // Composition validates this live final-line cursor before closing or replacing the view.
      const intent = this.active.clueId ? { type: 'collect-clue', clueId: this.active.clueId } : { type: 'complete-beat', beatId: this.active.beatId };
      this.onIntent(intent);
    }, 'primary-button', { id: 'narrative-next' });
    this.copy.replaceChildren(speaker, text, paragraph(line.fictional ? 'Lời Quang và hiện vật kể chuyện được biên soạn hư cấu; dữ kiện lịch sử có nguồn trong sổ tay.' : 'Đối chiếu tư liệu lịch sử trong sổ tay.', 'vn-fiction'), element('div', { className: 'vn-controls' }, previous, all, next), paragraph('Đọc theo nhịp của bạn · Esc tạm rời lời kể · Chỉ nút ghi mới nhận manh mối', 'vn-help'));
    if (focusNext) next.focus({ preventScroll: true });
  }

  getActive() { return this.active ? { ...this.active } : null; }
  clear() { this.active = null; this.wholeScene = false; }
}
