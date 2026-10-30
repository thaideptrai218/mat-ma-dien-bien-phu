import {createState, hasAllFragments, OBJECT_IDS} from './rules.js';

export const SAVE_KEY = 'mat-ma-dien-bien-phu:room-five:v1';

export function sanitizeSave(raw, fragments) {
  const state = createState();
  if (!raw || raw.version !== 1) return state;
  state.introSeen = raw.introSeen === true;
  state.seenObjectIds = Array.isArray(raw.seenObjectIds)
    ? [...new Set(raw.seenObjectIds.filter(id => OBJECT_IDS.includes(id)))] : [];
  const owned = fragments === undefined || hasAllFragments(fragments);
  state.assemblySolved = owned && raw.assemblySolved === true;
  state.reflectionSeen = state.assemblySolved && raw.reflectionSeen === true;
  state.exitReached = state.reflectionSeen && raw.exitReached === true;
  state.audioEnabled = raw.audioEnabled === true;
  state.audioVolume = Number.isFinite(raw.audioVolume) ? Math.max(0, Math.min(1, raw.audioVolume)) : .5;
  return state;
}

export function loadSave(storage, fragments = []) {
  try { return {state: sanitizeSave(JSON.parse(storage.getItem(SAVE_KEY)), fragments), notice: ''}; }
  catch { return {state: createState(), notice: 'Không đọc được tiến độ phòng 5. Bạn vẫn có thể chơi trong phiên này.'}; }
}

export function persistSave(storage, state, fragments = []) {
  try { storage.setItem(SAVE_KEY, JSON.stringify(sanitizeSave(state, fragments))); return ''; }
  catch { return 'Không lưu được tiến độ phòng 5. Bạn vẫn có thể chơi trong phiên này.'; }
}
