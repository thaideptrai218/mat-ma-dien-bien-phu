import { beats, chapters, chapterOrder, clues, puzzles, roomOrder } from '../content/story-data.js';

export const defaultSettings = { brightness: 'normal', reducedMotion: false, audioEnabled: false, audioVolume: 0.5 };
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
export const validCheckpoint = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 80;

export function validSettings(value) {
  return isRecord(value) && ['normal', 'bright'].includes(value.brightness)
    && typeof value.reducedMotion === 'boolean' && typeof value.audioEnabled === 'boolean'
    && typeof value.audioVolume === 'number' && Number.isFinite(value.audioVolume)
    && value.audioVolume >= 0 && value.audioVolume <= 1;
}

export function copySettings(value) {
  return { brightness: value.brightness, reducedMotion: value.reducedMotion, audioEnabled: value.audioEnabled, audioVolume: value.audioVolume };
}

function validIds(values, registry) {
  return Array.isArray(values) && values.every(id => typeof id === 'string' && Object.hasOwn(registry, id)) && new Set(values).size === values.length;
}

// Only persist the schema: runtime dialogue, free text and audio nodes never pass through.
export function validateSave(raw) {
  try {
    return validateRecord(raw);
  } catch {
    return null;
  }
}

function validateRecord(raw) {
  if (!isRecord(raw) || raw.version !== 1 || typeof raw.chapterId !== 'string' || !Object.hasOwn(chapters, raw.chapterId) || !validCheckpoint(raw.checkpointId) || !validSettings(raw.settings)) return null;
  if (!validIds(raw.completedRoomIds, chapters) || raw.completedRoomIds.length > roomOrder.length
    || raw.completedRoomIds.some((id, index) => id !== roomOrder[index])) return null;
  if (!validIds(raw.discoveredClueIds, clues) || !validIds(raw.collectedClueIds, clues) || !validIds(raw.completedBeatIds, beats)) return null;
  const completed = new Set(raw.completedBeatIds);
  const collected = new Set(raw.collectedClueIds);
  const discovered = new Set(raw.discoveredClueIds);
  const museumOpened = completed.has('museum-intro');
  const maxChapterIndex = museumOpened ? raw.completedRoomIds.length + 1 : 0;
  const isUnlocked = chapterId => chapterOrder.indexOf(chapterId) <= maxChapterIndex;
  if (!isUnlocked(raw.chapterId) || (!museumOpened && (raw.completedRoomIds.length || discovered.size))) return null;
  if (raw.discoveredClueIds.some(id => !isUnlocked(clues[id].chapterId))) return null;
  if (raw.collectedClueIds.some(id => !discovered.has(id))) return null;
  // Each clue and its beat are one atomic completion, in both directions.
  if (Object.values(clues).some(clue => collected.has(clue.id) !== completed.has(clue.beatId))) return null;
  if (raw.completedBeatIds.some(id => !isUnlocked(beats[id].chapterId)
    || (beats[id].requiresRoomCompletion && !raw.completedRoomIds.includes(beats[id].chapterId))
    || beats[id].requiredDiscoveredClueIds.some(clueId => !discovered.has(clueId)))) return null;
  if (raw.completedRoomIds.some(id => id !== 'peace' && chapters[id].clueIds.some(clueId => !collected.has(clueId)))) return null;
  // Saves written before per-puzzle progress existed imply every puzzle of each completed room.
  const completedPuzzleIds = raw.completedPuzzleIds === undefined ? raw.completedRoomIds.flatMap(id => chapters[id].puzzleIds) : raw.completedPuzzleIds;
  if (!validIds(completedPuzzleIds, puzzles)) return null;
  const solved = new Set(completedPuzzleIds);
  if (completedPuzzleIds.some(id => !isUnlocked(puzzles[id].chapterId) || (puzzles[id].requiresPuzzleId && !solved.has(puzzles[id].requiresPuzzleId))
    || puzzles[id].requiredClueIds.some(clueId => !collected.has(clueId)))) return null;
  // A room is complete exactly when all of its puzzles are solved.
  if (roomOrder.some(id => chapters[id].puzzleIds.length && raw.completedRoomIds.includes(id) !== chapters[id].puzzleIds.every(puzzleId => solved.has(puzzleId)))) return null;
  if (!isRecord(raw.hintLevels)) return null;
  for (const [id, level] of Object.entries(raw.hintLevels)) {
    if (!Object.hasOwn(puzzles, id) || !isUnlocked(puzzles[id].chapterId) || !Number.isInteger(level) || level < 0 || level > puzzles[id].hints.length) return null;
  }
  return {
    version: 1, chapterId: raw.chapterId, checkpointId: raw.checkpointId,
    completedRoomIds: [...raw.completedRoomIds], completedPuzzleIds: [...completedPuzzleIds], discoveredClueIds: [...raw.discoveredClueIds],
    collectedClueIds: [...raw.collectedClueIds], completedBeatIds: [...raw.completedBeatIds],
    hintLevels: { ...raw.hintLevels }, settings: copySettings(raw.settings),
  };
}
