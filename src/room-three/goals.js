import {CHALLENGES} from './puzzle-data.js';
import {currentChallenge,nextDocumentId} from './rules.js';
import {goalDoorFor} from './area-gates.js';

export function goalFor(s){
  const steps=CHALLENGES.map((ch,i)=>({title:i===3?'Mật điện, rương và cửa ra':ch.title,done:i===3?s.exitReached:s.completedChallenges.includes(ch.id)}));
  const labels={'preparation-record':'Đọc hồ sơ chuẩn bị chiến dịch','supply-journal':'Đọc sổ tiếp vận','command-telegrams':'Đọc hai bức điện về cách đánh','opening-letter':'Đọc thư sau trận Độc Lập','north-report':'Đọc báo cáo ngày 17/3'};
  const ch=currentChallenge(s),paper=nextDocumentId(s);let step=Math.min(s.completedChallenges.length,3),id=paper||ch?.stationId||'chest';
  let label=paper?labels[paper]:ch?.title||'Khôi phục ngày mở màn',detail=paper?'Đi theo dấu vàng, đọc trọn giấy rồi nghe Quang suy nghĩ.':'Hoàn thành cả câu hỏi mở rộng để nhận dữ kiện tiếp theo.';
  if(s.completedChallenges.length===4){label='Ghép ngày, tháng và năm';detail='Ba dữ kiện thời gian nằm trong sổ tay. Phương châm được giữ riêng là bài học về cách đánh.';}
  if(s.chestOpened){id='chest';label='Nhận mảnh tranh số III';detail='Hồ sơ tiếp vận đã được khôi phục. Rương đang mở, đến gần và nhấn E.';}
  if(s.fragmentCollected){id='door';label='Đi tới cửa ra';detail='Bạn đã có mảnh tranh của phòng 3.';}
  if(s.exitReached){label='Đã hoàn thành phòng 3';detail='Phòng 4 của Trâm có thể mở bằng liên kết riêng.';}
  // The next station may sit behind a fenced door puzzle: point at the door until it is open.
  const door=goalDoorFor(s,id);if(door){id=door;detail='Rào phía trước có khóa. Đến chỗ rào, nhấn E để mở khóa bằng một câu đố nhỏ.';}
  return{id,label,detail,step,steps,count:`${s.completedChallenges.length} / 4 thử thách · ${s.collectedNoteIds.length} / 5 giấy tờ`};
}
