import {clues, beats} from './content.js';
import {sanitizeSave} from './save.js';

export function getArchiveEntries(raw) {
  const state = sanitizeSave(raw);
  return state.collectedClueIds.map(id => {
    const clue = clues[id];
    return Object.freeze({id, room: 2, title: clue.title, kind: 'clue', body: clue.body,
      paragraphs: Object.freeze(beats[clue.beatId].lines.map(line => line.text))});
  });
}
