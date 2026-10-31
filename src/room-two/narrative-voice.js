import {beats} from './system-guidance.js';

const SPEAKERS = {system: 'Hệ Thống', quang: 'Quang'};

// Voices Bảo's visual-novel view from the outside: the donor NarrativeView is never edited, its instance
// method renderLine() is wrapped so each line shown (or the whole scene) is read aloud.
export function attachNarrativeVoice(narrative, getAudio) {
  const renderLine = narrative.renderLine.bind(narrative);
  narrative.renderLine = (...args) => {
    renderLine(...args);
    if (args[0] !== false) getAudio()?.playCue?.('ui-advance'); // 'Tiếp lời' / '← Trước' (opening the view passes false)
    const active = narrative.active, beat = active && beats[active.beatId];
    if (!beat) return;
    const shown = {beatId: active.beatId, lineIndex: active.lineIndex, whole: narrative.wholeScene};
    const lines = (shown.whole ? beat.lines : [beat.lines[shown.lineIndex]])
      .map(line => ({speaker: SPEAKERS[line.speakerId] ?? 'Quang', text: line.text}));
    // Deferred so the session has switched the audio mode to "dialogue" (it renders right after opening the view).
    queueMicrotask(() => {
      const now = narrative.active;
      if (!now || now.beatId !== shown.beatId || now.lineIndex !== shown.lineIndex || narrative.wholeScene !== shown.whole) return;
      getAudio()?.voice?.playSequence(lines);
    });
  };
}
