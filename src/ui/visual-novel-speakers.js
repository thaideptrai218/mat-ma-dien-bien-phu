// Speaker table for the visual-novel dialogue: label, portrait asset and accessible description.
// Plain strings in a script are the hero's thoughts; {speaker, text} objects name the speaker.
// Content keys the hero as "Long"; name, face and the system's avatar follow the hero chosen for this run.
import {activeHero} from '../heroes/hero-profiles.js';

export const SPEAKERS = {
  Long: {get name() { return activeHero().upper; }, get portrait() { return activeHero().portrait; }, get alt() { return activeHero().alt; }},
  'Hệ Thống': {name: 'HỆ THỐNG', get portrait() { return activeHero().systemPortrait; }, get alt() { return activeHero().systemAlt; }},
  // The narrator has no face: the portrait box shows a neutral card instead of an image.
  'Lời kể': {name: 'LỜI KỂ', portrait: null, alt: ''},
};

export function normalizeLine(line) {
  if (typeof line === 'string') return {speaker: 'Long', text: line};
  const speaker = SPEAKERS[line?.speaker] ? line.speaker : 'Lời kể';
  return {speaker, text: String(line?.text ?? '')};
}
