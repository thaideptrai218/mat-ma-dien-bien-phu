# Campaign session lifecycle implementation

Date: 2026-10-31. Status: DONE. Scope: existing rooms I/III/IV session/actions, shared scene/UI, child scene pre-create guards, new lifecycle helper and focused tests. No campaign runtime, Bảo, final-room or source historical-content edits.

## Delivered contract

`new RoomOneSession(root, options = {})`, likewise Three/Four. Fields: `root`, `options`, `disposed=false`, `ownsAudio=!options.audio`, stored `onPageHide`. Options: `storage`, `audio`, `isPaused`, `onExit`. Storage `null` explicitly overrides localStorage; absent/undefined preserves standalone fallback and original save keys. Shared audio is injected without replacing its status callback; standalone constructs/owns its controller.

Parent pause OR own dialog OR disposal pauses scene input. Rendering sets shared audio inactive while parent-paused. Actions reject disposed/parent-paused intents; session mutations, UI opening, interaction, render, async audio result and late scene position callbacks ignore disposal. Standalone room reset still resets audio to defaults; shared-audio reset retains current parent preferences.

Successful door exit commits first, then optional `deferRoomExit(session)` queues a single microtask. No campaign hook runs on chest-open or pickup. Deferred hook rechecks disposal, nonce and actual exitReached; reset/disposal invalidates it. With onExit, completed standalone panel is suppressed; without it, original panel remains. Contextual Room III/IV intro/fragment-outro copy describes the connected campaign only when onExit exists. Historical content modules remain unchanged.

## Shared helper

`src/core/session-lifecycle.js` exports:

- `disposeRoomSession(session)` returns the same cached Promise on every call, marks disposed synchronously, invalidates active/nonce, clears keys, disconnects scene callbacks, explicitly calls teardown while Phaser systems are alive, invokes UI cleanup, removes pagehide, destroys owned audio or silences shared audio. It registers core `destroy` before `game.destroy(true,false)`, resumes after the event's entire synchronous stack and only then clears root DOM/room classes (`r1` through `r5`). Existing sessions expose `destroy()` returning this helper.
- `deferRoomExit(session)` implements the guarded exit callback described above. Requires `.options`, `.nonce`, `.state.exitReached` and `.disposed`; returns false when standalone has no hook, true when campaign owns exit UI/transition.
- `retainSharedAudioPreferences(session)` copies `audio.getSnapshot().enabled/volume` into freshly reset `.state` only when audio is parent-owned.

New room workers should set the documented fields and use `.destroy()` wrapper. Their `ui.destroy()` must clean listeners/dialog/observers without deleting canvas/root before the helper's Phaser wait. Their scene teardown must be safe before create and idempotent. Parent owns shared AudioController destruction and refreshes child rendering from its status callback.

## Cleanup behavior

Shared scene teardown is idempotent, checks optional pre-create/plugin references, nulls unbind/collider/group after cleanup, tolerates already-null physics world and already-destroyed collider/group. It removes native input, world/postupdate/resize handlers and local texture. Base and III/IV create return when already torn down. Existing SHUTDOWN callback remains compatible; campaign explicitly invokes teardown before core destruction because Phaser does not emit SHUTDOWN from Game.destroy.

UI destroy mutes action callbacks, cancels stored RAF, invalidates current panel, disconnects document ResizeObserver through cleanup, clears draft Map and closes native dialog. It deliberately retains root/canvas until helper completes. Render/show/emit/close ignore destroyed UI; stale RAF rechecks destroyed/panel identity. Existing reader's pending font callback rejects disconnected nodes.

## Verification

Focused command passed **21/21**: `node --test tests/session-lifecycle.test.js tests/room-one-actions.test.js tests/room-three-actions.test.js tests/room-four-actions.test.js tests/audio-controller.test.js`.

Seven new meaningful tests cover same-promise/idempotent disposal and cleanup ordering, DOM removal after Phaser event stack, shared audio/pagehide ownership, missing pre-create resources, deferred single exit, stale/reset/disposed exit cancellation, every existing action router's disposed/paused rejection, and shared versus standalone reset preferences. Test count remains seven because related invariants share cases.

`npm run build` passed (80 modules/three entries at this slice's checkpoint); existing large Phaser chunk warning remains. Existing room action assertions passed unchanged. Syntax checks passed for the three modified sessions.

Integrated root reviewer/tester/browser QA remains necessary: real Phaser pre-create/transition cleanup, Room II/V consumer cleanup, one canvas/dialog/shared audio across full route, native close/focus and menu/new-game races. Unit adapter events prove helper ordering, not real rendered Phaser teardown or a fully completed campaign. Root owns full-suite/build/actual-route evidence after all disjoint slices integrate.

Unresolved questions: None blocking. Shared helper assumes it owns the active room root; controller must await destroy before reuse and keep the Game loop alive until its destroy frame.

Status: DONE
Summary: Optional injection and guarded lifecycle complete for I/III/IV; reusable disposal/exit/reset-audio helpers ready for II/V. Focused tests and build passed.
Concerns/Blockers: Integrated browser/reviewer verification pending at parent task level.
