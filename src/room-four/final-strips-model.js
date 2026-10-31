// Pure helpers for the chest lock strips (kept apart from the DOM view so node tests can cover them).
export const SLOT_IDS = Object.freeze(['slot-1', 'slot-2']);

// The tray lists the L strip first so the default order is not already the answer. Phrases come from the solved boards.
export function strips(boards) {
  return [boards.l, boards.t].map(board => ({id: `strip-${board.phrase}`, label: board.strip, phrase: board.phrase}));
}

// Slots in lock order -> the same concatenated phrase the typed field sent before.
export const phraseFromSlots = phrases => phrases.join('');
