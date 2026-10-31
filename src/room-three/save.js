import {CHALLENGES} from './puzzle-data.js';
import {createState,OBJECT_IDS} from './rules.js';
import {DOOR_IDS} from './area-gates.js';
export const SAVE_KEY='mat-ma-dien-bien-phu:room-three:v1';
export function sanitizeSave(raw){
  const s=createState();if(!raw||raw.version!==1)return s;
  const read=Array.isArray(raw.readNoteIds)?raw.readNoteIds:[],collected=Array.isArray(raw.collectedNoteIds)?raw.collectedNoteIds:[],done=Array.isArray(raw.completedChallenges)?raw.completedChallenges:[];
  // Restore the joint graph: papers for this challenge, its completion, then the next papers.
  outer:for(const ch of CHALLENGES){
    for(const id of ch.documentIds){
      if(!read.includes(id))break outer;
      s.readNoteIds.push(id);
      if(!collected.includes(id))break outer;
      s.collectedNoteIds.push(id);
    }
    if(!done.includes(ch.id))break;
    s.completedChallenges.push(ch.id);
  }
  s.introSeen=raw.introSeen===true;
  s.seenObjectIds=Array.isArray(raw.seenObjectIds)?[...new Set(raw.seenObjectIds.filter(id=>OBJECT_IDS.includes(id)))]:[];
  // Absent in saves written before door puzzles existed -> []; unknown or repeated ids are dropped.
  s.doorsSolved=Array.isArray(raw.doorsSolved)?DOOR_IDS.filter(id=>raw.doorsSolved.includes(id)):[];
  s.chestOpened=s.completedChallenges.length===4&&raw.chestOpened===true;
  s.fragmentCollected=s.chestOpened&&raw.fragmentCollected===true;s.exitReached=s.fragmentCollected&&raw.exitReached===true;
  s.audioEnabled=raw.audioEnabled===true;s.audioVolume=typeof raw.audioVolume==='number'&&Number.isFinite(raw.audioVolume)?Math.max(0,Math.min(1,raw.audioVolume)):.5;
  return s;
}
export function loadSave(storage){try{return{state:sanitizeSave(JSON.parse(storage.getItem(SAVE_KEY))),notice:''};}catch{return{state:createState(),notice:'Không đọc được tiến độ phòng 3. Bạn vẫn có thể chơi trong phiên này.'};}}
export function persistSave(storage,state){try{storage.setItem(SAVE_KEY,JSON.stringify(sanitizeSave(state)));return'';}catch{return'Không lưu được tiến độ phòng 3. Trò chơi vẫn tiếp tục trong phiên này.';}}
