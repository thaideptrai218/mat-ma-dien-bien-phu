import {DOOR_IDS, checkDoorAnswer} from './area-gates.js';

export const OBJECT_IDS = ['assembly', 'reflection', 'door', 'lamp', 'satchel'];
export const CORRECT_ORDER = Object.freeze([0, 1, 2, 3]);

export function createState() {
  return {version: 1, introSeen: false, seenObjectIds: [], assemblySolved: false,
    reflectionSeen: false, exitReached: false, doorsSolved: [], audioEnabled: false, audioVolume: .5};
}

export function hasAllFragments(fragments) {
  return Array.isArray(fragments) && [1, 2, 3, 4].every(id => fragments.includes(id));
}

export function reduce(state, action, payload = {}, fragments = []) {
  if (action === 'intro' && !state.introSeen) return {...state, introSeen: true};
  if (action === 'seen' && OBJECT_IDS.includes(payload.id) && !state.seenObjectIds.includes(payload.id)) {
    return {...state, seenObjectIds: [...state.seenObjectIds, payload.id]};
  }
  if (action === 'assembly' && !state.assemblySolved && hasAllFragments(fragments) &&
    Array.isArray(payload.order) && payload.order.length === 4 &&
    CORRECT_ORDER.every((id, index) => payload.order[index] === id)) {
    return {...state, assemblySolved: true};
  }
  // The optional personal response never crosses the UI boundary. This action has no answer payload.
  if (action === 'reflection' && hasAllFragments(fragments) && state.assemblySolved && !state.reflectionSeen) {
    return {...state, reflectionSeen: true};
  }
  if (action === 'exit' && hasAllFragments(fragments) && state.assemblySolved && state.reflectionSeen && !state.exitReached) {
    return {...state, exitReached: true};
  }
  if (action === 'solve-door' && DOOR_IDS.includes(payload.doorId) && !state.doorsSolved.includes(payload.doorId) &&
    !state.exitReached && checkDoorAnswer(payload.doorId, payload.answer)) {
    return {...state, doorsSolved: [...state.doorsSolved, payload.doorId]};
  }
  if (action === 'audio') return {...state, audioEnabled: !state.audioEnabled};
  return state;
}

export function goalFor(state, fragments = []) {
  const steps = [
    {title: 'Ghép bốn mảnh tranh', done: state.assemblySolved},
    {title: 'Lắng nghe câu hỏi cuối', done: state.reflectionSeen},
    {title: 'Bước qua cánh cửa', done: state.exitReached},
  ];
  const step = !state.assemblySolved ? 0 : !state.reflectionSeen ? 1 : 2;
  const goals = [
    {id: 'assembly', label: 'Đến bàn phục dựng bức tranh', detail: hasAllFragments(fragments)
      ? 'Chọn hai mảnh để đổi chỗ. Hoàn thiện bức tranh từ bốn phần tư.'
      : 'Cần đủ mảnh I, II, III, IV kiếm được trong hành trình. Phòng này không cấp mảnh còn thiếu.'},
    {id: 'reflection', label: 'Đến nơi ánh sáng cạnh cửa', detail: 'Bức tranh đã nguyên vẹn, nhưng cửa vẫn đóng. Còn một cuộc trò chuyện cần lắng nghe.'},
    {id: 'door', label: state.exitReached ? 'Đã bước qua cửa trở về' : 'Đi tới cửa phía bắc', detail: 'Đến gần cánh cửa rồi nhấn E để trở lại bảo tàng.'},
  ];
  return {...goals[step], step, steps, count: `Mảnh tranh: ${[1, 2, 3, 4].filter(id => fragments.includes(id)).length}/4`};
}
