import {CHALLENGES} from './puzzle-data.js';
import {EVALUATORS,finalCorrect} from './answers.js';
export const DOCUMENT_ORDER=Object.freeze(['preparation-record','supply-journal','command-telegrams','opening-letter','north-report']);
export const OBJECT_IDS=Object.freeze([...DOCUMENT_ORDER,'archive-cabinet','cargo-yard','command-tent','radio-station','chest','door','supply-crates','road-tools','field-lamp']);
export function createState(){return{version:1,introSeen:false,readNoteIds:[],collectedNoteIds:[],seenObjectIds:[],completedChallenges:[],chestOpened:false,fragmentCollected:false,exitReached:false,audioEnabled:false,audioVolume:.5};}
export const currentChallenge=s=>CHALLENGES[s.completedChallenges.length]||null;
export function nextDocumentId(s){const next=DOCUMENT_ORDER[s.collectedNoteIds.length];return currentChallenge(s)?.documentIds.includes(next)?next:null;}
export const canSolve=(s,id)=>{const ch=currentChallenge(s);return Boolean(ch&&ch.id===id&&ch.documentIds.every(doc=>s.collectedNoteIds.includes(doc)));};
export const recoveredTokens=s=>CHALLENGES.filter(ch=>s.completedChallenges.includes(ch.id)).map(ch=>({id:ch.id,title:ch.title,label:ch.reward}));
export function reduce(s,action,p={}){
  switch(action){
    case'intro':return{...s,introSeen:true};
    case'seen':return OBJECT_IDS.includes(p.id)&&!s.seenObjectIds.includes(p.id)?{...s,seenObjectIds:[...s.seenObjectIds,p.id]}:s;
    case'read':return DOCUMENT_ORDER.includes(p.id)&&p.id===nextDocumentId(s)&&!s.readNoteIds.includes(p.id)?{...s,readNoteIds:[...s.readNoteIds,p.id]}:s;
    case'collect':return DOCUMENT_ORDER.includes(p.id)&&p.id===nextDocumentId(s)&&s.readNoteIds.includes(p.id)?{...s,collectedNoteIds:[...s.collectedNoteIds,p.id]}:s;
    case'challenge':return canSolve(s,p.id)&&EVALUATORS[p.id]?.(p.answers)?{...s,completedChallenges:[...s.completedChallenges,p.id]}:s;
    case'final':return s.completedChallenges.length===4&&finalCorrect(p.date)?{...s,chestOpened:true}:s;
    case'fragment':return s.chestOpened?{...s,fragmentCollected:true}:s;
    case'exit':return s.fragmentCollected?{...s,exitReached:true}:s;
    case'audio':return{...s,audioEnabled:!s.audioEnabled};
    default:return s;
  }
}
