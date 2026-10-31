// Pure model for "drag tokens into bins". Immutable: every change returns a new state.
//   tokens: [{id, label, value?, kind?}]   bins: [{id, capacity?=Infinity, accepts?: string[] | (token)=>bool}]
//   placement: {tokenId: binId}            Unplaced tokens live in the tray (binId null).
//   swap: true -> dropping on a full bin exchanges tokens (the displaced one takes the mover's old spot).
export const TRAY = null;

function accepts(bin, token) {
  if (!bin.accepts) return true;
  return typeof bin.accepts === 'function' ? Boolean(bin.accepts(token)) : bin.accepts.includes(token.kind);
}

const freezeSlots = (binOrder, slots) => {
  for (const id of binOrder) slots[id] = Object.freeze(slots[id]);
  return Object.freeze(slots);
};

export function createTokenBins({tokens = [], bins = [], placement = {}, swap = false} = {}) {
  const tokenMap = {}, binMap = {}, slots = {};
  for (const token of tokens) {
    if (!token || typeof token.id !== 'string' || token.id in tokenMap) throw new TypeError(`bad or duplicate token id: ${token?.id}`);
    tokenMap[token.id] = Object.freeze({...token});
  }
  for (const bin of bins) {
    if (!bin || typeof bin.id !== 'string' || bin.id in binMap) throw new TypeError(`bad or duplicate bin id: ${bin?.id}`);
    binMap[bin.id] = Object.freeze({...bin, capacity: bin.capacity ?? Infinity});
    slots[bin.id] = [];
  }
  const binOrder = bins.map(b => b.id);
  for (const [tokenId, binId] of Object.entries(placement)) {
    if (!(tokenId in tokenMap)) throw new TypeError(`placement: unknown token ${tokenId}`);
    if (binId === TRAY) continue;
    if (!(binId in binMap)) throw new TypeError(`placement: unknown bin ${binId}`);
    if (!accepts(binMap[binId], tokenMap[tokenId]) || slots[binId].length >= binMap[binId].capacity) {
      throw new TypeError(`placement: ${tokenId} cannot sit in ${binId}`);
    }
    slots[binId].push(tokenId);
  }
  return Object.freeze({tokens: Object.freeze(tokenMap), tokenOrder: tokens.map(t => t.id), bins: Object.freeze(binMap),
    binOrder, slots: freezeSlots(binOrder, slots), swap: Boolean(swap)});
}

export function binOf(state, tokenId) {
  return state.binOrder.find(id => state.slots[id].includes(tokenId)) ?? TRAY;
}
export const trayTokens = state => state.tokenOrder.filter(id => binOf(state, id) === TRAY).map(id => state.tokens[id]);
export const contents = (state, binId) => state.slots[binId].map(id => state.tokens[id]);
export const isEmpty = (state, binId) => state.slots[binId].length === 0;
export const isFull = (state, binId) => state.slots[binId].length >= state.bins[binId].capacity;
export const sum = (state, binId) => contents(state, binId).reduce((total, t) => total + (Number(t.value) || 0), 0);
export const placementOf = state => Object.fromEntries(
  state.tokenOrder.filter(id => binOf(state, id) !== TRAY).map(id => [id, binOf(state, id)]));

// -> {ok:true} | {ok:false, reason:'unknown'|'rejected'|'full'|'same'}
export function canMove(state, tokenId, binId, {index} = {}) {
  const token = state.tokens[tokenId];
  if (!token || (binId !== TRAY && !(binId in state.bins))) return {ok: false, reason: 'unknown'};
  const from = binOf(state, tokenId);
  if (binId === TRAY) return from === TRAY ? {ok: false, reason: 'same'} : {ok: true};
  if (!accepts(state.bins[binId], token)) return {ok: false, reason: 'rejected'};
  if (from === binId) return Number.isInteger(index) ? {ok: true} : {ok: false, reason: 'same'}; // index = reorder inside the bin
  if (!isFull(state, binId)) return {ok: true};
  if (!state.swap) return {ok: false, reason: 'full'};
  // Swap needs the displaced token to be welcome where the mover came from.
  const displaced = state.tokens[state.slots[binId][0]];
  return from === TRAY || accepts(state.bins[from], displaced) ? {ok: true} : {ok: false, reason: 'rejected'};
}

// Returns the new state, or the same state when the move is not allowed. `index` orders tokens inside the bin.
export function move(state, tokenId, binId, {index} = {}) {
  if (!canMove(state, tokenId, binId, {index}).ok) return state;
  const from = binOf(state, tokenId), slots = {...state.slots};
  if (from !== TRAY) slots[from] = slots[from].filter(t => t !== tokenId);
  if (binId !== TRAY) {
    let list = [...slots[binId]];
    if (from !== binId && list.length >= state.bins[binId].capacity) { // swap mode: displaced token goes back to the mover's spot
      const [displaced] = list;
      list = list.filter(t => t !== displaced);
      if (from !== TRAY) slots[from] = [...slots[from], displaced];
    }
    const at = Number.isInteger(index) ? Math.max(0, Math.min(index, list.length)) : list.length;
    list.splice(at, 0, tokenId);
    slots[binId] = list;
  }
  return Object.freeze({...state, slots: freezeSlots(state.binOrder, slots)});
}

export const returnToTray = (state, tokenId) => move(state, tokenId, TRAY);
export const resetTokens = state => createTokenBins({tokens: state.tokenOrder.map(id => state.tokens[id]),
  bins: state.binOrder.map(id => state.bins[id]), swap: state.swap});
