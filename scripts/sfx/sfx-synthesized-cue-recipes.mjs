// SFX cues synthesized entirely with ffmpeg sources (aevalsrc / anoisesrc with fixed seeds).
// Each `synth()` returns a filtergraph fragment whose final output label is [syn] (mono, 44.1 kHz).
import {toneExpr, morseGateExpr, sweepCommands, SAMPLE_RATE as SR} from './ffmpeg-audio-process-helpers.mjs';

const sum = parts => parts.join('+');
const pad = (freqs, amp, detune = 0.6) => sum(freqs.flatMap((f, i) => [`${amp[i]}*sin(2*PI*${f}*t)`, `${amp[i] * 0.7}*sin(2*PI*${f + detune}*t)`]));
const MORSE = morseGateExpr('-.-.', 0.065);

export const SYNTH_CUES = [
  {
    id: 'system-chime', kind: 'sfx', notes: 'Two-note digital chime G6→C7 (85 ms apart) with octave overtones, short slap echo.',
    synth: () => `aevalsrc=exprs='${sum([toneExpr({freq: 1568, decay: 7, amp: 0.45}), toneExpr({freq: 3136, decay: 14, amp: 0.1}), toneExpr({freq: 2093, at: 0.085, decay: 6, amp: 0.45}), toneExpr({freq: 4186, at: 0.085, decay: 13, amp: 0.08})])}':s=${SR}:d=0.75,aecho=0.7:0.5:45|95:0.22|0.12,afade=t=out:st=0.55:d=0.2[syn]`,
  },
  {
    id: 'system-glitch', kind: 'sfx', notes: '150 ms digital glitch: square tone hopping pitch every 12.5 ms with dropouts + gated white noise, bit-crushed (6 bit), band-limited 250 Hz–7 kHz.',
    synth: () => [
      `aevalsrc=exprs='0.5*sgn(sin(2*PI*(180+130*mod(floor(t*80)*2749,17))*t))*lt(mod(floor(t*80)*7,5),3)':s=${SR}:d=0.15[g1]`,
      `anoisesrc=d=0.15:c=white:a=0.35:s=1954:r=${SR},aeval=exprs='val(0)*lt(mod(floor(t*120)*3,4),2)':c=same[g2]`,
      `[g1][g2]amix=inputs=2:normalize=0,acrusher=bits=6:samples=5:mix=1,highpass=f=250,lowpass=f=7000,afade=t=in:d=0.004,afade=t=out:st=0.135:d=0.015[syn]`,
    ].join(';'),
  },
  {
    id: 'morse-beep', kind: 'sfx', notes: 'Morse "-.-." at 65 ms units, 760 Hz sine with 5 ms ramps, 300 Hz–3.5 kHz band (telegraph earpiece).',
    synth: () => `aevalsrc=exprs='0.5*sin(2*PI*760*t)*(${MORSE.expr})':s=${SR}:d=${(MORSE.length + 0.05).toFixed(3)},highpass=f=300,lowpass=f=3500[syn]`,
  },
  {
    id: 'radio-static', kind: 'sfx', notes: '1.4 s radio hiss: band-passed white noise with 13 Hz × 3.1 Hz flutter, sparse crackle impulses, light bit-crush.',
    synth: () => [
      `anoisesrc=d=1.4:c=white:a=0.7:s=73:r=${SR},bandpass=f=1900:width_type=h:w=2600[rs0]`,
      `anoisesrc=d=1.4:c=white:a=1:s=74:r=${SR},aeval=exprs='if(gt(val(0),0.997),val(0),0)':c=same,highpass=f=1200[rs1]`,
      `aevalsrc=exprs='0.55+0.45*sin(2*PI*13*t)*sin(2*PI*3.1*t)':s=${SR}:d=1.4[rsm]`,
      `[rs0][rsm]amultiply[rs2]`,
      `[rs2][rs1]amix=inputs=2:normalize=0:weights=1 0.6,acrusher=bits=9:mix=0.6,afade=t=in:d=0.06,afade=t=out:st=1.05:d=0.35[syn]`,
    ].join(';'),
  },
  {
    id: 'fragment-get', kind: 'sfx', notes: 'Sparkling C-major arpeggio C6-E6-G6-C7 (70 ms steps) with octave glints and echo.',
    synth: () => `aevalsrc=exprs='${sum([1046.5, 1318.5, 1568, 2093].flatMap((freq, i) => [toneExpr({freq, at: i * 0.07, decay: 3.2, amp: 0.26}), toneExpr({freq: freq * 2, at: i * 0.07, decay: 8, amp: 0.05})]))}':s=${SR}:d=1.7,aecho=0.7:0.5:90|170:0.3|0.2,afade=t=out:st=1.35:d=0.35[syn]`,
  },
  {
    id: 'painting-complete', kind: 'sfx', notes: 'Warm C-major chord pad (detuned pairs) swelling in over 0.5 s, two soft bell glints, room echo; no melody.',
    synth: () => `aevalsrc=exprs='(${pad([261.63, 329.63, 392, 523.25, 659.25], [0.1, 0.09, 0.09, 0.06, 0.04])})*min(1,t/0.5)*exp(-max(0,t-1.3)*2)+${toneExpr({freq: 1568, at: 0.45, decay: 3, amp: 0.08})}+${toneExpr({freq: 2093, at: 0.55, decay: 3, amp: 0.07})}':s=${SR}:d=3,lowpass=f=6000,aecho=0.8:0.6:120|260:0.3|0.2,afade=t=out:st=2.5:d=0.5[syn]`,
  },
  {
    id: 'door-final-swell', kind: 'sfx', notes: 'Low C2–C4 open-fifth pad crescendo over 3 s with rising filtered air noise, then release; no melody.',
    synth: () => [
      `aevalsrc=exprs='(${pad([65.41, 98, 130.81, 196, 261.63], [0.16, 0.12, 0.12, 0.08, 0.05], 0.4)})*pow(min(1,t/3),2)*exp(-max(0,t-3.1)*3)':s=${SR}:d=4.2[dp]`,
      `anoisesrc=d=4.2:c=pink:a=0.3:s=1975:r=${SR},highpass=f=200,lowpass=f=1400[dn]`,
      `aevalsrc=exprs='pow(min(1,t/3),2)*exp(-max(0,t-3.1)*3)':s=${SR}:d=4.2[de]`,
      `[dn][de]amultiply[da]`,
      `[dp][da]amix=inputs=2:normalize=0,aecho=0.8:0.7:150|330:0.3|0.2,afade=t=out:st=3.8:d=0.4[syn]`,
    ].join(';'),
  },
  {
    id: 'time-warp', kind: 'sfx', notes: 'Whoosh: pink noise through a band-pass swept 220 Hz→5.2 kHz over 1.4 s, rising sine chirp 300→2400 Hz, bright bell glint at 1.25 s ("brightening").',
    synth: () => {
      const env = 'pow(min(1,t/1.2),2)*exp(-max(0,t-1.3)*7)';
      const k = Math.log(8) / 1.4;
      return [
        `anoisesrc=d=1.9:c=pink:a=0.8:s=1954:r=${SR},highpass=f=80,${sweepCommands('bandpass@tw', {from: 220, to: 5200, dur: 1.4})},bandpass@tw=f=220:width_type=q:w=1.4[tn]`,
        `aevalsrc=exprs='${env}':s=${SR}:d=1.9[te]`,
        `[tn][te]amultiply[tw]`,
        `aevalsrc=exprs='0.12*sin(2*PI*300*(exp(${k.toFixed(5)}*t)-1)/${k.toFixed(5)})*${env}+${toneExpr({freq: 2637, at: 1.25, decay: 5, amp: 0.15})}+${toneExpr({freq: 3520, at: 1.27, decay: 5, amp: 0.12})}+${toneExpr({freq: 2093, at: 1.25, decay: 4, amp: 0.1})}':s=${SR}:d=1.9[tc]`,
        `[tw][tc]amix=inputs=2:normalize=0,aecho=0.7:0.5:70|140:0.25|0.15,afade=t=out:st=1.6:d=0.3[syn]`,
      ].join(';');
    },
  },
  {
    id: 'room-transition', kind: 'sfx', notes: 'Soft 1.1 s pass-by whoosh: pink noise band-pass swept 2.4 kHz→350 Hz plus low brown-noise body, sin² envelope.',
    synth: () => [
      `anoisesrc=d=1.1:c=pink:a=0.8:s=2413:r=${SR},${sweepCommands('bandpass@rt', {from: 2400, to: 350, dur: 1.0})},bandpass@rt=f=2400:width_type=q:w=1.0[rn]`,
      `anoisesrc=d=1.1:c=brown:a=0.5:s=1954:r=${SR},lowpass=f=300[rb]`,
      `[rn][rb]amix=inputs=2:normalize=0:weights=1 0.5[rm]`,
      `aevalsrc=exprs='pow(sin(PI*t/1.1),2)':s=${SR}:d=1.1[re]`,
      `[rm][re]amultiply,lowpass=f=6000[syn]`,
    ].join(';'),
  },
  {
    id: 'drawer-open', kind: 'sfx', notes: 'Synthesized wooden slide (brown+pink noise, 700 Hz band, rough 37/23 Hz modulation) + Kenney impactWood_light_000 stop at +400 ms (-4 dB).',
    layers: [{pack: 'impact-sounds', file: 'impactWood_light_000.ogg', at: 0.4, gain: -4}],
    synth: () => [
      `anoisesrc=d=0.5:c=brown:a=0.9:s=11:r=${SR}[dw0]`,
      `anoisesrc=d=0.5:c=pink:a=0.4:s=12:r=${SR}[dw1]`,
      `[dw0][dw1]amix=inputs=2:normalize=0,bandpass=f=700:width_type=h:w=900[dw2]`,
      `aevalsrc=exprs='(0.55+0.45*abs(sin(2*PI*37*t)*sin(2*PI*23*t+1)))*min(1,t/0.03)*if(lt(t,0.42),1,exp(-(t-0.42)*40))':s=${SR}:d=0.5[dwe]`,
      `[dw2][dwe]amultiply,lowpass=f=3500[syn]`,
    ].join(';'),
  },
];
