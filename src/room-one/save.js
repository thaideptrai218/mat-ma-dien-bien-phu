import {createState, NOTE_IDS} from './rules.js';
export const SAVE_KEY = 'mat-ma-dien-bien-phu:room-one:v1';
const OBJECT_IDS = ['letter','map-a03',...NOTE_IDS,'comparison','drawer','chest','door','lamp','crate','radio'];
const uniqueIds = (value, allowed) => Array.isArray(value) ? [...new Set(value.filter(id => allowed.includes(id)))] : [];
export function sanitizeSave(raw) {
  const s = createState();
  if (!raw || raw.version !== 1) return s;
  s.introSeen = raw.introSeen === true;
  s.letterSolved = raw.letterSolved === true;
  s.envelopeOpened = s.letterSolved && raw.envelopeOpened === true;
  s.readNoteIds = s.envelopeOpened ? uniqueIds(raw.readNoteIds, NOTE_IDS) : [];
  s.collectedNoteIds = uniqueIds(raw.collectedNoteIds, s.readNoteIds);
  s.seenObjectIds = uniqueIds(raw.seenObjectIds, OBJECT_IDS);
  s.comparisonSolved = s.collectedNoteIds.length === 4 && raw.comparisonSolved === true;
  for (const [flag, previous] of [['drawerOpened','comparisonSolved'],['identitySolved','drawerOpened'],['chestOpened','identitySolved'],['exitReached','chestOpened']]) s[flag] = s[previous] && raw[flag] === true;
  s.audioEnabled = raw.audioEnabled === true;
  s.audioVolume = typeof raw.audioVolume === 'number' && Number.isFinite(raw.audioVolume) ? Math.max(0, Math.min(1, raw.audioVolume)) : .5;
  return s;
}
export function loadSave(storage) {
  try { return {state: sanitizeSave(JSON.parse(storage.getItem(SAVE_KEY))), notice: ''}; }
  catch { return {state: createState(), notice: 'Không đọc được tiến độ. Bạn vẫn có thể chơi trong phiên này.'}; }
}
export function persistSave(storage, state) {
  try { storage.setItem(SAVE_KEY, JSON.stringify(sanitizeSave(state))); return ''; }
  catch { return 'Không lưu được tiến độ trên trình duyệt. Trò chơi vẫn tiếp tục trong phiên này.'; }
}
