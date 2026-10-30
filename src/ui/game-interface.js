import emblemUrl from '../../assets/images/game-emblem.png';
import { chapters, clues, puzzles, roomOrder } from '../content/story-data.js';
import { currentPuzzleId } from '../core/game-rules.js';
import { DialogController } from './dialog-controller.js';
import { NarrativeView } from './narrative-view.js';
import { PuzzleView } from './puzzle-view.js';
import { ArchiveView } from './archive-view.js';
import { mainMenuContent, endingContent } from './menu-views.js';
import { element, button, paragraph, field, actions } from './dom-elements.js';

export class GameInterface {
  constructor({ getState, onIntent, onModalChange, getAudioState = () => ({}) }) {
    Object.assign(this, { getState, onIntent, getAudioState });
    this.abort = new AbortController(); this.toastTimer = null; this.nearby = null;
    this.dialog = new DialogController({ onModalChange, onClose: () => this.narrative.clear() });
    this.narrative = new NarrativeView({ dialog: this.dialog, onIntent, getState });
    this.puzzle = new PuzzleView({ dialog: this.dialog, getState, onIntent });
    this.archive = new ArchiveView({ dialog: this.dialog, getState, onIntent, showBeat: id => this.showNarrative(id), showPuzzle: id => this.showPuzzle(id) });
    document.querySelector('[data-brand-emblem]').src = emblemUrl;
    const progress = document.querySelector('#chapter-progress');
    roomOrder.forEach((id, index) => progress.append(element('li', { dataset: { chapterId: id } }, element('span', {}, String(index + 1).padStart(2, '0')), element('b', {}, ['Him Lam', 'Bàn cờ', 'Điện báo', 'Hòa bình'][index]))));
    document.addEventListener('click', event => {
      const control = event.target.closest('[data-ui-action]'); if (!control) return;
      const routes = { close: () => { if (this.dialog.dismissible) this.close(); }, settings: () => this.showSettings(), notebook: () => this.showNotebook(), puzzle: () => this.showPuzzle(), sources: () => this.showSources(), backlog: () => this.showBacklog(), interact: () => onIntent({ type: 'interact' }), 'focus-game': () => onIntent({ type: 'focus-game' }), 'audio-toggle': () => onIntent({ type: 'audio-toggle' }) };
      routes[control.dataset.uiAction]?.();
    }, { signal: this.abort.signal });
    document.addEventListener('keydown', event => {
      if (this.isOpen() || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.target.isContentEditable || /INPUT|TEXTAREA|SELECT|BUTTON/.test(event.target.tagName)) return;
      if (!document.querySelector('#game-host').contains(document.activeElement) && document.activeElement !== document.querySelector('#game-host')) return;
      if (event.key.toLowerCase() === 'n') { event.preventDefault(); this.showNotebook(); }
      if (event.key === 'Escape') { event.preventDefault(); this.showSettings(); }
    }, { signal: this.abort.signal });
    document.addEventListener('game-open-notebook', () => this.showNotebook(), { signal: this.abort.signal });
  }

