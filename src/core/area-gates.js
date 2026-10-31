// Area gates: pure data helpers. A gate is a removable barrier derived from existing save flags.
//   {id, rects:[[x,y,w,h]...], style:'bars'|'rope'|'curtain'|'barrier'|'door', unlockedBy(state)->bool, notice}
// Gates are never merged into WORLD.walls; rooms keep their own AREA_GATES array so world tests stay unchanged.
export const GATE_STYLES = Object.freeze(['bars', 'rope', 'curtain', 'barrier', 'door']);

export function validateGates(gates = []) {
  const ids = new Set();
  for (const gate of gates) {
    if (!gate || typeof gate.id !== 'string' || !gate.id) throw new TypeError('area gate needs a string id');
    if (ids.has(gate.id)) throw new TypeError(`duplicate area gate id: ${gate.id}`);
    ids.add(gate.id);
    if (!GATE_STYLES.includes(gate.style)) throw new TypeError(`area gate ${gate.id}: unknown style ${gate.style}`);
    if (typeof gate.unlockedBy !== 'function') throw new TypeError(`area gate ${gate.id}: unlockedBy must be a function`);
    if (!Array.isArray(gate.rects) || !gate.rects.length) throw new TypeError(`area gate ${gate.id}: rects required`);
    for (const rect of gate.rects) {
      if (!Array.isArray(rect) || rect.length !== 4 || !rect.every(Number.isFinite) || rect[2] <= 0 || rect[3] <= 0) {
        throw new TypeError(`area gate ${gate.id}: bad rect ${JSON.stringify(rect)}`);
      }
    }
  }
  return gates;
}

// A throwing or non-true predicate keeps the gate locked (fail closed on corrupt state).
function isOpen(gate, state) {
  try { return gate.unlockedBy(state ?? {}) === true; } catch { return false; }
}

export const lockedGates = (gates = [], state = {}) => gates.filter(gate => !isOpen(gate, state));
export const lockedGateIds = (gates = [], state = {}) => lockedGates(gates, state).map(gate => gate.id);
export const lockedGateRects = (gates = [], state = {}) => lockedGates(gates, state).flatMap(gate => gate.rects.map(rect => [...rect]));

// Same world plus the currently locked gate rects as walls; for reachability tests and map validation only.
export function worldWithGates(world, gates = [], state = {}) {
  const rects = lockedGateRects(gates, state);
  return rects.length ? {...world, walls: [...world.walls, ...rects]} : world;
}

export function gateById(gates = [], id) { return gates.find(gate => gate.id === id) || null; }
