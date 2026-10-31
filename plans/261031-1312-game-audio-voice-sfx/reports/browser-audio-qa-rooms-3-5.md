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

## Unresolved questions
- Is the missing first-line chime intended, or should it be treated as a bug? Current code has no guard.
- Should Esc open settings or close the panel? Current behaviour closes; confirm intent.
- Is a campaign-free way to reach Room 5 acceptable for browser QA?
