# Campaign lifecycle scout

Date: 2026-10-31. Scope: read-only source review of canonical checkout; only this report written. Read README, architecture/code standards, sessions/actions/saves/main for rooms 1/3/4, shared scene/input/UI/reader/audio, installed Phaser 3.90 source. `CLAUDE.md` absent in project root. No web research or Bảo edits.

## Recommended contracts

Keep each standalone `main.js` and room `save.js` default intact. Campaign imports **session classes**, never room `main.js`: main modules instantiate immediately, add standalone navigation and expose globals. Campaign must import shared fonts/CSS and room CSS itself, await `loadGameFonts(document.fonts)`, then construct one session.

Add optional second session argument, consistently in rooms 1/3/4:

```js
constructor(root, {storage, onExit = null} = {})
```

Use supplied `storage` whenever it is not `undefined`, including explicit `null`; otherwise obtain `window.localStorage` inside existing try/catch. Avoid `storage || window.localStorage`, which accidentally falls back for intentionally unavailable storage. Existing `new RoomOneSession(root)` retains behavior and existing keys.

Saves already require only synchronous `getItem(key)` and `setItem(key, serializedState)`; no `removeItem`, length or clear is used. All load/write exceptions already become notices. Campaign adapter can map the existing room SAVE_KEY into one global envelope's `rooms` member and write **only one global localStorage key**. Existing room `sanitizeSave` must still run on both import and persistence; retain version 1 per-room snapshots. Adapter getItem returns serialized room object or `null`. Adapter setItem updates in-memory envelope before attempted durable write, so blocked storage still retains the campaign during this live session; throw/write-notice when durability fails. Never fall back to room standalone keys implicitly. Unknown room keys should reject rather than create arbitrary global entries.

For real automatic exit, call optional `onExit` only on the successful door branch, after `commit('exit')` and after its local completed view is settled (or instead of completed when callback exists). Campaign callback queues the transition in a microtask and verifies active session identity/generation before acting. Never destroy synchronously inside adapter `setItem`, `render`, or `commit`: every current door branch calls `show('completed')` after `commit` returns, and constructor also renders/opens intro before the controller has assigned the session reference.

Locations: room-one/session.js:14,48,109; room-three/session.js:15,35,70; room-four/session.js:13,39,87. Optional storage + exit hook + destroy are sufficient; rules need no campaign logic.

## Completion and progress invariants

| Room | Actual fragment earned | Exit prerequisite | Restore validation |
| --- | --- | --- | --- |
| I | `chestOpened` (no distinct fragment flag) | `chestOpened` | Letter→A03→4 collected/read papers→comparison→drawer→identity→chest→exit |
| III | `fragmentCollected`, separate from `chestOpened` | `fragmentCollected` | Joint ordered paper/challenge graph, all four challenges→chest→fragment→exit |
| IV | `fragmentCollected`, separate from `chestOpened` | `fragmentCollected` | Contiguous seven-paper prefix→crossword→column→T/L→chest→fragment→exit |

Source: each room rules/save and openObject door branch. `interact` checks nearest object, radius and open modal; action `continue-object` checks current dialogue token/action/object; reducer exit rejects missing fragment/chest prerequisite. Do not award III/IV at final-answer/chest-open events. Do not advance merely because a fragment was collected. Derive campaign fragments from sanitized room snapshots; derive unlocked/current stage from contiguous sanitized exits, including Bảo's verified equivalent when integrated. Current room intro/exit restoration happens in constructors; campaign must choose the first unfinished stage **before constructing**, avoiding an already-complete room's standalone completion dialog.

## Critical Phaser lifecycle finding

Installed `node_modules/phaser/src/core/Game.js:716` documents `destroy` as asynchronous. Its `destroy(true, false)` only sets `pendingDestroy`; next frame `step` calls `runDestroy` before ordinary update. Keep `noReturn=false`, since true prevents another Game on this page.

`runDestroy` at Game.js:749 calls `scene.destroy()`. SceneManager.js:1716 loops through `sys.destroy()`. Systems.js:798 emits **DESTROY**, not SHUTDOWN. Existing RoomOneScene cleanup at src/room-one/scene.js:57 listens **only SHUTDOWN**, so merely calling `game.destroy(true)` leaks custom canvas/window/document input listeners. Rooms III/IV inherit this issue.

Do not repair by blindly adding the current teardown as a late DESTROY callback: ArcadePhysics.destroy/shutdown (ArcadePhysics.js:710,739) destroys and nulls `world`; current teardown assumes `this.physics.world.off`. DisplayList.destroy also destroys scene objects. Collider.destroy (Collider.js:159) unconditionally uses `this.world.removeCollider` and nulls world; repeating it throws. Current teardown is not idempotent.

Minimum safe sequence:

1. Mark session destroyed; invalidate active dialogue and nonce; mute UI/session/scene callbacks immediately. Repeated destroy returns the same completion promise.
2. Clear movement while player/body/animation are alive; invoke **idempotent scene teardown explicitly before Phaser destruction**. Preserve own DOM unbinds, POST_UPDATE/WORLD_STEP removal, resize removal, collider/static-group cleanup and texture removal. Guard missing boot/create properties, null cleaned references, and skip repeat work. Scene teardown must work even if Game was constructed but scene has not created yet.
3. Destroy UI without normal modal-close action; remove stored pagehide callback; call AudioController.destroy.
4. Attach one Game DESTROY listener before `game.destroy(true, false)`; await its completion before mounting the next room. Promise resolution/continuation naturally runs after the synchronous `runDestroy` body finishes. **Do not construct the next Game inside the DESTROY event handler**, because renderer/canvas/loop cleanup occurs after that event.
5. Replace room root/mount next session only after completion. Do not stop/destroy the Game loop before pendingDestroy gets its next frame. Serial transition generation protects rapid reset/new-game requests. Hidden tabs may delay the next RAF; retain a transition state rather than creating a second Game concurrently.

