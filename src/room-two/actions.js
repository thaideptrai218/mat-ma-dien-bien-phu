import {CHAPTER, clues, puzzles, beats, evaluatePuzzle} from './content.js';
import {PUZZLE_GUIDE} from './system-guidance.js';
import {NEUTRAL_WRONG} from '../ui/neutral-notice.js';
import {createDialogueVoice, startDialogueVoice} from '../audio/dialogue-voice.js';

// Hệ Thống points to the next station first; the solved board stays one button away.
function showGuide(session, puzzle) {
  const spoken = [puzzle.successText, ...PUZZLE_GUIDE[puzzle.id]];
  const lines = spoken.map(line => typeof line === 'string' ? line : `${line.speaker} — ${line.text}`);
  const voice = createDialogueVoice(session.audio, spoken);
  session.show('dialogue', {title: puzzle.title, speaker: 'Quang', lines, script: spoken, voice, buttonLabel: 'Xem lại kết quả trên bàn',
    action: 'puzzle-review', payload: {puzzleId: puzzle.id, token: session.nonce + 1}});
  startDialogueVoice(session, voice);
}

export function handleIntent(session, intent) {
  if (session.disposed || session.options.isPaused?.() || !intent) return;
  const active = session.active;
  if (intent.type === 'play-cue') {
    if (active?.kind === 'puzzle' && ['weight', 'static', 'chain', 'fold', 'unlock', 'error'].includes(intent.kind))
      session.audio.playCue(intent.kind);
    return;
  }
  // Hints now come from Hệ Thống after a wrong try (see ui.js); the donor hint button is hidden and unreachable.
  if (intent.type === 'use-hint') return;
  if (intent.type === 'submit-puzzle') {
    if (active?.kind !== 'puzzle' || active.puzzleId !== intent.puzzleId) return;
    const puzzle = puzzles[intent.puzzleId];
    if (!puzzle || session.state.completedPuzzleIds.includes(puzzle.id)) return;
    if (puzzle.requiresPuzzleId && !session.state.completedPuzzleIds.includes(puzzle.requiresPuzzleId)) {
      session.audio.playCue('error');
      session.ui.puzzle.showFeedback(NEUTRAL_WRONG, 'error');
      return;
    }
    const result = evaluatePuzzle(puzzle.id, intent.answer, session.state.collectedClueIds);
    if (!result.ok) {
      session.audio.playCue('error'); session.ui.puzzle.showFeedback(NEUTRAL_WRONG, 'error');
      return;
    }
    if (!session.commit(intent.type, intent)) return;
    session.audio.playCue(puzzle.type === 'fold' ? 'unlock' : 'success');
    session.notice = puzzle.successText;
    if (session.state.fragmentCollected && !session.state.completedBeatIds.includes(CHAPTER.outroBeatId))
      session.showNarrative(CHAPTER.outroBeatId);
    else if (PUZZLE_GUIDE[puzzle.id]) showGuide(session, puzzle);
    else { session.showPuzzle(puzzle.id); session.ui.puzzle.showFeedback(puzzle.successText, 'success'); }
    return;
  }
  if (!['collect-clue', 'complete-beat'].includes(intent.type) || active?.kind !== 'narrative') return;
  const current = session.ui.narrative.getActive();
  if (!current?.lastLine || current.beatId !== active.beatId) return;
  if (intent.type === 'collect-clue') {
    const clue = clues[intent.clueId];
    if (!clue || active.clueId !== clue.id || current.clueId !== clue.id || current.beatId !== clue.beatId) return;
    if (session.commit(intent.type, intent)) session.notice = `Đã ghi: ${clue.title}`;
  } else {
    if (!beats[intent.beatId] || current.beatId !== intent.beatId) return;
    session.commit(intent.type, intent);
  }
  session.close();
}

export function handleAction(session, action, payload = {}) {
  if (session.disposed) return;
  if (action === 'modal-open') { session.scene?.clearKeys(); return; }
  if (action === 'modal-close') {
    session.active = null; session.ui.narrative.clear(); session.scene?.clearKeys(); session.scene?.focus(); session.render(); return;
  }
  if (session.options.isPaused?.()) return;
  switch (action) {
    case 'close': return session.close();
    case 'puzzle-review': {
      const active = session.active, puzzle = puzzles[payload.puzzleId];
      if (active?.kind !== 'dialogue' || payload.token !== active.token || payload.puzzleId !== active.payload?.puzzleId) return;
      if (!puzzle || !session.state.completedPuzzleIds.includes(puzzle.id)) return;
      session.showPuzzle(puzzle.id); session.ui.puzzle.showFeedback(puzzle.successText, 'success');
      return;
    }
    case 'interact': return session.interact(session.position.nearbyId);
    case 'map': return session.show('map');
    case 'notebook': return session.show('notebook', {state: session.state});
    case 'quests-toggle': return session.ui.toggleQuests();
    case 'settings': return session.show('settings', {audio: session.audio.getSnapshot()});
    case 'read-clue':
      if (session.active?.kind === 'notebook' && session.state.discoveredClueIds.includes(payload.clueId))
        session.showNarrative(clues[payload.clueId].beatId, {clueId: payload.clueId});
      return;
    case 'reset-confirmed': if (session.active?.kind === 'settings') session.reset(); return;
    case 'audio-toggle': {
      const runtime = session.audio.getSnapshot();
      if (!session.state.audioEnabled || (runtime.unlocked && runtime.running)) session.commit('audio');
      session.audio.setPreferences(session.state);
      if (session.state.audioEnabled) session.audio.unlockFromGesture().then(result => {
        if (session.disposed) return;
        if (result.notice) session.notice = result.notice;
        session.render();
      });
      return;
    }
  }
}