  render(state, nearby, audioState = this.getAudioState()) {
    this.nearby = nearby;
    const chapter = chapters[state.chapterId]; if (!chapter) return;
    document.querySelector('#chapter-kicker').textContent = chapter.kicker;
    document.querySelector('#chapter-title').textContent = chapter.title;
    const steps = chapter.puzzleIds, step = currentPuzzleId(state);
    document.querySelector('#chapter-goal').textContent = state.completedRoomIds.includes(state.chapterId) ? 'Hồ sơ đã hoàn tất. Đến cánh cửa phía đông để tiếp tục.'
      : steps.length > 1 ? `Bước ${steps.indexOf(step) + 1}/${steps.length} · ${puzzles[step].goal}` : chapter.goal;
    const count = chapter.clueIds.filter(id => state.collectedClueIds.includes(id)).length;
    document.querySelector('#clue-counter').textContent = `${count} / ${chapter.clueIds.length}`;
    for (const item of document.querySelectorAll('#chapter-progress li')) {
      const current = item.dataset.chapterId === state.chapterId;
      item.classList.toggle('current', current); item.classList.toggle('completed', state.completedRoomIds.includes(item.dataset.chapterId));
      if (current) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current');
    }
    const interact = document.querySelector('#interaction-button');
    const clueId = nearby?.clueId || nearby?.id;
    interact.disabled = !nearby;
    interact.querySelector('span').textContent = nearby?.type === 'exit' ? nearby.label || 'Bước qua cánh cửa' : clueId && clues[clueId] ? clues[clueId].title : nearby?.label || 'Đến gần một dấu vết';
    const puzzleButton = document.querySelector('#puzzle-button');
    puzzleButton.disabled = !steps.length && state.chapterId !== 'peace';
    puzzleButton.textContent = state.chapterId === 'peace' ? 'Điều mang về ↗' : 'Ghép hồ sơ ↗';
    const audioButton = document.querySelector('#audio-button');
    const enabled = state.settings.audioEnabled, unlocked = audioState?.running ?? audioState?.unlocked ?? false;
    audioButton.textContent = enabled ? unlocked ? 'Tắt âm thanh' : 'Bật lại âm thanh' : 'Bật âm thanh';
    audioButton.setAttribute('aria-pressed', String(enabled && unlocked));
    document.body.classList.toggle('reduce-motion', state.settings.reducedMotion);
    document.body.classList.toggle('bright-scene', state.settings.brightness === 'bright');
    // Open narrative, text fields and puzzle drafts are intentionally untouched by HUD renders.
  }

  showMainMenu({ canContinue = false, notice = '' } = {}) {
    this.narrative.clear(); this.menuOptions = { canContinue, notice }; this.menuMode = true;
    const begin = type => { this.menuMode = false; this.onIntent({ type }); };
    const content = mainMenuContent({ canContinue, notice, onStart: () => canContinue ? this.showResetConfirm(() => this.showMainMenu(this.menuOptions)) : begin('new-game'), onContinue: () => begin('continue'), onSources: () => this.showSources() });
    this.dialog.show({ title: 'Những ký ức dẫn lối về nhà', kicker: 'PHIÊU LƯU · KHÁM PHÁ · GIẢI ĐỐ', variant: 'menu-dialog', dismissible: false, content, focus: content.querySelector('#continue-button') || content.querySelector('#new-game-button') });
  }

  showClue(clueId) { const clue = clues[clueId]; if (clue) this.showNarrative(clue.beatId, { clueId }); }
  showStory(chapterId) { if (chapters[chapterId]) this.showNarrative(chapters[chapterId].introBeatId); }
  showNarrative(beatId, options = {}) { this.narrative.show(beatId, options); }
  showNotebook() { this.narrative.clear(); this.archive.notebook(); }
  showBacklog() { this.narrative.clear(); this.archive.backlog(); }
  showSources() { this.narrative.clear(); this.archive.sourcePanel(this.menuMode ? { onBack: () => this.showMainMenu(this.menuOptions) } : {}); }
  showPuzzle(puzzleId = currentPuzzleId(this.getState()) || this.getState().chapterId) { this.narrative.clear(); this.puzzle.show(puzzleId); }
  showPuzzleFeedback(text, tone = 'error') { this.puzzle.showFeedback(text, tone); }
  showHint(text) { this.showPuzzleFeedback(text, 'hint'); }

