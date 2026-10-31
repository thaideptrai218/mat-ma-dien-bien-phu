import {validateGates} from '../core/area-gates.js';

// Room 2 area gates + door puzzles. Kept out of WORLD/OBJECTS on purpose: the donor map is deep-compared by tests.
// Every gate has exactly ONE method, fixed here (never re-rolled at runtime):
//   'auto'   opens by itself once the task of the previous section is done (flags already in the save);
//   'puzzle' opens only by solving a short door puzzle (E at the door); the result is kept in state.doorsSolved.
// `legacy` lists progress that can only exist after passing the gate. It is a safety net for saves written
// before gates existed, so nobody is ever trapped; it is unreachable in normal play.
//
// Progression (goal order): balance -> [radio-hut] -> radio -> [south-west] -> diary -> [south-mid] -> newspaper
// -> [south-east] -> telegram -> [north-room] -> calendar -> fist -> dossier + fold -> exit.
// The middle hall (fist, dossier, fold stations) cannot be fenced: every route to the east wing passes within
// interaction range of those stations, so the donor station order guards them.
const has = (list, id) => Array.isArray(list) && list.includes(id);
const collected = (...ids) => state => ids.some(id => has(state?.collectedClueIds, id));
const solved = (...ids) => state => ids.some(id => has(state?.completedPuzzleIds, id));
const anyOf = (...tests) => state => tests.some(test => test(state));

const GATE_SPECS = [
  {id: 'radio-hut', method: 'auto', guards: ['nava-radio-note', 'nava-radio-station'], style: 'door', rects: [[1960, 500, 180, 32]],
    opensWhen: solved('nava-balance'), legacy: anyOf(collected('nava-radio-note'), solved('nava-radio')),
    notice: 'Cửa lán điện đài còn cài chặt. Hệ Thống: Ký Chủ hãy khóa cán cân bên bàn Nava trước.'},
  {id: 'south-west', method: 'puzzle', guards: ['nava-diary'], style: 'door', rects: [[260, 828, 180, 32]],
    legacy: anyOf(collected('nava-diary', 'nava-newspaper', 'nava-allied-telegram', 'nava-calendar'), solved('nava-fist')),
    notice: 'Cửa gian tây nam có khóa. Nhấn E để mở khóa.',
    door: {kind: 'emblem', label: 'Mở khóa cửa gian tây nam', title: 'Khóa cửa gian tây nam',
      prompt: 'Ghi chú trên điện đài nói rõ bên nào đang dồn quân về một chỗ. Kéo huy hiệu của bên ấy vào ổ khóa.',
      slot: 'Ổ khóa: bên dồn quân về một chỗ', choices: [{id: 'french', label: 'Bộ chỉ huy Pháp'}, {id: 'vietbac', label: 'Việt Bắc'}],
      answer: 'french'}},
  {id: 'south-mid', method: 'auto', guards: ['nava-newspaper'], style: 'door', rects: [[1080, 828, 180, 32]],
    opensWhen: collected('nava-diary'), legacy: anyOf(collected('nava-newspaper', 'nava-allied-telegram', 'nava-calendar'), solved('nava-fist')),
    notice: 'Cửa gian giữa phía nam còn cài chặt. Hệ Thống: Ký Chủ hãy ghi nhật ký chiến sĩ ở gian tây nam trước.'},
  {id: 'south-east', method: 'puzzle', guards: ['nava-allied-telegram'], style: 'door', rects: [[1880, 828, 180, 32]],
    legacy: anyOf(collected('nava-allied-telegram', 'nava-calendar'), solved('nava-fist')),
    notice: 'Cửa gian đông nam có khóa. Nhấn E để mở khóa.',
    door: {kind: 'ruler', label: 'Mở khóa cửa gian đông nam', title: 'Khóa cửa gian đông nam',
      prompt: 'Trang báo cũ ghi ngày liên quân Việt – Lào bắt đầu tiến công hướng Trung Lào. Kéo thước tới đúng ngày ấy rồi bấm Mở khóa.',
      rulerLabel: 'Ngày trong tháng', min: 1, max: 31, value: 1, answer: 21},
  },
  {id: 'north-room', method: 'puzzle', guards: ['nava-calendar'], style: 'door', rects: [[1180, 500, 180, 32]],
    legacy: anyOf(collected('nava-calendar'), solved('nava-fist')),
    notice: 'Cửa gian bản đồ phía bắc có khóa. Nhấn E để mở khóa.',
    door: {kind: 'dial', label: 'Mở khóa cửa gian bản đồ phía bắc', title: 'Khóa cửa gian bản đồ phía bắc',
      prompt: 'Bức điện liên quân Việt – Lào đề cuối một tháng. Xoay hai bánh số thành tháng ấy rồi bấm Mở khóa.',
      wheels: 2, wheelLabel: (index, total) => `Bánh số ${index + 1} trên ${total}`, dialLabel: 'Tháng trên bức điện', answer: '01'}},
];

// guards: object ids this gate shuts off (used to point the goal marker at the door while it is locked).
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
export const DOOR_OPENED_NOTICE = 'Ổ khóa bật mở. Cánh cửa đã mở lối.';
// If the goal object sits behind a still-locked puzzle door, the goal becomes that door.
export function goalDoorFor(state, goalId) {
  const gate = DOOR_GATES.find(item => item.guards.includes(goalId) && !item.unlockedBy(state));
  return gate ? doorObjectId(gate.id) : null;
}
export const doorObjectId = gateId => `door:${gateId}`;
export const doorHintKey = gateId => `door-${gateId}`;

// Interactable stand-ins for locked puzzle doors (scene-only; the donor WORLD is never touched).
export function doorObjects(lockedIds = []) {
  return DOOR_GATES.filter(gate => lockedIds.includes(gate.id)).map(gate => {
    const [x, y, w, h] = gate.rects[0];
    return Object.freeze({id: doorObjectId(gate.id), type: 'door', gateId: gate.id, x: x + w / 2, y: y + h / 2, radius: 96, label: gate.door.label});
  });
}

// Answer check shared by the reducer and the door panel: string/number answers compared after trimming.
export function checkDoorAnswer(gateId, answer) {
  const gate = DOOR_GATES.find(item => item.id === gateId);
  return Boolean(gate) && String(answer ?? '').trim() === String(gate.door.answer);
}
