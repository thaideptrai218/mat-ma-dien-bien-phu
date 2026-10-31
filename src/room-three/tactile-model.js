// Pure models for the Room 3 drag-and-drop boards. Each board turns placed tokens back into the exact payload the
// evaluators in answers.js already accept, so the answers and the reducer are unchanged by the new interaction.
import {createTokenBins, placementOf, contents, trayTokens} from '../ui/tactile/token-bins-model.js';
import {PREPARATION_CARDS, CARGO_ITEMS, TELEGRAMS, OPENING_EVENTS} from './puzzle-data.js';

export const PREPARATION_GROUPS = Object.freeze([
  ['decision', 'Mốc đầu · 6/12/1953'], ['preparation', 'Giai đoạn chuẩn bị · các việc đan xen'], ['opening', 'Mốc mở màn · 13/3/1954'],
]);
export const SUPPLY_TOKENS = Object.freeze([
  {id: 'banners', label: 'Cờ hội, hoa trang trí'}, {id: 'food', label: 'Lương thực'}, {id: 'trinkets', label: 'Đồ lưu niệm'},
  {id: 'weapons', label: 'Vũ khí'}, {id: 'ammunition', label: 'Đạn dược'}, {id: 'medical', label: 'Thuốc men'},
]);
const SLOT = index => `slot-${index + 1}`;
const slots = count => Array.from({length: count}, (_, index) => ({id: SLOT(index), capacity: 1}));
const rotate = (list, by) => [...list.slice(by), ...list.slice(0, by)]; // fixed shuffle: the first view is never already solved

// Every factory takes a saved placement ({tokenId: binId}); a stale or invalid placement falls back to an empty board.
export const restoreBoard = (make, placement) => {
  try { return make(placement ?? {}); } catch { return make({}); }
};
export const allPlaced = model => trayTokens(model).length === 0;

export const preparationCardsBoard = placement => createTokenBins({placement,
  tokens: PREPARATION_CARDS.map(card => ({id: card.id, label: card.text})), bins: PREPARATION_GROUPS.map(([id]) => ({id}))});
export const groupsPayload = model => ({...placementOf(model)});

export const suppliesBoard = placement => createTokenBins({placement, tokens: SUPPLY_TOKENS.map(token => ({...token})), bins: [{id: 'depot'}]});
export const suppliesPayload = model => contents(model, 'depot').map(token => token.id);

// Six labels dragged onto six pictures (one label per picture, dropping on a full picture swaps them).
export const cargoBoard = placement => createTokenBins({placement, swap: true,
  tokens: [...CARGO_ITEMS].reverse().map(item => ({id: item.id, label: item.label})), bins: CARGO_ITEMS.map(item => ({id: item.id, capacity: 1}))});
export const matchesPayload = model => Object.fromEntries(model.binOrder
  .filter(binId => model.slots[binId].length).map(binId => [binId, model.slots[binId][0]]));

export const TELEGRAM_KEYS = Object.freeze(['initial', 'final']);
export const telegramBoard = key => placement => createTokenBins({placement, swap: true,
  tokens: rotate(TELEGRAMS[key], 2).map(word => ({id: word.id, label: word.text})), bins: slots(TELEGRAMS[key].length)});
// Words read in slot order; identical NHANH / CHẮC cards stay interchangeable exactly as telegramCorrect expects.
export const telegramPayload = model => model.binOrder.flatMap(binId => model.slots[binId]);

export const newsOrderBoard = placement => createTokenBins({placement, swap: true,
  tokens: [...OPENING_EVENTS].reverse().map(event => ({id: event.id, label: event.text})), bins: slots(OPENING_EVENTS.length)});
export const newsOrderPayload = telegramPayload;

export const datesBoard = placement => createTokenBins({placement, swap: true,
  tokens: rotate(OPENING_EVENTS, 1).map(event => ({id: `date-${event.id}`, label: event.date.replace(/\/0/g, '/'), date: event.date})),
  bins: [...OPENING_EVENTS].reverse().map(event => ({id: event.id, capacity: 1}))});
export const datesPayload = model => Object.fromEntries(model.binOrder
  .filter(binId => model.slots[binId].length).map(binId => [binId, model.tokens[model.slots[binId][0]].date]));

export const FINAL_SLOTS = Object.freeze([['day', 'Ngày'], ['month', 'Tháng'], ['year', 'Năm']]);
// The chest lock takes the reward cards the player has actually earned (recoveredTokens in rules.js).
export const finalLockBoard = tokens => placement => createTokenBins({placement, swap: true,
  tokens: tokens.map(token => ({id: token.id, label: token.label})), bins: FINAL_SLOTS.map(([id]) => ({id, capacity: 1}))});
// dd/mm/yyyy from the numbers on the cards; '' while a slot is empty or holds a card without a number.
export function composeDate(model) {
  const parts = FINAL_SLOTS.map(([binId]) => {
    const token = model.slots[binId][0] && model.tokens[model.slots[binId][0]];
    return token ? /\d+/.exec(token.label)?.[0] ?? null : null;
  });
  if (parts.includes(null)) return '';
  return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`;
}
