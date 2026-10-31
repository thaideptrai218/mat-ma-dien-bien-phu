# Browser audio QA: Rooms 3, 4, 5

Commit: ab11f45 (feat/quang-system-guidance). Report only, no src edits, no commit.
Date: 2026-10-31. Env: Win 11, Chrome (headless, puppeteer-core), `npm run build` exit 0, `vite preview` on 127.0.0.1:4199 (stopped after run).
Method: fresh browser context per room (empty localStorage). Real mouse clicks and keyboard. Read-only instrumentation injected via evaluateOnNewDocument: AudioBufferSourceNode.start wrapper (maps decoded buffer → fetched file), MutationObserver on `.is-speaking`, `window.getRoomXSnapshot()`.

## Test results overview

| Scope | Result |
|---|---|
| Room 3 browser checks | 20/22 pass, 2 fail (same root cause: first-line chime race) |
| Room 4 browser checks | 20/22 pass, 2 fail (same root cause) |
| Room 5 browser | Not run. Needs 4 campaign fragments; seeding save forbidden. Unit tests only (below) |
| `npm test` | 156/156 pass, 0 fail |
| Room 5 / audio unit subset | 38/38 pass |
| Build | exit 0. Warning: phaser chunk 1.19 MB > 500 kB (pre-existing size notice, not audio) |

## Per-check table (Room 3 / Room 4)

| # | Check | R3 | R4 | Evidence |
|---|---|---|---|---|
| 1 | Intro shows "Bật lồng tiếng" | PASS | PASS | btn text, aria "Bật lồng tiếng để nghe lời thoại" |
| 2 | Paragraph count = voice manifest group | PASS | PASS | R3 7/7 (`r3.INTRO`), R4 5/5 (`r4.INTRO`) |
| 3 | Pre-click: audio locked, no voice/sfx/ambience fetch | PASS | PASS | `state: uninitialized`, 0 audio requests |
| 4 | Real click unlocks audio | PASS | PASS | state `running`, enabled, no notice |
| 5 | Voice plays in script order | PASS | PASS | 7/7 and 5/5 files; each file id = FNV id of DOM speaker+text |
| 6 | `is-speaking` moves 0..N-1 | PASS | PASS | sequence [0..6] and [0..4] |
| 7 | After read: button "Nghe lại", no highlight | PASS | PASS | visible text "Nghe lại" |
| 8 | Voice files 200 | PASS | PASS | 7×200, 5×200, none failed |
| 9 | Hệ Thống lines chimed (system-chime) | **FAIL** | **FAIL** | see Issue 1. R3 4/5 chimed, R4 3/4 |
| 10 | system-chime requested before first voice | **FAIL** | **FAIL** | chime req 1753 ms vs first voice req 1702 ms (same race) |
| 11 | Ambience bed requested + started | PASS | PASS | `audio/ambience/room-3.mp3` / `room-4.mp3` 200, bed running |
| 12 | "Nghe lại" replays from line 1 | PASS | PASS | highlight idx 0, new voice start |
| 13 | Esc mid-voice stops voice | PASS | PASS | `voice.playing=false`, dialog closed, no visible highlight |
| 14 | No more lines start after Esc (3 s watch) | PASS | PASS | start count unchanged |
| 15 | Settings: Lồng tiếng toggle + 3 sliders | PASS | PASS | "Lồng tiếng: Bật"; labels Âm lượng lồng tiếng / Hiệu ứng / Môi trường, 3 range inputs |
| 16 | Toggle Tắt ↔ Bật | PASS | PASS | both states seen |
| 17 | Walking → footstep samples | PASS | PASS | R3 `step-earth-*` ×8, R4 `step-stone-*` ×8; stepCount +8; moved 520 px |
| 18 | Footstep files 200 | PASS | PASS | 9/9 200 |
| 19 | No 4xx/5xx except favicon | PASS | PASS | only `favicon.ico` 404 in R3 (filtered out of check, as spec allows) |
| 20 | No console or page errors | PASS | PASS | none apart from favicon 404 |
| 21 | Esc closes settings → exploration | PASS | PASS | view null, mode exploration |
| 22 | Settings opened from header "Tùy chọn" | PASS | PASS | Esc does not open settings (see Note A) |

Note: check 22 (header open) and 13 were rewritten during QA because Esc closes an open panel instead of opening settings. Behaviour is the same code path as Room 1 (`settings` action toggles).

## Room 5

Not browser-tested. Campaign `index.html` Room 5 needs four fragments; seeding a save is not allowed. Unit coverage that ran and passed:
- `tests/room-five-actions|content|rules|world.test.js`
- `tests/sample-audio.test.js`, `tests/audio-controller.test.js`, `tests/voice-line-player.test.js`
- Full `npm test`: 156/156

