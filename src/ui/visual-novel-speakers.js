// Speaker table for the visual-novel dialogue: label, portrait asset and accessible description.
// Plain strings in a script are Quang's thoughts; {speaker, text} objects name the speaker.
const asset = name => new URL(`../../assets/images/${name}`, import.meta.url).href;

export const SPEAKERS = {
  Quang: {name: 'QUANG', portrait: asset('quang-portrait.png'), alt: 'Quang, nhân vật hư cấu'},
  'Hệ Thống': {name: 'HỆ THỐNG', portrait: asset('game-emblem.png'), alt: 'Biểu tượng Hệ Thống'},
  // The narrator has no face: the portrait box shows a neutral card instead of an image.
  'Lời kể': {name: 'LỜI KỂ', portrait: null, alt: ''},
};

export function normalizeLine(line) {
  if (typeof line === 'string') return {speaker: 'Quang', text: line};
  const speaker = SPEAKERS[line?.speaker] ? line.speaker : 'Lời kể';
  return {speaker, text: String(line?.text ?? '')};
}
