// Pure model for the Room 1 comparison desk: eight fact cards dragged into eight slots (one per row and side).
// The payload built here is exactly what the old form produced, so rules.js comparisonCorrect() is unchanged.
import {createTokenBins, contents} from '../ui/tactile/token-bins-model.js';

export const COMPARISON_ROWS = Object.freeze([
  {name: 'troop', title: 'Quân số', kind: 'troop'},
  {name: 'equipment', title: 'Trang bị', kind: 'equipment'},
  {name: 'position', title: 'Thế chiến lược', kind: 'position'},
  {name: 'pressure', title: 'Sức ép', kind: 'pressure'},
]);
const SIDES = Object.freeze([['VN', 'Việt Nam'], ['France', 'Pháp']]);

// Fixed interleaved order: cards of the two sides are mixed in the tray, no randomness (stable tests and saves).
export const COMPARISON_TOKENS = Object.freeze([
  {id: 'limited', label: 'Còn hạn chế', kind: 'equipment'},
  {id: 'n445000', label: '445.000', kind: 'troop', value: 445000},
  {id: 'dispersed', label: 'Lực lượng phân tán', kind: 'position'},
  {id: 'supply', label: 'Tiếp tế, hậu cần', kind: 'pressure'},
  {id: 'modern', label: 'Hiện đại', kind: 'equipment'},
  {id: 'n252000', label: '252.000', kind: 'troop', value: 252000},
  {id: 'costs', label: 'Tài chính, chi phí chiến tranh', kind: 'pressure'},
  {id: 'initiative', label: 'Giữ thế chủ động', kind: 'position'},
]);

export const COMPARISON_BINS = Object.freeze(COMPARISON_ROWS.flatMap(row => SIDES.map(([side, sideLabel]) => ({
  id: row.name + side, capacity: 1, accepts: token => token.kind === row.kind, label: `${row.title} · ${sideLabel}`,
}))));

export const createComparisonBoard = () => createTokenBins({
  tokens: COMPARISON_TOKENS, bins: COMPARISON_BINS.map(({id, capacity, accepts}) => ({id, capacity, accepts})),
});

export const comparisonLabels = () => Object.fromEntries(COMPARISON_BINS.map(bin => [bin.id, bin.label]));

// -> payload {troopVN:Number, troopFrance:Number, equipmentVN:'limited', ...} or null while a slot is empty.
export function comparisonPayload(state) {
  const payload = {};
  for (const bin of COMPARISON_BINS) {
    const [token] = contents(state, bin.id);
    if (!token) return null;
    payload[bin.id] = token.kind === 'troop' ? token.value : token.id;
  }
  return payload;
}

export const emptySlotCount = state => COMPARISON_BINS.filter(bin => state.slots[bin.id].length === 0).length;
