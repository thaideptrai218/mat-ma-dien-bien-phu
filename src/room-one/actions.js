import {DOCUMENTS} from './documents.js';
import {ENDING, CAMPAIGN_ENDING, GUIDE} from './content.js';
import {goalFor} from './rules.js';
import {LETTER_DOCUMENT} from './letter-document.js';
import {NAVA_CONTEXT_DOCUMENT} from './nava-context.js';

// UI intents are accepted only by their current view. Closing a reader invalidates its confirmation.
export function handleAction(s, action, p = {}) {
  if (s.disposed || s.options?.isPaused?.()) return;
  const active = s.active;
  const inView = kind => active?.kind === kind;
  const dialogueToken = () => inView('dialogue') && p.token === active.token;
  if (action?.endsWith('-submit')) s.notice = '';
  switch (action) {
    case 'modal-open': s.scene?.clearKeys(); return;
    case 'modal-close': s.active = null; s.scene?.clearKeys(); s.scene?.focus(); s.render(); return;
    case 'close': return s.close();
    case 'intro-finish': if (dialogueToken()) { s.commit('intro'); s.close(); } return;
    case 'continue-object': if (dialogueToken() && p.id === active.payload.id) s.openObject(p.id); return;
    case 'interact': return s.interact(s.position.nearbyId);
    case 'map': return s.show('map', {position: s.position, goal: goalFor(s.state), state:s.state});
    case 'notebook': return s.show('notebook', {documents: [...(s.state.letterSolved ? [LETTER_DOCUMENT] : []), ...DOCUMENTS.filter(d => s.state.collectedNoteIds.includes(d.id)), ...(s.state.identitySolved ? [NAVA_CONTEXT_DOCUMENT] : [])]});
    case 'quests-toggle': s.ui.toggleQuests?.(); return;
    case 'settings': if (s.ui.isOpen) s.close(); else s.show('settings', {audio:s.audio.getSnapshot()}); return;
    case 'reset-confirmed': if (inView('settings')) s.reset(); return;
    case 'audio-toggle': {
      const runtime = s.audio.getSnapshot();
      if (!s.state.audioEnabled || (runtime.unlocked && runtime.running)) s.commit('audio');
      s.audio.setPreferences(s.state);
      if (s.state.audioEnabled) s.audio.unlockFromGesture().then(result => { if (s.disposed) return; if (result.notice) s.notice = result.notice; s.render(); });
      return;
    }
    case 'audio-volume': {
      const value = Number(p.value);
      if (Number.isFinite(value)) {s.commit('volume',{value}); s.audio.setPreferences(s.state); s.render();}
      return;
    }
    case 'letter-finish':
      if (inView('document') && !active.readOnly && active.document.id === 'restored-letter' && p.id === active.document.id)
        return s.dialogue('Quang · Sau khi đọc thư', [...LETTER_DOCUMENT.reflection, 'Nhãn lưu trữ ghi A-03. Trên bản đồ treo vách cũng có những ô như vậy.', ...GUIDE.letter], 'Nhớ ký hiệu A-03', 'letter-record', {documentId:'restored-letter'});
      return;
    case 'letter-record':
      if (dialogueToken() && active.action === 'letter-record' && s.commit('letter', p)) s.close();
      return;
    case 'map-submit':
      if (!inView('a03')) return;
      if (!s.commit('map', p)) return s.error('Nhãn lưu trữ ở cuối thư ghi A-03. Hãy đối chiếu hàng và cột.');
      s.audio.playCue('success');
      return s.dialogue('Ngăn lưu trữ A-03', ['Bốn giấy tờ được xếp chung: một lá thư, một trang sổ quân nhu, bản ghi của phía Pháp và thư từ Paris.', 'Chúng đều được viết trước tháng 5/1953. Mình sẽ đọc theo thứ tự ngày tháng.', ...GUIDE.a03]);
    case 'document-finish': {
      if (!inView('document') || active.readOnly || active.document.id !== p.id) return;
      if (!s.commit('read', p)) {
        if (!s.state.readNoteIds.includes(p.id)) return;
      }
      const doc = DOCUMENTS.find(d => d.id === p.id);
      return s.dialogue(`Quang suy luận · ${doc.code}`, doc.reflection, 'Ghi dữ kiện vào sổ tay', 'document-collect', {id:p.id});
    }
    case 'document-collect':
      if (!dialogueToken() || p.id !== active.payload.id) return;
      if (s.commit('collect', p)) {
        s.audio.playCue('paper'); s.notice = 'Đã ghi dữ kiện. Bạn có thể đọc lại nguyên văn trong sổ tay N.';
        if (DOCUMENTS.every(d => s.state.collectedNoteIds.includes(d.id))) return s.dialogue('Đủ bốn hồ sơ', GUIDE.dossiers);
        s.close();
      }
      return;
    case 'document-reread': {
      if (!inView('notebook')) return;
      if (p.id === 'restored-letter' && s.state.letterSolved) return s.show('document',{document:LETTER_DOCUMENT,readOnly:true});
      if (p.id === 'nava-context' && s.state.identitySolved) return s.show('document',{document:NAVA_CONTEXT_DOCUMENT,readOnly:true});
      if (!s.state.collectedNoteIds.includes(p.id)) return;
      return s.show('document', {document:DOCUMENTS.find(d => d.id === p.id),readOnly:true});
    }
    case 'comparison-submit':
      if (!inView('comparison')) return;
      if (!s.commit('comparison', p)) return s.error('Có nhận định chưa khớp với chứng cứ. Số quân: V-02/P-01; trang bị: V-02/P-01; thế trận: V-01/P-01; sức ép: V-02/P-02.');
      s.audio.playCue('success');
      return s.dialogue('Bốn hàng dữ kiện', ['Đối chiếu đúng: quân số 252.000 / 445.000; trang bị hạn chế / hiện đại; thế chủ động / lực lượng phân tán; sức ép tiếp tế / chi phí chiến tranh.', 'Những con số cho biết quy mô lực lượng; cách bố trí và những khó khăn mới cho thấy tình thế của họ.', 'Bốn hàng làm lộ bốn chữ số: 2 · 4 · 1 · 3. Đây là mật mã của trò chơi, không phải một niên đại lịch sử.', ...GUIDE.comparison], 'Ghi mã ngăn kéo 2413', 'close');
    case 'drawer-submit':
      if (!inView('drawer')) return;
      if (!s.commit('drawer', p)) return s.error('Ngăn kéo có bốn số. Hãy dùng mã 2413 từ bàn đối chiếu.');
      s.audio.playCue('success'); return s.show('identity');
    case 'identity-submit':
      if (!inView('identity')) return;
      if (!s.commit('identity', p)) return s.error('Đọc từng số bằng bảng A1Z26: 08 = H, 05 = E. Ghép đủ hai nhóm thành tên người.');
      s.audio.playCue('success');
      return s.dialogue('Henri Navarre · Tháng 5/1953', ['Henri Navarre, thường gọi là Nava, được cử sang Đông Dương làm Tổng chỉ huy tháng 5/1953.', 'Có một bản tin viết sau đó hai tháng. Mình sẽ đọc tiếp để biết kế hoạch mới đã được thông qua thế nào.', ...GUIDE.identity], 'Đọc bản tin tháng 7/1953', 'nava-context-open');
    case 'nava-context-open':
      if (dialogueToken() && active.action === 'nava-context-open' && s.state.identitySolved)
        return s.show('document',{document:NAVA_CONTEXT_DOCUMENT,readOnly:false,finishAction:'nava-context-finish'});
      return;
    case 'nava-context-finish':
      if (inView('document') && !active.readOnly && s.state.identitySolved && active.document.id === 'nava-context' && p.id === active.document.id)
        return s.dialogue('Quang · Sau bản tin tháng bảy',[...NAVA_CONTEXT_DOCUMENT.reflection,'Trên rương cần họ theo cách gọi tiếng Việt. Mình sẽ dùng NAVA.', ...GUIDE.chest]);
      return;
    case 'chest-submit':
      if (!inView('chest')) return;
      if (!s.commit('chest', p)) return s.error('Dùng họ theo cách gọi trong tài liệu tiếng Việt: NAVA.');
      s.audio.playCue('success'); return s.dialogue('Mảnh ký ức đầu tiên', s.options?.onExit ? CAMPAIGN_ENDING : ENDING, 'Cất mảnh tranh và tìm cửa', 'close');
  }
}
