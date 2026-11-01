// Splits a TTS payload at sentence ends (". ! ? …") and joins separately rendered clips with real silence,
// because the model glides over full stops inside one short clip.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

export const SENTENCE_PAUSE_SEC = 0.45;
export const splitSentences = text => text.split(/(?<=[.!?…])\s+/u).map(s => s.trim()).filter(Boolean);

// clips: MP3 buffers in reading order → one MP3 buffer with SENTENCE_PAUSE_SEC of silence between them.
export function joinWithPauses(clips) {
  if (clips.length === 1) return clips[0];
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sentjoin-'));
  try {
    const inputs = clips.flatMap((clip, i) => {
      const file = path.join(dir, `${i}.mp3`);
      fs.writeFileSync(file, clip);
      return ['-i', file];
    });
    const last = clips.length - 1;
    const chain = clips.map((_, i) => `[${i}:a]aresample=24000,aformat=channel_layouts=mono${i < last ? `,apad=pad_dur=${SENTENCE_PAUSE_SEC}` : ''}[a${i}]`).join(';');
    const filter = `${chain};${clips.map((_, i) => `[a${i}]`).join('')}concat=n=${clips.length}:v=0:a=1[out]`;
    const out = path.join(dir, 'out.mp3');
    const run = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', filter, '-map', '[out]', '-c:a', 'libmp3lame', '-b:a', '192k', out]);
    if (run.status !== 0) throw new Error(`ffmpeg join failed: ${run.stderr}`);
    return fs.readFileSync(out);
  } finally {
    fs.rmSync(dir, {recursive: true, force: true});
  }
}
