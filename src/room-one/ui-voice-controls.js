import { element, button } from './ui-elements.js';
import { voicePreferences } from '../audio/voice-preferences.js';

// Dialogue panel: highlights the paragraph being read and, while recordings exist, offers "Nghe lại"
// (or "Bật lồng tiếng" when sound is still off/locked: a real click that unlocks audio and reads the panel).
// `voice` is the handle from createDialogueVoice(); without it the panel stays plain text. Returns a cleanup.
export function attachDialogueVoice(prose, paragraphs, voice, emit) {
  if (!voice) return () => {};
  let alive = true;
  const replay = button('Nghe lại', async () => {
    if (voice.soundReady()) { voice.replay(); return; }
    const ready = await voice.enable(emit);
    if (alive && ready) voice.start();
    refresh();
  }, 'r1-voice-replay');
  replay.hidden = true;
  const refresh = () => voice.available().then(ok => {
    if (!alive) return;
    const ready = voice.soundReady();
    replay.hidden = !ok;
    replay.textContent = ready ? 'Nghe lại' : 'Bật lồng tiếng';
    replay.setAttribute('aria-label', ready ? 'Nghe lại lời thoại' : 'Bật lồng tiếng để nghe lời thoại');
  }, () => {});
  voice.onLine = index => {
    paragraphs.forEach((paragraph, i) => paragraph.classList.toggle('is-speaking', i === index));
    if (index < 0) refresh();
  };
  prose.append(replay);
  refresh();
  return () => { alive = false; voice.onLine = () => {}; };
}

// Settings panel: voice-over switch and volume (relative to the master volume), saved by the voice module.
export function voiceSettings(preferences = voicePreferences) {
  const box = element('div', 'r1-voice-settings');
  const toggle = button('', () => { preferences.set({ enabled: !preferences.get().enabled }); }, 'r1-voice-toggle');
  const label = element('label', 'r1-voice-volume');
  const text = element('span');
  const slider = element('input');
  slider.type = 'range'; slider.min = '0'; slider.max = '100'; slider.step = '5';
  slider.addEventListener('input', () => preferences.set({ volume: Number(slider.value) / 100 }));
  label.append(text, slider);
  const render = ({ enabled, volume }) => {
    toggle.textContent = enabled ? 'Lồng tiếng: Bật' : 'Lồng tiếng: Tắt';
    toggle.setAttribute('aria-pressed', String(enabled));
    slider.value = String(Math.round(volume * 100));
    slider.disabled = !enabled;
    text.textContent = `Âm lượng lồng tiếng · ${slider.value}%`;
  };
  const unsubscribe = preferences.subscribe(render);
  render(preferences.get());
  box.append(toggle, label);
  return { node: box, cleanup: unsubscribe };
}
