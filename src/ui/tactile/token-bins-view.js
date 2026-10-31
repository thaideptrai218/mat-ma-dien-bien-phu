// DOM view for token-bins-model. Three equivalent ways to move a token, all ending in model.move():
//   1. pointer drag (mouse/touch/pen, Pointer Events, no HTML5 DnD)   2. click token, then click a target
//   3. keyboard: Enter/Space lifts, Tab or arrows pick a target, Enter drops, Esc cancels, Delete returns to tray.
// Text only enters through textContent/text nodes (see dom-elements.js).
import {element} from '../dom-elements.js';
import {TRAY, trayTokens, contents, binOf, canMove, move, isFull} from './token-bins-model.js';
import './tactile.css';

const DRAG_THRESHOLD = 6;
const DEFAULT_MESSAGES = {
  lifted: label => `Đã nhấc ${label}. Chọn ô đích rồi bấm Enter, hoặc Esc để hủy.`,
  placed: (label, bin) => `Đã đặt ${label} vào ${bin}.`,
  returned: label => `Đã trả ${label} về khay.`,
  cancelled: () => 'Đã bỏ chọn.',
  rejected: (label, bin) => `${label} không đặt được vào ${bin}.`,
  full: bin => `${bin} đã đầy.`,
};

export function createTokenBinsView({state, onChange, labels = {}, trayLabel = 'Khay', describeToken = token => token.label,
  messages = {}, disabled = false, className = ''} = {}) {
  const say = {...DEFAULT_MESSAGES, ...messages};
  let model = state, lifted = null, isDisabled = Boolean(disabled), dragged = false, destroyed = false;
  const zones = new Map(), live = element('div', {className: 'tb-live', role: 'status', 'aria-live': 'polite'});
  const root = element('div', {className: `tb ${className}`.trim()});
  const binLabel = id => id === TRAY ? trayLabel : labels[id] ?? id;
  const dropKey = id => id === TRAY ? '' : id;

  const makeZone = (id, extra) => {
    const zone = element('div', {className: `tb-zone ${extra}`, role: 'group', 'aria-label': binLabel(id), dataset: {drop: dropKey(id)},
      onClick: e => { if (e.target === e.currentTarget && lifted !== null && !isDisabled) drop(lifted, id); }});
    zones.set(id, zone);
    return zone;
  };
  const tray = makeZone(TRAY, 'tb-tray'), bins = {};
  const binBox = element('div', {className: 'tb-bins'});
  for (const id of model.binOrder) { bins[id] = makeZone(id, 'tb-bin'); binBox.append(bins[id]); }
  root.append(tray, binBox, live);

  const announce = text => { live.textContent = ''; live.textContent = text; };
  const slotButtons = () => [...root.querySelectorAll('.tb-slot:not(:disabled)')];

  function commit(next, tokenId, message, focus) {
    if (next === model) return false;
    model = next; lifted = null; render(focus ?? {token: tokenId});
    announce(message);
    onChange?.(model, {tokenId, binId: binOf(model, tokenId)});
    return true;
  }

  function drop(tokenId, binId) {
    const token = model.tokens[tokenId], check = canMove(model, tokenId, binId);
    if (!check.ok) {
      if (check.reason !== 'same') announce(check.reason === 'full' ? say.full(binLabel(binId)) : say.rejected(token.label, binLabel(binId)));
      else cancel(tokenId);
      return;
    }
    commit(move(model, tokenId, binId), tokenId, binId === TRAY ? say.returned(token.label) : say.placed(token.label, binLabel(binId)));
  }

  function lift(tokenId, viaKeyboard) {
    lifted = tokenId; render({token: tokenId});
    announce(say.lifted(model.tokens[tokenId].label));
    if (viaKeyboard) slotButtons()[0]?.focus();
  }
  function cancel(tokenId = lifted) {
    if (lifted === null) return;
    lifted = null; render({token: tokenId}); announce(say.cancelled());
  }

  function cycleFocus(from, direction) {
    const list = slotButtons(), at = list.indexOf(from);
    if (list.length) list[(at + direction + list.length) % list.length].focus();
  }

  function onTokenKey(event, tokenId) {
    if (isDisabled) return;
    if (event.key === 'Escape' && lifted !== null) { event.preventDefault(); cancel(tokenId); }
    else if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); drop(tokenId, TRAY); }
    else if (lifted === tokenId && ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) {
      event.preventDefault(); const first = slotButtons()[0]; first?.focus();
    }
  }

  function onTokenClick(event, tokenId) {
    if (dragged || isDisabled) return;
    if (lifted === null) lift(tokenId, event.detail === 0); // click.detail is 0 for Enter/Space activation
    else if (lifted === tokenId) cancel(tokenId);
    else drop(lifted, binOf(model, tokenId));
  }

  const zoneAt = (x, y) => document.elementsFromPoint(x, y).find(el => el.dataset?.drop !== undefined && root.contains(el));

  function startPointer(event, tokenId, node) {
    if (isDisabled || event.button > 0 || !event.isPrimary) return;
    const sx = event.clientX, sy = event.clientY;
    let active = false, over = null;
    node.setPointerCapture?.(event.pointerId);
    const clearOver = () => { over?.classList.remove('is-over', 'is-bad'); over = null; };
    const move_ = e => {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!active && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      if (!active) { active = true; node.classList.add('is-dragging'); }
      node.style.transform = `translate(${dx}px, ${dy}px)`;
      const zone = zoneAt(e.clientX, e.clientY);
      if (zone !== over) {
        clearOver(); over = zone || null;
        if (over) over.classList.add(canMove(model, tokenId, over.dataset.drop || TRAY).ok ? 'is-over' : 'is-bad');
      }
    };
    const finish = (e, cancelled) => {
      node.removeEventListener('pointermove', move_); node.removeEventListener('pointerup', up);
      node.removeEventListener('pointercancel', cancelAll); node.releasePointerCapture?.(e.pointerId);
      const target = over; clearOver();
      node.classList.remove('is-dragging'); node.style.transform = '';
      if (!active) return;
      dragged = true; setTimeout(() => { dragged = false; }, 0); // swallow the click that follows a drag
      if (!cancelled && target) drop(tokenId, target.dataset.drop || TRAY);
    };
    const up = e => finish(e, false), cancelAll = e => finish(e, true);
    node.addEventListener('pointermove', move_); node.addEventListener('pointerup', up);
    node.addEventListener('pointercancel', cancelAll);
  }

  function tokenButton(token) {
    const node = element('button', {type: 'button', className: `tb-token${lifted === token.id ? ' is-lifted' : ''}`,
      disabled: isDisabled, 'aria-pressed': String(lifted === token.id), dataset: {token: token.id},
      onKeyDown: e => onTokenKey(e, token.id), onClick: e => onTokenClick(e, token.id)}, describeToken(token));
    node.addEventListener('pointerdown', e => startPointer(e, token.id, node));
    return node;
  }

  function slotButton(id) {
    const ok = lifted !== null && !isDisabled && canMove(model, lifted, id).ok;
    const full = id !== TRAY && isFull(model, id) && !model.swap;
    return element('button', {type: 'button', className: 'tb-slot', disabled: !ok, dataset: {slot: dropKey(id)},
      'aria-label': `Đặt vào ${binLabel(id)}`,
      onClick: () => lifted !== null && drop(lifted, id),
      onKeyDown: e => {
        if (e.key === 'Escape') { e.preventDefault(); cancel(); }
        else if (['ArrowRight', 'ArrowDown'].includes(e.key)) { e.preventDefault(); cycleFocus(e.currentTarget, 1); }
        else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) { e.preventDefault(); cycleFocus(e.currentTarget, -1); }
      }}, full ? '' : '+');
  }

  function render(focus) {
    if (destroyed) return;
    for (const [id, zone] of zones) {
      const list = id === TRAY ? trayTokens(model) : contents(model, id);
      zone.classList.toggle('is-empty', list.length === 0);
      zone.replaceChildren(element('span', {className: 'tb-label'}, binLabel(id)), ...list.map(tokenButton), slotButton(id));
    }
    if (focus?.token) root.querySelector(`[data-token="${CSS.escape(focus.token)}"]`)?.focus();
  }

  render();
  return {
    root, tray, bins,
    getState: () => model,
    setState(next) { model = next; lifted = null; render(); },
    setDisabled(value) { isDisabled = Boolean(value); root.classList.toggle('is-disabled', isDisabled); render(); },
    destroy() { destroyed = true; root.remove(); zones.clear(); },
  };
}
