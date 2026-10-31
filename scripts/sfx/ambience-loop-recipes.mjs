// Per-place ambience loops (stereo). Each recipe has:
//  - bed(): continuous noise textures rendered LOOP+XFADE s long; the builder crossfades its tail into
//    its head so the loop seam is inaudible.
//  - layers[]: periodic sounds (all periods divide LOOP) or sparse events placed well inside the loop,
//    rendered exactly LOOP s long so they wrap seamlessly. `lu` = layer loudness relative to the bed.
// Battlefield material is deliberately distant (low-passed, echoed), sparse and quiet.
import {burstEnvelopeExpr, seededRandom, SAMPLE_RATE as SR} from './ffmpeg-audio-process-helpers.mjs';

export const LOOP = 44;   // seconds; 2 s clock cycle and 11/22 s modulations divide it exactly
export const XFADE = 4;   // seconds of equal-power crossfade at the seam
const BED = LOOP + XFADE;

const noise = (color, seed, amp, dur) => `anoisesrc=d=${dur}:c=${color}:a=${amp}:s=${seed}:r=${SR}`;
/** Decorrelated stereo noise: independent seeds per channel, same filter chain. */
const stereoNoise = (label, color, seed, amp, chain, dur = BED) =>
  `${noise(color, seed, amp, dur)},${chain}[${label}L];${noise(color, seed + 1, amp, dur)},${chain}[${label}R];[${label}L][${label}R]join=inputs=2:channel_layout=stereo[${label}]`;
/** Multiplies a stereo stream by a slow amplitude-modulation expression (periods must divide LOOP). */
const modulate = (label, input, expr, dur = BED) => `aevalsrc=exprs='${expr}|${expr}':s=${SR}:d=${dur}[${label}e];[${input}][${label}e]amultiply[${label}]`;
const mix = (inputs, weights, out) => `${inputs.map(i => `[${i}]`).join('')}amix=inputs=${inputs.length}:normalize=0:weights=${weights.join(' ')}[${out}]`;
/** Sparse impulses from white noise above a threshold — crackle / droplets. */
const crackle = (seed, threshold, dur) => `${noise('white', seed, 1, dur)},aeval=exprs='if(gt(val(0),${threshold}),val(0),0)':c=same`;
const silentBase = label => `anullsrc=r=${SR}:cl=stereo:d=${LOOP}[${label}]`;

/** Seeded event times: `count` events spread over [from, to] with jitter. */
function eventTimes(seed, count, from, to) {
  const rnd = seededRandom(seed), slot = (to - from) / count;
  return Array.from({length: count}, (_, i) => Number((from + slot * i + rnd() * slot * 0.6).toFixed(2)));
}

/** Distant muffled impact: brown noise shaped by bursts, double low-pass, long echo, centred. */
function distantThuds(seed, times, {lowpass = 90, decay = 1.4, echo = '0.8:0.85:700|1500:0.25|0.12'} = {}) {
  const rnd = seededRandom(seed + 7);
  const env = burstEnvelopeExpr(times.map(at => ({at, amp: Number((0.6 + rnd() * 0.4).toFixed(2)), attack: 22, decay, length: 5})));
  return `${noise('brown', seed, 0.9, LOOP)}[th0];aevalsrc=exprs='${env}':s=${SR}:d=${LOOP}[th1];[th0][th1]amultiply,lowpass=f=${lowpass},lowpass=f=${lowpass},aecho=${echo},pan=stereo|c0=0.9*c0|c1=0.8*c0[lay]`;
}

const BUNKER_THUDS = eventTimes(1954, 3, 5, 36);
const ROOM4_SHELLS = eventTimes(1307, 2, 10, 34);
const ROOM3_DIG = [...eventTimes(503, 1, 9, 11), ...eventTimes(507, 1, 27, 29)].flatMap(t => [t, t + 1.5, t + 3.0]);