Scene `teardown` should remain safe on SHUTDOWN too. Because plugin shutdown can run before the existing late listener, guard missing world/body and already-destroyed objects. Optional DESTROY listener is safe only after those guards; explicit early teardown remains simpler for campaign switches. Base teardown must leave subclass overlays safe: RoomThreeScene destroys+nulls chestOverlay/fragmentLabel; RoomFourScene destroys+nulls chestOverlay before super.

## Session callback and UI cleanup

Each session currently has no destroy method. Guard `render`, `commit`, `show`, `interact` and action dispatch after destroy; late audio `.then(...)` currently calls session.render in every actions.js. Entry guard in each handleAction also protects retained old DOM callbacks. Audio callback should stop reaching session; scene callback table can be detached/replaced after clearing motion. `isPaused` must report true when disposed. Do not null UI then call existing `isPaused:()=>this.ui.isOpen` from input unbind; order/guard this explicitly.

Room I has named `onPageHide` (session.js:35); rooms III/IV currently use anonymous listeners (session.js:27/:30), requiring stored functions to remove. Room I main.js:15 duplicates pagehide; campaign does not import that main. Removing redundant standalone listener is optional; avoid creating a new unremovable one.

Shared RoomOneUI owns native dialog, panel cleanup and queued requestAnimationFrame (ui.js:122–156). New `destroy` should set a destroyed flag/mute onAction, invalidate `panel`, run panel.cleanup even if dialog is already closed, close native dialog and remove it/root children as appropriate. Ordinary `close()` emits `modal-close`, focuses old scene and renders, so it is unsuitable after session teardown. Pending RAF checks `isOpen` and panel identity; clear panel and optionally cancel stored RAF ID. `emit`, `show`, `render`, `close` should harmlessly ignore disposed UI. Detached element listeners do not require global enumeration once root/dialog/session references are released.

Document reader uses ResizeObserver in afterOpen and cleanup disconnects it (document-reader.js:97–100). `document.fonts.ready.then(check)` cannot be cancelled, but its check rejects disconnected/zero-height scroll nodes; UI destroy must disconnect observer and remove reader. Room III's draft Map stays session-local and can clear on destroy. UI adds `r1-app`, `r3-app`, `r4-app` classes but never removes them: clear room-specific classes or provide a fresh room root at every mount to avoid old room CSS affecting later rooms. Fixed `game-canvas` ID requires only one live room UI/root.

## Audio ownership

AudioController.destroy already is idempotent: marks destroyed, increments operation to invalidate pending resume, removes its blur/focus/visibility handlers and statechange listener, stops synth sources, disconnects gains/analyser, closes context (audio-controller.js:91). Invoke it; merely setMode('inactive') retains listeners/context. Controller getSnapshot can still return diagnostics after destroy, but session render must be disabled.

Each newly constructed room otherwise creates its own AudioController. Stored audioEnabled is a preference, not authorization to resume a fresh AudioContext. Automatic transition must not claim audio remains unlocked: the next room may require its existing audio button. Keeping uninterrupted audio would require deliberately shared AudioController ownership/injection beyond the minimal storage work; never have old session destroy a shared controller. Common audio preferences, if desired, belong in campaign data and are propagated separately from runtime unlock.

## Reset semantics and standalone compatibility

Existing settings explicitly confirm reset of **this room**; reset methods createState, persist through storage, reset position and show intro. Preserve this meaning under campaign adapter: reset active room snapshot and derive its fragment/status afresh, retain earlier rooms. Sequential campaign normally cannot have earned later-room state while current is unfinished. If replay of earlier rooms is added, define downstream invalidation rather than leaving contradictory “current room reset, later exits still complete”. Do not overload room reset into global new game.

Provide campaign-level global new game separately with its own concrete confirmation. It invalidates pending transition, destroys active session, clears/reinitializes **global envelope only**, then mounts Room I. Do not delete standalone room keys or Bảo's standalone save. Fresh campaign must not auto-import standalone completed keys; any migration would be explicit scope.

Campaign build requires new Vite HTML input; standalone inputs remain. Campaign header/nav/settings/completed text must describe connected journey; current Room I completed panel opens external 4180, Room III/IV text describes independent build. Avoid rendering these transient standalone descriptions on automatic transitions; callback branch can suppress completed panel only in campaign while defaults preserve standalone behavior.

## Verification targets for implementation

- Existing 68 tests and three standalone entries retain behavior; adapter tests prove no standalone key writes, sanitized graph preservation, storage failure keeps in-memory state, global reset isolation, and no advance on chest/fragment without exit.
- Real browser transitions 1→2→3→4 check one canvas/dialog, no retained input/audio/pagehide callbacks, no collider/world-null errors, no old RAF/dialog reappearance, actual save/reload at safe spawn. Rapid restart/new-game while switch pending must not mount stale sessions.
- Test destroying before Phaser create and repeated destroy/SHUTDOWN; no assumption every Scene object exists. Audio resume pending during destroy must not render/restore old room.
- Full historical puzzle completion should use actual actions/doors; diagnostics must remain read-only and no test-only progress/teleport setter in production.

Unresolved questions: Bảo's constructor/save/door hook contract is outside this scoped read-only scout and must be verified by its owner before integration. Whether campaign audio must stay uninterrupted needs a product decision only if that behavior is required; default per-room user audio action is supported by current contracts.

Status: DONE
