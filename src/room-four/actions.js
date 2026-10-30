import {DOCUMENTS} from './documents.js';
import {goalFor} from './rules.js';
import {ENDING} from './content.js';

const endingFor=s=>s.options?.onExit?ENDING.map(line=>({...line,text:line.text
  .replace('Tới cửa phía bắc để hoàn thành Phòng 4 độc lập.','Tới cửa phía bắc để tiếp tục hành trình.')
  .replace('Phòng 5 ghép tranh và suy ngẫm nằm trong hành trình năm phòng ở trang chính. Bản chơi riêng này giữ tiến độ riêng, không tự chuyển mảnh tranh vào hành trình.','Qua cửa là Phòng 5: ghép bốn mảnh tranh và cùng Quang suy ngẫm về hành trình.')})):ENDING;

export function handleAction(s,action,p={}) {
  if(s.disposed||s.options?.isPaused?.())return;
  const active=s.active,inView=kind=>active?.kind===kind;
  const confirmed=expected=>inView('dialogue')&&active.action===expected&&active.token===p.token;
  if(action?.endsWith('-submit'))s.notice='';
  switch(action) {
    case 'modal-open':s.scene?.clearKeys();return;
    case 'modal-close':s.active=null;s.scene?.clearKeys();s.scene?.focus();s.render();return;
    case 'close':return s.close();
    case 'intro-finish':if(confirmed('intro-finish')){s.commit('intro');s.close();}return;
    case 'continue-object':if(confirmed('continue-object')&&p.id===active.payload.id)s.openObject(p.id);return;
    case 'interact':return s.interact(s.position.nearbyId);
    case 'map':return s.show('map',{position:s.position,goal:goalFor(s.state),state:s.state});
    case 'notebook':return s.show('notebook',{documents:DOCUMENTS.filter(d=>s.state.collectedNoteIds.includes(d.id))});
    case 'quests-toggle':s.ui.toggleQuests?.();return;
    case 'settings':if(s.ui.isOpen)s.close();else s.show('settings',{audio:s.audio.getSnapshot()});return;
    case 'reset-confirmed':if(inView('settings'))s.reset();return;
    case 'audio-toggle':{
      const runtime=s.audio.getSnapshot();
      if(!s.state.audioEnabled||(runtime.unlocked&&runtime.running))s.commit('audio');
      s.audio.setPreferences(s.state);
      if(s.state.audioEnabled)s.audio.unlockFromGesture().then(result=>{if(s.disposed)return;if(result.notice)s.notice=result.notice;s.render();});
      return;
    }
    case 'document-finish':{
      if(!inView('document')||active.readOnly||p.id!==active.document.id)return;
      if(!s.commit('read',p)&&!s.state.readNoteIds.includes(p.id))return;
      const d=DOCUMENTS.find(doc=>doc.id===p.id);if(!d)return;
      return s.dialogue(`Quang · ${d.title}`,d.reflection,'Ghi dữ kiện vào sổ tay','document-collect',{id:p.id});
    }
    case 'document-collect':
      if(!confirmed('document-collect')||p.id!==active.payload.id)return;
      if(s.commit('collect',p)){s.audio.playCue('paper');s.notice='Đã ghi dữ kiện. Sổ tay N giữ toàn văn để đối chiếu.';s.close();}return;
    case 'document-reread':
      if(inView('notebook')&&s.state.collectedNoteIds.includes(p.id))s.show('document',{document:DOCUMENTS.find(d=>d.id===p.id),readOnly:true});return;
    case 'crossword-submit':
      if(!inView('crossword'))return;
      if(!s.commit('crossword',p))return s.error('Có hàng chưa khớp. Xem lại giấy tờ tương ứng; câu về thuốc nổ cần viết số bằng chữ.');
      s.audio.playCue('success');return s.show('column',{solved:s.state.columnSolved});
    case 'column':if((inView('crossword')||inView('column'))&&s.state.crosswordSolved)s.show('column',{solved:s.state.columnSolved});return;
    case 'column-submit':
      if(!inView('column'))return;
      if(!s.commit('column',p))return s.error('Cột này chưa thành một lời chỉ dẫn đủ bảy chữ. Hãy đọc từ hàng đầu tới hàng cuối.');
      s.audio.playCue('success');return s.dialogue('TÌM T VÀ L',['T · I · M · T · V · A · L. Đọc thành “TÌM T VÀ L”.','Phía sau rương có hai bảng chữ. Mình sẽ tìm hình T trên bảng bên trái và hình L trên bảng bên phải.']);
    case 'shape-submit':{
      if(!inView('board')||p.board!==active.board)return;
      if(!s.commit('shape',p))return s.error(p.board==='t'?'Chọn trọn hàng trên cùng và cột giữa kéo xuống để thành hình T.':'Chọn cột đầu tiên từ trên xuống, rồi hàng cuối sang phải để thành hình L.');
      s.audio.playCue('success');return s.show('board',{board:p.board,solved:true});
    }
    case 'final-submit':
      if(!inView('final'))return;
      if(!s.commit('final',p))return s.error('Ghép hai phần đọc được ở hình T và hình L thành khẩu hiệu trên lá cờ chiến thắng.');
      s.audio.playCue('success');return s.dialogue('Rương ký ức đã mở',['“Quyết chiến, Quyết thắng.” Khóa rương vừa bật.','Mình sẽ lấy mảnh tranh số IV rồi tới cánh cửa phía bắc.']);
    case 'fragment-collect':
      if(confirmed('fragment-collect')&&p.id==='chest'&&active.payload.id==='chest'&&s.commit('fragment')){s.audio.playCue('reveal');s.dialogue('Mảnh tranh số IV',endingFor(s));}return;
  }
}
