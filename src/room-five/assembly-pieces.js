// Painting pieces: initial shuffle, pure swap, and drag-to-swap wiring (kept DOM-free at import time for node tests).
// Drag a painting piece onto another slot to swap them. Pointer Events only (mouse, touch, pen); the existing
// click-then-click swap and the keyboard path stay untouched. Hit-testing uses client coordinates, so scrolling is safe.
const DRAG_THRESHOLD = 6;

export function shuffledPieces(random = Math.random) {
  const order = [0, 1, 2, 3];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]];
  }
  return order.every((id, index) => id === index) ? [2, 0, 3, 1] : order;
}

// Pure: new order with positions a and b exchanged, or the same array when the swap is not valid.
export function swapPieces(order, a, b) {
  if (!Array.isArray(order) || a === b || ![a, b].every(i => Number.isInteger(i) && i >= 0 && i < order.length)) return order;
  const next = [...order]; [next[a], next[b]] = [next[b], next[a]];
  return next;
}

// slots: the piece buttons in board order. onSwap(from, to) runs once per completed drag onto a different slot.
export function enableDragSwap(slots, onSwap) {
  let swallowClick = false;
  const board = slots[0]?.parentElement;
  // A drag ends with a click on the dropped-on slot in some browsers; swallow it so it is not read as a click-swap.
  board?.addEventListener('click', event => {
    if (!swallowClick) return;
    swallowClick = false; event.stopPropagation(); event.preventDefault();
  }, true);
  // The dragged piece follows the pointer and sits on top, so look past it to the slot underneath.
  const slotAt = (x, y, dragged) => document.elementsFromPoint(x, y).find(el => el !== dragged && slots.includes(el));

  slots.forEach((slot, from) => slot.addEventListener('pointerdown', event => {
    if (event.button > 0 || !event.isPrimary) return;
    const sx = event.clientX, sy = event.clientY;
    let active = false, over = null;
    slot.setPointerCapture?.(event.pointerId);
    const clearOver = () => {over?.classList.remove('is-over'); over = null;};
    const move = e => {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!active && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      if (!active) {active = true; slot.classList.add('is-dragging');}
      slot.style.transform = `translate(${dx}px, ${dy}px)`;
      const target = slotAt(e.clientX, e.clientY, slot);
      if (target !== over) {clearOver(); if (target) {over = target; over.classList.add('is-over');}}
    };
    const finish = (e, cancelled) => {
      slot.removeEventListener('pointermove', move); slot.removeEventListener('pointerup', up); slot.removeEventListener('pointercancel', abort);
      slot.releasePointerCapture?.(e.pointerId);
      const target = over; clearOver();
      slot.classList.remove('is-dragging'); slot.style.transform = '';
      if (!active) return;
      swallowClick = true; setTimeout(() => {swallowClick = false;}, 0);
      if (!cancelled && target) onSwap(from, slots.indexOf(target));
    };
    const up = e => finish(e, false), abort = e => finish(e, true);
    slot.addEventListener('pointermove', move); slot.addEventListener('pointerup', up); slot.addEventListener('pointercancel', abort);
  }));
}
