// Shared helpers for the SFX/ambience pipeline: running ffmpeg, measuring loudness/peaks,
// a seeded PRNG (so synthesized event placement is reproducible) and small expression builders
// for ffmpeg `aevalsrc` / `asendcmd` graphs.
import {spawn} from 'node:child_process';

export const SAMPLE_RATE = 44100;

/** Runs a command, resolves with combined stdout+stderr, rejects on non-zero exit. */
export const run = (command, argv) => new Promise((resolve, reject) => {
  const child = spawn(command, argv, {windowsHide: true});
  let output = '';
  child.stdout.on('data', chunk => { output += chunk; });
  child.stderr.on('data', chunk => { output += chunk; });
  child.on('error', reject);
  child.on('close', code => (code === 0 ? resolve(output) : reject(new Error(`${command} exited ${code}: ${output.slice(-900)}`))));
});

export const ffmpeg = argv => run('ffmpeg', ['-hide_banner', '-nostdin', '-y', ...argv]);

export async function probeDurationSec(file) {
  const out = await run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]);
  return Number(out.trim());
}

/**
 * Sample peak in dBFS via astats (float-aware; unlike volumedetect it does not clip at 0 dBFS,
 * which matters for summed layers and Vorbis sources that overshoot full scale).
 */
export async function measurePeakDb(file) {
  const out = await ffmpeg(['-i', file, '-af', 'astats=measure_perchannel=none', '-f', 'null', '-']);
  const match = out.slice(out.lastIndexOf('Overall')).match(/Peak level dB:\s*(-?[\d.]+|-inf)/);
  if (!match) throw new Error(`astats gave no peak level for ${file}`);
  return match[1] === '-inf' ? -Infinity : Number(match[1]);
}

/** EBU R128 integrated loudness (LUFS) and true peak (dBTP). Very short clips may report null LUFS. */
export async function measureLoudness(file) {
  const out = await ffmpeg(['-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-']);
  const summary = out.slice(out.lastIndexOf('Summary:'));
  const lufs = summary.match(/I:\s*(-?[\d.]+|-inf|nan) LUFS/i);
  const peak = summary.match(/Peak:\s*(-?[\d.]+|-inf) dBFS/i);
  const value = m => (m && Number.isFinite(Number(m[1])) && Number(m[1]) > -70 ? Number(m[1]) : null);
  return {lufs: value(lufs), truePeak: peak ? (Number.isFinite(Number(peak[1])) ? Number(peak[1]) : null) : null};
}

/** Deterministic PRNG (mulberry32) — same seed, same ambience every build. */
export function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const n = value => Number(value.toFixed(5));

/** Decaying sine note for aevalsrc: starts at `at` s, exponential decay `decay` 1/s, soft attack. */
export function toneExpr({freq, at = 0, decay = 4, amp = 0.3, attack = 0.004}) {
  const dt = `(t-${n(at)})`;
  return `if(gte(t,${n(at)}),${n(amp)}*sin(2*PI*${n(freq)}*${dt})*exp(-${dt}*${n(decay)})*min(1,${dt}/${n(attack)}),0)`;
}

/** Envelope expression: a sum of percussive bursts (attack rate, decay rate) at given times. */
export function burstEnvelopeExpr(events) {
  if (!events.length) return '0';
  return events.map(({at, amp = 1, attack = 30, decay = 2, length = 4}) => {
    const dt = `(t-${n(at)})`;
    return `if(between(t,${n(at)},${n(at + length)}),${n(amp)}*(1-exp(-${dt}*${n(attack)}))*exp(-${dt}*${n(decay)}),0)`;
  }).join('+');
}

/** Gate expression for a morse pattern ('.' / '-') with 5 ms ramps on every element. */
export function morseGateExpr(pattern, unit, ramp = 0.005) {
  let cursor = 0;
  const parts = [];
  for (const symbol of pattern) {
    const length = symbol === '-' ? unit * 3 : unit;
    const a = n(cursor), b = n(cursor + length);
    parts.push(`between(t,${a},${b})*min(min(1,(t-${a})/${ramp}),(${b}-t)/${ramp})`);
    cursor += length + unit;
  }
  return {expr: parts.join('+'), length: cursor};
}

/**
 * asendcmd script that sweeps the `frequency` of a named biquad filter exponentially
 * from `from` Hz to `to` Hz between `start` and `start+dur` seconds.
 */
export function sweepCommands(target, {from, to, start = 0, dur, steps = 40}) {
  const lines = [];
  for (let i = 0; i <= steps; i++) {
    const p = i / steps;
    lines.push(`${n(start + p * dur)} ${target} frequency ${Math.round(from * (to / from) ** p)}`);
  }
  return `asendcmd=c='${lines.join(';')}'`;
}

/** Unique filtergraph label generator so recipe graphs never collide. */
export function labeler(prefix = 'n') {
  let i = 0;
  return () => `${prefix}${i++}`;
}
