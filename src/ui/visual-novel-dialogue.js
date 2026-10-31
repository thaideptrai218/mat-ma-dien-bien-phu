import {element, button} from '../room-one/ui-elements.js';
import {SPEAKERS, normalizeLine} from './visual-novel-speakers.js';
import {attachLineVoice} from './visual-novel-voice.js';

// Visual-novel dialogue shared by every room (same .vn-* markup as Room 2's narrative view): one line per
// step with speaker label + portrait, "i / n" counter, Trước / Tiếp lời / Đọc toàn cảnh. On the last line the
// next button becomes the session's own button (finish), so action tokens keep their old meaning.
//   script: strings (Long) or {speaker, text}; voice: createDialogueVoice() handle or null
//   finish: {label, onClick} | null (read-only: no confirm button); lastExtra: node shown only on the last line
export function visualNovelDialogue({title, eyebrow = 'LỜI THOẠI', script = [], voice = null, finish = null, lastExtra = null, note = ''}, emit) {
  const lines = script.map(normalizeLine);
  if (!lines.length) lines.push({speaker: 'Long', text: ''});
  let index = 0, wholeFrom = null; // wholeFrom: line the "Đọc toàn cảnh" reading started from
  const isLast = () => index === lines.length - 1;

  const node = element('section', 'vn-dialogue');
  const picture = element('img');
  picture.width = 180; picture.height = 235;
  const card = element('div', 'vn-narrator-card');
  const portrait = element('div', 'vn-portrait');
  portrait.append(picture, card);
  picture.addEventListener('error', () => { picture.hidden = true; card.hidden = false; });
  const name = element('strong'), counter = element('span');
  counter.setAttribute('aria-label', 'Thứ tự lời thoại');
  const text = element('div', 'vn-text');
  text.setAttribute('aria-live', 'polite');
  const previous = button('← Trước', () => { wholeFrom = null; index--; render(index === 0); }, 'vn-quiet');
  const whole = button('Đọc toàn cảnh', () => { wholeFrom = index; index = lines.length - 1; render(true); voiceControl?.play(); }, 'vn-quiet');
  const next = button('Tiếp lời →', () => {
    if (!isLast()) { index++; render(false); voiceControl?.play(); return; }
    finish?.onClick();
  }, 'vn-next');
  const controls = element('div', 'vn-controls');
  const copy = element('div', 'vn-copy');
  const extra = lastExtra ? element('div', 'vn-extra') : null;
  extra?.append(lastExtra);
  const rangeNow = () => wholeFrom === null ? {from: index, to: index + 1} : {from: wholeFrom, to: lines.length};
  const view = {emit, range: rangeNow, highlight: spoken => {
    text.querySelectorAll('p').forEach((p, i) => p.classList.toggle('is-speaking', wholeFrom === null ? i === 0 && spoken === index : i === spoken));
  }};
  const voiceControl = voice ? attachLineVoice(voice, lines, view) : null;
  if (voiceControl) controls.append(previous, whole, voiceControl.replay, next); else controls.append(previous, whole, next);
  copy.append(element('div', 'vn-speaker'), text);
  if (note) copy.append(element('p', 'vn-fiction', note));
  if (extra) copy.append(extra);
  copy.append(controls, element('p', 'vn-help', 'Esc đóng lời thoại · Tiếp lời để đọc tiếp'));
  node.append(element('p', 'r1-eyebrow', eyebrow), element('h2', '', title), element('div', 'vn-layout'));
  node.lastChild.append(portrait, copy);

  function render(focusNext) {
    const line = lines[index], speaker = SPEAKERS[line.speaker];
    picture.hidden = !speaker.portrait; card.hidden = Boolean(speaker.portrait);
    if (speaker.portrait) { picture.src = speaker.portrait; picture.alt = speaker.alt; }
    card.replaceChildren(element('span', 'vn-narrator-glyph', '❝'), element('span', '', speaker.name));
    name.textContent = speaker.name; counter.textContent = `${index + 1} / ${lines.length}`;
    copy.firstChild.replaceChildren(name, counter);
    text.replaceChildren(...(wholeFrom === null ? [line] : lines).map(item => {
      const p = element('p');
      if (wholeFrom !== null) p.append(element('b', 'vn-line-name', SPEAKERS[item.speaker].name), ' ');
      p.append(item.text);
      return p;
    }));
    previous.disabled = index === 0;
    const last = isLast();
    next.textContent = last ? (finish?.label || 'Đã đọc hết') : 'Tiếp lời →';
    next.classList.toggle('vn-final', last);
    next.hidden = last && !finish;
    whole.hidden = lines.length === 1;
    if (extra) extra.hidden = !last;
    voiceControl?.refresh();
    if (focusNext && !next.hidden) next.focus({preventScroll: true});
  }
  render(false);
  return {node, afterOpen: () => { if (!next.hidden) next.focus({preventScroll: true}); },
    cleanup: () => voiceControl?.cleanup(), dialogClass: 'vn-dialog'};
}
