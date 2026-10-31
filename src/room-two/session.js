import Phaser from 'phaser';
import {AudioController} from '../audio/audio-controller.js';
import {disposeRoomSession, deferRoomExit, retainSharedAudioPreferences} from '../core/session-lifecycle.js';
import {RoomTwoScene} from './scene.js';
import {RoomTwoUI} from './ui.js';
import {CHAPTER, clues} from './content.js';
import {WORLD, OBJECTS} from './world.js';
import {createState, rendererState, reduce} from './rules.js';
import {loadSave, persistSave} from './save.js';
import {goalFor} from './goals.js';
import {handleAction, handleIntent} from './actions.js';
import {attachNarrativeVoice} from './narrative-voice.js';
import {AREA_GATES, DOOR_GATES, doorHintKey, doorObjects} from './area-gates.js';
import {lockedGateIds, lockedGateRects, gateById} from '../core/area-gates.js';

export class RoomTwoSession {
  constructor(root, options = {}) {
    this.root = root; this.options = options; this.disposed = false;
    if (options.storage !== undefined) this.storage = options.storage;
    else { try { this.storage = window.localStorage; } catch { this.storage = null; } }
    const loaded = loadSave(this.storage);
    this.state = loaded.state; this.notice = loaded.notice;
    this.active = null; this.nonce = 0; this.position = {...WORLD.checkpoints[0]};
    this.ownsAudio = !options.audio;
    this.audio = options.audio || new AudioController({onStatusChange: () => this.render()});
    this.audio.setScene('room-2');
    this.ui = new RoomTwoUI({root, onAction: (action, payload) => handleAction(this, action, payload),
      audio: this.audio, getState: () => rendererState(this.state), onIntent: intent => handleIntent(this, intent)});
    attachNarrativeVoice(this.ui.narrative, () => this.audio);
    this.scene = new RoomTwoScene({onInteract: id => this.interact(id),
      onPosition: position => { if (!this.disposed) { this.position = position; this.render(); } },
      onReady: () => this.render(),
      onGateBlocked: id => { const gate = gateById(AREA_GATES, id); if (gate && !this.disposed) { this.notice = gate.notice; this.render(); } },
      onShortcut: key => handleAction(this, {M: 'map', N: 'notebook', Q: 'quests-toggle', Escape: 'settings'}[key]),
      isPaused: () => this.disposed || Boolean(this.options.isPaused?.()) || Boolean(this.ui?.isOpen), audio: this.audio});
    this.game = new Phaser.Game({type: Phaser.AUTO, parent: 'game-canvas', backgroundColor: '#19251b',
      scale: {mode: Phaser.Scale.RESIZE, width: '100%', height: '100%'},
      render: {antialias: true, roundPixels: true}, scene: this.scene,
      physics: {default: 'arcade', arcade: {debug: false}}});
    this.audio.setPreferences(this.state); this.render();
    if (!this.state.introSeen) this.showNarrative(CHAPTER.introBeatId);
    else if (this.state.exitReached && !options.onExit) this.show('completed');
    this.onPageHide = () => this.audio.setMode('inactive');
    window.addEventListener('pagehide', this.onPageHide);
  }

  render() {
    if (this.disposed || !this.ui) return;
    const goal = goalFor(this.state), nearby = OBJECTS.find(object => object.id === this.position.nearbyId) || null;
    const hudState = {...this.state, collectedNoteIds: this.state.collectedClueIds, seenObjectIds: this.state.discoveredClueIds};
    this.ui.render({state: hudState, position: this.position, nearby, goal, notice: this.notice, audio: this.audio.getSnapshot(),
      lockedGateRects: lockedGateRects(AREA_GATES, this.state)});
    this.scene?.setLockedGates(lockedGateIds(AREA_GATES, this.state));
    this.scene?.setGoal(goal.id); this.scene?.setRoomComplete(this.state.fragmentCollected);
    this.audio.setPreferences(this.state);
    const mode = this.options.isPaused?.() ? 'inactive' : this.ui.isOpen ? 'dialogue' : 'exploration';
    if (this.audio.mode !== mode) this.audio.setMode(mode);
  }

