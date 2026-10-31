import {DOCUMENTS} from './documents.js';
import {ENDING, CAMPAIGN_ENDING, GUIDE, LINES} from './content.js';
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
        return s.dialogue('Long · Sau khi đọc thư', [...LETTER_DOCUMENT.reflection, ...LINES.letterArchive, ...GUIDE.letter], 'Nhớ ký hiệu A-03', 'letter-record', {documentId:'restored-letter'});
      return;
    case 'letter-record':
      if (dialogueToken() && active.action === 'letter-record' && s.commit('letter', p)) s.close();
      return;
    case 'map-submit':
      if (!inView('a03')) return;
      if (!s.commit('map', p)) return s.error('Chưa đúng.');
      s.audio.playCue('success');
      return s.dialogue('Ngăn lưu trữ A-03', [...LINES.a03, ...GUIDE.a03]);
    case 'document-finish': {
      if (!inView('document') || active.readOnly || active.document.id !== p.id) return;
      if (!s.commit('read', p)) {
        if (!s.state.readNoteIds.includes(p.id)) return;
      }
      const doc = DOCUMENTS.find(d => d.id === p.id);
      return s.dialogue(`Long suy luận · ${doc.code}`, doc.reflection, 'Ghi dữ kiện vào sổ tay', 'document-collect', {id:p.id});
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
      if (!s.commit('comparison', p)) return s.error('Có chỗ chưa khớp.');
      s.audio.playCue('success');
      return s.dialogue('Bốn hàng dữ kiện', [...LINES.comparison, ...GUIDE.comparison], 'Ghi mã ngăn kéo 2413', 'close');
    case 'drawer-submit':
      if (!inView('drawer')) return;
      if (!s.commit('drawer', p)) return s.error('Chưa đúng.');
      s.audio.playCue('drawer-open'); return s.show('identity');
    case 'identity-submit':
      if (!inView('identity')) return;
      if (!s.commit('identity', p)) return s.error('Chưa đúng.');
      s.audio.playCue('success');
      return s.dialogue('Henri Navarre · Tháng 5/1953', [...LINES.identity, ...GUIDE.identity], 'Đọc bản tin tháng 7/1953', 'nava-context-open');
    case 'nava-context-open':
      if (dialogueToken() && active.action === 'nava-context-open' && s.state.identitySolved)
        return s.show('document',{document:NAVA_CONTEXT_DOCUMENT,readOnly:false,finishAction:'nava-context-finish'});
      return;
    case 'nava-context-finish':
      if (inView('document') && !active.readOnly && s.state.identitySolved && active.document.id === 'nava-context' && p.id === active.document.id)
        return s.dialogue('Long · Sau bản tin tháng bảy',[...NAVA_CONTEXT_DOCUMENT.reflection,...LINES.navaContext, ...GUIDE.chest]);
      return;
    case 'door-submit':
      if (!inView(`door-${p.id}`)) return;
      if (!s.commit('door', p)) return s.error('Chưa khớp.');
      s.audio.playCue('success'); s.close(); s.notice = 'Khóa đã mở. Lối đi phía sau đã thông.'; s.render(); return;
    case 'chest-submit':
      if (!inView('chest')) return;
      if (!s.commit('chest', p)) return s.error('Chưa đúng.');
      s.audio.playCue('chest-unlock'); setTimeout(() => { if (!s.disposed) s.audio.playCue('chest-open'); }, 350); return s.dialogue('Mảnh ký ức đầu tiên', s.options?.onExit ? CAMPAIGN_ENDING : ENDING, 'Cất mảnh tranh và tìm cửa', 'close');
  }
}
