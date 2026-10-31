import Phaser from 'phaser';
import {AudioController} from '../audio/audio-controller.js';
import {createDialogueVoice, startDialogueVoice} from '../audio/dialogue-voice.js';
import {disposeRoomSession, deferRoomExit, retainSharedAudioPreferences} from '../core/session-lifecycle.js';
import {RoomOneUI} from '../room-one/ui.js';
import {RoomFiveScene} from './scene.js';
import {createPanel, shuffledPieces} from './panels.js';
import {INTRO, SOURCE_LABEL, LINES, NOTICES, REFLECTION_SCRIPT} from './content.js';
import {WORLD, OBJECTS} from './world.js';
import {createState, goalFor, hasAllFragments, reduce} from './rules.js';
import {loadSave, persistSave} from './save.js';
import {handleAction} from './actions.js';
import './room-five.css';

export class RoomFiveSession {
  constructor(root, options = {}) {
    this.disposed = false; this.options = options; this.ownsAudio = !options.audio;
    this.fragments = [...new Set(Array.isArray(options.fragments) ? options.fragments.filter(id => [1, 2, 3, 4].includes(id)) : [])];
    if (options.storage !== undefined) this.storage = options.storage;
    else {try {this.storage = window.localStorage;} catch {this.storage = null;}}
    const loaded = loadSave(this.storage, this.fragments); this.state = loaded.state; this.notice = loaded.notice;
    this.active = null; this.nonce = 0; this.position = {...WORLD.checkpoints[0]}; this.assemblyOrder = shuffledPieces();
    this.audio = options.audio || new AudioController({onStatusChange: () => this.render()});
    this.audio.setScene('room-5');
    retainSharedAudioPreferences(this);
    this.ui = new RoomOneUI({root, onAction: (action, payload) => handleAction(this, action, payload)}, {
      subtitle: 'PHÒNG 5 · BỨC TRANH HÒA BÌNH', date: 'CĂN PHÒNG CUỐI', roomLabel: 'HÀNH TRÌNH PHÒNG 5',
      world: WORLD, panelFactory: createPanel,
    });
    this.scene = new RoomFiveScene({
      onInteract: id => this.interact(id), onPosition: position => {if (!this.disposed) {this.position = position; this.render();}},
      onShortcut: key => handleAction(this, ({M: 'map', N: 'notebook', Q: 'quests-toggle', Escape: 'settings'})[key]),
      isPaused: () => this.disposed || Boolean(this.options.isPaused?.()) || this.ui.isOpen, audio: this.audio,
    });
    this.game = new Phaser.Game({type: Phaser.AUTO, parent: 'game-canvas', backgroundColor: '#22372d',
      scale: {mode: Phaser.Scale.RESIZE, width: '100%', height: '100%'}, render: {antialias: true, roundPixels: true},
      scene: this.scene, physics: {default: 'arcade', arcade: {debug: false}}});
    this.audio.setPreferences(this.state); this.render();
    if (!this.state.introSeen) this.dialogue('Bức tranh hòa bình', hasAllFragments(this.fragments) ? [...INTRO, SOURCE_LABEL] : [
      NOTICES.introMissing, SOURCE_LABEL,
    ], 'Bước vào căn phòng cuối', 'intro-finish');
    else if (this.state.exitReached && !options.onExit) this.show('completed');
    this.onPageHide = () => this.audio.setMode('inactive'); window.addEventListener('pagehide', this.onPageHide);
  }
  render() {
    if (this.disposed || !this.ui) return;
    const goal = goalFor(this.state, this.fragments), nearby = OBJECTS.find(o => o.id === this.position.nearbyId) || null;
    this.ui.render({state: this.state, position: this.position, nearby, goal, notice: this.notice, audio: this.audio.getSnapshot()});
    this.scene?.setGoal(goal.id); this.scene?.setDoorOpen(this.state.reflectionSeen);
    const mode = this.options.isPaused?.() ? 'inactive' : this.ui.isOpen ? 'dialogue' : 'exploration';
    if (this.audio.mode !== mode) this.audio.setMode(mode);
  }
  commit(action, payload) {
    if (this.disposed || this.options.isPaused?.()) return false;
    const next = reduce(this.state, action, payload, this.fragments); if (next === this.state) return false;
    this.state = next; const notice = persistSave(this.storage, next, this.fragments); if (notice) this.notice = notice;
    this.render(); return true;
  }
  show(view, data = {}) {
    if (this.disposed || this.options.isPaused?.()) return;
    const token = ++this.nonce; this.audio.voice?.stop(); this.scene?.clearKeys();
    const voice = view === 'reflection' ? createDialogueVoice(this.audio, REFLECTION_SCRIPT) : null;
    if (voice) data = {...data, voice};
    // Mark the active context before mounting a panel: opening a dialog may synchronously emit modal-open.
    this.active = {kind: view, ...data, token}; this.ui.show(view, {...data, token}); this.render();
    startDialogueVoice(this, voice);
  }
  dialogue(title, lines, buttonLabel = 'Trở lại bản đồ', action = 'close', payload = {}) {
    if (this.disposed) return;
    const token = this.nonce + 1;
    const messages = lines.map(line => typeof line === 'string' ? line : `${line.speaker} — ${line.text}`);
    const voice = createDialogueVoice(this.audio, lines);
    this.show('dialogue', {title, speaker: 'Quang', lines: messages, voice, buttonLabel, action, payload: {...payload, token}});
    startDialogueVoice(this, voice);
  }
  close() {
    if (this.disposed) return;
    this.audio.voice?.stop(); this.ui.close(); this.active = null; this.scene?.clearKeys(); this.scene?.focus(); this.render();
  }
  error(message) {if (!this.disposed) {this.notice = message; this.audio.playCue('error'); this.render();}}
  interact(id) {
    if (this.disposed || this.options.isPaused?.() || this.ui.isOpen || this.state.exitReached) return;
    const object = OBJECTS.find(o => o.id === id), position = this.scene.getPosition();
    if (!object || position.nearbyId !== id || Math.hypot(object.x - position.x, object.y - position.y) > object.radius) return;
    this.notice = ''; this.commit('seen', {id}); this.audio.playCue('paper');
    if (id === 'lamp') return this.dialogue(object.label, LINES.lamp);
    if (id === 'satchel') return this.dialogue(object.label, hasAllFragments(this.fragments) ? LINES.satchelFull : LINES.satchelMissing);
    if (id === 'assembly' && !hasAllFragments(this.fragments)) return this.dialogue(object.label, LINES.assemblyMissing);
    if (id === 'reflection' && !this.state.assemblySolved) return this.dialogue(object.label, LINES.reflectionLocked);
    if (id === 'door' && !this.state.reflectionSeen) return this.dialogue(object.label, this.state.assemblySolved ? LINES.doorAssembled : LINES.doorUnassembled);
    this.dialogue(object.label, LINES[id === 'assembly' ? 'lookAssembly' : id === 'reflection' ? 'lookReflection' : 'lookDoor'],
      id === 'door' ? 'Bước qua cửa trở về' : 'Xem kỹ', 'continue-object', {id});
  }
  openObject(id) {
    if (this.disposed || this.options.isPaused?.()) return;
    if (id === 'assembly' && hasAllFragments(this.fragments)) return this.show('assembly', {order: this.assemblyOrder, solved: this.state.assemblySolved});
    if (id === 'reflection' && this.state.assemblySolved) return this.show('reflection', {readOnly: this.state.reflectionSeen});
    if (id === 'door' && this.commit('exit')) {
      if (!this.options.onExit) return this.show('completed');
      this.close();
      deferRoomExit(this);
    }
  }
  reset() {
    if (this.disposed) return;
    this.ui.close(); this.active = null; this.nonce++; this.state = createState(); retainSharedAudioPreferences(this);
    this.assemblyOrder = shuffledPieces(); this.notice = persistSave(this.storage, this.state, this.fragments);
    this.scene.resetPosition?.(); this.audio.setPreferences(this.state); this.render();
    this.dialogue('Bức tranh hòa bình', hasAllFragments(this.fragments) ? INTRO : [NOTICES.resetMissing], 'Bước vào căn phòng cuối', 'intro-finish');
  }
  destroy() {return disposeRoomSession(this);}
}
