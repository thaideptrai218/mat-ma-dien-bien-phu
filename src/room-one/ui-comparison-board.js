// Comparison desk view: drag (or click / keyboard) the eight fact cards into the slots, then submit.
// The tactile view (it imports CSS) is loaded on demand so node tests that reach this module never touch CSS.
import {element, submitButton} from './ui-elements.js';
import {createComparisonBoard, comparisonLabels, comparisonPayload, emptySlotCount} from './comparison-board-model.js';

export function comparisonBoard(emit) {
  const form = element('form', 'r1-comparison r1-comparison-board');
  const status = element('p', 'r1-board-status', 'Đang chuẩn bị bàn đối chiếu…');
  status.setAttribute('aria-live', 'polite');
  const submit = submitButton('Đối chiếu bốn hồ sơ');
  submit.disabled = true;
  let view = null;
  const sync = state => {
    const missing = emptySlotCount(state);
    submit.disabled = missing > 0;
    status.textContent = missing ? `Còn ${missing} ô trống.` : 'Đã đủ tám ô. Có thể đối chiếu.';
  };
  const holder = element('div');
  form.append(element('p', 'r1-muted', 'Kéo thẻ vào ô, hoặc bấm thẻ rồi bấm ô đích. Bàn phím: Enter nhấc thẻ, mũi tên chọn ô, Enter thả, Delete trả thẻ.'), holder, status, submit);
  import('../ui/tactile/token-bins-view.js').then(({createTokenBinsView}) => {
    view = createTokenBinsView({state: createComparisonBoard(), labels: comparisonLabels(), trayLabel: 'Thẻ dữ kiện', className: 'r1-board', onChange: sync});
    holder.replaceChildren(view.root); sync(view.getState());
  }).catch(() => { status.textContent = 'Không tải được bàn đối chiếu. Hãy tải lại trang.'; });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const payload = view && comparisonPayload(view.getState());
    if (payload) emit('comparison-submit', payload);
  });
  return form;
}
