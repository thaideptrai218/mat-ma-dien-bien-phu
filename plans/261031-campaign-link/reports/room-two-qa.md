# Independent Room 2 playthrough

Date: 2026-10-31. Result: **PASS for integrated Room 2 standalone route**. Tested production preview `http://127.0.0.1:4173/room-two.html`, fresh headless agent-browser session `campaign-bao-qa`, separate from root's campaign browser. CDP port 52098. No product edits in this QA task.

## Method

Read the current Room 2 session/actions/world/panels/rules/UI, original PuzzleView/NarrativeView and actual puzzle specifications. Harness `tmp/bao-two-journey.mjs` consumes only read-only `getRoomTwoSnapshot()`, computes a collision-safe BFS route from source geometry and issues real CDP keydown/up for all movement and E interactions. Native dialog buttons use trusted mouse events; text fields use keyboard select-all/insert-text; selects use their DOM value/change interface. No teleport, game/session setter, storage injection or fabricated prior completions. Historical source links were not opened.

The run continued from its own legitimately earned save after two harness corrections: closed native dialogs retain DOM children, so narrative loop now scopes to `dialog[open]`; nearest-target approach now keeps a ±16px margin instead of stopping on the fist/fold distance boundary. Neither failure was a product error or state bypass. Natural persisted progress from the first segment was retained on resume.

## Actual route evidence

- Completed intro through its original next-line controls. Read and deliberately recorded all seven clues: planner, radio note, diary, newspaper, allied telegram, calendar and Điện Biên Phủ dossier. Each increased collected count only after the final narrative control. The room notebook showed seven entries.
- Balance: classified all five cards into their original plan steps. **43** northern weights was rejected with the original “cán cân chưa khóa” feedback; **44** solved puzzle one.
- Radio: swapping **PHANTAN/TAPTRUNG** between the two channels was rejected with original reversed-channel feedback. Correct Vietnamese text **TẬP TRUNG** for French command and **PHÂN TÁN** for Việt Bắc solved puzzle two.
- Fist: selecting the correct Thà Khẹt/Trung Lào pair as the first move was rejected as wrong turn (“Nava … gom quân”). Then original ordered four moves succeeded: Lai Châu/Tây Bắc → Thà Khẹt/Trung Lào → Nậm Hu/Thượng Lào → Kon Tum/Bắc Tây Nguyên.
- Fold: Điện Biên Phủ target with **0611** left fragment false and gate locked. **0612** completed puzzle four, earned fragment II and unlocked the east gate. `exitReached` was still false before walking to the door. Original outro completed through next-line controls.
- Walked to `navarre-plan-exit` using keyboard and pressed E. Room completion showed; `exitReached=true`. No indirect puzzle/fragment event substituted for the physical door.

Final saved state: seven discovered/collected clues, ordered completedPuzzleIds `[nava-balance,nava-radio,nava-fist,nava-fold]`, intro/outro and seven clue beats complete, `fragmentCollected=true`, `exitReached=true`, audio muted.

## Additional checks

- Mid-room reload after balance and first two clues preserved both clue list and solved-puzzle list. Position returned to safe `(580,350)` entry. Completion reload again preserved the full final state and completed panel at the same safe entry.
- Pressing movement key D while a native puzzle/number field held focus did not move Quang (less than one pixel difference). Walking otherwise used only native canvas keyboard input.
- Header audio trusted click unlocked Web Audio; second click muted and saved `audioEnabled=false`. This verifies runtime availability/unlock/mute state, not subjective audible output.
- At **390×844**, native notebook dialog measured **337px** wide at x19, y10, height824; document scrollWidth375 did not exceed viewport390; all seven notebook rows remained present. This narrow-screen check covers shared header/notebook/dialog, not every puzzle's narrow-screen visual layout.
- CDP Runtime observer reported **zero uncaught exceptions during the observed route**. Observer attached after initial page bootstrap; this is not a claim about earlier console/network diagnostics.
- Original donor `http://127.0.0.1:4180/` returned **HTTP 200** after the playthrough. No donor files/process/storage were modified by this QA task.

## Campaign reuse and limits

Run `node tmp/bao-two-journey.mjs <cdp-port> getCampaignSnapshot <campaign-url-substring>` once the root campaign's active child is Room 2. Same harness handles shared audio already being enabled, skips standalone reload/mobile routines and waits after physical exit for both sanitized `campaign.rooms[2].exitReached` and the newly mounted `world.id==='room-three'`, then checks one canvas. No campaign progress is injected. The script accepts the default standalone getter/URL when optional arguments are absent.

This report independently proves the Room 2 native route; it does **not** claim full campaign 1→5, parent-owned shared-audio continuity or cross-room cleanup. Root's separate campaign run supplies that evidence. Donor content/art equivalence belongs to the extraction tests/provenance review, not inferred from this browser run.

Unresolved questions: None. No product blockers found.

Status: DONE
Summary: Complete Room 2 standalone route and wrong-answer/restore/audio/focus/narrow-screen checks passed. Reusable keyboard/CDP campaign-stage harness delivered.
Concerns/Blockers: Full campaign transition proof remains with root's distinct end-to-end run.
