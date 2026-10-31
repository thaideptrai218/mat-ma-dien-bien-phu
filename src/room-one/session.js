import Phaser from 'phaser';
import {AudioController} from '../audio/audio-controller.js';
import {createDialogueVoice, startDialogueVoice} from '../audio/dialogue-voice.js';
import {RoomOneScene} from './scene.js';
import {RoomOneUI} from './ui.js';
import {DOCUMENTS} from './documents.js';
import {INTRO, REACTIONS, LINES} from './content.js';
import {WORLD, OBJECTS} from './world.js';
import {createState, goalFor, reduce} from './rules.js';
import {loadSave, persistSave} from './save.js';
import {handleAction} from './actions.js';
import {LETTER_DOCUMENT} from './letter-document.js';
import {disposeRoomSession, deferRoomExit, retainSharedAudioPreferences} from '../core/session-lifecycle.js';

export class RoomOneSession {
  constructor(root, options = {}) {
    this.root = root; this.options = options; this.disposed = false; this.ownsAudio = !options.audio;
    if (options.storage !== undefined) this.storage = options.storage;
    else try { this.storage = window.localStorage; } catch { this.storage = null; }
    const loaded = loadSave(this.storage);
    this.state = loaded.state; this.notice = loaded.notice;
    this.active = null; this.nonce = 0; this.position = {...WORLD.checkpoints[0]};
    this.audio = options.audio || new AudioController({onStatusChange: () => this.render()});
    this.audio.setScene('room-1');
    this.ui = new RoomOneUI({root, onAction: (action, payload) => handleAction(this, action, payload)});
    this.scene = new RoomOneScene({
      onInteract: id => this.interact(id),
      onPosition: position => { if (this.disposed) return; this.position = position; this.render(); },
      onShortcut: key => handleAction(this, ({M:'map', N:'notebook', Q:'quests-toggle', Escape:'settings'})[key]),
      isPaused: () => this.disposed || Boolean(this.options.isPaused?.()) || this.ui.isOpen,
      audio: this.audio,
    });
    this.game = new Phaser.Game({type: Phaser.AUTO, parent: 'game-canvas', backgroundColor: '#171d18',
      scale: {mode: Phaser.Scale.RESIZE, width: '100%', height: '100%'},
      render: {antialias: true, roundPixels: true}, scene: this.scene,
      physics: {default: 'arcade', arcade: {debug: false}}});
    this.audio.setPreferences(this.state); this.render();
    if (!this.state.introSeen) this.dialogue('Trước bản kế hoạch', INTRO, 'Bước vào căn phòng', 'intro-finish');
    else if (this.state.exitReached) this.show('completed');
    this.onPageHide = () => this.audio.setMode('inactive');
    window.addEventListener('pagehide', this.onPageHide);
  }
  render() {
    if (this.disposed || !this.ui) return;
    const goal = goalFor(this.state);
    const nearby = OBJECTS.find(o => o.id === this.position.nearbyId) || null;
    this.ui.render({state: this.state, position: this.position, nearby, goal,
      notice: this.notice, audio: this.audio.getSnapshot()});
    this.scene?.setGoal?.(goal.id);
    const mode = this.options.isPaused?.() ? 'inactive' : this.ui.isOpen ? 'dialogue' : 'exploration';
    if (this.audio.mode !== mode) this.audio.setMode(mode);
  }
  commit(action, payload) {
    if (this.disposed) return false;
    const next = reduce(this.state, action, payload);
    if (next === this.state) return false;
    this.state = next; const error = persistSave(this.storage, next);
    if (error) this.notice = error;
    this.render(); return true;
  }
  show(view, data = {}) {
    if (this.disposed) return;
    this.audio.voice?.stop(); this.scene?.clearKeys(); this.ui.show(view, data);
    this.active = {kind: view, ...data, token: ++this.nonce}; this.render();
  }
  dialogue(title, lines, buttonLabel = 'Trở lại bản đồ', action = 'close', payload = {}) {
    if (this.disposed) return;
    const messages = lines.map(line => typeof line === 'string' ? line : `${line.speaker} — ${line.text}`);
    const token = ++this.nonce;
    const voice = createDialogueVoice(this.audio, lines);
    this.show('dialogue', {title, speaker: 'Quang', lines: messages, voice, buttonLabel, action, payload: {...payload, token}});
    this.active.token = token; startDialogueVoice(this, voice);
  }
  close() { if (this.disposed) return; this.audio.voice?.stop(); this.ui.close(); this.active = null; this.scene?.clearKeys(); this.scene?.focus(); this.render(); }
  error(message) { if (this.disposed) return; this.notice = message; this.audio.playCue('error'); this.render(); }
  interact(id) {
    if (this.disposed || this.options.isPaused?.() || this.ui.isOpen || this.state.exitReached) return;
    const object = OBJECTS.find(o => o.id === id);
    const p = this.scene.getPosition();
    if (!object || p.nearbyId !== id || Math.hypot(object.x-p.x, object.y-p.y) > object.radius) return;
    this.notice = '';
    const locked = this.isLocked(id), seen = this.state.seenObjectIds.includes(id);
    const s = this.state;
    const finished = {letter:s.letterSolved,'map-a03':s.envelopeOpened,comparison:s.comparisonSolved,
      drawer:s.drawerOpened,chest:s.chestOpened,door:s.exitReached}[id] ??
      (DOCUMENTS.some(d=>d.id===id) ? s.collectedNoteIds.includes(id) : seen);
    const reaction = REACTIONS[id]?.[locked ? 'locked' : finished ? 'repeat' : 'first'] || ['Mình cần xem kỹ dấu vết này.'];
    this.commit('seen', {id}); this.audio.playCue('paper');
    const props = ['lamp','crate','radio'];
    const readLabel = id === 'letter' ? 'Mở thư' : DOCUMENTS.some(d=>d.id===id) ? 'Đọc giấy tờ' : 'Xem kỹ đồ vật';
    this.dialogue(object.label, reaction, locked || props.includes(id) ? 'Trở lại bản đồ' : readLabel,
      locked || props.includes(id) ? 'close' : 'continue-object', {id});
  }
  isLocked(id) {
    const s = this.state;
    if (id === 'map-a03') return !s.letterSolved;
    if (DOCUMENTS.some(d => d.id === id)) return !s.envelopeOpened;
    if (id === 'comparison') return s.collectedNoteIds.length !== 4;
    if (id === 'drawer') return !s.comparisonSolved;
    if (id === 'chest') return !s.identitySolved;
    if (id === 'door') return !s.chestOpened;
    return false;
  }
  openObject(id) {
    if (this.disposed || this.options.isPaused?.()) return;
    if (this.isLocked(id)) return this.close();
    if (id === 'letter') {
      return this.show('document',{document:LETTER_DOCUMENT,readOnly:this.state.letterSolved,finishAction:'letter-finish'});
    }
    if (id === 'map-a03') return this.show('a03');
    const document = DOCUMENTS.find(d => d.id === id);
    if (document) return this.show('document', {document, readOnly: this.state.collectedNoteIds.includes(id)});
    if (id === 'comparison') return this.show('comparison', {solved: this.state.comparisonSolved});
    if (id === 'drawer') return this.show(this.state.drawerOpened ? 'identity' : 'drawer');
    if (id === 'chest') {
      if (this.state.chestOpened) return this.dialogue('Mảnh tranh thứ nhất', LINES.chestOpened);
      return this.show('chest');
    }
    if (id === 'door' && this.commit('exit')) {
      if (!deferRoomExit(this)) this.show('completed');
    }
  }
  reset() {
    if (this.disposed) return;
    this.ui.close(); this.active = null; this.nonce++;
    this.state = createState(); retainSharedAudioPreferences(this); this.notice = persistSave(this.storage, this.state);
    this.scene.resetPosition?.(); this.audio.setPreferences(this.state);
    this.dialogue('Trước bản kế hoạch', INTRO, 'Bước vào căn phòng', 'intro-finish');
  }
  destroy() { return disposeRoomSession(this); }
}
