import {clues, beats, sources} from './content.js';
import {sanitizeSave} from './save.js';

export function getArchiveEntries(raw) {
  const state = sanitizeSave(raw);
  return state.collectedClueIds.map(id => {
    const clue = clues[id];
    return Object.freeze({id, room: 2, title: clue.title, kind: 'clue', body: clue.body,
      paragraphs: Object.freeze(beats[clue.beatId].lines.map(line => line.text)),
      source: clue.sourceIds.map(id => sources[id].title).join(' · '),
      fictionDisclosure: 'Lời Quang và hiện vật kể chuyện được biên soạn hư cấu; dữ kiện lịch sử có nguồn trong sổ tay.'});
  });
}
