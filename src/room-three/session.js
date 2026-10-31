import Phaser from 'phaser';
import {AudioController} from '../audio/audio-controller.js';
import {createDialogueVoice, startDialogueVoice} from '../audio/dialogue-voice.js';
import {RoomThreeScene} from './scene.js';
import {RoomThreeUI} from './ui.js';
import {DOCUMENTS} from './documents.js';
import {INTRO,CAMPAIGN_INTRO,REACTIONS,LINES} from './content.js';
import {CHALLENGES} from './puzzle-data.js';
import {WORLD,OBJECTS} from './world.js';
import {createState,reduce,nextDocumentId,canSolve,recoveredTokens} from './rules.js';
import {goalFor} from './goals.js';
import {loadSave,persistSave} from './save.js';
import {handleAction} from './actions.js';
import {disposeRoomSession,deferRoomExit,retainSharedAudioPreferences} from '../core/session-lifecycle.js';

const introFor = options => options.onExit ? CAMPAIGN_INTRO : INTRO;

export class RoomThreeSession{
  constructor(root,options={}){
    this.root=root;this.options=options;this.disposed=false;this.ownsAudio=!options.audio;
    if(options.storage!==undefined)this.storage=options.storage;
    else try{this.storage=window.localStorage;}catch{this.storage=null;}
    const loaded=loadSave(this.storage);this.state=loaded.state;this.notice=loaded.notice;this.active=null;this.nonce=0;this.position={...WORLD.checkpoints[0]};
    this.audio=options.audio||new AudioController({onStatusChange:()=>this.render()});
    this.audio.setScene('room-3');
    this.ui=new RoomThreeUI({root,onAction:(action,payload)=>handleAction(this,action,payload)});
    this.scene=new RoomThreeScene({onInteract:id=>this.interact(id),onPosition:p=>{if(this.disposed)return;this.position=p;this.render();},
      onShortcut:key=>handleAction(this,({M:'map',N:'notebook',Q:'quests-toggle',Escape:'settings'})[key]),isPaused:()=>this.disposed||Boolean(this.options.isPaused?.())||this.ui.isOpen,audio:this.audio});
    this.game=new Phaser.Game({type:Phaser.AUTO,parent:'game-canvas',backgroundColor:'#26362a',scale:{mode:Phaser.Scale.RESIZE,width:'100%',height:'100%'},
      render:{antialias:true,roundPixels:true},scene:this.scene,physics:{default:'arcade',arcade:{debug:false}}});
    this.audio.setPreferences(this.state);this.render();
    if(!this.state.introSeen)this.dialogue('Mật mã hậu phương',introFor(options),'Bắt đầu tuyến tiếp vận','intro-finish');
    else if(this.state.exitReached)this.show('completed');
    this.onPageHide=()=>this.audio.setMode('inactive');window.addEventListener('pagehide',this.onPageHide);
  }
  render(){
    if(this.disposed||!this.ui)return;const goal=goalFor(this.state),nearby=OBJECTS.find(o=>o.id===this.position.nearbyId)||null;
    this.ui.render({state:this.state,position:this.position,nearby,goal,notice:this.notice,audio:this.audio.getSnapshot(),tokens:recoveredTokens(this.state)});
    this.scene?.setGoal(goal.id);this.scene?.setChestOpen(this.state.chestOpened);this.scene?.setFragmentCollected(this.state.fragmentCollected);
    const mode=this.options.isPaused?.()?'inactive':this.ui.isOpen?'dialogue':'exploration';if(this.audio.mode!==mode)this.audio.setMode(mode);
  }
  commit(action,p){if(this.disposed)return false;const next=reduce(this.state,action,p);if(next===this.state)return false;this.state=next;const notice=persistSave(this.storage,next);if(notice)this.notice=notice;this.render();return true;}
  show(view,data={}){if(this.disposed)return;this.audio.voice?.stop();this.scene?.clearKeys();this.ui.show(view,data);this.active={kind:view,...data,token:++this.nonce};this.render();}
  dialogue(title,lines,buttonLabel='Trở lại bản đồ',action='close',payload={}){
    if(this.disposed)return;
    const token=++this.nonce;const voice=createDialogueVoice(this.audio,lines);
    this.show('dialogue',{title,speaker:'Quang',lines:lines.map(line=>typeof line==='string'?line:`${line.speaker} — ${line.text}`),voice,buttonLabel,action,payload:{...payload,token}});this.active.token=token;startDialogueVoice(this,voice);
  }
  close(){if(this.disposed)return;this.audio.voice?.stop();this.ui.close();this.active=null;this.scene?.clearKeys();this.scene?.focus();this.render();}
  error(message){if(this.disposed)return;this.notice=message;this.audio.playCue('error');this.render();}
  isLocked(id){
    if(DOCUMENTS.some(d=>d.id===id))return !this.state.collectedNoteIds.includes(id)&&nextDocumentId(this.state)!==id;
    const challenge=CHALLENGES.find(ch=>ch.stationId===id);
    if(challenge)return !this.state.completedChallenges.includes(challenge.id)&&!canSolve(this.state,challenge.id);
    if(id==='chest')return this.state.completedChallenges.length!==4;
    if(id==='door')return !this.state.fragmentCollected;
    return false;
  }
  interact(id){
    if(this.disposed||this.options.isPaused?.()||this.ui.isOpen||this.state.exitReached)return;const object=OBJECTS.find(o=>o.id===id),p=this.scene.getPosition();
    if(!object||p.nearbyId!==id||Math.hypot(object.x-p.x,object.y-p.y)>object.radius)return;
    this.notice='';const locked=this.isLocked(id),challenge=CHALLENGES.find(ch=>ch.stationId===id),s=this.state;
    const done=challenge?s.completedChallenges.includes(challenge.id):DOCUMENTS.some(d=>d.id===id)?s.collectedNoteIds.includes(id):id==='chest'?s.fragmentCollected:id==='door'?s.exitReached:s.seenObjectIds.includes(id);
    let lines=REACTIONS[id]?.[locked?'locked':done?'repeat':'first']||['Mình sẽ xem kỹ chỗ này.'];
    if(id==='chest'&&s.chestOpened&&!s.fragmentCollected)lines=['Khóa đã mở. Mảnh tranh số III nằm trong rương.'];
    this.commit('seen',{id});this.audio.playCue('paper');const prop=['supply-crates','road-tools','field-lamp'].includes(id);
    this.dialogue(object.label,lines,locked||prop?'Trở lại bản đồ':DOCUMENTS.some(d=>d.id===id)?'Đọc giấy tờ':'Xem kỹ đồ vật',locked||prop?'close':'continue-object',{id});
  }
  openObject(id){
    if(this.disposed||this.options.isPaused?.())return;
    if(this.isLocked(id))return this.close();const document=DOCUMENTS.find(d=>d.id===id);
    if(document)return this.show('document',{document,readOnly:this.state.collectedNoteIds.includes(id)});
    const ch=CHALLENGES.find(c=>c.stationId===id);
    if(ch)return this.show(ch.id,{solved:this.state.completedChallenges.includes(ch.id),reward:ch.reward});
    if(id==='chest'){
      if(!this.state.chestOpened)return this.show('final',{tokens:recoveredTokens(this.state)});
      if(!this.state.fragmentCollected)return this.dialogue('Hồ sơ tiếp vận đã khôi phục',LINES.fragmentReady,'Nhận mảnh tranh số III','fragment-collect',{id:'chest'});
      return this.dialogue('Rương đã mở',LINES.chestEmpty);
    }
    if(id==='door'&&this.commit('exit')){if(!deferRoomExit(this))this.show('completed');}
  }
  reset(){if(this.disposed)return;this.ui.close();this.active=null;this.nonce++;this.state=createState();retainSharedAudioPreferences(this);this.notice=persistSave(this.storage,this.state);this.scene.resetPosition?.();this.audio.setPreferences(this.state);this.render();this.dialogue('Mật mã hậu phương',introFor(this.options),'Bắt đầu tuyến tiếp vận','intro-finish');}
  destroy(){return disposeRoomSession(this);}
}
