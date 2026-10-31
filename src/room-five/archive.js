import {getArchiveEntries as entries, SOURCE_LABEL} from './content.js';

export function getArchiveEntries(state) {
  return entries(state).map(entry => ({...entry, fictionDisclosure: SOURCE_LABEL}));
}
