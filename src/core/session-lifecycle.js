/** Dispose custom resources before Phaser destroys the systems they depend on. */
export function disposeRoomSession(session) {
  if (session.disposePromise) return session.disposePromise;
  session.disposed = true;
  session.active = null;
  session.nonce = (session.nonce || 0) + 1;
  const root = session.root || session.ui?.root;
  const game = session.game;
  // Cache the promise before cleanup, including callbacks from dialog/audio teardown.
  let resolve, reject;
  session.disposePromise = new Promise((done, fail) => { resolve = done; reject = fail; });
  (async () => {
    if (session.scene) {
      session.scene.clearKeys?.();
      session.scene.callbacks = {isPaused: () => true};
      session.scene.teardown?.();
    }
    session.ui?.destroy?.();
    if (session.onPageHide) globalThis.window?.removeEventListener('pagehide', session.onPageHide);
    session.audio?.voice?.stop();
    if (session.ownsAudio) session.audio?.destroy();
    else session.audio?.setMode('inactive');
    if (game) {
      await new Promise(done => {
        // Phaser emits this before renderer/canvas cleanup; the await resumes afterwards.
        game.events.once('destroy', done);
        game.destroy(true, false);
      });
    }
    root?.replaceChildren();
    root?.classList.remove('r1-app', 'r2-app', 'r3-app', 'r4-app', 'r5-app');
  })().then(resolve, reject);
  return session.disposePromise;
}

/** A stored callback must never resurrect a room after a newer session mounted. */
export function deferRoomExit(session) {
  if (!session.options?.onExit || session.disposed) return false;
  if (session.exitQueued) return true;
  session.exitQueued = true;
  const token = session.nonce;
  queueMicrotask(() => {
    session.exitQueued = false;
    if (!session.disposed && session.nonce === token && session.state.exitReached)
      session.options.onExit(session);
  });
  return true;
}

/** Room restart resets puzzles; campaign-owned sound preferences remain shared. */
export function retainSharedAudioPreferences(session) {
  if (session.ownsAudio) return;
  const audio = session.audio.getSnapshot();
  session.state.audioEnabled = audio.enabled;
  session.state.audioVolume = audio.volume;
}
