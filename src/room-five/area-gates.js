import {validateGates} from '../core/area-gates.js';

// Room 5 area gates. Kept out of WORLD on purpose (world tests deep-check it). Each gate has exactly ONE method, fixed here:
//   'puzzle' - opens only by a short door puzzle (E at the rope); the result is kept in state.doorsSolved;
//   'auto'   - opens by itself once the task of the previous section is done (flag already in the save).
// `legacy` is a safety net for saves written before gates existed: later progress implies the gate is open,
// so nobody is ever trapped. It cannot be true in normal play before the gate is passed.
//
// Progression: entry + lamp + satchel -> [reconstruction-hall, puzzle] -> assembly table
//   -> [light-curtain, auto on assemblySolved] -> reflection light -> door.
const has = (list, id) => Array.isArray(list) && list.includes(id);

// Fragment numerals follow the order of the journey (fragment N comes from room N). Plaques are shown out of order
// on purpose, so the player matches by the room's name instead of by position.
const PLAQUES = Object.freeze([
  {id: 'room-3', label: 'Phòng 3 · Mật mã hậu phương'},
  {id: 'room-1', label: 'Phòng 1 · Trước bản kế hoạch'},
  {id: 'room-4', label: 'Phòng 4 · Những ngày quyết định'},
  {id: 'room-2', label: 'Phòng 2 · Bàn cờ Đông Dương'},
].map(Object.freeze));
const FRAGMENTS = Object.freeze(['I', 'II', 'III', 'IV']);
const ANSWER = 'room-1,room-2,room-3,room-4'; // fragment I..IV -> plaque, joined in numeral order

const GATE_SPECS = [
  {id: 'reconstruction-hall', method: 'puzzle', guards: ['assembly'], style: 'rope', rects: [[48, 890, 1904, 24]],
    legacy: state => state?.assemblySolved === true || has(state?.seenObjectIds, 'assembly'),
    notice: 'Sợi dây chắn lối vào gian phục dựng. Nhấn E để mở khóa.',
    door: {kind: 'plaques', label: 'Mở khóa lối vào gian phục dựng', title: 'Khóa lối vào gian phục dựng',
      prompt: 'Bốn mảnh tranh mang số La Mã theo thứ tự các phòng Ký Chủ đã đi qua. Kéo mỗi mảnh vào tấm biển của phòng đã cho Ký Chủ mảnh ấy, rồi bấm Mở khóa.',
      fragments: FRAGMENTS, plaques: PLAQUES, answer: ANSWER}},
  {id: 'light-curtain', method: 'auto', guards: ['reflection', 'door'], style: 'curtain',
    rects: [[48, 360, 412, 32], [760, 360, 480, 32], [1540, 360, 412, 32]],
    opensWhen: state => state?.assemblySolved === true, legacy: state => state?.reflectionSeen === true,
    notice: 'Tấm rèm sáng còn buông. Hệ Thống: Ký Chủ hãy ghép xong bức tranh trên bàn phục dựng trước.'},
];

export const doorSolved = (state, id) => has(state?.doorsSolved, id);

function toGate(spec) {
  const {id, method, legacy, opensWhen, door, ...rest} = spec;
  const unlockedBy = method === 'auto'
    ? state => opensWhen(state) === true || legacy(state) === true
    : state => doorSolved(state, id) || legacy(state) === true;
  return Object.freeze({...rest, id, method, door, unlockedBy});
}

export const AREA_GATES = validateGates(GATE_SPECS.map(toGate));
export const DOOR_GATES = Object.freeze(AREA_GATES.filter(gate => gate.method === 'puzzle'));
export const DOOR_IDS = Object.freeze(DOOR_GATES.map(gate => gate.id));
export const DOOR_OPENED_NOTICE = 'Sợi dây đã được gỡ. Lối vào gian phục dựng đã mở.';
export const doorObjectId = gateId => `door:${gateId}`;
export const doorViewKey = gateId => `door-${gateId}`; // also the SYSTEM_HINTS key
export const gateIdOfDoorView = view => DOOR_IDS.find(id => doorViewKey(id) === view) || null;

// Interactable stand-ins for locked puzzle gates (scene-only; WORLD is never touched).
export function doorObjects(lockedIds = []) {
  return DOOR_GATES.filter(gate => lockedIds.includes(gate.id)).map(gate => {
    const [x, y, w, h] = gate.rects[0];
    return Object.freeze({id: doorObjectId(gate.id), type: 'gate-door', gateId: gate.id, x: x + w / 2, y: y + h / 2, radius: 96, label: gate.door.label});
  });
}

// If the goal object sits behind a still-locked puzzle gate, the goal becomes that gate.
export function goalDoorFor(state, goalId) {
  const gate = DOOR_GATES.find(item => item.guards.includes(goalId) && !item.unlockedBy(state));
  return gate ? doorObjectId(gate.id) : null;
}

// Placement {fragment: plaqueId} -> the string the reducer checks; null while a fragment is still in the tray.
export function doorAnswerFromPlacement(gateId, placement = {}) {
  const gate = DOOR_GATES.find(item => item.id === gateId);
  if (!gate || !gate.door.fragments.every(id => typeof placement[id] === 'string')) return null;
  return gate.door.fragments.map(id => placement[id]).join(',');
}

export function checkDoorAnswer(gateId, answer) {
  const gate = DOOR_GATES.find(item => item.id === gateId);
  return Boolean(gate) && String(answer ?? '').trim() === String(gate.door.answer);
}
