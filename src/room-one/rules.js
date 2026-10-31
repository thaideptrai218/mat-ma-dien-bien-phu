import { DOOR_PUZZLES, doorAnswerCorrect, doorAvailable } from './door-puzzles.js';
import { gateIsOpen, firstAnchorId } from './area-gates.js';
export const NOTE_IDS = Object.freeze(['v1', 'v2', 'p1', 'p2']);
export function createState() {
  return { version: 1, introSeen: false, letterSolved: false, envelopeOpened: false,
    readNoteIds: [], collectedNoteIds: [], seenObjectIds: [], comparisonSolved: false,
    drawerOpened: false, identitySolved: false, chestOpened: false, exitReached: false, doorsSolved: [],
    audioEnabled: false, audioVolume: .5 };
}
export const normalizeAnswer = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '').toUpperCase();
export function comparisonCorrect(p) {
  return Number(p.troopVN) === 252000 && Number(p.troopFrance) === 445000 &&
    p.equipmentVN === 'limited' && p.equipmentFrance === 'modern' &&
    p.positionVN === 'initiative' && p.positionFrance === 'dispersed' &&
    p.pressureVN === 'supply' && p.pressureFrance === 'costs';
}
// Every stage validates its predecessor, including when a correct answer is guessed early.
export function reduce(state, action, payload = {}) {
  switch (action) {
    case 'intro': return { ...state, introSeen: true };
    case 'seen': return typeof payload.id === 'string' && !state.seenObjectIds.includes(payload.id)
      ? { ...state, seenObjectIds: [...state.seenObjectIds, payload.id] } : state;
    case 'letter': return payload.documentId === 'restored-letter' ? { ...state, letterSolved: true } : state;
    case 'map': return state.letterSolved && normalizeAnswer(payload.cell) === 'A03' ? { ...state, envelopeOpened: true } : state;
    case 'read': return state.envelopeOpened && NOTE_IDS.includes(payload.id) && !state.readNoteIds.includes(payload.id)
      ? { ...state, readNoteIds: [...state.readNoteIds, payload.id] } : state;
    case 'collect': return state.envelopeOpened && state.readNoteIds.includes(payload.id) && NOTE_IDS.includes(payload.id) && !state.collectedNoteIds.includes(payload.id)
      ? { ...state, collectedNoteIds: [...state.collectedNoteIds, payload.id] } : state;
    case 'comparison': return NOTE_IDS.every(id => state.collectedNoteIds.includes(id)) && comparisonCorrect(payload)
      ? { ...state, comparisonSolved: true } : state;
    case 'drawer': return state.comparisonSolved && normalizeAnswer(payload.code) === '2413' ? { ...state, drawerOpened: true } : state;
    case 'identity': return state.drawerOpened && normalizeAnswer(payload.name) === 'HENRINAVARRE' ? { ...state, identitySolved: true } : state;
    case 'chest': return state.identitySolved && normalizeAnswer(payload.keyword) === 'NAVA' ? { ...state, chestOpened: true } : state;
    case 'door': return doorAvailable(payload.id, state) && !(state.doorsSolved || []).includes(payload.id) && doorAnswerCorrect(payload.id, payload)
      ? { ...state, doorsSolved: [...(state.doorsSolved || []), payload.id] } : state;
    case 'exit': return state.chestOpened && gateIsOpen('exit-hall', state) ? { ...state, exitReached: true } : state;
    case 'audio': return { ...state, audioEnabled: !state.audioEnabled };
    case 'volume': return Number.isFinite(payload.value) ? {...state,audioVolume:Math.max(0,Math.min(1,payload.value))} : state;
    default: return state;
  }
}
// Objects that sit behind a puzzle-type gate: while that gate is shut the goal points at the gate's lock instead.
const GATED_TARGET = { v1: 'west-archive', v2: 'west-archive', drawer: 'drawer-alcove', door: 'exit-hall' };
export function goalFor(s) {
  const goal = baseGoal(s), gate = GATED_TARGET[goal.id];
  if (!gate || gateIsOpen(gate, s)) return goal;
  return { ...goal, id: firstAnchorId(gate), label: `Mở khóa: ${DOOR_PUZZLES[gate].title}`, detail: 'Nhấn E ở chỗ khóa rồi xoay các bánh để mở lối đi.' };
}
function baseGoal(s) {
  const steps = [
    { title: 'Đọc lá thư và tìm A-03', done: s.envelopeOpened },
    { title: 'Đọc, suy luận và đối chiếu bốn hồ sơ', done: s.comparisonSolved },
    { title: 'Mở ngăn kéo và giải điện mật', done: s.identitySolved },
    { title: 'Mở rương, nhận mảnh ký ức', done: s.exitReached },
  ];
  let id = 'letter', label = 'Đọc lá thư gửi người nhà', detail = 'Một phong thư nằm trên bàn gần cửa vào.', step = 0;
  if (s.letterSolved) { id = 'map-a03'; label = 'Tìm ô A-03 trên bản đồ'; detail = 'Bản đồ nằm trên bức tường phía bắc.'; }
  if (s.envelopeOpened) {
    step = 1; id = NOTE_IDS.find(note => !s.collectedNoteIds.includes(note)) || 'comparison';
    label = id === 'comparison' ? 'Đối chiếu lực lượng hai phía' : `Đọc hồ sơ ${id[0] === 'v' ? 'V' : 'P'}-0${id[1]}`;
    detail = id === 'comparison' ? 'Đưa dữ kiện về bàn đối chiếu ở giữa phòng.' : 'Đọc đầy đủ trang giấy, cùng Long suy luận rồi ghi dữ kiện.';
  }
  if (s.comparisonSolved) { step = 2; id = 'drawer'; label = 'Mở ngăn kéo: 2413'; detail = 'Bốn hàng đối chiếu đã cho bốn chữ số 2 · 4 · 1 · 3.'; }
  if (s.drawerOpened) { id = 'drawer'; label = 'Giải tên người trong điện mật'; detail = 'Dùng bảng A1Z26 nằm trong ngăn kéo.'; }
  if (s.identitySolved) { step = 3; id = 'chest'; label = 'Mang tên Nava đến rương sắt'; detail = 'Nhập họ được Việt hóa trong lời suy luận: NAVA.'; }
  if (s.chestOpened) { id = 'door'; label = 'Đến cửa phía bắc'; detail = 'Bạn đã có mảnh tranh đầu tiên.'; }
  if (s.exitReached) { label = 'Đã hoàn thành phòng 1'; detail = 'Bốn mảnh tranh thuộc toàn bộ hành trình; hiện bạn đã tìm được mảnh thứ nhất.'; }
  return { id, label, detail, step, steps, count: `${s.collectedNoteIds.length} / 4 hồ sơ` };
}
