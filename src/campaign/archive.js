import {LETTER_DOCUMENT} from '../room-one/letter-document.js';
import {DOCUMENTS as ONE} from '../room-one/documents.js';
import {NAVA_CONTEXT_DOCUMENT} from '../room-one/nava-context.js';
import {DOCUMENTS as THREE} from '../room-three/documents.js';
import {DOCUMENTS as FOUR} from '../room-four/documents.js';
import {getArchiveEntries as bao} from '../room-two/archive.js';
import {getArchiveEntries as final} from '../room-five/archive.js';

export function archiveEntries(s) {
  const entries=[];
  const append=(room,docs)=>entries.push(...docs.map(doc=>({...doc,room,archiveId:`${room}:${doc.id}`})));
  const one=s.rooms[1];
  if (one) append(1,[...(one.letterSolved?[LETTER_DOCUMENT]:[]),...ONE.filter(d=>one.collectedNoteIds.includes(d.id)),...(one.identitySolved?[NAVA_CONTEXT_DOCUMENT]:[])]);
  if (s.rooms[2]) append(2,bao(s.rooms[2]).map(doc=>({...doc,kind:'report',paragraphs:doc.paragraphs || doc.lines || [doc.body],
    source:doc.source || doc.sources?.map(source=>source.title).join('; '),
    fictionDisclosure:doc.fictionDisclosure || 'Lời dẫn và đối thoại trong phòng Bảo là nội dung trò chơi, không phải lời chứng lịch sử.'})));
  for (const [room,docs] of [[3,THREE],[4,FOUR]]) if (s.rooms[room]) append(room,docs.filter(d=>s.rooms[room].collectedNoteIds.includes(d.id)));
  if (s.rooms[5]) append(5,final(s.rooms[5]));
  return entries;
}
