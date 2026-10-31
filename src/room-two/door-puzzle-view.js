// Short door puzzles for the locked Room 2 doors (data lives in area-gates.js). Each one uses a shared tactile
// component and finishes in a few seconds with facts the player has just read. The view only collects an answer
// and hands it to onAttempt(doorId, answer); the reducer decides, and wrong tries reach the Hệ Thống hint card.
import {element, paragraph} from '../ui/dom-elements.js';
import {createTokenBins} from '../ui/tactile/token-bins-model.js';
import {createTokenBinsView} from '../ui/tactile/token-bins-view.js';
import {createCombinationDial} from '../ui/tactile/combination-dial.js';
import {DIGITS} from '../ui/tactile/dial-model.js';
import {createRangeRuler} from '../ui/tactile/range-ruler.js';

const SLOT = 'slot';

export class DoorPuzzleView {
  constructor({dialog, onAttempt}) {
    this.dialog = dialog; this.onAttempt = onAttempt; this.feedback = null;
  }

  show(gate) {
    const {door} = gate;
    const builders = {emblem: () => this.emblem(gate), ruler: () => this.ruler(gate), dial: () => this.dial(gate)};
    this.feedback = element('div', {className: 'r2-door-feedback', role: 'status', 'aria-live': 'polite'});
    const content = element('div', {className: 'r2-door'}, paragraph(door.prompt), builders[door.kind](), this.feedback);
    this.dialog.show({title: door.title, kicker: 'CỬA CÓ KHÓA', content});
  }

  showFeedback(text) {
    if (this.feedback?.isConnected) this.feedback.replaceChildren(paragraph(text, 'feedback error'));
  }

  // Drag the emblem of the right side into the lock; a wrong emblem bounces back to the tray.
  emblem({id, door}) {
    const fresh = () => createTokenBins({tokens: door.choices.map(choice => ({id: choice.id, label: choice.label})),
      bins: [{id: SLOT, capacity: 1}], swap: true});
    const view = createTokenBinsView({state: fresh(), trayLabel: 'Huy hiệu', labels: {[SLOT]: door.slot}, className: 'r2-door-emblems',
      onChange: (model, {tokenId, binId}) => {
        if (binId !== SLOT) return;
        this.onAttempt(id, tokenId);
        if (view.root.isConnected) view.setState(fresh()); // solved doors close this panel; wrong tries reset the lock
      }});
    return view.root;
  }

  ruler({id, door}) {
    const ruler = createRangeRuler({min: door.min, max: door.max, value: door.value, label: door.rulerLabel});
    return this.withSubmit(ruler.element, () => this.onAttempt(id, ruler.getValue()));
  }

  dial({id, door}) {
    const dial = createCombinationDial({wheels: door.wheels, alphabet: DIGITS, label: door.dialLabel, wheelLabel: door.wheelLabel});
    return this.withSubmit(dial.element, () => this.onAttempt(id, dial.getValue()));
  }

  withSubmit(control, submit) {
    return element('div', {className: 'r2-door-control'}, control,
      element('button', {type: 'button', className: 'primary-button', onClick: submit}, 'Mở khóa →'));
  }
}
