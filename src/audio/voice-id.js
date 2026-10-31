// Content-addressed voice line ids, shared by the voice-script build and the game runtime.
// Same voice + same NFC text → same id; any text edit yields a new id, so stale recordings are detectable.
const OFFSET = 0xcbf29ce484222325n, PRIME = 0x100000001b3n, MASK = 0xffffffffffffffffn;

export const VOICES = Object.freeze({'Hệ Thống': 'system', Quang: 'quang', 'Lời kể': 'narrator'});

// 64-bit FNV-1a over UTF-8 bytes; synchronous so it runs the same in Node and the browser.
export function voiceIdFor(voice, text) {
  let hash = OFFSET;
  for (const byte of new TextEncoder().encode(`${voice}\u0000${String(text).normalize('NFC')}`)) {
    hash ^= BigInt(byte);
    hash = (hash * PRIME) & MASK;
  }
  return hash.toString(16).padStart(16, '0');
}

// Dialogue lines are plain strings (Quang's thoughts) or {speaker, text}; returns null for unknown speakers.
export function voiceOf(line) {
  if (typeof line === 'string') return 'quang';
  return VOICES[line?.speaker] ?? null;
}
