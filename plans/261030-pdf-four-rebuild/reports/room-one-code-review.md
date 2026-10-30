# Room 1 code review

Reviewed 2026-10-30. Pending working tree; no product edits by reviewer.

## Scope and assessment

Reviewed all 17 `src/room-one/` JavaScript/CSS modules (1,379 nonblank lines at final reread), shared geometry/character/audio/font contracts, four Room 1 test files, and the Room 1 milestone plan. Read README and code standards. Applied `ck:scout`, `ck:code-review`, base and web review checklists. Sources remained local; no historical internet research.

**GO for the reviewed code. No remaining actionable findings.** This is a local single-player application: no authentication, server endpoint, database, or private-data transmission. HTML content uses `textContent`; Bảo link is explicit and does not transfer storage. Final delivery acceptance still includes the lead's build and browser evidence below.

## Final audio recheck

The remaining audio concern is fixed. `src/room-one/actions.js:24` now examines runtime state before toggling preferences, so enabled/suspended audio resumes in one gesture and enabled/running audio can be muted. `audioLabel` in `src/room-one/ui-elements.js` distinguishes enable, resume and mute; `src/room-one/ui.js` refreshes both header and open-settings labels from each audio snapshot. The added regression test proves suspended resume preserves the enabled preference and a subsequent running toggle disables it.

## Scout findings corrected during review

Integration owner corrected these findings; fixes were reread in source:

- Restored-letter submission previously persisted `letterSolved` before its final confirmation, allowing close/reload to unlock A-03. It now uses a token-guarded `letter-record` confirmation.
- Clicking the quest toggle previously toggled twice across UI/controller. Controller now owns the toggle.
- Native dialog's queued close event could invalidate the new intro after reset. Removed the stale asynchronous close handler; closure invalidates current session synchronously.
- Room 1 used unsupported `correct`/`wrong` cue names. Calls now use shared synth's `success`/`error` names.
- Wrong-answer notice survived subsequent correct submissions. Submission attempts now clear the prior notice.
- Prior inspection was confused with completed puzzles, producing claims that a code/fragment was already acquired. Result reactions now depend on actual completed state.
- Settings initially received no audio snapshot and its label did not refresh. Controller now supplies it; both audio labels refresh, with a separate resume action when playback is suspended.

## Verification and plan follow-up

Fresh final command: `node --test tests/room-one-actions.test.js tests/room-one-content.test.js tests/room-one-rules.test.js tests/room-one-world.test.js tests/audio-controller.test.js` — **21 passed, 0 failed**. This includes new restored-letter final-confirmation and suspended-audio regression tests.

Verified predecessor checks, four separately confirmed notes, stale-reader rejection, isolated storage key, malformed/blocked storage recovery, normalized 260/390 movement, key interruption, full document lengths/source labels, and reachable E approaches for all thirteen anchors. Audio uses actual movement distance; map uses the same world objects/obstacles and scene coordinates. Font requests settle before canvas artwork creation; local failures do not reject startup.

Concurrency, error propagation, caller contracts, compatibility, external inputs and data exposure were traced. No unbounded query or network loop applies. Type coverage/test coverage percentages not measured; no lint script configured.

The lead owns fresh production build, old-route retirement, current documentation and the visible browser journey. The lead reports real keyboard/DOM play through all four notes, comparison, drawer and chest without state setters; that browser execution was not independently repeated by this reviewer. Do not mark final delivery acceptance checkboxes complete from this source review alone. Final browser evidence should include door completion, full document scroll/confirmation, reset then intro completion, click and keyboard quest controls, wrong-to-correct answers, audio enable/resume, narrow view/zoom, and save/reload. No plan files or task state were changed by reviewer.

## Unresolved questions

None.
