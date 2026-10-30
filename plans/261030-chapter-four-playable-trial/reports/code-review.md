# Chapter-four trial code review

Date: 2026-10-30. Scope: standalone `chapter-four.html`, all `src/chapter-four/**`, two new test files, and Vite multi-entry configuration. Production source read-only; report only.

## Summary

No evidence-backed blocking finding remains. Three Medium issues were corrected and passed frozen-source re-review: narrative control focus, brightness option, chest-opening animation. Controller/tester own the final production-browser journey and PCM evidence.

## Resolved findings

### Medium: advancing dialogue removes the focused control

`src/chapter-four/ui/narrative-panels.js`, `draw()` regenerated controls through `controls.replaceChildren()` when **Tiếp lời** was activated, without refocusing its replacement. The focused DOM node was removed, interrupting repeated Enter/Space reading and requiring a fresh Tab cycle. The main game's VN already restores focus on advance.

Resolved: `draw()` detects focus inside controls before replacement and focuses the new primary control afterward; initial/outside focus is preserved. A narrow harness of the actual narrative module advanced twice through `lineIndex:2,lastLine:true`, keeping focus on each replacement button. UI worker independently reported the real-browser consecutive-Enter path passing. `open()` also defers initial heading/welcome-button focus until panel content exists and guards closed/replaced panels.

### Medium: brightness setting changed state without changing the scene

`src/chapter-four/ui/help-panel.js:31` exposes **Tăng sáng khung cảnh**, but its `brightness` value had no rendering consumer. `TrialScene.applySettings()` merged the value while only configuring camera/gait; trial CSS had no brightness selector. Thus the checkbox appeared functional and updated state while leaving the scene unchanged.

Resolved: `TrialInterface.render()` toggles the trial-owned `trial-bright` class from current state. CSS applies `brightness(1.18)` only to `#trial-host canvas`, leaving dialog text unchanged. Switching to normal/reset removes the class through ordinary HUD render.

### Medium: chest changes immediately between static drawings

`src/chapter-four/trial-scene.js`, `refreshProgress()` called `paintChest(chestOpened)`; `src/chapter-four/archive-art.js:89` used a boolean to draw a static open or closed lid/glow. No time-varying opening existed despite the accepted plan's explicit opening animation. The completion delay alone is not an animation.

Resolved: the scene tweens `chestProgress` 0→1 over 800 ms with `Cubic.Out`; painter uses progress for lid movement, glow and fragment appearance. A narrow actual-painter harness confirmed distinct drawing calls at 0, 0.5 and 1. Reduced-motion opening completes immediately; enabling it mid-animation stops the tween and sets progress to 1. Reset transitions visual open→closed, stops the tween and resets progress to 0; shutdown also stops it. Regular progress refreshes do not restart a running/completed opening.

## Verified boundaries and contracts

- Scouted the session/action/reducer/UI/scene paths before review. `onReady → render → refreshProgress → onNearby` ends in HUD rendering; `syncInput → clearMotion → onMotion` ends in position-map updates. No callback recursion found.
- Exact seven IDs and seven answers; 7×17 crossword offsets yield `TIMTVAL`. Cipher grids and exact distinct T/L cell sets yield `QUYETCHIEN` / `QUYETTHANG`. Wrong column, malformed/duplicate/extra/missing cells and incomplete puzzle stages are rejected.
- Reducer requires every clue collected before crossword, crossword before cipher, cipher before chest phrase. Last-line cursor/ID checks precede composition collection; early Esc does not collect. Reopening and puzzle errors retain cursor/drafts; reset clears drafts and progress.
- No main-game save/store/localStorage reference in the trial source. One independent state owner, no persistence, no server/auth/DB surface. Text is inserted through DOM text APIs. No security/anti-cheat expansion requested.
- Shared character-animation, AudioController and pure geometry modules have empty Git diffs. Vite adds two local explicit HTML inputs while preserving existing base/chunk configuration.
- River spans the world boundary; only bridge gap is walkable. Three eastern clues are reachable while locked; western targets are blocked. Every remaining clue/table/chest has a walkable interaction approach after unlock. Rendering/collision use the same geometry.
- Sprint uses normalized 390 versus 260 movement speed. Input is canvas-scoped; movement/Shift are cleared for modal/blur/hidden, stale repeats cannot restart motion, and form keyboard input is not captured globally. Scene movement/gait/steps use actual physics displacement.
- Single lazy audio controller; sequence guards prevent stale async preference commits after reset. Muting/inactive/dialogue modes and suspend retry come from the unchanged controller. Post-close deliberate cues are deferred until canvas focus/mode synchronization.
- Dialog queued close handler ignores a previously closed panel if a replacement is open. Reset before start is explicitly allowed by the corrected intent allowlist; reviewed current source, not the superseded candidate.

## Validation

- Fresh focused tests: `node --test tests/chapter-four-rules.test.js tests/chapter-four-world.test.js` — 14 passed, 0 failed.
- Fresh reviewer `npm test` — 37 passed, 0 failed before the three bounded fixes. Controller reports the same 37 tests and production build passing after the frozen fixes; reviewer did not duplicate those full commands.
- Controller/tester reports successful initial production build: both HTML entries, 46 transformed modules. Reviewer inspected Vite diff and existing `dist/chapter-four.html`; did not duplicate a build while UI layout fixes were active.
- No percentages, type coverage, lint result, browser route or audible PCM claimed. Root owns actual UI route/PCM verification and final production browser checks. Reviewer did not operate its browser sessions or edit source/tests.

Frozen follow-up also checked completion/reset ordering: `start()` clears the prior finish timer and invalidates pending audio requests; state/render closes/reset chest animation before repositioning; the final scene snapshot refreshes HUD target/map after reset even when the target ID did not change. The 1100 ms completion timer follows the 800 ms opening and requires an active run, opened chest and no replacement modal. No new evidence-backed timer/reset defect found. Existing `dist/chapter-four.html` references frozen bundle `chapterFour-BCg12_1P.js`.

## Follow-up

All three accepted fixes have passed bounded source re-review. Trial map, rules and stage boundaries otherwise match the plan. Controller completes final production-browser evidence and plan-state updates; reviewer did not change task state or authorize publication.

## Unresolved questions

No unresolved code-review blocker or product decision. Full-route browser, visual timing, brightness and actual PCM verification remain controller/tester observations.

Status: DONE
