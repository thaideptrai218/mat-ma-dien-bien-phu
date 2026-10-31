// SFX cues built from Kenney CC0 samples (UI, paper, wood, metal, footsteps).
// Each layer: {pack, file, at (s), gain (dB), chain (extra ffmpeg filters)}. Layers are mono-summed,
// leading silence trimmed, mixed with amix(normalize=0), then peak-normalized by the builder.
const interfaceSound = (file, extra = {}) => ({pack: 'interface-sounds', file, ...extra});
const rpg = (file, extra = {}) => ({pack: 'rpg-audio', file, ...extra});
const impact = (file, extra = {}) => ({pack: 'impact-sounds', file, ...extra});
const uiAudio = (file, extra = {}) => ({pack: 'ui-audio', file, ...extra});

// Typewriter: six key strikes (UI-pack mechanical clicks) each doubled with a quiet,
// high-passed metal plate tap for the type-bar "clack".
const KEY_TIMES = [0, 0.12, 0.23, 0.39, 0.5, 0.63];
const KEY_CLICKS = ['click3.ogg', 'click4.ogg', 'click1.ogg', 'click3.ogg', 'click4.ogg', 'click1.ogg'];
const typewriterLayers = KEY_TIMES.flatMap((at, i) => [
  uiAudio(KEY_CLICKS[i], {at, gain: i % 2 ? -2 : 0}),
  impact('impactPlate_light_000.ogg', {at: at + 0.004, gain: -15, chain: 'highpass=f=900,atrim=0:0.12'}),
]);

const footsteps = (id, pack, files, chain) => files.map((file, i) => ({
  id: `${id}-${i + 1}`, kind: 'footstep', layers: [{pack, file, chain}],
  notes: `Kenney ${file}; ${chain}; lead/tail silence trimmed; 30 ms tail fade; peak-normalized to -6 dBFS; mono MP3.`,
}));

export const KENNEY_FOLEY_CUES = [
  {id: 'ui-advance', kind: 'sfx', layers: [interfaceSound('click_001.ogg')], notes: 'Kenney click_001 as-is; trimmed + peak-normalized.'},
  {id: 'ui-open', kind: 'sfx', layers: [interfaceSound('maximize_001.ogg')], notes: 'Kenney maximize_001; trimmed + peak-normalized.'},
  {id: 'ui-close', kind: 'sfx', layers: [interfaceSound('minimize_001.ogg')], notes: 'Kenney minimize_001; trimmed + peak-normalized.'},
  {id: 'hint', kind: 'sfx', layers: [interfaceSound('question_001.ogg')], notes: 'Kenney question_001; trimmed + peak-normalized.'},
  {id: 'success', kind: 'sfx', layers: [interfaceSound('confirmation_002.ogg')], notes: 'Kenney confirmation_002; trimmed + peak-normalized.'},
  {id: 'error', kind: 'sfx', layers: [interfaceSound('error_006.ogg', {chain: 'lowpass=f=5000'})], notes: 'Kenney error_006 (the softest, lowest error tone in the pack); 5 kHz low-pass to keep it gentle.'},
  {id: 'notebook', kind: 'sfx', layers: [rpg('bookOpen.ogg'), rpg('bookFlip3.ogg', {at: 0.12, gain: -6})], notes: 'Kenney bookOpen + bookFlip3 (-6 dB, +120 ms): open the notebook, then a page settles.'},
  {id: 'paper', kind: 'sfx', layers: [rpg('bookFlip2.ogg')], notes: 'Kenney bookFlip2; trimmed + peak-normalized.'},
  {id: 'chest-unlock', kind: 'sfx', layers: [rpg('metalClick.ogg'), rpg('metalLatch.ogg', {at: 0.22, gain: -2})], notes: 'Kenney metalClick (key turn) + metalLatch (+220 ms, -2 dB).'},
  {id: 'chest-open', kind: 'sfx', layers: [rpg('creak2.ogg'), impact('impactWood_light_001.ogg', {at: 0.62, gain: -8})], notes: 'Kenney creak2 (hinge) + impactWood_light_001 (+620 ms, -8 dB) as the lid comes to rest.'},
  {id: 'door-open', kind: 'sfx', layers: [rpg('doorOpen_1.ogg')], notes: 'Kenney doorOpen_1; trimmed + peak-normalized.'},
  {id: 'card-place', kind: 'sfx', layers: [rpg('bookPlace1.ogg', {chain: 'highpass=f=280,lowpass=f=9000'})], notes: 'Kenney bookPlace1, 280 Hz high-pass to thin it into a light card on a table.'},
  {id: 'map-unfold', kind: 'sfx', layers: [rpg('bookFlip1.ogg'), rpg('cloth1.ogg', {at: 0.1, gain: -6}), rpg('bookFlip3.ogg', {at: 0.45, gain: -4})], notes: 'Kenney bookFlip1 + cloth1 (-6 dB) + bookFlip3 (-4 dB) layered into one long paper unfold.'},
  {id: 'typewriter', kind: 'sfx', layers: typewriterLayers, notes: 'Six Kenney UI-Audio clicks (click1/3/4) at irregular 110–160 ms spacing, each doubled with Kenney impactPlate_light_000 (900 Hz HP, -15 dB) for the metal type-bar.'},
  ...footsteps('step-earth', 'rpg-audio', ['footstep00.ogg', 'footstep01.ogg', 'footstep02.ogg'], 'highpass=f=50,lowpass=f=5000'),
  ...footsteps('step-wood', 'impact-sounds', ['footstep_wood_000.ogg', 'footstep_wood_001.ogg', 'footstep_wood_002.ogg'], 'highpass=f=50'),
  ...footsteps('step-stone', 'impact-sounds', ['footstep_concrete_000.ogg', 'footstep_concrete_001.ogg', 'footstep_concrete_002.ogg'], 'highpass=f=50'),
];