Gap: no browser evidence for Room 5 voice, ambience `room-5.mp3`, or footsteps (`surface: wood`).

## Issues

### Issue 1 (low, real): first Hệ Thống line on unlock is not chimed
- Repro: R3 4/4 runs, R4 1/1 run. Consistent.
- Cause: `CueLibrary.preload()` starts at unlock. Voice line 0 is fetched and played before `system-chime` decodes. `VoiceLinePlayer.playSequence` calls `cues.play('system-chime')`, which returns false when the buffer is missing, so there is no chime and no 300 ms gap.
- Evidence: first voice start at ~1.6 s page time, no chime start before it. Later Hệ Thống lines: chime start → voice start gap 300–306 ms (matches `chimeGapMs=300`).
- Impact: only the first system line of the session after unlock. Audible as a missing announcement, not an error.
- Suggested direction (not applied): await the chime buffer before the first system line, or preload the chime earlier.

### Issue 2 (low): stale `.is-speaking` after Esc in a modal panel
- Repro: Esc while a dialogue line is being read. Native `<dialog>` cancel → `RoomOneUI.close()` → `panel.cleanup()` sets `voice.onLine = noop` → then `setMode('exploration')` → `voice.stop()` fires `onLine(-1)` into the no-op.
- Result: voice stops correctly. One `p.is-speaking` remains inside the closed dialog (not visible). It is cleared when the panel is rebuilt.
- Path difference: the session `close()` calls `voice.stop()` before `ui.close()`, so only the native Esc path leaves the class.
- By code inspection, same path in Room 1 (shared `ui.js`/`ui-voice-controls.js`). Not browser-tested in Room 1.

### Note A (info): Esc semantics
- Esc on an open panel closes it. Opening settings needs the "Tùy chọn" header button. Same as Room 1 code.

### Note B (info): footstep and chime samples are fetched at unlock, not on walk
- By code, `CueLibrary.preload()` fetches all sfx (footsteps, chime, UI) on unlock. Walk-time evidence is buffer starts (start instrumentation) plus `stepCount` +8, not new requests. The "footstep request" check is satisfied by unlock-time 200s plus walk-time starts.

## Run count
- Room 3: 4 runs (chime failure identical in all 4). Room 4: 1 run. Timings not measured.

## Artifacts (outside repo, scratchpad)
- Probe: `C:\Users\pgb31\AppData\Local\Temp\claude\C--Users-pgb31\c5c9ddd7-2161-4ee6-8a8d-f82bf232b9e8\scratchpad\qa-audio-room.mjs`
- Results JSON: `...\scratchpad\qa-result-three.json`, `...\scratchpad\qa-result-four.json`
- Screenshots: `...\scratchpad\qa-three-intro-speaking.png`, `...\scratchpad\qa-four-intro-speaking.png`

## Recommendations (priority)
1. Fix Issue 1: make the first Hệ Thống line wait for (or preload) `system-chime`. Add a unit test for "first system line waits for chime buffer".
2. Fix Issue 2: in `RoomOneUI.close()`, call `voice.stop()` before `panel.cleanup()`, or let the cleanup clear `is-speaking`.
3. Add a Room 5 browser check: a campaign-free route, or a debug entry point that does not require seeding saves (only if the project allows it).
4. Keep the browser probe as a repeatable script (currently scratchpad only).

**Status:** DONE_WITH_CONCERNS

**Summary:** Rooms 3 and 4 pass 20/22 browser checks each. Voice order, highlight, replay, Esc stop, settings, ambience, footsteps, and network (no 404 except favicon) all pass. Two low-severity issues: first system line unchimed on unlock (race), and stale highlight after native Esc. Room 5 browser run not done (campaign fragments needed); its unit tests pass (38 subset, 156 full suite).

## Follow-up

Date: 2026-10-31. HEAD 47bc509 (fixes in b5362ec). `npm run build` exit 0. `vite preview` 127.0.0.1:4199, stopped after run. Tree clean. Probe: `C:\Users\pgb31\AppData\Local\Temp\claude\C--Users-pgb31\c5c9ddd7-2161-4ee6-8a8d-f82bf232b9e8\scratchpad\qa-followup-audio.mjs` (copy of the room probe; adds strict Esc DOM check and first-Hệ Thống chime check). Run: `node qa-followup-audio.mjs three|one`. Room 1 added as config `one`.

### 1. Fix re-verification

