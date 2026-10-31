import {validateGates} from '../core/area-gates.js';

// Room 4 area gates. The archive is one open hall, so the gates are barrier lines across it: together they cut the
// floor into a chain of sections that open in the order the seven papers are read (timeline order).
// Every gate has exactly ONE unlock method, fixed here (never re-rolled at runtime):
//   'auto'   opens by itself once the task of the previous section is done (flags already in the save);
//   'puzzle' opens only by solving a short door puzzle (E at the lock); the result is kept in state.doorsSolved.
// `legacy` lists progress that can only exist after passing the gate. It is a safety net for saves written before
// gates existed, so nobody is ever trapped; it is unreachable in normal play.
//
// Section chain (clockwise ring around the cipher chamber):
//   start+01 (south-west) -> [final-assault] 02 (west) -> [a1-night] 03 + crossword gallery (north-west/north)
//   -> [headquarters] 04 (north-east) -> [results] 05 (east) -> [north] 06 + radio (south-east)
//   -> [independence] 07 (south) ; the middle chamber (boards T/L and chest) sits behind [cipher-cordon].
const has = (list, id) => Array.isArray(list) && list.includes(id);
const collected = id => state => has(state?.collectedNoteIds, id);
const reached = id => state => has(state?.readNoteIds, id) || has(state?.collectedNoteIds, id);
const anyOf = (...tests) => state => tests.some(test => test(state));

const GATE_SPECS = [
  {id: 'final-assault', method: 'auto', guards: ['final-assault'], style: 'rope', rects: [[48, 1030, 782, 32]],
    opensWhen: collected('east-offensive'), legacy: reached('final-assault'),
    notice: 'Lối lên gian phía tây còn bị chặn. Hệ Thống: Ký Chủ hãy ghi lá thư đầu tiên vào sổ tay trước.'},
  {id: 'a1-night', method: 'puzzle', guards: ['a1', 'crossword', 'door'], style: 'bars', rects: [[48, 430, 782, 32]],
    legacy: reached('a1'),
    notice: 'Cổng song phía tây bắc có khóa. Nhấn E để mở khóa.',
    door: {kind: 'emblem', label: 'Mở khóa cổng song phía tây bắc', title: 'Khóa cổng song phía tây bắc',
      prompt: 'Bản tổng hợp đầu tháng năm để riêng một mục, vì đợt tiến công này chỉ chuẩn bị điều kiện cho bước quyết định ấy. Kéo tấm thẻ đúng vào ổ khóa.',
      slot: 'Ổ khóa: bước quyết định tiếp theo', trayLabel: 'Thẻ',
      choices: [{id: 'general-offensive', label: 'Tổng công kích'}, {id: 'geneva', label: 'Hiệp định Genève'}, {id: 'nava', label: 'Kế hoạch Nava'}],
      answer: 'general-offensive'}},
  {id: 'headquarters', method: 'auto', guards: ['headquarters'], style: 'rope', rects: [[1800, 48, 32, 366]],
    opensWhen: collected('a1'), legacy: reached('headquarters'),
    notice: 'Lối sang gian đông bắc còn bị chặn. Hệ Thống: Ký Chủ hãy ghi trang sổ sau đêm A1 vào sổ tay trước.'},
  {id: 'results', method: 'puzzle', guards: ['results'], style: 'bars', rects: [[1970, 520, 782, 32]],
    legacy: reached('results'),
    notice: 'Cổng song phía đông có khóa. Nhấn E để mở khóa.',
    door: {kind: 'dial', label: 'Mở khóa cổng song phía đông', title: 'Khóa cổng song phía đông',
      prompt: 'Lá thư tối mồng bảy ghi giờ quân ta chiếm sở chỉ huy. Xoay bốn bánh số thành giờ rồi phút ấy, sau đó bấm Mở khóa.',
      wheels: 4, wheelLabel: (index, total) => `Bánh số ${index + 1} trên ${total}`, dialLabel: 'Giờ rồi phút trong lá thư', answer: '1730'}},
  {id: 'north', method: 'puzzle', guards: ['north', 'radio'], style: 'bars', rects: [[1970, 1000, 782, 32]],
    legacy: reached('north'),
    notice: 'Cổng song phía đông nam có khóa. Nhấn E để mở khóa.',
    door: {kind: 'ruler', label: 'Mở khóa cổng song phía đông nam', title: 'Khóa cổng song phía đông nam',
      prompt: 'Bản ghi kết quả đếm số ngày đêm chiến dịch kéo dài. Kéo thước tới đúng số ngày đêm ấy rồi bấm Mở khóa.',
      rulerLabel: 'Số ngày đêm', min: 1, max: 90, value: 30, answer: 56}},
  {id: 'independence', method: 'auto', guards: ['independence'], style: 'rope', rects: [[1580, 1150, 32, 602], [1990, 1032, 32, 720]],
    opensWhen: collected('north'), legacy: reached('independence'),
    notice: 'Lối xuống gian phía nam còn bị chặn. Hệ Thống: Ký Chủ hãy ghi cuốn sổ của người dạy học vào sổ tay trước.'},
  {id: 'cipher-cordon', method: 'auto', guards: ['board-t', 'board-l', 'chest'], style: 'rope',
    rects: [[1160, 414, 480, 30], [830, 444, 30, 706], [1940, 444, 30, 706], [830, 1120, 1140, 30]],
    opensWhen: state => state?.columnSolved === true,
    legacy: anyOf(state => state?.boardTSolved === true, state => state?.boardLSolved === true, state => state?.chestOpened === true),
    notice: 'Dây chắn khu mật mã còn căng. Hệ Thống: Ký Chủ hãy tìm lời chỉ dẫn ở bảng ô chữ trước.'},
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
export const DOOR_OPENED_NOTICE = 'Ổ khóa bật mở. Lối đi phía trước đã thông.';
export const doorObjectId = gateId => `door:${gateId}`;
export const doorHintKey = gateId => `door-${gateId}`;

// If the goal object sits behind a still-locked puzzle door, the goal becomes that door.
export function goalDoorFor(state, goalId) {
  const gate = DOOR_GATES.find(item => item.guards.includes(goalId) && !item.unlockedBy(state));
  return gate ? doorObjectId(gate.id) : null;
}

// Interactable stand-ins for locked puzzle doors (scene-only; the WORLD objects list is never touched).
export function doorObjects(lockedIds = []) {
  return DOOR_GATES.filter(gate => lockedIds.includes(gate.id)).map(gate => {
    const [x, y, w, h] = gate.rects[0];
    return Object.freeze({id: doorObjectId(gate.id), type: 'lock', gateId: gate.id, x: x + w / 2, y: y + h / 2, radius: 96, label: gate.door.label});
  });
}

// Answer check shared by the reducer and the door panel: answers are compared as trimmed text.
export function checkDoorAnswer(gateId, answer) {
  const gate = DOOR_GATES.find(item => item.id === gateId);
  return Boolean(gate) && String(answer ?? '').trim() === String(gate.door.answer);
}
