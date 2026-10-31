import { element, button, audioLabel } from './ui-elements.js';
import { createPanel } from './ui-panels.js';
import { createRoomMap } from './ui-map.js';
import { WORLD } from './world.js';
import { SystemHintCard } from '../ui/system-hint-card.js';

export class RoomOneUI {
  // audio/hints: optional voice controller and the room's SYSTEM_HINTS ({puzzleId: {open, hints}}) for the Hệ Thống side card.
  constructor({ root, onAction, audio = null, hints = {} }, { subtitle = 'PHÒNG 1 · TRƯỚC BẢN KẾ HOẠCH', date = '1950 — 7/1953', roomLabel = 'HÀNH TRÌNH PHÒNG 1', world = WORLD, panelFactory = createPanel } = {}) {
    this.root = root;
    this.onAction = onAction;
    this.hintCard = new SystemHintCard({ hints, audio });
    this.world = world;
    this.panelFactory = panelFactory;
    this.snapshot = {};
    this.collapsed = window.matchMedia('(max-width: 650px)').matches;
    this.root.classList.add('r1-app');
    const header = element('header', 'r1-header');
    const brand = element('div', 'r1-brand');
    brand.append(element('span', 'r1-brand-mark', 'M'), element('div', 'r1-brand-copy'));
    brand.lastChild.append(element('h1', '', 'Mật mã Điện Biên Phủ'), element('p', '', subtitle));
    const tools = element('nav', 'r1-header-tools');
    tools.setAttribute('aria-label', 'Công cụ');
    this.audioButton = button('Bật âm thanh', () => this.emit('audio-toggle'), 'r1-header-button');
    tools.append(button('Sổ tay', () => this.emit('notebook'), 'r1-header-button'), this.audioButton, button('Tùy chọn', () => this.emit('settings'), 'r1-header-button'));
    header.append(brand, tools);
    const stage = element('main', 'r1-stage');
    const canvasHost = element('div', 'r1-canvas');
    canvasHost.id = 'game-canvas';
    const caption = element('div', 'r1-scene-caption');
    caption.append(element('span', 'r1-eyebrow', 'CĂN PHÒNG KÝ ỨC'), element('span', '', date));
    this.quests = element('aside', 'r1-quests');
    this.quests.setAttribute('aria-label', 'Nhiệm vụ hiện tại');
    const questHeading = element('div', 'r1-quest-heading');
    questHeading.append(element('span', 'r1-eyebrow', roomLabel));
    this.questToggle = button('', () => this.emit('quests-toggle'), 'r1-quest-toggle');
    questHeading.append(this.questToggle);
    this.questBody = element('div', 'r1-quest-body');
    this.questSteps = element('ol', 'r1-quest-steps');
    this.questGoal = element('p', 'r1-quest-goal');
    this.questDetail = element('p', 'r1-quest-detail');
    this.questCount = element('p', 'r1-quest-count');
    this.questBody.append(this.questSteps, this.questGoal, this.questDetail, this.questCount);
    this.quests.append(questHeading, this.questBody);
    this.minimap = element('aside', 'r1-minimap');
    this.minimap.setAttribute('aria-label', 'Bản đồ thu nhỏ');
    const mapTop = element('div', 'r1-minimap-heading');
    mapTop.append(element('span', '', 'Sơ đồ căn phòng'), button('M · Mở rộng', () => this.emit('map'), 'r1-map-expand'));
    this.miniMapDrawing = element('div');
    this.miniMapGoal = element('p', 'r1-minimap-goal');
    this.minimap.append(mapTop, this.miniMapDrawing, this.miniMapGoal);
    this.interactButton = button('Tiến đến gần một dấu vết', () => this.emit('interact'), 'r1-interact');
    this.interactButton.disabled = true;
    this.notice = element('p', 'r1-notice');
    this.notice.setAttribute('role', 'status');
    this.notice.setAttribute('aria-live', 'polite');
    stage.append(canvasHost, caption, this.quests, this.minimap, this.interactButton, this.notice);
    const footer = element('footer', 'r1-controls');
    for (const [key, text] of [['WASD / ↑↓←→', 'Di chuyển'], ['Shift', 'Chạy nhanh'], ['E', 'Tương tác'], ['N', 'Sổ tay'], ['M', 'Bản đồ'], ['Q', 'Nhiệm vụ']]) {
      const hint = element('span');
      hint.append(element('kbd', '', key), document.createTextNode(text));
      footer.append(hint);
    }
    this.dialog = element('dialog', 'r1-modal');
    this.dialog.setAttribute('aria-label', 'Nội dung và giải đố');
    this.dialog.addEventListener('cancel', event => { event.preventDefault(); this.close(); });
    this.root.replaceChildren(header, stage, footer, this.dialog);
    this.updateQuestVisibility();
  }

  get isOpen() { return this.dialog.open; }

  emit(action, payload = {}) {
    if (this.destroyed) return;
    if (action === 'ui-close') { this.close(); return; }
    this.onAction(action, payload);
  }

  toggleQuests(force) {
    this.collapsed = typeof force === 'boolean' ? !force : !this.collapsed;
    this.updateQuestVisibility();
  }

  updateQuestVisibility() {
    this.questBody.hidden = this.collapsed;
    this.quests.classList.toggle('is-collapsed', this.collapsed);
    this.questToggle.textContent = this.collapsed ? '+ Q' : '− Q';
    this.questToggle.setAttribute('aria-expanded', String(!this.collapsed));
    this.questToggle.setAttribute('aria-label', this.collapsed ? 'Mở nhiệm vụ' : 'Thu gọn nhiệm vụ');
  }

