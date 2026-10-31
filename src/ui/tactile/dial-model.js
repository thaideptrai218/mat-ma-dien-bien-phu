// Pure model for rotating combination locks. Wheels wrap around their alphabet.
export const DIGITS = Object.freeze([...'0123456789']);
export const LETTERS = Object.freeze([...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']);

export function normalizeAlphabet(alphabet) {
  const list = typeof alphabet === 'string' ? [...alphabet] : Array.isArray(alphabet) ? alphabet.map(String) : null;
  if (!list || list.length < 2 || new Set(list).size !== list.length || list.some(item => !item)) {
    throw new TypeError('dial alphabet needs >=2 unique non-empty symbols');
  }
  return Object.freeze(list);
}

// step('9', +1, DIGITS) -> '0'; unknown symbols restart from the first symbol.
export function step(symbol, delta, alphabet) {
  const list = normalizeAlphabet(alphabet), at = Math.max(0, list.indexOf(symbol)), size = list.length;
  return list[(((at + Math.trunc(delta)) % size) + size) % size];
}

// `alphabet` may be one alphabet for all wheels or an array of per-wheel alphabets (arrays of arrays/strings).
export function createDial({wheels = 4, alphabet = DIGITS, value = ''} = {}) {
  if (!Number.isInteger(wheels) || wheels < 1 || wheels > 12) throw new TypeError('dial wheels must be 1..12');
  const perWheel = Array.isArray(alphabet) && alphabet.length === wheels && alphabet.every(item => typeof item === 'string' ? item.length > 1 : Array.isArray(item));
  const alphabets = Array.from({length: wheels}, (_, i) => normalizeAlphabet(perWheel ? alphabet[i] : alphabet));
  const symbols = [...String(value ?? '')];
  const indexes = alphabets.map((list, i) => Math.max(0, list.indexOf(symbols[i])));
  return Object.freeze({alphabets: Object.freeze(alphabets), indexes: Object.freeze(indexes)});
}

const replaceAt = (state, wheel, index) => Object.freeze({...state, indexes: Object.freeze(state.indexes.map((v, i) => i === wheel ? index : v))});

function assertWheel(state, wheel) {
  if (!Number.isInteger(wheel) || wheel < 0 || wheel >= state.indexes.length) throw new RangeError(`no wheel ${wheel}`);
}

export function stepWheel(state, wheel, delta) {
  assertWheel(state, wheel);
  const size = state.alphabets[wheel].length;
  return replaceAt(state, wheel, (((state.indexes[wheel] + Math.trunc(delta)) % size) + size) % size);
}

// Sets a wheel to a symbol (letters match case-insensitively). Unknown symbol returns the same state.
export function setWheel(state, wheel, symbol) {
  assertWheel(state, wheel);
  const list = state.alphabets[wheel], text = String(symbol);
  let index = list.indexOf(text);
  if (index < 0) index = list.findIndex(item => item.toLowerCase() === text.toLowerCase());
  return index < 0 || index === state.indexes[wheel] ? state : replaceAt(state, wheel, index);
}

export const wheelSymbol = (state, wheel) => state.alphabets[wheel][state.indexes[wheel]];
export const dialValue = state => state.indexes.map((_, i) => wheelSymbol(state, i)).join('');
