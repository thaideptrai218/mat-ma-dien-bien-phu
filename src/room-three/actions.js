import {DOCUMENTS} from './documents.js';
import {ENDING} from './content.js';
import {CHALLENGES} from './puzzle-data.js';
import {recoveredTokens} from './rules.js';
import {goalFor} from './goals.js';

const activities={'preparation-submit':'preparation','cargo-submit':'cargo','strategy-submit':'strategy','opening-submit':'opening'};
const errors={preparation:'Kiểm tra hai mốc ngày và nhóm công việc chuẩn bị. Chọn đủ nhu cầu hậu cần để duy trì chiến đấu lâu dài.',cargo:'Còn chú thích hoặc nhận định chưa đúng. Xem lại xe thồ, vai trò dân công và thanh niên xung phong.',strategy:'Kiểm tra hai phương châm cùng lý do bảo đảm chắc thắng. Những thẻ NHANH hoặc CHẮC giống nhau có thể đổi chỗ cho nhau.',opening:'Xem lại ba mốc 13, 15 và 17/3/1954. Đợt đầu phá tuyến phòng ngự phía Bắc, chưa kết thúc toàn chiến dịch.'};
const explanations={preparation:'Ba việc chuẩn bị có thể diễn ra đan xen. Điều cần giữ là hậu cần phải sẵn trước lúc nổ súng.',cargo:'Xe thồ, dân công và những con đường đã nối nguồn hàng ở hậu phương với người lính ngoài mặt trận.',strategy:'Bộ Chỉ huy đánh giá tình hình thực tế, đặt yêu cầu chắc thắng lên trước việc giữ nguyên một dự định.',opening:'Him Lam, Độc Lập rồi Bản Kéo: những thắng lợi mở đường tiến xuống lòng chảo, tạo điều kiện cho các đợt sau.'};
export function handleAction(s,action,p={}){
  if(s.disposed||s.options?.isPaused?.())return;
  const active=s.active,inView=kind=>active?.kind===kind,confirmed=expected=>inView('dialogue')&&active.action===expected&&active.token===p.token;
  if(action?.endsWith('-submit'))s.notice='';
  const activity=activities[action];
  if(activity){
    if(!inView(activity)||active.solved)return;
    if(!s.commit('challenge',{id:activity,answers:p}))return s.error(errors[activity]);
    const ch=CHALLENGES.find(c=>c.id===activity);s.audio.playCue('success');return s.dialogue('Dữ kiện vừa khôi phục',[ch.reward,explanations[activity]]);
  }
  switch(action){
    case'modal-open':s.scene?.clearKeys();return;
    case'modal-close':s.active=null;s.scene?.clearKeys();s.scene?.focus();s.render();return;
    case'close':return s.close();
    case'intro-finish':if(confirmed('intro-finish')){s.commit('intro');s.close();}return;
    case'continue-object':if(confirmed('continue-object')&&p.id===active.payload.id)s.openObject(p.id);return;
    case'interact':return s.interact(s.position.nearbyId);
    case'map':return s.show('map',{position:s.position,goal:goalFor(s.state),state:s.state});
    case'notebook':return s.show('notebook',{documents:DOCUMENTS.filter(d=>s.state.collectedNoteIds.includes(d.id)),tokens:recoveredTokens(s.state)});
    case'rewards':return s.show('rewards',{tokens:recoveredTokens(s.state)});
    case'quests-toggle':s.ui.toggleQuests?.();return;
    case'settings':if(s.ui.isOpen)s.close();else s.show('settings',{audio:s.audio.getSnapshot()});return;
    case'reset-confirmed':if(inView('settings'))s.reset();return;
    case'audio-toggle':{
      const runtime=s.audio.getSnapshot();if(!s.state.audioEnabled||(runtime.unlocked&&runtime.running))s.commit('audio');s.audio.setPreferences(s.state);
      if(s.state.audioEnabled)s.audio.unlockFromGesture().then(r=>{if(s.disposed)return;if(r.notice)s.notice=r.notice;s.render();});return;
    }
    case'document-finish':{
      if(!inView('document')||active.readOnly||p.id!==active.document.id)return;
      if(!s.commit('read',p)&&!s.state.readNoteIds.includes(p.id))return;
      const d=DOCUMENTS.find(doc=>doc.id===p.id);if(d)return s.dialogue(`Quang · ${d.title}`,d.reflection,'Ghi dữ kiện vào sổ tay','document-collect',{id:p.id});return;
    }
    case'document-collect':if(confirmed('document-collect')&&p.id===active.payload.id&&s.commit('collect',p)){s.audio.playCue('paper');s.notice='Đã ghi dữ kiện. Sổ tay N giữ toàn văn và các mật mã đã khôi phục.';s.close();}return;
    case'document-reread':if(inView('notebook')&&s.state.collectedNoteIds.includes(p.id))s.show('document',{document:DOCUMENTS.find(d=>d.id===p.id),readOnly:true});return;
    case'final-submit':if(!inView('final'))return;if(!s.commit('final',p))return s.error('Ghép NGÀY 13, THÁNG 3 và NĂM 1954 thành ngày mở màn. Phương châm được giữ riêng.');s.audio.playCue('success');return s.dialogue('13/03/1954',['Ngày mở màn Chiến dịch Điện Biên Phủ đã được khôi phục. Rương vừa mở.','Mình sẽ cất mảnh tranh số III trước khi đi tiếp.']);
    case'fragment-collect':if(confirmed('fragment-collect')&&p.id==='chest'&&active.payload.id==='chest'&&s.commit('fragment')){s.audio.playCue('reveal');s.dialogue('Mảnh tranh số III',s.options?.onExit?ENDING.map(line=>({...line,text:line.text.replace('Phòng 4 của Trâm và Phòng 5 ghép tranh có trong hành trình năm phòng ở trang chính. Các bản chơi riêng không tự chuyển tiến độ.','Qua cửa, mình sẽ đến Phòng 4 của Trâm rồi tiếp tục tới phòng ghép tranh và suy ngẫm.')})):ENDING);}return;
  }
}
