// Chest lock: drag the two slogan strips (read from the solved T and L boards) into the two lock slots.
// The strip placed in slot 1 is spoken first. Output is the same phrase the typed field used to send.
import {element, heading} from '../room-one/ui-elements.js';
import {createTokenBins, contents, trayTokens} from '../ui/tactile/token-bins-model.js';
import {createTokenBinsView} from '../ui/tactile/token-bins-view.js';
import {BOARDS} from './puzzle-data.js';
import {strips, phraseFromSlots, SLOT_IDS} from './final-strips-model.js';

const SLOT_LABELS = {'slot-1': 'Khe thứ nhất của khóa', 'slot-2': 'Khe thứ hai của khóa'};

export function finalPanel(data, emit) {
  const body = element('section', 'r4-puzzle');
  body.append(heading('Lời quyết tâm trên nắp rương', 'PHÒNG 4 · MẬT KHẨU CUỐI'));
  if (data.solved) {
    body.append(element('p', 'r1-success', 'Khóa đã mở. Hãy đến chiếc rương để nhận mảnh tranh thứ tư.'));
    return body;
  }
  body.append(element('p', 'r1-lead', 'Hai dải chữ đã dò được ở bảng T và bảng L nằm trên khay. Kéo từng dải vào khe của khóa rương sao cho đọc thành một câu trọn vẹn, rồi bấm Mở khóa rương. Có thể bấm chọn dải rồi bấm khe, hoặc dùng bàn phím.'));
  const fresh = () => createTokenBins({tokens: strips(BOARDS), bins: SLOT_IDS.map(id => ({id, capacity: 1})), swap: true});
  const submit = element('button', 'r1-button r1-primary', 'Mở khóa rương');
  submit.type = 'button';
  let model = fresh();
  const sync = next => { model = next; submit.disabled = trayTokens(model).length > 0; };
  const view = createTokenBinsView({state: model, trayLabel: 'Khay dải chữ', labels: SLOT_LABELS, className: 'r4-strips',
    onChange: next => sync(next)});
  sync(model);
  submit.addEventListener('click', () => {
    emit('final-submit', {phrase: phraseFromSlots(SLOT_IDS.map(id => contents(model, id)[0]?.phrase ?? ''))});
    if (view.root.isConnected) { const reset = fresh(); view.setState(reset); sync(reset); } // a wrong try puts both strips back on the tray
  });
  body.append(view.root, submit);
  return body;
}
