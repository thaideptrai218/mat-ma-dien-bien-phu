import {button} from '../room-one/ui-elements.js';

// Voice side of the visual-novel dialogue. Only the step on screen is spoken: advancing plays that line,
// "Đọc toàn cảnh" plays the remaining lines in order. Quang is text-only, so his lines are skipped silently.
// `view` supplies range() -> {from, to} (lines to read), emit and highlight(lineIndex | -1).
export function attachLineVoice(voice, lines, view) {
  const replay = button('Nghe lại', async () => {
    if (voice.soundReady()) { play(); return; }
    const ready = await voice.enable(view.emit); // real click: turns sound on and unlocks audio
    if (alive && ready) play();
    refresh();
  }, 'vn-voice');
  replay.hidden = true;
  let alive = true, run = 0;
  const refresh = () => {
    const {from, to} = view.range();
    Promise.all([voice.available(lines), voice.available(lines.slice(from, to))]).then(([any, here]) => {
      if (!alive) return;
      const ready = voice.soundReady();
      replay.hidden = !any || voice.muted() || (ready && !here); // nothing to hear for this step
      replay.textContent = ready ? 'Nghe lại' : 'Bật lồng tiếng';
      replay.setAttribute('aria-label', ready ? 'Nghe lại lời thoại' : 'Bật lồng tiếng để nghe lời thoại');
    }, () => {});
  };
  function play() {
    if (!alive) return;
    const {from, to} = view.range(), mine = ++run;
    voice.speak(lines.slice(from, to), index => {
      if (!alive || mine !== run) return;
      view.highlight(index < 0 ? -1 : from + index);
      if (index < 0) refresh();
    });
  }
  // startDialogueVoice() calls start() once the panel is the active view: read the first step only.
  voice.start = play;
  refresh();
  return {replay, play, refresh, cleanup() { alive = false; run++; view.highlight(-1); }};
}
