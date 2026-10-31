import {SynthVoices} from './synth-voices.js';
import {VoiceLinePlayer} from './voice-line-player.js';
import {CueLibrary} from './cue-library.js';
import {SampleCueBank,CUE_ALIASES,SYNTH_FALLBACK} from './sample-cue-bank.js';
import {AmbienceLoop} from './ambience-loop.js';

// Footstep surface per scene: bunker/forest ground is earth, the staff room and final room are wood, room 4 is stone.
const SURFACES={'room-1':'earth','room-2':'wood','room-3':'earth','room-4':'stone','room-5':'wood'};

export class AudioController{
  constructor({onStatusChange=()=>{}}={}){
    this.onStatusChange=onStatusChange;
    this.Engine=globalThis.AudioContext||globalThis.webkitAudioContext;this.context=null;this.master=null;this.analyser=null;this.synth=null;
    this.preferences={audioEnabled:false,audioVolume:.5};this.mode='inactive';this.unlocked=false;this.destroyed=false;
    this.focused=typeof document==='undefined'||document.hasFocus();this.operation=0;this.stepDistance=0;this.lastStep=-Infinity;
    this.stepCount=0;this.cueCount=0;this.lastCue=null;this.notice=null;this.listeners=[];
    this.voice=new VoiceLinePlayer(this);
    this.library=new CueLibrary(this);this.cues=new SampleCueBank(this,this.library);this.ambience=new AmbienceLoop(this,this.library);
    this.scene=null;this.surface='earth';
    if(typeof window!=='undefined'){
      const listen=(target,event,handler)=>{target.addEventListener(event,handler);this.listeners.push(()=>target.removeEventListener(event,handler));};
      listen(window,'blur',()=>{this.focused=false;this.stepDistance=0;this.sync();});
      listen(window,'focus',()=>{this.focused=true;this.stepDistance=0;this.sync();});
      listen(document,'visibilitychange',()=>{this.stepDistance=0;this.sync();});
    }
  }
  background(){return !this.focused||(typeof document!=='undefined'&&document.hidden);}
  // Sound may be heard at all (ignores mode): lets a cue such as the door sound finish while a room changes.
  soundOn(){return !this.destroyed&&this.unlocked&&this.preferences.audioEnabled&&this.preferences.audioVolume>0&&
    this.context?.state==='running'&&!this.background();}
  audible(){return this.soundOn()&&this.mode!=='inactive';}
  // Scene picks the ambience bed ('museum'|'bunker'|'room-1'..'room-5') and the footstep surface.
  setScene(scene){this.scene=scene||null;this.surface=SURFACES[scene]||'earth';this.ambience.setScene(this.scene);this.sync();}
  voiceActivity(on){this.ambience.setDuck(on);}
  // Voice-over plays only while a dialogue panel is open and sound is audible.
  voiceAudible(){return this.mode==='dialogue'&&this.audible();}
  initialize(){
    this.context=new this.Engine();this.master=this.context.createGain();this.master.gain.value=0;
    this.analyser=this.context.createAnalyser();this.analyser.fftSize=2048;this.samples=new Float32Array(this.analyser.fftSize);
    this.master.connect(this.analyser);this.analyser.connect(this.context.destination);this.synth=new SynthVoices(this.context,this.master);
    this.onStateChange=()=>{
      this.unlocked=this.context.state==='running';
      this.notice=this.unlocked||!this.preferences.audioEnabled?null:'Âm thanh đã tạm dừng. Bấm Bật lại âm thanh để tiếp tục nghe.';
      this.sync();this.onStatusChange();
    };this.context.addEventListener('statechange',this.onStateChange);
  }
  // lastUnlock lets UI code await an unlock started by a shared action handler (e.g. audio-toggle).
  unlockFromGesture(){return this.lastUnlock=this.performUnlock();}
  // Sound the player asked for and the browser allowed (independent of mode, focus and volume).
  voiceReady(){return this.unlocked&&this.preferences.audioEnabled;}
  async performUnlock(){
    if(this.destroyed)return {ok:false,notice:'Âm thanh đã được đóng.'};
    if(!this.Engine){this.notice='Trình duyệt không hỗ trợ Web Audio. Bạn vẫn có thể chơi bằng văn bản.';return {ok:false,notice:this.notice};}
    const version=++this.operation;
    try{
      if(!this.context)this.initialize();
      // create/resume happens synchronously in the actual button gesture.
      await this.context.resume();
      if(this.destroyed||version!==this.operation)return {ok:false,notice:null};
      this.unlocked=this.context.state==='running';
      if(this.unlocked)this.cues.preload();
      this.notice=this.unlocked?null:'Chưa mở được âm thanh. Bấm Bật âm thanh để thử lại.';
    }catch{
      if(this.destroyed||version!==this.operation)return {ok:false,notice:null};
      this.unlocked=false;this.notice='Chưa mở được âm thanh. Bạn vẫn có thể chơi; bấm thử lại khi sẵn sàng.';
    }
    this.sync();return {ok:this.unlocked,notice:this.notice};
  }
  setPreferences(preferences={}){
    if(typeof preferences.audioEnabled==='boolean')this.preferences.audioEnabled=preferences.audioEnabled;
    if(Number.isFinite(preferences.audioVolume))this.preferences.audioVolume=Math.max(0,Math.min(1,preferences.audioVolume));
    if(!this.preferences.audioEnabled||this.preferences.audioVolume===0)this.stepDistance=0;
    this.sync();
  }
  setMode(mode){
    if(!['exploration','dialogue','inactive'].includes(mode))return;
    const previous=this.mode;
    this.mode=mode;this.stepDistance=0;this.sync();
    // A panel opening or closing over the map gets its small interface sound.
    if(previous!==mode&&previous!=='inactive'&&mode!=='inactive')this.playCue(mode==='dialogue'?'ui-open':'ui-close');
  }
  sync(){
    if(!this.context||this.destroyed)return;
    const audible=this.audible(),soundOn=this.soundOn(),now=this.context.currentTime;
    if(!this.voiceAudible())this.voice.stop();
    this.master.gain.cancelScheduledValues(now);this.master.gain.setValueAtTime(soundOn?this.preferences.audioVolume*.45:0,now);
    if(!soundOn)this.cues.stop();
    this.ambience.update(audible);
    if(!audible){this.synth.stop();this.stepDistance=0;return;}
    // The synth bed is only the fallback for scenes without a recorded bed.
    if(this.mode==='exploration'&&this.ambience.status()==='none')this.synth.ambience();
    else{this.synth.stop('ambient');if(this.mode!=='exploration'){this.synth.stop('step');this.stepDistance=0;}}
  }
  reportMotion({distance=0,blocked=false}={}){
    if(!this.audible()||this.mode!=='exploration'||blocked||!Number.isFinite(distance)||distance<=0){
      this.stepDistance=0;this.synth?.stop('step');return false;
    }
    this.stepDistance+=distance;
    if(this.stepDistance<64||this.context.currentTime-this.lastStep<.15)return false;
    this.stepDistance%=64;this.lastStep=this.context.currentTime;
    if(!this.cues.footstep(this.surface))this.synth.footstep();
    this.stepCount++;return true;
  }
  playCue(kind){
    if(!this.audible())return false;
    // Prefer the recording; the synth cue covers names without one and the moments before it has loaded.
    if(!this.cues.play(CUE_ALIASES[kind]||kind)&&(this.synth.count()>22||!this.synth.cue(SYNTH_FALLBACK[kind]||kind)))return false;
    this.lastCue=kind;this.cueCount++;return true;
  }
  getSnapshot(){
    let rms=0,peak=0;
    if(this.analyser){
      this.analyser.getFloatTimeDomainData(this.samples);
      for(const sample of this.samples){rms+=sample*sample;peak=Math.max(peak,Math.abs(sample));}
      rms=Math.sqrt(rms/this.samples.length);
    }
    return Object.freeze({available:Boolean(this.Engine),unlocked:this.unlocked,running:this.context?.state==='running',
      enabled:this.preferences.audioEnabled,volume:this.preferences.audioVolume,mode:this.mode,audible:this.audible(),
      state:this.context?.state||'uninitialized',stepCount:this.stepCount,cueCount:this.cueCount,lastCue:this.lastCue,
      activeSources:this.synth?.count()||0,voice:this.voice.getSnapshot(),scene:this.scene,
      cues:Object.freeze({sfx:this.cues.count(),ambience:this.ambience.count(),surface:this.surface}),ambientSources:this.synth?.count('ambient')||0,
      signal:Object.freeze({rms,peak,contextTime:this.context?.currentTime||0}),notice:this.notice});
  }
  destroy(){
    if(this.destroyed)return;this.destroyed=true;this.operation++;this.listeners.forEach(unlisten=>unlisten());this.listeners=[];
    this.voice.destroy();this.cues.destroy();this.ambience.destroy();this.synth?.stop();this.master?.disconnect();this.analyser?.disconnect();
    if(this.context){this.context.removeEventListener('statechange',this.onStateChange);this.context.close().catch(()=>{});}
    this.unlocked=false;
  }
}
