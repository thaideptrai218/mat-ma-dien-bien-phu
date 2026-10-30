import {createState,DOCUMENT_ORDER,OBJECT_IDS} from './rules.js';
export const SAVE_KEY='mat-ma-dien-bien-phu:room-four:v1';
export function sanitizeSave(raw) {
  const s=createState(); if (!raw || raw.version!==1) return s;
  s.introSeen=raw.introSeen===true;
  const read=Array.isArray(raw.readNoteIds)?raw.readNoteIds:[], collected=Array.isArray(raw.collectedNoteIds)?raw.collectedNoteIds:[];
  // Only a contiguous, read-and-confirmed historical sequence may be restored.
  for (const id of DOCUMENT_ORDER) {
    if (!read.includes(id) || !collected.includes(id)) break;
    s.collectedNoteIds.push(id);s.readNoteIds.push(id);
  }
  const next=DOCUMENT_ORDER[s.collectedNoteIds.length];
  if (next && read.includes(next)) s.readNoteIds.push(next);
  s.seenObjectIds=Array.isArray(raw.seenObjectIds)?[...new Set(raw.seenObjectIds.filter(id=>OBJECT_IDS.includes(id)))]:[];
  s.crosswordSolved=s.collectedNoteIds.length===7 && raw.crosswordSolved===true;
  s.columnSolved=s.crosswordSolved && raw.columnSolved===true;
  s.boardTSolved=s.columnSolved && raw.boardTSolved===true;
  s.boardLSolved=s.columnSolved && raw.boardLSolved===true;
  s.chestOpened=s.boardTSolved && s.boardLSolved && raw.chestOpened===true;
  s.fragmentCollected=s.chestOpened && raw.fragmentCollected===true;
  s.exitReached=s.fragmentCollected && raw.exitReached===true;
  s.audioEnabled=raw.audioEnabled===true;
  s.audioVolume=typeof raw.audioVolume==='number' && Number.isFinite(raw.audioVolume)?Math.max(0,Math.min(1,raw.audioVolume)):.5;
  return s;
}
export function loadSave(storage) {
  try {return {state:sanitizeSave(JSON.parse(storage.getItem(SAVE_KEY))),notice:''};}
  catch {return {state:createState(),notice:'Không đọc được tiến độ phòng 4. Bạn vẫn có thể chơi trong phiên này.'};}
}
export function persistSave(storage,state) {
  try {storage.setItem(SAVE_KEY,JSON.stringify(sanitizeSave(state)));return '';}
  catch {return 'Không lưu được tiến độ phòng 4 trên trình duyệt. Bạn vẫn có thể chơi trong phiên này.';}
}
