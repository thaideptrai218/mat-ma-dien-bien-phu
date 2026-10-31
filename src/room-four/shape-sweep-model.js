// Pure model for the "bút dò" (probe pen) on the T/L letter boards: press on a cell and sweep across others to pick
// (or un-pick) many cells in one stroke. The first cell decides the stroke's mode: an unpicked cell starts an "add"
// stroke, a picked one starts a "remove" stroke. Cells skipped by a fast pointer are filled in along the straight
// line between the last and the new cell, so a stroke never leaves gaps. Output stays a plain Set of cell indexes,
// exactly what the old tap-by-tap UI produced.
export const BOARD_COLUMNS = 5;

const apply = (selected, index, mode) => {
  const next = new Set(selected);
  if (mode === 'add') next.add(index); else next.delete(index);
  return next;
};

// Cells on the straight line from a to b (inclusive), grid-aligned (Bresenham).
export function cellsOnLine(from, to, columns = BOARD_COLUMNS) {
  let x = from % columns, y = Math.floor(from / columns);
  const x1 = to % columns, y1 = Math.floor(to / columns);
  const dx = Math.abs(x1 - x), dy = -Math.abs(y1 - y), sx = x < x1 ? 1 : -1, sy = y < y1 ? 1 : -1;
  let error = dx + dy;
  const cells = [y * columns + x];
  while (x !== x1 || y !== y1) {
    const doubled = 2 * error;
    if (doubled >= dy) { error += dy; x += sx; }
    if (doubled <= dx) { error += dx; y += sy; }
    cells.push(y * columns + x);
  }
  return cells;
}

export function beginSweep(selected, index) {
  const mode = selected.has(index) ? 'remove' : 'add';
  return {mode, last: index, selected: apply(selected, index, mode)};
}

export function extendSweep(sweep, index, columns = BOARD_COLUMNS) {
  if (!sweep || index === sweep.last) return sweep;
  let selected = sweep.selected;
  for (const cell of cellsOnLine(sweep.last, index, columns)) selected = apply(selected, cell, sweep.mode);
  return {...sweep, last: index, selected};
}
