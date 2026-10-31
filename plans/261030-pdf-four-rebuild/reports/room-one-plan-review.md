# Room 1 implementation gate

Status: **GO — ROOM 1 ONLY**. Reviewed 2026-10-30 before product implementation. This task changed only plan/review documents. Current implementation phase: [Room 1 playable](../phase-room-one-playable.md).

## Evidence and scope

Read current primary README, original rebuild plan, source-quality audit and all supplied `Desktop/lich su.txt` locally in two untruncated segments. No internet research. User approved the early-1953 comparison scope, troop totals 445,000/252,000, current chain, map anchors and actual playable design. Their latest request adds top-right quests, map, sprint, full long notes and Quang's object thoughts/reactions.

Earlier waiting clauses are superseded for this Room 1 design only. Rooms 3–5 and full-campaign integration remain later work. Do not present standalone success as a completed PDF 4 campaign, teach both Nava-plan stages in Room 1, silently enter Bảo or import/save its progress.

## Review resolutions

| Finding | Concrete resolution |
| --- | --- |
| Old proposal demanded campaign cards absent from source | Current approved comparison puzzle replaces that route. No 1950–1952 invented campaign-card history. |
| Source-quality audit rejects unverified totals as default mandatory answers | User explicitly selected 445,000/252,000 for this design. Preserve the decision and badge them as figures from user transcript; do not label independently verified. Other corrupt/unapproved figures still excluded. |
| Full notes could be reduced to VN summaries | Four 250–350-word complete paper documents; notebook rereads full text. Separate Quang thoughts after reading. Measure word counts and inspect rendered last paragraphs. |
| Correct guessed code/name could skip learning sequence | Reducer prerequisites and validator invariants gate A-03, four document collections, comparison, drawer, decode, chest and door independently. |
| Paper open/close may imply reading | Controller requires active document/phase and final page/end plus active final deduction line; late callbacks/reset cannot collect. |
| Static minimap might misrepresent world | Both maps render actual snapshot coordinates/bounds/collision obstacles and marker status; no teleport controls. |
| Object anchors at north wall may be unreachable | Test each anchor's reachable interaction ring with object-body rectangles and line-of-sight; move collision extents/interaction offsets if needed while retaining accepted anchors. |
| Sprint diagonal speed or sticky focus | Normalize vector before 260/390 speed; modal/blur clears velocity and held/repeat input. Re-entry requires new key press. |
| One generic reaction could miss requested personality | Object-specific first/repeat/locked state thoughts for every prop; verify coverage list and play representative states. |
| Legacy maps remain executable after index switch | Retire all old primary active entries and map modules after replacement is ready; clean build plus dev/preview route checks. Keep historical images/reports. |
| Preserving Bảo could accidentally port/change old campaign | Leave separate checkout and 4180 process untouched. Current Room 1 completion offers explicit link only; do not copy donor whole campaign into new app. |
| Full-campaign guards might be applied prematurely | Current app has one fragment/one completion panel/private save. Five-room/four-fragment/peace-outro design remains future contract, not current completion claim. |

## Integration contracts and acceptance

Use new isolated `src/room-one/` and generic reusable utilities; no old campaign session/content imports. Freeze stable IDs, action payloads, scene snapshot and UI intent signatures before parallel implementation. Five responsibilities have disjoint file ownership in phase doc. Controller owns session/actions/main and cross-owner wiring; workers do not revert one another.

Run pure full-chain/bypass/save tests and geometry reachability before browser QA. Browser must walk/interact letter→A-03→four papers/deductions→comparison→2413→A1Z26 HENRINAVARRE→NAVA chest→fragment→door. Verify actual HUD/map/sprint/full text/Quang reactions rather than relying on reducer-only journey. Reload and reset cannot preserve impossible progress. Test Vietnamese font and focus/audio behavior from real controls. Final build/docs must state standalone Room 1 only; protect separate Bảo unchanged.

## Unresolved questions

None blocking Room 1 implementation. Later room content and complete PDF 4 campaign integration remain outside this milestone.
