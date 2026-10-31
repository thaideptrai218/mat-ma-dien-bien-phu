import {CROSSWORD_ROWS, BOARDS} from './puzzle-data.js';
import {DOOR_IDS,checkDoorAnswer,goalDoorFor} from './area-gates.js';

export const DOCUMENT_ORDER = Object.freeze(['east-offensive','final-assault','a1','headquarters','results','north','independence']);
export const OBJECT_IDS = Object.freeze([...DOCUMENT_ORDER,'crossword','board-t','board-l','chest','door','lamp','radio']);
export const normalizeAnswer = value => String(value ?? '').replace(/[đĐ]/g,'D').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/gi,'').toUpperCase();
export function createState() {
  return {version:1,introSeen:false,readNoteIds:[],collectedNoteIds:[],seenObjectIds:[],
    crosswordSolved:false,columnSolved:false,boardTSolved:false,boardLSolved:false,
    chestOpened:false,fragmentCollected:false,exitReached:false,doorsSolved:[],audioEnabled:false,audioVolume:.5};
}
export const nextDocumentId = state => DOCUMENT_ORDER[state.collectedNoteIds.length] || null;
export function crosswordCorrect(answers = {}) {
  return Boolean(answers && typeof answers==='object' && CROSSWORD_ROWS.every(row => normalizeAnswer(answers[row.id]) === row.answer));
}
export function shapeCorrect(board, selected) {
  const expected = BOARDS[board]?.cells;
  return Boolean(expected && Array.isArray(selected) && selected.length === expected.length &&
    new Set(selected).size === selected.length && selected.every(index => Number.isInteger(index) && expected.includes(index)));
}
export function columnText(column) {
  return CROSSWORD_ROWS.map(row => row.answer[column-row.start] || ' ').join('');
}
export function reduce(s, action, p = {}) {
  switch(action) {
    case 'intro': return {...s,introSeen:true};
    case 'seen': return OBJECT_IDS.includes(p.id) && !s.seenObjectIds.includes(p.id) ? {...s,seenObjectIds:[...s.seenObjectIds,p.id]} : s;
    case 'read': return p.id === nextDocumentId(s) && !s.readNoteIds.includes(p.id) ? {...s,readNoteIds:[...s.readNoteIds,p.id]} : s;
    case 'collect': return p.id === nextDocumentId(s) && s.readNoteIds.includes(p.id) ? {...s,collectedNoteIds:[...s.collectedNoteIds,p.id]} : s;
    case 'crossword': return s.collectedNoteIds.length === 7 && crosswordCorrect(p.answers) ? {...s,crosswordSolved:true} : s;
    case 'column': return s.crosswordSolved && Number(p.column) === 8 ? {...s,columnSolved:true} : s;
    case 'shape': {
      if (!s.columnSolved || !shapeCorrect(p.board,p.selected)) return s;
      return {...s,[p.board === 't' ? 'boardTSolved' : 'boardLSolved']:true};
    }
    case 'final': return s.boardTSolved && s.boardLSolved && normalizeAnswer(p.phrase) === 'QUYETCHIENQUYETTHANG' ? {...s,chestOpened:true} : s;
    case 'fragment': return s.chestOpened ? {...s,fragmentCollected:true} : s;
    case 'exit': return s.fragmentCollected ? {...s,exitReached:true} : s;
    case 'door': return DOOR_IDS.includes(p.doorId) && !s.doorsSolved.includes(p.doorId) && !s.exitReached && checkDoorAnswer(p.doorId,p.answer) ? {...s,doorsSolved:[...s.doorsSolved,p.doorId]} : s;
    case 'audio': return {...s,audioEnabled:!s.audioEnabled};
    default: return s;
  }
}
export function goalFor(s) {
  const steps=[
    {title:'Đọc bảy tư liệu theo dòng thời gian',done:s.collectedNoteIds.length===7},
    {title:'Giải ô chữ, tìm cột dọc',done:s.columnSolved},
    {title:'Tìm hình T/L và mở rương',done:s.chestOpened},
    {title:'Nhận mảnh tranh IV, tới cửa',done:s.exitReached},
  ];
  const titles=['Theo dấu những đường hào','Đọc ghi chép đợt tiến công cuối','Đọc trang sổ sau đêm A1','Đọc thư tối 7/5','Đọc tổng kết chiến dịch','Đọc câu chuyện về miền Bắc','Đọc thư về độc lập dân tộc'];
  let id=nextDocumentId(s),step=0,label=titles[s.collectedNoteIds.length],detail='Đi tới dấu vàng trên bản đồ. Đọc trọn trang giấy rồi cùng Long suy nghĩ.';
  if (!id) {id='crossword';step=1;label='Điền bảy hàng ô chữ';detail='Bàn ô chữ ở phía bắc. Mỗi câu hỏi gắn với một giấy tờ đã đọc.';}
  if (s.crosswordSolved) {label='Tìm cột chữ có nghĩa';detail='Chọn một cột dọc, đọc từ trên xuống dưới.';}
  if (s.columnSolved) {step=2;id=s.boardTSolved?'board-l':'board-t';label=s.boardTSolved?'Tìm hình L trên bảng bên phải':'Tìm hình T trên bảng bên trái';detail='Hai bàn mật mã nằm phía sau rương. Chọn các ô tạo thành hình cần tìm.';}
  if (s.boardTSolved && s.boardLSolved) {id='chest';label='Ghép khẩu hiệu, mở rương';detail='Mang hai phần lời đọc được đến khóa rương giữa phòng.';}
  if (s.chestOpened) {step=3;id='chest';label='Lấy mảnh tranh số IV';detail='Rương đã tự mở. Đến gần và nhấn E để nhận mảnh tranh.';}
  if (s.fragmentCollected) {id='door';label='Đi tới cửa phía bắc';detail='Bạn đã giữ mảnh tranh của phòng 4.';}
  if (s.exitReached) {label='Đã hoàn thành phòng 4';detail='Bản thử này chưa nối sang phòng ghép tranh cuối hành trình.';}
  const lock=goalDoorFor(s,id);
  if (lock&&!s.exitReached) {id=lock;detail='Lối phía trước có khóa. Nhấn E ở khóa để mở bằng một câu đố nhỏ.';}
  return {id,label,detail,step,steps,count:`${s.collectedNoteIds.length} / 7 tư liệu · Mảnh IV: ${s.fragmentCollected?'1':'0'} / 1`};
}