| Check | Room 3 | Room 1 |
|---|---|---|
| Intro "Bật lồng tiếng", paragraphs = manifest group | PASS 7/7 | PASS 5/5 |
| Pre-click no audio requests; real click unlocks | PASS | PASS |
| Voice order, file ids match DOM text | PASS 7/7 | PASS 5/5 |
| is-speaking 0..N-1 | PASS | PASS |
| Hệ Thống lines chimed | PASS 5/5 (gaps 301–305 ms) | PASS 4/4 (301–305 ms) |
| **Fix a**: FIRST Hệ Thống line preceded by chime | **PASS** (304 ms, 1 chime start before it) | **PASS** (302 ms) |
| system-chime request before first voice request | **FAIL** (chime 1841 ms, voice 1823 ms, +18 ms) | **FAIL** (chime 1648 ms, voice 1620 ms, +28 ms) |
| **Fix b**: Esc during voice → voice stops, dialog closed | PASS | PASS |
| **Fix b**: Esc leaves 0 `.is-speaking` in DOM | **PASS** (0) | **PASS** (0) |
| No voice starts 3 s after Esc | PASS (8 starts before, none after) | PASS (6 before, none after) |
| Nghe lại replays from line 1 | PASS | PASS |
| Ambience bed requested and started | PASS (`room-3`) | PASS (`room-1`) |
| Settings: toggle Tắt/Bật, 3 sliders, Esc closes | PASS | PASS |
| Walking → 8 footstep starts (earth), 9/9 files 200 | PASS | PASS |
| No 4xx/5xx, no console or page errors | PASS | PASS |
| Total | 23/24 | 23/24 |

Notes:
- Fix a works audibly: `CHIME_WAIT_MS = 400` lets the chime finish decoding after unlock, then 300 ms gap. Only failing check is request order. Chime is fetched at unlock in parallel with line 0, so its request lands 18–28 ms after the first voice request. Audible result meets the goal; strict request-order criterion from first QA does not.
- Residual risk: if chime decode takes over 400 ms (slow device or network), first Hệ Thống line still plays unchimed, silently. Not reproduced here.
- Fix b confirmed: native Esc now clears highlight in the closed dialog. Single run per room, not repeated.

### 2. Room 5 in real campaign (`index.html`): NOT RUN

Stopped per instruction. Not feasible within reason:
- Room 5 needs earned completion of Rooms 1–4: full paper reads, puzzle answers, physical walks across four scenes. Hundreds of scripted interactions, plus per-room answer tuning.
- No usable driver in repo. `plans/261029-1757-mat-ma-dien-bien-phu-game/reports/browser-journey-driver.js` targets the old standalone `gameDebug` API (him-lam, campaign-map, command-post). Campaign QA harness lived in ignored `tmp/`; absent here.
- Save seeding forbidden. No teleport or progress setter used.

Static checks for Room 5 (code inspection only, no browser evidence):
- Intro: `room-five/session.js:39` uses `dialogue()` → `createDialogueVoice` → `r5.INTRO` (4 recorded lines). Code PASS.
- Painting-complete: `room-five/actions.js:43` plays `painting-complete` on assembly. Code PASS.
- Door: `room-five/actions.js:47` plays `door-final-swell`. Code PASS.
- Ambience `room-5` and surface `wood`: `audio-controller.js` maps `room-5`. Not traced end to end.
- Museum return narration (`museum.MUSEUM_RETURN`, 3 recordings): wiring under `src/campaign/` not traced. Unverified.

**Issue 3 (medium, code inspection): final reflection has no voice path.**
- `room-five/panels.js` `reflection()` renders `REFLECTION_SCRIPT` as plain text. Does not call `createDialogueVoice` or `startDialogueVoice`.
- `room-five/session.js:94` opens it via `show('reflection')`, which has no voice wiring. Reread path (`actions.js:50`) same.
- Manifest has 6 recorded `r5.REFLECTION_SCRIPT` lines (incl. Hệ Thống `SYSTEM_QUESTION`, index 1) with `durationMs`. They are never played.
- No test asserts reflection voice (`tests/room-five-*.test.js`). Spec "final question voiced by Hệ Thống" is not met.
- Fix direction: route reflection through the dialogue voice path (keep reread voiced), add a unit test that the reflection view attaches a voice handle.

### Summary
Fix a and fix b verified in Room 3 and Room 1 (browser). Chime request-order check still fails by 18–28 ms (audible result fine). Room 5 browser run not done (no driver, fragments require full play). Static review found the final Hệ Thống reflection question is never voiced.

**Status:** DONE_WITH_CONCERNS

## Unresolved questions
- Is the missing first-line chime intended, or should it be treated as a bug? Current code has no guard.
- Should Esc open settings or close the panel? Current behaviour closes; confirm intent.
- Is a campaign-free way to reach Room 5 acceptable for browser QA?
- Follow-up: strict chime request-order (before first voice) vs audible gap: which is the acceptance criterion?
- Follow-up: is the silent final reflection intended? Manifest has recordings, spec says voiced.
- Follow-up: commit the campaign journey driver under `plans/` (currently only in ignored `tmp/`) so Room 5 can be run repeatably?
