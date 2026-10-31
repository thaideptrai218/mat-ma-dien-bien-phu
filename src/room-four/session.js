import Phaser from 'phaser';
import {AudioController} from '../audio/audio-controller.js';
import {createDialogueVoice, startDialogueVoice} from '../audio/dialogue-voice.js';
import {RoomFourScene} from './scene.js';
import {RoomFourUI} from './ui.js';
import {DOCUMENTS} from './documents.js';
import {INTRO,CAMPAIGN_INTRO,REACTIONS,LINES} from './content.js';
import {WORLD,OBJECTS} from './world.js';
import {createState,goalFor,reduce,nextDocumentId} from './rules.js';
import {loadSave,persistSave} from './save.js';
import {handleAction} from './actions.js';
import {disposeRoomSession,deferRoomExit,retainSharedAudioPreferences} from '../core/session-lifecycle.js';

const introFor=options=>options.onExit?CAMPAIGN_INTRO:INTRO;

export class RoomFourSession {
  constructor(root,options={}) {
    this.root=root;this.options=options;this.disposed=false;this.ownsAudio=!options.audio;
    if(options.storage!==undefined)this.storage=options.storage;
    else try {this.storage=window.localStorage;} catch {this.storage=null;}
    const loaded=loadSave(this.storage);this.state=loaded.state;this.notice=loaded.notice;
    this.active=null;this.nonce=0;this.position={...WORLD.checkpoints[0]};
    this.audio=options.audio||new AudioController({onStatusChange:()=>this.render()});
    this.ui=new RoomFourUI({root,onAction:(action,payload)=>handleAction(this,action,payload)});
    this.scene=new RoomFourScene({
      onInteract:id=>this.interact(id),onPosition:p=>{if(this.disposed)return;this.position=p;this.render();},
      onShortcut:key=>handleAction(this,({M:'map',N:'notebook',Q:'quests-toggle',Escape:'settings'})[key]),
      isPaused:()=>this.disposed||Boolean(this.options.isPaused?.())||this.ui.isOpen,audio:this.audio,
    });
    this.game=new Phaser.Game({type:Phaser.AUTO,parent:'game-canvas',backgroundColor:'#171d18',
      scale:{mode:Phaser.Scale.RESIZE,width:'100%',height:'100%'},render:{antialias:true,roundPixels:true},
      scene:this.scene,physics:{default:'arcade',arcade:{debug:false}}});
    this.audio.setPreferences(this.state);this.render();
    if (!this.state.introSeen) this.dialogue('Những ngày quyết định',introFor(options),'Bước vào phòng 4','intro-finish');
    else if (this.state.exitReached) this.show('completed');
    this.onPageHide=()=>this.audio.setMode('inactive');window.addEventListener('pagehide',this.onPageHide);
  }
  render() {
    if (this.disposed||!this.ui) return;
    const goal=goalFor(this.state),nearby=OBJECTS.find(o=>o.id===this.position.nearbyId)||null;
    this.ui.render({state:this.state,position:this.position,nearby,goal,notice:this.notice,audio:this.audio.getSnapshot()});
    this.scene?.setGoal(goal.id);this.scene?.setChestOpen(this.state.chestOpened);this.scene?.setFragmentCollected?.(this.state.fragmentCollected);
    const mode=this.options.isPaused?.()?'inactive':this.ui.isOpen?'dialogue':'exploration';if(this.audio.mode!==mode)this.audio.setMode(mode);
  }
  commit(action,payload) {
    if(this.disposed)return false;
    const next=reduce(this.state,action,payload);if(next===this.state)return false;
    this.state=next;const notice=persistSave(this.storage,next);if(notice)this.notice=notice;this.render();return true;
  }
  show(view,data={}) {
    if(this.disposed)return;
    this.audio.voice?.stop();this.scene?.clearKeys();this.ui.show(view,data);this.active={kind:view,...data,token:++this.nonce};this.render();
  }
  dialogue(title,lines,buttonLabel='Trở lại bản đồ',action='close',payload={}) {
    if(this.disposed)return;
    const token=++this.nonce;
    const voice=createDialogueVoice(this.audio,lines);
    this.show('dialogue',{title,speaker:'Quang',lines:lines.map(line=>typeof line==='string'?line:`${line.speaker} — ${line.text}`),voice,buttonLabel,action,payload:{...payload,token}});
    this.active.token=token;startDialogueVoice(this,voice);
  }
  close(){if(this.disposed)return;this.audio.voice?.stop();this.ui.close();this.active=null;this.scene?.clearKeys();this.scene?.focus();this.render();}
  error(message){if(this.disposed)return;this.notice=message;this.audio.playCue('error');this.render();}
  isLocked(id) {
    const s=this.state;
    if(DOCUMENTS.some(d=>d.id===id))return !s.collectedNoteIds.includes(id)&&id!==nextDocumentId(s);
    if(id==='crossword')return s.collectedNoteIds.length!==7;
    if(id==='board-t'||id==='board-l')return !s.columnSolved;
    if(id==='chest')return !(s.boardTSolved&&s.boardLSolved);
    if(id==='door')return !s.fragmentCollected;
    return false;
  }
  interact(id) {
    if(this.disposed||this.options.isPaused?.()||this.ui.isOpen||this.state.exitReached)return;
    const object=OBJECTS.find(o=>o.id===id),p=this.scene.getPosition();
    if(!object||p.nearbyId!==id||Math.hypot(object.x-p.x,object.y-p.y)>object.radius)return;
    this.notice='';const s=this.state,locked=this.isLocked(id);
    const finished={crossword:s.crosswordSolved,'board-t':s.boardTSolved,'board-l':s.boardLSolved,chest:s.fragmentCollected,door:s.exitReached}[id]??
      (DOCUMENTS.some(d=>d.id===id)?s.collectedNoteIds.includes(id):s.seenObjectIds.includes(id));
    let lines=REACTIONS[id]?.[locked?'locked':finished?'repeat':'first']||['Mình sẽ xem kỹ chỗ này.'];
    if(id==='chest'&&s.chestOpened&&!s.fragmentCollected)lines=['Nắp rương đã bật lên. Mảnh tranh số IV nằm bên trong.'];
    this.commit('seen',{id});this.audio.playCue('paper');
    const prop=['lamp','radio'].includes(id);
    this.dialogue(object.label,lines,locked||prop?'Trở lại bản đồ':DOCUMENTS.some(d=>d.id===id)?'Đọc giấy tờ':'Xem kỹ đồ vật',
      locked||prop?'close':'continue-object',{id});
  }
  openObject(id) {
    if(this.disposed||this.options.isPaused?.())return;
    if(this.isLocked(id))return this.close();
    const document=DOCUMENTS.find(d=>d.id===id);
    if(document)return this.show('document',{document,readOnly:this.state.collectedNoteIds.includes(id)});
    if(id==='crossword')return this.show(this.state.crosswordSolved?'column':'crossword',{solved:this.state.columnSolved});
    if(id==='board-t'||id==='board-l')return this.show('board',{board:id==='board-t'?'t':'l',solved:id==='board-t'?this.state.boardTSolved:this.state.boardLSolved});
    if(id==='chest') {
      if(!this.state.chestOpened)return this.show('final');
      if(!this.state.fragmentCollected)return this.dialogue('Mảnh tranh số IV',LINES.fragmentReady,'Nhận mảnh tranh số IV','fragment-collect',{id:'chest'});
      return this.dialogue('Rương đã mở',LINES.chestEmpty);
    }
    if(id==='door'&&this.commit('exit')){if(!deferRoomExit(this))this.show('completed');}
  }
  reset(){if(this.disposed)return;this.ui.close();this.active=null;this.nonce++;this.state=createState();retainSharedAudioPreferences(this);this.notice=persistSave(this.storage,this.state);this.scene.resetPosition?.();this.audio.setPreferences(this.state);this.render();this.dialogue('Những ngày quyết định',introFor(this.options),'Bước vào phòng 4','intro-finish');}
  destroy(){return disposeRoomSession(this);}
}