  showSettings() {
    this.narrative.clear();
    const settings = this.getState().settings;
    const sound = element('input', { type: 'checkbox', checked: settings.audioEnabled, onChange: event => {
      const pending = this.onIntent({ type: 'set-settings', settings: { audioEnabled: event.target.checked } });
      Promise.resolve(pending).then(() => { sound.checked = this.getState().settings.audioEnabled; });
    } });
    const volumeLabel = element('output', {}, `${Math.round(settings.audioVolume * 100)} %`);
    const volume = element('input', { type: 'range', min: 0, max: 1, step: 0.05, value: settings.audioVolume, id: 'audio-volume', onInput: event => {
      const value = Number(event.target.value); volumeLabel.textContent = `${Math.round(value * 100)} %`; this.onIntent({ type: 'set-settings', settings: { audioVolume: value } });
    } });
    const brightness = element('select', { id: 'brightness-setting', onChange: event => this.onIntent({ type: 'set-settings', settings: { brightness: event.target.value } }) }, element('option', { value: 'normal', selected: settings.brightness === 'normal' }, 'Ánh sáng gốc'), element('option', { value: 'bright', selected: settings.brightness === 'bright' }, 'Sáng rõ hơn'));
    const reduced = element('input', { type: 'checkbox', checked: settings.reducedMotion, onChange: event => this.onIntent({ type: 'set-settings', settings: { reducedMotion: event.target.checked } }) });
    const runtime = this.getAudioState();
    const content = element('div', {}, paragraph('Không cần vội. Khi bảng này mở, Quang dừng bước để bạn đọc và điều chỉnh.'), element('label', { className: 'setting-row' }, sound, element('span', {}, 'Hiệu ứng âm thanh')), field(element('span', {}, 'Âm lượng ', volumeLabel), volume), field('Độ sáng khung cảnh', brightness), element('label', { className: 'setting-row' }, reduced, element('span', {}, 'Giảm chuyển động, camera theo ngay')));
    if (settings.audioEnabled && !(runtime.running ?? runtime.unlocked)) content.append(button('Bật lại âm thanh', () => this.onIntent({ type: 'audio-toggle' })), paragraph('Trình duyệt cần một lần bấm để phát âm thanh sau khi tải trang hoặc tạm dừng.', 'form-help'));
    content.append(actions(button('Trở lại căn hầm →', () => this.close(), 'primary-button'), button('Bắt đầu lại', () => this.showResetConfirm())), paragraph('Lời kể luôn có văn bản. Âm thanh có thể tắt bất cứ lúc nào.', 'dialog-note'));
    this.dialog.show({ title: 'Một khoảng dừng', kicker: 'TÙY CHỌN', content });
  }

  showResetConfirm(onCancel = () => this.showSettings()) {
    this.narrative.clear();
    this.dialog.show({ title: 'Bắt đầu một hành trình mới?', kicker: 'CHƠI LẠI', dismissible: !this.menuMode, content: element('div', {}, paragraph('Tiến độ hiện tại và các tùy chọn sẽ được đặt lại. Những dòng suy nghĩ riêng trên trang không được giữ lại.'), actions(button('Giữ hành trình hiện tại', onCancel, 'primary-button'), button('Xóa tiến độ và chơi mới', () => { this.puzzle.clearDrafts(); this.menuMode = false; this.onIntent({ type: 'confirm-reset' }); }, 'danger-button', { id: 'confirm-reset' }))) });
  }

  showEnding() {
    this.narrative.clear();
    this.dialog.show({ title: 'Trang sổ đã khép, câu chuyện còn mở', kicker: 'TRỞ VỀ BẢO TÀNG', variant: 'ending-dialog', content: endingContent({ onNotebook: () => this.showNotebook(), onAgain: () => this.showResetConfirm(() => this.showEnding()) }) });
  }

  showToast(text) {
    clearTimeout(this.toastTimer); const toast = document.querySelector('#game-toast'); toast.textContent = text; toast.hidden = false;
    this.toastTimer = setTimeout(() => { toast.hidden = true; }, 6000);
  }
  close() { this.dialog.close(); }
  isOpen() { return this.dialog.isOpen(); }
  getActiveNarrative() { return this.narrative.getActive(); }
  destroy() { clearTimeout(this.toastTimer); this.abort.abort(); this.dialog.destroy(); this.narrative.clear(); }
}
