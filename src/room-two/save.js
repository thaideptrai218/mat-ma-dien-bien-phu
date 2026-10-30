import {createState} from './rules.js';
import {CHAPTER, CLUE_IDS, PUZZLE_IDS, clues, puzzles} from './content.js';

export const SAVE_KEY = 'mat-ma-dien-bien-phu:room-two:v1';
const ids = (value, allowed) => Array.isArray(value) ? [...new Set(value.filter(id => allowed.includes(id)))] : [];

export function sanitizeSave(raw) {
  const state = createState();
  if (!raw || raw.version !== 1) return state;
  const completed = Array.isArray(raw.completedBeatIds) ? raw.completedBeatIds : [];
  state.discoveredClueIds = ids(raw.discoveredClueIds, CLUE_IDS);
  state.collectedClueIds = ids(raw.collectedClueIds, state.discoveredClueIds)
    .filter(id => completed.includes(clues[id].beatId));
  state.completedBeatIds = state.collectedClueIds.map(id => clues[id].beatId);
  state.introSeen = completed.includes(CHAPTER.introBeatId);
  if (state.introSeen) state.completedBeatIds.push(CHAPTER.introBeatId);
  const solved = Array.isArray(raw.completedPuzzleIds) ? raw.completedPuzzleIds : [];
  for (const [index, id] of PUZZLE_IDS.entries()) {
    if (solved[index] !== id || puzzles[id].requiredClueIds.some(clue => !state.collectedClueIds.includes(clue))) break;
    state.completedPuzzleIds.push(id);
  }
  // The original fold awards II. Stored inventory flags never create an award.
  state.fragmentCollected = state.completedPuzzleIds.length === PUZZLE_IDS.length;
  if (state.fragmentCollected && completed.includes(CHAPTER.outroBeatId)) state.completedBeatIds.push(CHAPTER.outroBeatId);
  state.exitReached = state.fragmentCollected && raw.exitReached === true;
  for (const id of PUZZLE_IDS) {
    const level = raw.hintLevels?.[id];
    if (Number.isInteger(level) && level > 0) state.hintLevels[id] = Math.min(level, puzzles[id].hints.length);
  }
  state.audioEnabled = raw.audioEnabled === true;
  state.audioVolume = typeof raw.audioVolume === 'number' && Number.isFinite(raw.audioVolume)
    ? Math.max(0, Math.min(1, raw.audioVolume)) : .5;
  return state;
}

export function loadSave(storage) {
  try { return {state: sanitizeSave(JSON.parse(storage.getItem(SAVE_KEY))), notice: ''}; }
  catch { return {state: createState(), notice: 'Không đọc được tiến độ phòng 2. Bạn vẫn có thể chơi trong phiên này.'}; }
}

export function persistSave(storage, state) {
  try { storage.setItem(SAVE_KEY, JSON.stringify(sanitizeSave(state))); return ''; }
  catch { return 'Không lưu được tiến độ phòng 2. Trò chơi vẫn tiếp tục trong phiên này.'; }
}
