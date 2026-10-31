import {element} from '../room-one/ui-elements.js';

const emblemUrl = new URL('../../assets/images/game-emblem.png', import.meta.url).href;
const CARD_WIDTH = 252; // px, plus a margin on both sides, needed beside the open modal for the full card

// Hệ Thống side card shown beside an open puzzle panel. It lives inside the open <dialog> (top layer), fixed at
// the left edge and vertically centered. It speaks one line at a time: a short reminder when the puzzle opens,
// then, after each wrong submission, hints[0] (first miss) and hints[1] (second miss and afterwards).
// Where the modal leaves no free side space the card collapses to a small emblem button.
export class SystemHintCard {
  constructor({hints = {}, audio = null} = {}) {
    this.hints = hints; this.audio = audio; this.key = null; this.mistakes = 0;
    this.id = `sys-hint-${Math.random().toString(36).slice(2, 8)}`;
    this.node = element('aside', 'sys-hint is-compact');
    this.node.setAttribute('aria-label', 'Lời nhắc của Hệ Thống');
    this.toggle = element('button', 'sys-hint-toggle');
    this.toggle.type = 'button';
    this.toggle.setAttribute('aria-controls', this.id);
    this.badge = element('span', 'sys-hint-badge', '!'); this.badge.hidden = true;
    this.toggle.append(this.emblem(), this.badge);
    this.toggle.addEventListener('click', () => this.expand(!this.expanded));
    const body = element('div', 'sys-hint-body'); body.id = this.id;
    const head = element('div', 'sys-hint-head');
    this.step = element('span', 'sys-hint-step');
    head.append(this.emblem(), element('strong', '', 'HỆ THỐNG'), this.step);
    this.text = element('p', 'sys-hint-text');
    body.append(head, this.text);
    // Always-present live region: the visible text may be collapsed, announcements must not depend on it.
    this.live = element('span', 'sys-hint-live');
    this.live.setAttribute('role', 'status');
    this.node.append(this.toggle, body, this.live);
    this.onResize = () => this.layout();
    this.expanded = false; this.node.hidden = true;
  }

  emblem() { const img = element('img', 'sys-hint-emblem'); img.src = emblemUrl; img.alt = ''; img.width = 28; img.height = 28; return img; }

  has(key) { return Boolean(key && this.hints[key]?.open); }

  // Mounts the card in `dialog`. Re-opening the same puzzle (a re-render) keeps its progress and stays silent.
  open(key, dialog) {
    if (!this.has(key)) { this.hide(); return; }
    this.dialog = dialog;
    if (key !== this.key) { this.key = key; this.mistakes = 0; this.expand(false); this.say(this.hints[key].open, 'Lời nhắc', false); }
    this.node.hidden = false;
    dialog.append(this.node);
    window.addEventListener('resize', this.onResize);
    this.layout();
    requestAnimationFrame(() => { if (this.key === key) this.layout(); });
  }

  mistake() {
    if (!this.key) return;
    const hints = this.hints[this.key].hints || [];
    if (!hints.length) return;
    this.mistakes++;
    const level = Math.min(this.mistakes, hints.length);
    this.say(hints[level - 1], `Gợi ý ${level}`, true);
  }

  // Shows and speaks one line; `attention` flags a new hint in the collapsed card.
  say(line, label, attention) {
    this.text.textContent = line; this.step.textContent = label; this.live.textContent = line;
    this.badge.hidden = this.expanded || !attention;
    try { this.audio?.voice?.playSequence([{speaker: 'Hệ Thống', text: line}]); } catch { /* voice is optional */ }
  }

  expand(open) {
    this.expanded = open; this.node.classList.toggle('is-open', open);
    this.toggle.setAttribute('aria-expanded', String(open));
    this.toggle.setAttribute('aria-label', open ? 'Thu gọn lời nhắc của Hệ Thống' : 'Mở lời nhắc của Hệ Thống');
    if (open) this.badge.hidden = true;
  }

  // Full card only when the modal leaves enough room on its left; otherwise the small collapsible card.
  layout() {
    if (!this.dialog?.isConnected) return;
    const free = (window.innerWidth - this.dialog.getBoundingClientRect().width) / 2;
    this.node.classList.toggle('is-compact', !(this.dialog.open && free >= CARD_WIDTH + 24));
  }

  hide() {
    this.key = null; this.mistakes = 0; this.node.hidden = true; this.node.remove();
    window.removeEventListener('resize', this.onResize);
  }
}
