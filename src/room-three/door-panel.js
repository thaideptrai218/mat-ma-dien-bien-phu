// Short door puzzles for the fenced Room 3 areas (data lives in area-gates.js). Each one uses a shared tactile
// component and takes a few seconds with facts the player has just read. The panel only collects an answer and
// emits 'door-submit'; the reducer decides, and wrong tries reach the Hệ Thống hint card.
import {element as node} from '../ui/dom-elements.js';
import {element, heading} from '../room-one/ui-elements.js';
import {createTokenBins} from '../ui/tactile/token-bins-model.js';
import {createTokenBinsView} from '../ui/tactile/token-bins-view.js';
import {createRangeRuler} from '../ui/tactile/range-ruler.js';

const SLOT = 'slot';

// Drag the card of the right group into the lock; a wrong card bounces back to the tray.
function emblemControl({door}, attempt) {
  const fresh = () => createTokenBins({tokens: door.choices.map(choice => ({id: choice.id, label: choice.label})), bins: [{id: SLOT, capacity: 1}], swap: true});
  const view = createTokenBinsView({state: fresh(), trayLabel: 'Thẻ lực lượng', labels: {[SLOT]: door.slot}, className: 'r3-door-emblems',
    onChange: (_model, {tokenId, binId}) => {
      if (binId !== SLOT) return;
      attempt(tokenId);
      if (view.root.isConnected) view.setState(fresh()); // solved doors close this panel; a wrong try resets the lock
    }});
  return view.root;
}

function rulerControl({door}, attempt) {
  const ruler = createRangeRuler({min: door.min, max: door.max, value: door.value, label: door.rulerLabel});
  return node('div', {className: 'r3-door-control'}, ruler.element,
    node('button', {type: 'button', className: 'r1-button r1-primary', onClick: () => attempt(ruler.getValue())}, 'Mở khóa →'));
}

const CONTROLS = {emblem: emblemControl, ruler: rulerControl};

export function doorPanel({gate}, emit) {
  const body = element('section', 'r3-puzzle r3-door');
  const attempt = answer => emit('door-submit', {doorId: gate.id, answer});
  body.append(heading(gate.door.title, 'PHÒNG 3 · LỐI CÓ KHÓA'), element('p', 'r1-lead', gate.door.prompt), CONTROLS[gate.door.kind](gate, attempt));
  return body;
}