  commit(action, payload = {}) {
    if (this.disposed) return false;
    const next = reduce(this.state, action, payload);
    if (next === this.state) return false;
    this.state = next;
    const notice = persistSave(this.storage, next);
    if (notice) this.notice = notice;
    this.render(); return true;
  }

  show(view, data = {}) {
    if (this.disposed) return;
    this.audio.voice?.stop(); this.ui.narrative.clear(); this.ui.puzzle.activeId = null; this.scene?.clearKeys();
    this.active = {kind: view, ...data, token: ++this.nonce};
    this.ui.show(view, data); this.render();
  }

  showNarrative(beatId, {clueId} = {}) {
    if (this.disposed) return;
    this.audio.voice?.stop(); this.scene?.clearKeys(); this.ui.puzzle.activeId = null;
    this.active = {kind: 'narrative', beatId, clueId, token: ++this.nonce};
    this.ui.narrative.show(beatId, {clueId}); this.render();
  }

  showPuzzle(puzzleId) {
    if (this.disposed) return;
    this.audio.voice?.stop(); this.scene?.clearKeys(); this.ui.narrative.clear();
    this.active = {kind: 'puzzle', puzzleId, token: ++this.nonce};
    this.ui.puzzle.show(puzzleId); this.render();
  }

  showDoor(gateId) {
    const gate = DOOR_GATES.find(item => item.id === gateId);
    if (this.disposed || !gate) return;
    this.audio.voice?.stop(); this.scene?.clearKeys(); this.ui.narrative.clear();
    this.active = {kind: 'door', gateId, token: ++this.nonce};
    this.ui.puzzle.activeId = doorHintKey(gateId); // Hệ Thống card keys its hints on this id
    this.ui.door.show(gate); this.render();
  }

  close() {
    if (this.disposed) return;
    this.audio.voice?.stop(); this.ui.close(); this.active = null; this.ui.narrative.clear();
    this.scene?.clearKeys(); this.scene?.focus(); this.render();
  }

  interact(id) {
    if (this.disposed || this.options.isPaused?.() || this.ui.isOpen || this.state.exitReached) return;
    const target = OBJECTS.find(object => object.id === id) || doorObjects(lockedGateIds(AREA_GATES, this.state)).find(object => object.id === id), position = this.scene.getPosition();
    if (!target || position.nearbyId !== id || Math.hypot(target.x - position.x, target.y - position.y) > target.radius) return;
    this.notice = '';
    if (target.type === 'clue') {
      this.commit('discover-clue', {clueId: target.clueId});
      this.showNarrative(clues[target.clueId].beatId, {clueId: target.clueId});
    } else if (target.type === 'puzzle') this.showPuzzle(target.puzzleId);
    else if (target.type === 'door') { this.showDoor(target.gateId); return; }
    else if (target.type === 'exit') {
      if (!this.commit('exit')) {
        this.notice = 'Cánh cửa còn khóa. Hãy hoàn thành thử thách trong gian này.';
        this.audio.playCue('error'); this.render(); return;
      }
      if (!deferRoomExit(this)) this.show('completed');
      return;
    }
    this.audio.playCue('paper');
  }

  reset() {
    if (this.disposed) return;
    const {audioEnabled, audioVolume} = this.state;
    this.close(); this.ui.puzzle.clearDrafts(); this.nonce++;
    this.state = {...createState(), audioEnabled, audioVolume};
    retainSharedAudioPreferences(this);
    this.notice = persistSave(this.storage, this.state);
    this.scene?.resetPosition(); this.render(); this.showNarrative(CHAPTER.introBeatId);
  }

  destroy() {
    return disposeRoomSession(this);
  }
}
