import { element, button } from './ui-elements.js';
import { voicePreferences, mixPreferences } from '../audio/voice-preferences.js';

// A 0-100% slider bound to one numeric field of a preferences store; returns {label, render(values)}.
function volumeSlider(preferences, field, title) {
  const label = element('label', 'r1-voice-volume');
  const text = element('span');
  const slider = element('input');
  slider.type = 'range'; slider.min = '0'; slider.max = '100'; slider.step = '5';
  slider.addEventListener('input', () => preferences.set({ [field]: Number(slider.value) / 100 }));
  label.append(text, slider);
  return { label, slider, render: (values, enabled = true) => {
    slider.value = String(Math.round(values[field] * 100));
    slider.disabled = !enabled;
    text.textContent = `${title} · ${slider.value}%`;
  } };
}

// Settings panel: voice-over switch plus voice, effects and ambience volumes (all relative to the master volume).
// Saved by the audio preference modules, never in room saves.
export function voiceSettings(preferences = voicePreferences, mix = mixPreferences) {
  const box = element('div', 'r1-voice-settings');
  const toggle = button('', () => { preferences.set({ enabled: !preferences.get().enabled }); }, 'r1-voice-toggle');
  const voice = volumeSlider(preferences, 'volume', 'Âm lượng lồng tiếng');
  const effects = volumeSlider(mix, 'sfxVolume', 'Hiệu ứng');
  const ambience = volumeSlider(mix, 'ambienceVolume', 'Môi trường');
  const renderVoice = values => {
    toggle.textContent = values.enabled ? 'Lồng tiếng: Bật' : 'Lồng tiếng: Tắt';
    toggle.setAttribute('aria-pressed', String(values.enabled));
    voice.render(values, values.enabled);
  };
  const renderMix = values => { effects.render(values); ambience.render(values); };
  const stops = [preferences.subscribe(renderVoice), mix.subscribe(renderMix)];
  renderVoice(preferences.get()); renderMix(mix.get());
  box.append(toggle, voice.label, effects.label, ambience.label);
  return { node: box, cleanup: () => stops.forEach(stop => stop()) };
}
