# Room 5 — final assembly and reflection

Date: 2026-10-31. Status: implemented, focused component QA **PASS**. Full campaign acceptance remains controller-owned; this report does not claim the supplied fragment fixture proves earlier rooms were played.

## Delivery and integration

- `src/room-five/`: pure rules/save; source script and archive; 2000×1400 world/art/scene; configured shared RoomOneUI; native puzzle/reflection panels; guarded session/actions. Shared WASD/arrows, Shift, E, M/N/Q, physics, camera and map remain real controls.
- `RoomFiveSession(root, options)` accepts `{storage,audio,isPaused,onExit,fragments}`. Omitted fragments means empty inventory. No standalone entry grants pieces. Every solve/reflection/exit checks four actual owned IDs. Save sanitization restores only assembly→reflection→exit; contextual loading strips solved claims when a fragment is missing. Parent independently validates four predecessor exits and its own derived fragment inventory.
- `PAINTING_URL`, `PAINTING_ALT`, `MUSEUM_RETURN`, `CLOSING_LINE`, `DOOR_MESSAGE`, source labels exported from `content.js`; `archive.js` exposes `getArchiveEntries(state)` for parent journal. One original local `assets/images/victory-painting.svg` supplies parent framing and all four true 2×2 quadrants. Disclosed as project illustration, not an archival photograph or copy of a museum painting.
- Correct assembly keeps the door visually and logically closed. Walk to the separate reflection point, read the full scripted system question and Quang answer, then deliberately continue. The door gains light only after acknowledgment. Walk to the physical door and confirm; deferred shared exit helper calls the parent after valid exit. Standalone session without callback displays its own completion panel.
- Optional personal textarea has no form name or answer payload. No code reads its value into an intent, state, storage, archive or log; cleanup clears it on close/replacement/disposal. Empty continuation accepted. The authored Quang answer is presented as story, not an answer the player must endorse or reproduce.
- Session respects disposed and parent-pause guards; stored pagehide callback; owned versus injected audio; retained shared preferences on reset; shared asynchronous idempotent destruction. No shared scene/UI/audio, existing room or donor files changed by this worker.

## Source and narrative fidelity

Read README first, reviewed campaign plan/GO report/lifecycle scout, project code/design conventions, prior PDF audit and supplied PDF4 text pp. 3–5. No historical web research. Full final question, Quang's authored answer, intervening narration, door message and complete museum conclusion are available as selectable Vietnamese HTML text. No arbitrary word limits. The sentence describing completed assembly appears after the actual solve, preserving the source without announcing success in the intro. Museum return and ending acknowledgment are parent responsibilities.

## Verification

- Eight focused Node tests pass: actual ownership/no auto-grant; exact quadrant permutation; separate assembly/reflection/exit; blank continuation; prefix repair; save privacy; blocked storage; active view/token/disposed/parent-pause rejection; full source script/archive/painting; all five objects reachable with actual player-body clearance.
- Full test suite at this checkpoint: **105/105 pass**. Production Vite build passes (existing Phaser chunk-size warning only).
- Isolated browser fixture at ignored `tmp/five-harness/`, separate origin 4175 and component-prefixed session storage, supplied `[1,2,3,4]` context. This is a component fixture, not production progress fabrication and not full campaign proof.
- Browser journey used actual CDP keyboard events: Shift/WASD walks to table, native Enter swaps, wrong assembly denied, exact order solves, closed physical door inspected before reflection, reflection point approached, blank continuation, physical door approached/confirmed, exactly one deferred exit. Full reflection paragraphs checked against DOM text. Reload after assembly preserves that step, leaves reflection/exit false and respawns safely.
- Typed synthetic privacy marker absent from all recorded storage writes; closing cleared the textarea; reopened blank continuation accepted. At 375×812 puzzle and reflection have no horizontal document overflow; screenshots visually inspected for readable text, real quadrant images, controls and source labels. Desktop also captured.
- Previously completed component save reopened with only `[1,2,3]`: solved/reflection/exit flags stripped, physical table refuses puzzle. No missing fragment awarded.
- Repeated asynchronous destroy removes canvas/dialog with no runtime exceptions; parent pause makes audio inactive. Parent campaign QA still covers shared AudioContext continuity, full historical route, and museum acknowledgment.

Evidence (ignored local harness): `tmp/five-harness/journey.mjs`, `world.png`, `puzzle-desktop.png`, `puzzle-mobile.png`, `puzzle-correct.png`, `reflection-desktop.png`, `reflection-mobile.png`, `door-open.png`. Harness never included among Vite production entries.

## Follow-up visual continuity verification

Controller's immediate post-swap screenshot exposed a real transient rendering mismatch: the shared button's `transition: background .15s` animated background positions while piece labels changed immediately. An isolated native-button component reproduced old quadrant positions immediately after swapping, followed by the correct positions after 350 ms. The settled image already matched the source; the defect was the unnecessary interpolation between quarters.

Scoped CSS fix: `.r5-piece.r1-button` now transitions only `filter` and `border-color`. Immediately after the same swaps **and** after 350 ms, computed positions are exactly `0% 0%`, `100% 0%`, `0% 100%`, `100% 100%`, all at `200% 200%`, `no-repeat`, with the same local SVG URL. Hover retains those values. Slots measured 284.5×189.656 px (1.5 aspect ratio). Side-by-side screenshot visually confirms a single flag and continuous mountains/bunker against the shared original: `tmp/five-harness/painting-continuity-css-fixed.png`. Eight focused tests rerun: pass. Only Room 5 CSS changed; no progress rules changed.

## Limits and unresolved questions

No unresolved product questions. Full campaign browser route/review and publication are controller-owned. The component tests use supplied fragment context explicitly; they do not substitute for earning fragments through Rooms 1–4. Walking remains desktop keyboard input, consistent with existing rooms.

Status: DONE
Summary: Final room implemented; eight focused tests, 105-test suite, build and isolated browser component journey pass. Complete source reflection retained, optional response private, real physical exit preserved.
Concerns/Blockers: Full campaign acceptance remains controller-owned.
