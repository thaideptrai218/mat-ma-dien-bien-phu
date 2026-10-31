// Voice handle for one dialogue panel: sessions create it, the panel binds highlight/replay to it.
// Returns null when the controller has no voice player, so callers can stay text-only.
export function createDialogueVoice(audio, lines) {
  const player = audio?.voice;
  if (!player || !Array.isArray(lines) || !lines.length) return null;
  const handle = {
    lines,
    // The panel replaces this to highlight the paragraph being read (index, or -1 when reading ends).
    onLine: () => {},
    available: () => player.hasVoiceFor(lines),
    start: () => player.playSequence(lines, {onLine: index => handle.onLine(index)}),
    muted: () => audio.preferences?.audioVolume === 0,
    soundReady: () => Boolean(audio.voiceReady?.()),
    replay: () => handle.start(),
    // Click handler of "Bật lồng tiếng": emit('audio-toggle') makes the room's own action turn sound on and unlock
    // audio inside this gesture; resolves true once sound is ready. The panel decides whether to start playback.
    async enable(emit) {
      emit('audio-toggle');
      await audio.lastUnlock;
      return handle.soundReady();
    },
  };
  return handle;
}

// Starts the handle only if its panel really became the active view (panels can be skipped while paused).
export function startDialogueVoice(session, voice) {
  if (voice && session.active?.voice === voice) voice.start();
}
