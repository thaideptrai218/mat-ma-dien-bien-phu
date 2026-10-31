import {validateGates} from '../core/area-gates.js';

// Room 3 area gates + door puzzles, kept out of WORLD.walls on purpose (world tests assume an open camp).
// Every gate has exactly ONE method, fixed here and never re-rolled at runtime:
//   'auto'   opens by itself once the task of the previous section is done (flags already in the save);
//   'puzzle' opens only by solving a short door puzzle (E at the door); the result is kept in state.doorsSolved.
// `legacy` lists progress that can only exist after passing the gate. It is a safety net for saves written
// before gates existed, so nobody is ever trapped; it is unreachable in normal play.
//
// Progression (camp is entered at the south-west depot):
//   depot [prep. record, cabinet] -> (depot-rope) -> journal yard -> (cargo-pen) -> cargo yard
//   -> (road-barrier) -> command camp [telegrams, tent] -> (east-yard-curtain) -> east camp [letter, report]
//   -> (radio-pen) -> radio station; chest and exit stay in the open camp, locked by the story as before.
const has = (list, id) => Array.isArray(list) && list.includes(id);
const done = id => state => has(state?.completedChallenges, id);
const collected = id => state => has(state?.collectedNoteIds, id);
const anyOf = (...tests) => state => tests.some(test => test(state));

const GATE_SPECS = [
  // Rope across the whole depot, joined to the shelf at x1090. Opens when the prep. record is restored at the cabinet.
  {id: 'depot-rope', method: 'auto', guards: ['supply-journal'], style: 'rope', rects: [[1090, 44, 26, 1912]],
    opensWhen: done('preparation'), legacy: collected('supply-journal'),
    notice: 'Dây chắn kho còn căng. Hệ Thống: Ký Chủ hãy khôi phục hồ sơ ở tủ hồ sơ chuẩn bị trước.'},
  // Fence ring round the cargo yard; the door is the south side, facing the journal yard.
  {id: 'cargo-pen', method: 'puzzle', guards: ['cargo-yard'], style: 'bars',
    rects: [[1360, 1156, 300, 24], [1360, 880, 300, 24], [1360, 904, 24, 252], [1636, 904, 24, 252]],
    legacy: done('cargo'), notice: 'Bãi hàng có rào chắn. Nhấn E để mở khóa.',
    door: {kind: 'emblem', label: 'Mở khóa rào bãi hàng', title: 'Khóa rào bãi hàng',
      prompt: 'Sổ người đi cùng chuyến hàng nhắc ai mở và sửa những đoạn đường khó. Kéo thẻ của lực lượng ấy vào ổ khóa.',
      slot: 'Ổ khóa: lực lượng làm đường', choices: [{id: 'porters', label: 'Dân công gánh hàng'}, {id: 'engineers', label: 'Công binh làm đường'}, {id: 'artillery', label: 'Bộ đội kéo pháo'}],
      answer: 'engineers'}},
  // The road barrier: opened by the engineers, i.e. once the cargo route is restored.
  {id: 'road-barrier', method: 'auto', guards: ['command-telegrams'], style: 'barrier', rects: [[1780, 44, 26, 306], [1780, 630, 26, 270], [1780, 1000, 26, 956]],
    opensWhen: done('cargo'), legacy: collected('command-telegrams'),
    notice: 'Barie đường lên lều chỉ huy còn chắn. Hệ Thống: Ký Chủ hãy nối lại tuyến hàng ở bãi hàng trước.'},
  // Canvas screen across the east camp. Opens when the command tent has restored the two telegrams.
  {id: 'east-yard-curtain', method: 'auto', guards: ['opening-letter'], style: 'curtain', rects: [[2540, 44, 26, 1912]],
    opensWhen: done('strategy'), legacy: anyOf(collected('opening-letter'), done('opening')),
    notice: 'Tấm bạt chắn phía đông còn buông. Hệ Thống: Ký Chủ hãy khôi phục hai bức điện ở lều chỉ huy trước.'},
  // Fence ring round the radio station; the door is the north side, facing the report table.
  {id: 'radio-pen', method: 'puzzle', guards: ['radio-station'], style: 'rope',
    rects: [[2520, 1360, 300, 24], [2520, 1636, 300, 24], [2520, 1384, 24, 252], [2796, 1384, 24, 252]],
    legacy: done('opening'), notice: 'Trạm điện đài có dây chắn. Nhấn E để mở khóa.',
    door: {kind: 'ruler', label: 'Mở khóa dây chắn trạm điện đài', title: 'Khóa dây chắn trạm điện đài',
      prompt: 'Lá thư kể ngày bộ đội tiêu diệt cứ điểm Độc Lập. Kéo thước tới đúng ngày ấy rồi bấm Mở khóa.',
      rulerLabel: 'Ngày trong tháng Ba', min: 1, max: 31, value: 1, answer: 15}},
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
export const DOOR_OPENED_NOTICE = 'Ổ khóa bật mở. Lối đi đã thông.';
export const doorObjectId = gateId => `door:${gateId}`;
export const doorHintKey = gateId => `door-${gateId}`;

// If the goal object sits behind a still-locked puzzle door, the goal becomes that door.
export function goalDoorFor(state, goalId) {
  const gate = DOOR_GATES.find(item => item.guards.includes(goalId) && !item.unlockedBy(state));
  return gate ? doorObjectId(gate.id) : null;
}

// Interactable stand-ins for locked puzzle doors (scene-only; WORLD itself is never touched).
export function doorObjects(lockedIds = []) {
  return DOOR_GATES.filter(gate => lockedIds.includes(gate.id)).map(gate => {
    const [x, y, w, h] = gate.rects[0];
    return Object.freeze({id: doorObjectId(gate.id), type: 'door', gateId: gate.id, x: x + w / 2, y: y + h / 2, radius: 96, label: gate.door.label});
  });
}

// Answer check shared by the reducer: string/number answers compared after trimming.
export function checkDoorAnswer(gateId, answer) {
  const gate = DOOR_GATES.find(item => item.id === gateId);
  return Boolean(gate) && String(answer ?? '').trim() === String(gate.door.answer);
}
