import {AudioController} from '../audio/audio-controller.js';
import {CampaignStore} from './store.js';
import {CampaignUI} from './ui.js';
import {SessionHost} from './session-host.js';
import {currentRoom,fragmentsFor,phaseFor} from './state.js';
import {introFrame,returnFrame} from './framing.js';
import {SAVE_KEY as ONE} from '../room-one/save.js';
import {SAVE_KEY as TWO} from '../room-two/save.js';
import {SAVE_KEY as THREE} from '../room-three/save.js';
import {SAVE_KEY as FOUR} from '../room-four/save.js';
import {SAVE_KEY as FIVE} from '../room-five/save.js';

const KEYS=[ONE,TWO,THREE,FOUR,FIVE];
const LOADERS=[
  ()=>import('../room-one/session.js').then(m=>m.RoomOneSession),
  ()=>import('../room-two/session.js').then(m=>m.RoomTwoSession),
  ()=>import('../room-three/session.js').then(m=>m.RoomThreeSession),
  ()=>import('../room-four/session.js').then(m=>m.RoomFourSession),
  ()=>import('../room-five/session.js').then(m=>m.RoomFiveSession),
];
export class CampaignRuntime {
  constructor(root,{storage}={}) {
    if(storage===undefined){try{storage=window.localStorage;}catch{storage=null;}}
    this.host=new SessionHost();
    this.store=new CampaignStore(storage,()=>this.render());
    this.audio=new AudioController({onStatusChange:()=>this.host.active?.render()});
    this.audio.setPreferences(this.store.state.settings);
    this.ui=new CampaignUI(root,{
      onArchive:()=>this.ui.showArchive(this.store.state),
      onRestart:()=>this.confirmRestart(),
      onOverlayChange:open=>{
        const session=this.host.active;session?.scene?.clearKeys();
        if(open)this.audio.setMode('inactive');else if(!session?.ui?.isOpen)session?.scene?.focus();
        session?.render();
      },
    });
    this.render();this.openCurrent();
    this.onPageHide=()=>this.audio.setMode('inactive');window.addEventListener('pagehide',this.onPageHide);
  }
  render(){this.ui?.render(this.store.state,this.store.notice);}
  confirmRestart(){this.ui.confirmRestart(()=>{this.store.reset();this.openCurrent();});}
  async openCurrent() {
    this.ui.close(false);this.audio.setMode('inactive');this.host.active?.scene?.clearKeys();
    try{
      await this.host.replace({prepare:async()=>{
        this.ui.loading();
        const state=this.store.state,phase=phaseFor(state),room=currentRoom(state);
        if(phase!=='room')return()=>{
          const view=phase==='museum-intro'?introFrame(()=>{this.store.begin();this.openCurrent();}):
            returnFrame(phase==='complete',()=>{this.store.finish();this.openCurrent();},()=>this.confirmRestart());
          this.ui.stage.replaceChildren(view);this.render();return null;
        };
        const Session=await LOADERS[room-1]();
        return()=>{
          const roomRoot=document.createElement('div');roomRoot.className='campaign-room';this.ui.stage.replaceChildren(roomRoot);
          const session=new Session(roomRoot,{storage:this.store.adapter(room,KEYS[room-1]),audio:this.audio,
            isPaused:()=>this.ui.isOpen,fragments:fragmentsFor(this.store.state),
            onExit:()=>this.openCurrent()});
          this.render();return session;
        };
      }});
    }catch(error){console.error('Campaign room failed to open',error);this.audio.setMode('inactive');this.ui.failure(()=>this.openCurrent());}
  }
  snapshot(){
    const session=this.host.active;
    return structuredClone({campaign:this.store.state,room:currentRoom(this.store.state),phase:phaseFor(this.store.state),
      fragments:fragmentsFor(this.store.state),state:session?session.state:null,
      ...(session?.scene?.getSnapshot?.() || {}),view:session?.active?.kind || null,
      overlayOpen:this.ui.isOpen,audio:this.audio.getSnapshot()});
  }
}
