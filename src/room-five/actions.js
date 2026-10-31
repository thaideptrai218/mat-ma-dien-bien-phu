import {goalFor, hasAllFragments} from './rules.js';
import {GUIDE, LINES} from './content.js';

export function handleAction(session, action, payload = {}) {
  const s = session;
  if (s.disposed || s.options.isPaused?.()) return;
  const active = s.active;
  const inView = kind => active?.kind === kind;
  const confirmed = expected => inView('dialogue') && active.action === expected && active.token === payload.token;
  const matching = kind => inView(kind) && active.token === payload.token;
  switch (action) {
    case 'modal-open': s.scene?.clearKeys(); return;
    case 'modal-close': s.active = null; s.scene?.clearKeys(); s.scene?.focus(); s.render(); return;
    case 'close': return s.close();
    case 'intro-finish': if (confirmed('intro-finish')) {s.commit('intro'); s.close();} return;
    case 'continue-object':
      if (confirmed('continue-object') && payload.id === active.payload.id) s.openObject(payload.id);
      return;
    case 'interact': return s.interact(s.position.nearbyId);
    case 'map': return s.show('map', {position: s.position, state: s.state, goal: goalFor(s.state, s.fragments)});
    case 'notebook': return s.show('notebook', {inventory: `Đang giữ ${s.fragments.length ? s.fragments.map(id => ['I', 'II', 'III', 'IV'][id - 1]).join(', ') : 'chưa có mảnh tranh nào'}. Bốn mảnh chỉ đến từ bốn phòng đã chơi.`});
    case 'quests-toggle': s.ui.toggleQuests(); return;
    case 'settings': if (s.ui.isOpen) s.close(); else s.show('settings', {audio: s.audio.getSnapshot()}); return;
    case 'reset-confirmed': if (inView('settings')) s.reset(); return;
    case 'audio-toggle': {
      const runtime = s.audio.getSnapshot();
      if (!s.state.audioEnabled || (runtime.unlocked && runtime.running)) s.commit('audio');
      s.audio.setPreferences(s.state);
      if (s.state.audioEnabled) s.audio.unlockFromGesture().then(result => {
        if (s.disposed) return;
        if (result.notice) s.notice = result.notice; s.render();
      });
      return;
    }
    case 'assembly-draft':
      if (matching('assembly') && !s.state.assemblySolved && validOrder(payload.order)) s.assemblyOrder = [...payload.order];
      return;
    case 'assembly-submit':
      if (!matching('assembly') || s.state.assemblySolved) return;
      s.notice = '';
      if (!hasAllFragments(s.fragments)) return s.error('Cần đủ bốn mảnh thật từ hành trình trước khi ghép tranh.');
      if (!s.commit('assembly', {order: payload.order})) return s.error('Chưa đúng.');
      s.audio.playCue('painting-complete');
      return s.dialogue('Tranh đã nguyên vẹn, cửa vẫn đóng', [...LINES.assembly, ...GUIDE.assembly]);
    case 'reflection-continue':
      if (!matching('reflection') || active.readOnly || !s.commit('reflection')) return;
      s.audio.playCue('door-final-swell');
      return s.dialogue('Cánh cửa đã mở', [...LINES.door, ...GUIDE.door]);
    case 'reflection-reread':
      if (inView('notebook') && s.state.reflectionSeen) s.show('reflection', {readOnly: true});
      return;
  }
}

function validOrder(order) {
  return Array.isArray(order) && order.length === 4 && new Set(order).size === 4 && order.every(id => [0, 1, 2, 3].includes(id));
}