export const AMBIENCE_RECIPES = [
  {
    id: 'museum', notes: 'Quiet gallery room tone: low brown rumble + soft HVAC pink hiss (60 Hz–1.1 kHz), faint 100 Hz air-handler hum.',
    bed: () => [stereoNoise('mh', 'pink', 101, 0.06, 'highpass=f=60,lowpass=f=1100'), stereoNoise('mr', 'brown', 103, 0.15, 'lowpass=f=220'), mix(['mh', 'mr'], [1, 1], 'bed')].join(';'),
    layers: [{lu: -10, notes: 'hum', graph: () => {
      const e = '(0.004*sin(2*PI*100*t)+0.0015*sin(2*PI*200*t)+0.001*sin(2*PI*300*t))*(0.85+0.15*sin(2*PI*t/11))';
      return `aevalsrc=exprs='${e}|${e}':s=${SR}:d=${LOOP}[lay]`;
    }}],
  },
  {
    id: 'bunker', notes: 'Opening, de Castries bunker: deep earth rumble (brown < 240 Hz, 11 s swell), 3 far muffled thuds per loop (< 90 Hz, long echo), faint dust trickle after each.',
    bed: () => [stereoNoise('br', 'brown', 201, 0.5, 'lowpass=f=240'), modulate('bm', 'br', '0.7+0.3*sin(2*PI*t/11)'), stereoNoise('ba', 'pink', 203, 0.03, 'bandpass=f=500:width_type=q:w=0.8'), mix(['bm', 'ba'], [1, 1], 'bed')].join(';'),
    layers: [
      {lu: -2, notes: 'distant thuds', graph: () => distantThuds(205, BUNKER_THUDS)},
      {lu: -14, notes: 'dust trickle', graph: () => `${noise('pink', 207, 0.8, LOOP)},highpass=f=3500[d0];aevalsrc=exprs='${burstEnvelopeExpr(BUNKER_THUDS.map(t => ({at: t + 0.35, attack: 8, decay: 1.8, length: 3})))}':s=${SR}:d=${LOOP}[d1];[d0][d1]amultiply,pan=stereo|c0=0.6*c0|c1=0.9*c0[lay]`},
    ],
  },
  {
    id: 'room-1', notes: 'Bunker interior: low room rumble, whistling draught through a gap (700 Hz resonant band, 11 s / 4.4 s gusts), oil-lamp flame hiss + sparse crackles.',
    bed: () => [
      stereoNoise('r1r', 'brown', 301, 0.35, 'lowpass=f=200'),
      stereoNoise('r1w', 'white', 303, 0.25, 'bandpass=f=650:width_type=q:w=5'),
      modulate('r1m', 'r1w', '0.3+0.7*(0.5+0.5*sin(2*PI*t/11))*(0.7+0.3*sin(2*PI*t/4.4+1))'),
      stereoNoise('r1f', 'pink', 305, 0.05, 'bandpass=f=1500:width_type=q:w=0.7'),
      mix(['r1r', 'r1m', 'r1f'], [1, 0.8, 0.6], 'bed'),
    ].join(';'),
    layers: [{lu: -9, notes: 'lamp crackle', graph: () => `${crackle(307, 0.99993, LOOP)},bandpass=f=2600:width_type=h:w=2000,aecho=0.6:0.3:12:0.3,pan=stereo|c0=0.7*c0|c1=0.6*c0[lay]`}],
  },
  {
    id: 'room-2', notes: 'Staff room: quiet room tone, wall clock tick-tock (1 s, alternating pitch, left), faint radio hiss with gentle flutter + rare crackle (right).',
    bed: () => [
      stereoNoise('r2r', 'brown', 401, 0.25, 'lowpass=f=250'),
      stereoNoise('r2p', 'pink', 403, 0.04, 'lowpass=f=1500'),
      `${noise('white', 405, 0.2, BED)},bandpass=f=2200:width_type=h:w=1600[r2h0];aevalsrc=exprs='0.45+0.35*sin(2*PI*t/11)+0.2*sin(2*PI*t/2.2)':s=${SR}:d=${BED}[r2h1];[r2h0][r2h1]amultiply,pan=stereo|c0=0.45*c0|c1=0.75*c0[r2h]`,
      mix(['r2r', 'r2p', 'r2h'], [1, 1, 0.7], 'bed'),
    ].join(';'),
    layers: [
      {lu: -6, notes: 'clock', graph: () => `aevalsrc=exprs='0.3*(sin(2*PI*if(lt(mod(t,2),1),3200,2500)*t)+0.5*sin(2*PI*1300*t))*exp(-mod(t,1)*90)':s=${SR}:d=${LOOP},highpass=f=700,aecho=0.7:0.4:23|41:0.25|0.15,pan=stereo|c0=0.75*c0|c1=0.5*c0[lay]`},
      {lu: -12, notes: 'radio crackle', graph: () => `${crackle(407, 0.99996, LOOP)},bandpass=f=3000:width_type=h:w=2500,pan=stereo|c0=0.4*c0|c1=0.8*c0[lay]`},
    ],
  },
  {
    id: 'room-3', notes: 'Night forest: still air + leaf rustle swells, three crickets (3.9–4.9 kHz chirp trains, panned), far pick/shovel strikes (Kenney impactMining, 1.1 kHz LP + echo) and a distant bicycle freewheel.',
    bed: () => [stereoNoise('r3a', 'pink', 501, 0.05, 'highpass=f=80,lowpass=f=700'), stereoNoise('r3l', 'pink', 503, 0.08, 'bandpass=f=2500:width_type=q:w=1'), modulate('r3m', 'r3l', '0.3+0.7*pow(0.5+0.5*sin(2*PI*t/11+0.5),2)'), mix(['r3a', 'r3m'], [1, 0.8], 'bed')].join(';'),
    layers: [
      {lu: 0, notes: 'crickets', graph: () => {
        const crickets = [[4400, 15, 20, 0, 0.25, 0.8, 0.4], [4850, 18, 16, 1.3, 0.2, 0.35, 0.8], [3950, 12, 9, 2.2, 0.15, 0.55, 0.55]];
        return crickets.map(([f, r, g, p, a, l, rr], i) => `aevalsrc=exprs='${a}*sin(2*PI*${f}*t)*pow(max(0,sin(2*PI*${r}*t)),6)*gt(sin(2*PI*${g}/${LOOP}*t+${p}),0.15)':s=${SR}:d=${LOOP},highpass=f=2500,pan=stereo|c0=${l}*c0|c1=${rr}*c0[c${i}]`).join(';') + `;[c0][c1][c2]amix=inputs=3:normalize=0[lay]`;
      }},
      {lu: -10, notes: 'distant digging + bicycle', files: ROOM3_DIG.map((_, i) => ({pack: 'impact-sounds', file: `impactMining_00${i % 3}.ogg`})), graph: () => {
        const strikes = ROOM3_DIG.map((t, i) => `[${i}:a]aresample=${SR},aformat=channel_layouts=mono,lowpass=f=1100,volume=${i % 3 === 1 ? -3 : 0}dB,adelay=delays=${Math.round(t * 1000)}:all=1,pan=stereo|c0=0.8*c0|c1=0.5*c0[s${i}]`);
        const bike = `aevalsrc=exprs='if(between(t,20.5,22.9),0.3*exp(-mod(t,1/14)*350)*sin(2*PI*2600*t)*sin(PI*(t-20.5)/2.4),0)':s=${SR}:d=${LOOP},highpass=f=600,lowpass=f=2500,pan=stereo|c0=0.4*c0|c1=0.7*c0[bk]`;
        const labels = ['base', ...ROOM3_DIG.map((_, i) => `s${i}`), 'bk'].map(l => `[${l}]`).join('');
        return [silentBase('base'), ...strikes, bike, `${labels}amix=inputs=${ROOM3_DIG.length + 2}:normalize=0:duration=first,aecho=0.8:0.6:220|480:0.35|0.2[lay]`].join(';');
      }},
    ],
  },
  {
    id: 'room-4', notes: 'Hillside in the rain: steady rain wash (pink 500 Hz–7.5 kHz) + droplet ticks, gusting hill wind (22 s swell), two very distant artillery rumbles per loop (< 70 Hz, long echo, low level).',
    bed: () => [
      stereoNoise('r4r', 'pink', 601, 0.45, 'highpass=f=500,lowpass=f=7500'),
      `${crackle(603, 0.993, BED)},bandpass=f=3800:width_type=h:w=3000[r4dL];${crackle(604, 0.993, BED)},bandpass=f=3800:width_type=h:w=3000[r4dR];[r4dL][r4dR]join=inputs=2:channel_layout=stereo[r4d]`,
      stereoNoise('r4w', 'brown', 605, 0.5, 'bandpass=f=380:width_type=h:w=320'),
      modulate('r4m', 'r4w', '0.35+0.65*pow(0.5+0.5*sin(2*PI*t/22),1.5)'),
      mix(['r4r', 'r4d', 'r4m'], [1, 0.5, 0.8], 'bed'),
    ].join(';'),
    layers: [{lu: -5, notes: 'very distant artillery', graph: () => distantThuds(607, ROOM4_SHELLS, {lowpass: 70, decay: 0.8, echo: '0.8:0.9:600|1300:0.3|0.18'})}],
  },
  {
    id: 'room-5', notes: 'Stillness: light wind (brown 420 Hz band, 22 s swell), faint air, very low sustained hum on A1/A2/E3/A3 with a slow 22 s swell — no melody, no pulsing.',
    bed: () => [stereoNoise('r5w', 'brown', 701, 0.45, 'bandpass=f=420:width_type=h:w=400'), modulate('r5m', 'r5w', '0.35+0.65*(0.5+0.5*sin(2*PI*t/22))'), stereoNoise('r5a', 'pink', 703, 0.03, 'highpass=f=300,lowpass=f=3000'), mix(['r5m', 'r5a'], [1, 1], 'bed')].join(';'),
    layers: [{lu: -8, notes: 'low hum', graph: () => {
      const voice = (oct, phase) => `(0.03*sin(2*PI*55*t)+0.022*sin(2*PI*${oct}*t)+0.012*sin(2*PI*165*t)+0.006*sin(2*PI*220*t))*(0.75+0.25*sin(2*PI*t/22+${phase}))`;
      return `aevalsrc=exprs='${voice(110, 0)}|${voice(110.25, 1.5)}':s=${SR}:d=${LOOP}[lay]`;
    }}],
  },
];