  render(snapshot) {
    if (this.destroyed) return;
    this.snapshot = { ...this.snapshot, ...snapshot };
    const { state = {}, position = {}, nearby, goal = {}, notice = '', audio = {} } = this.snapshot;
    const fingerprint = JSON.stringify([goal, state.collectedNoteIds]);
    if (fingerprint !== this.goalFingerprint) {
      this.goalFingerprint = fingerprint;
      this.questSteps.replaceChildren();
      for (const [index, step] of (goal.steps || []).entries()) {
        const item = element('li', `${step.done ? 'is-done' : ''} ${index === goal.step ? 'is-current' : ''}`);
        item.append(element('span', 'r1-step-number', step.done ? '✓' : String(index + 1).padStart(2, '0')), element('span', '', step.title));
        this.questSteps.append(item);
      }
      this.questGoal.textContent = goal.label || 'Khám phá căn phòng';
      this.questDetail.textContent = goal.detail || '';
      this.questCount.textContent = goal.count || '';
      this.miniMapGoal.textContent = `Mục tiêu: ${goal.label || 'Khám phá căn phòng'}`;
    }
    this.interactButton.disabled = !nearby;
    this.interactButton.textContent = nearby ? `E · ${nearby.label}` : 'Tiến đến gần một dấu vết';
    const message = typeof notice === 'string' ? notice : notice?.text || notice?.message || '';
    if (this.notice.textContent !== message) this.notice.textContent = message;
    this.notice.hidden = !message;
    if (this.modalNotice) { this.modalNotice.textContent = message; this.modalNotice.hidden = !message; }
    this.audioButton.textContent = audioLabel(audio);
    const settingsAudio = this.dialog.querySelector('.r1-settings-audio');
    if (settingsAudio) settingsAudio.textContent = audioLabel(audio);
    // Only rebuild the small drawing when its world position/status changes, never the open form.
    const mapKey = `${Math.round(position.x / 6)},${Math.round(position.y / 6)},${fingerprint},${(state.seenObjectIds || []).join(',')}`;
    if (mapKey !== this.mapKey) {
      this.mapKey = mapKey;
      this.miniMapDrawing.replaceChildren(createRoomMap(this.snapshot, true, this.world));
    }
  }

  show(view, data = {}) {
    if (this.destroyed) return;
    if (this.currentView === view && data.notice && !data.solved) {
      this.modalNotice.textContent = typeof data.notice === 'string' ? data.notice : data.notice.message || '';
      this.modalNotice.hidden = false;
      return;
    }
    this.panel?.cleanup?.();
    this.currentView = view;
    const className = `r1-modal r1-view-${view}${view === 'document' && ['letter', 'journal', 'report'].includes(data.document?.kind) ? ' r1-view-artifact' : ''}`;
    const close = button('Đóng · Esc', () => this.close(), 'r1-modal-close');
    this.panel = this.panelFactory(view, data, (action, payload) => this.emit(action, payload), this.snapshot, this.world);
    this.dialog.className = `${className}${this.panel.dialogClass ? ' ' + this.panel.dialogClass : ''}`;
    this.modalNotice = element('p', 'r1-modal-notice', typeof data.notice === 'string' ? data.notice : '');
    this.modalNotice.setAttribute('role', 'status');
    this.modalNotice.hidden = !this.modalNotice.textContent;
    this.dialog.replaceChildren(close, this.panel.node, this.modalNotice);
    const hintKey = this.hintKeyFor(view, data);
    if (hintKey && !data.solved) this.hintCard.open(hintKey, this.dialog); else this.hintCard.hide();
    if (!this.isOpen) { this.dialog.showModal(); this.onAction('modal-open', { view }); }
    this.dialog.scrollTop = 0;
    const openedPanel = this.panel;
    if (this.openFrame) cancelAnimationFrame(this.openFrame);
    this.openFrame = requestAnimationFrame(() => {
      this.openFrame = null;
      if (this.destroyed || !this.isOpen || this.panel !== openedPanel) return;
      openedPanel.afterOpen?.();
      const input = this.dialog.querySelector('input:not([type="checkbox"]), select');
      if (input) input.focus({ preventScroll: true });
    });
  }

  // Key of the SYSTEM_HINTS entry for the view being shown (Room 2 overrides it for its donor puzzle view).
  hintKeyFor(view, data) { return view === 'board' ? `board-${data.board}` : view; }

  // A wrong submission: the Hệ Thống card (if a puzzle is open) speaks its next hint.
  noteMistake() { if (!this.destroyed) this.hintCard.mistake(); }

  close() {
    if (this.destroyed) return;
    if (!this.isOpen) return;
    this.hintCard.hide();
    this.panel?.cleanup?.();
    this.dialog.close();
    this.currentView = null;
    this.onAction('modal-close');
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.onAction = () => {};
    if (this.openFrame) cancelAnimationFrame(this.openFrame);
    this.openFrame = null;
    this.hintCard.hide();
    this.panel?.cleanup?.(); this.panel = null;
    this.currentView = null;
    if (this.dialog.open) this.dialog.close();
    this.drafts?.clear();
    // Canvas/root removal belongs to the session after Phaser's destroy frame.
  }
}
