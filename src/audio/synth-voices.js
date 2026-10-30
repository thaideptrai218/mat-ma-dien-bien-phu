// Every source owns and disconnects its short-lived gain/filter chain.
export class SynthVoices{
  constructor(context,destination){
    this.context=context;this.destination=destination;this.voices=new Set();
    this.noise=context.createBuffer(1,context.sampleRate,context.sampleRate);
    const samples=this.noise.getChannelData(0);let previous=0;
    for(let i=0;i<samples.length;i++){previous=(previous+Math.random()*2-1)/1.4;samples[i]=previous*.5;}
  }
  own(source,nodes,kind){
    const voice={source,kind,finished:false,stop:()=>{
      if(voice.finished)return;voice.finished=true;try{source.stop();}catch{}
      source.disconnect();nodes.forEach(node=>node.disconnect());this.voices.delete(voice);
    }};
    source.onended=voice.stop;this.voices.add(voice);return voice;
  }
  stop(kind=null){for(const voice of [...this.voices])if(!kind||voice.kind===kind)voice.stop();}
  count(kind=null){return [...this.voices].filter(voice=>!kind||voice.kind===kind).length;}
  envelope(volume,duration,delay=0){
    const gain=this.context.createGain(),now=this.context.currentTime+delay;gain.gain.value=0;
    gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(volume,now+.008);
    gain.gain.exponentialRampToValueAtTime(.0001,now+duration);gain.connect(this.destination);return gain;
  }
  tone(frequency,delay,duration,volume,type='sine',kind='cue'){
    const source=this.context.createOscillator(),gain=this.envelope(volume,duration,delay),now=this.context.currentTime;
    source.type=type;source.frequency.setValueAtTime(frequency,now+delay);source.connect(gain);this.own(source,[gain],kind);
    source.start(now+delay);source.stop(now+delay+duration);
  }
  rustle(duration,volume,frequency,kind='cue'){
    const source=this.context.createBufferSource(),filter=this.context.createBiquadFilter(),gain=this.envelope(volume,duration);
    filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=.6;filter.connect(gain);
    source.buffer=this.noise;source.connect(filter);this.own(source,[filter,gain],kind);source.start();source.stop(this.context.currentTime+duration);
  }
  ambience(){
    if(this.count('ambient'))return;
    const gain=this.context.createGain();gain.gain.value=.025;gain.connect(this.destination);
    const tone=this.context.createOscillator();tone.type='sine';tone.frequency.value=58;tone.connect(gain);this.own(tone,[gain],'ambient');tone.start();
    const air=this.context.createBufferSource(),filter=this.context.createBiquadFilter(),airGain=this.context.createGain();
    air.buffer=this.noise;air.loop=true;filter.type='lowpass';filter.frequency.value=240;filter.Q.value=.3;
    airGain.gain.value=.04;air.connect(filter);filter.connect(airGain);airGain.connect(this.destination);
    this.own(air,[filter,airGain],'ambient');air.start();
  }
  footstep(){this.rustle(.085,.18,260,'step');this.tone(82,0,.075,.13,'sine','step');}
  cue(kind){
    if(kind==='paper')this.rustle(.24,.2,1800);
    else if(kind==='reveal'){this.rustle(.16,.13,1400);this.tone(392,0,.3,.14);this.tone(523,.09,.34,.12);}
    else if(kind==='success'){this.tone(392,0,.3,.16);this.tone(494,.12,.34,.15);this.tone(587,.24,.52,.14);}
    else if(kind==='error'){this.tone(196,0,.16,.13,'triangle');this.tone(165,.14,.23,.12,'triangle');}
    else if(kind==='weight'){this.tone(880,0,.14,.09,'triangle');this.tone(1320,0,.09,.05);}
    else if(kind==='static'){this.rustle(.32,.12,2600);this.tone(640,0,.08,.04,'square');}
    else if(kind==='chain'){for(let i=0;i<4;i++)this.tone(1480+i*90,i*.05,.05,.05,'square');this.rustle(.22,.1,3200);}
    else if(kind==='fold'){this.rustle(.34,.2,1200);this.rustle(.18,.12,2400);}
    else if(kind==='unlock'){this.tone(1046,0,.06,.1,'square');this.tone(784,.07,.3,.12);this.tone(1175,.16,.4,.12);}
    else return false;
    return true;
  }
}
