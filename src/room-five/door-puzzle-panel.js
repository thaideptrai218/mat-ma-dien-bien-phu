// Door puzzle panel for the locked reconstruction hall: drag each fragment numeral onto the plaque of the room it came from.
// The view only collects a placement and emits 'solve-door'; the reducer (rules.js) decides. Wrong tries reach the Hệ Thống card.
import {element, button, heading} from '../room-one/ui-elements.js';
import {createTokenBins, placementOf} from '../ui/tactile/token-bins-model.js';
import {createTokenBinsView} from '../ui/tactile/token-bins-view.js';
import {DOOR_GATES, doorAnswerFromPlacement} from './area-gates.js';

export function doorPanel(gateId, data, emit) {
  const gate = DOOR_GATES.find(item => item.id === gateId), node = element('section', 'r5-door-puzzle');
  if (!gate) {node.append(element('p', 'r1-lead', 'Khóa này không còn tác dụng.')); return {node};}
  const {door} = gate;
  const state = createTokenBins({tokens: door.fragments.map(id => ({id, label: `Mảnh ${id}`})),
    bins: door.plaques.map(plaque => ({id: plaque.id, capacity: 1})), swap: true});
  const view = createTokenBinsView({state, trayLabel: 'Mảnh tranh trong túi', className: 'r5-door-plaques',
    labels: Object.fromEntries(door.plaques.map(plaque => [plaque.id, plaque.label]))});
  const status = element('p', 'r5-selection-status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  const submit = () => {
    const answer = doorAnswerFromPlacement(gate.id, placementOf(view.getState()));
    if (answer === null) {status.textContent = 'Còn mảnh chưa đặt vào tấm biển nào.'; return;}
    status.textContent = ''; emit('solve-door', {doorId: gate.id, answer, token: data.token});
  };
  node.append(heading(door.title, 'PHÒNG 5 · SỢI DÂY CHẮN'), element('p', 'r1-lead', door.prompt), view.root, status,
    button('Mở khóa →', submit, 'r1-primary'));
  return {node, cleanup: () => view.destroy()};
}
