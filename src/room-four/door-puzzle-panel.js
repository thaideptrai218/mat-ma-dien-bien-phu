// Short door puzzles for the locked Room 4 gates (data lives in area-gates.js). Each one uses a shared tactile
// component and takes a few seconds with facts the player has just read. The panel only collects an answer and emits
// 'door-submit'; the reducer decides, and wrong tries reach the Hệ Thống hint card.
import {element as node} from '../ui/dom-elements.js';
import {element, heading} from '../room-one/ui-elements.js';
import {createTokenBins} from '../ui/tactile/token-bins-model.js';
import {createTokenBinsView} from '../ui/tactile/token-bins-view.js';
import {createCombinationDial} from '../ui/tactile/combination-dial.js';
import {DIGITS} from '../ui/tactile/dial-model.js';
import {createRangeRuler} from '../ui/tactile/range-ruler.js';
import {DOOR_GATES} from './area-gates.js';

const SLOT = 'slot';

// Drag the right card into the lock; a wrong card bounces back to the tray.
function emblem(gate, submit) {
  const {door} = gate;
  const fresh = () => createTokenBins({tokens: door.choices.map(choice => ({id: choice.id, label: choice.label})), bins: [{id: SLOT, capacity: 1}], swap: true});
  const view = createTokenBinsView({state: fresh(), trayLabel: door.trayLabel, labels: {[SLOT]: door.slot}, className: 'r4-door-cards',
    onChange: (_model, {tokenId, binId} = {}) => {
      if (binId !== SLOT) return;
      submit(tokenId);
      if (view.root.isConnected) view.setState(fresh());
    }});
  return view.root;
}

const withSubmit = (control, submit) => node('div', {className: 'r4-door-control'}, control,
  node('button', {type: 'button', className: 'r1-button r1-primary', onClick: submit}, 'Mở khóa →'));

function ruler(gate, submit) {
  const {door} = gate;
  const control = createRangeRuler({min: door.min, max: door.max, value: door.value, label: door.rulerLabel});
  return withSubmit(control.element, () => submit(control.getValue()));
}

function dial(gate, submit) {
  const {door} = gate;
  const control = createCombinationDial({wheels: door.wheels, alphabet: DIGITS, label: door.dialLabel, wheelLabel: door.wheelLabel});
  return withSubmit(control.element, () => submit(control.getValue()));
}

const BUILDERS = {emblem, ruler, dial};

export function doorPanel(data, emit) {
  const gate = DOOR_GATES.find(item => item.id === data.gateId);
  const body = element('section', 'r4-puzzle r4-door');
  if (!gate || !BUILDERS[gate.door.kind]) { body.append(element('p', 'r1-muted', 'Khóa này không còn dùng được.')); return body; }
  body.append(heading(gate.door.title, 'PHÒNG 4 · KHÓA CỔNG'));
  body.append(element('p', 'r1-lead', gate.door.prompt), BUILDERS[gate.door.kind](gate, answer => emit('door-submit', {doorId: gate.id, answer})));
  return body;
}
