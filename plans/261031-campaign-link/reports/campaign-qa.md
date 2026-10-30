# Campaign acceptance — 31/10/2026

Status: PASS. Actual browser route completed all five rooms using earned progress, physical movement/interactions and native puzzle controls. No production progress or teleport setter was used.

## Environment and evidence

Built five-entry preview on localhost:4173, Chromium agent-browser session `campaign-qa`, desktop 1440×1000, 375px paper and 390×844 framing checks. Node/CDP harnesses in ignored `tmp/` issue WASD/Shift/E keydown/up and interact with actual DOM controls; read-only snapshots measure results. Save data was earned through the route, not injected. Completed evidence and screenshots remain local under ignored `tmp/campaign-*`.

## Actual route

- Museum: painting → fictional bunker context → five-room instructions → Room1.
- Room1: full original letter → A-03 → all four full papers/read-confirmations → force comparison → 2413 drawer → Henri Navarre → July N-01 → NAVA chest/I → physically walk to north door. Wrong drawer code denied. Room2 starts in the same page with only I earned.
- Bảo Room2: all seven original narratives recorded, balance44 and original card steps, both radio channels, four ordered fist directions, final `dbp`/`0612` fold. Wrong answers denied; actual fold awards II and opens gate; physical east exit mounts Room3. Original donor remains untouched. See independent [Room2 QA](room-two-qa.md).
- Room3: all five full papers, preparation/cargo/strategy/opening challenges, all six decoded local illustrations, wrong supply/reason/year answers denied, four reward tokens, 13/03/1954 seal, separate III pickup, physical door to Room4.
- Trâm Room4: seven full papers in chronology, seven crossword answers, wrong column denied, column9, both original T/L shape traversals, wrong final phrase denied, complete phrase auto-opens chest, separate IV pickup, physical north exit. All four prior exits and all four owned fragments were retained on reload into Room5.
- Room5: wrong arrangement denied; four native select/swap controls restore exact order, assembly keeps door closed; physical locked door responds correctly. Full six-passage scripted reflection present, optional textarea left blank, deliberate continuation opens door, physical walk/E exit returns to museum. No canvas remains on return. Explicit museum acknowledgment sets endingSeen; four fragments/five valid exits persist.

## Shared behavior and regressions

- Global archive had25 entries on entering Room5; earliest Room1 letter and original Bảo planner reopened as full selectable paper. Archive grew to26 after final scripted reflection. No progress granted by rereading.
- Enabled audio preference survived Room5 reload; new context correctly reported unlocked=false. This verifies the review fix initializing parent-owned preferences before constructing Room5. Bảo unlock/mute was verified with trusted input, and unlocked shared context survived Room2→3. No personal reflection text is stored; independent final-room component QA verified a typed marker was erased and absent from writes.
- Campaign snapshot world mutation test changed only the returned copy; subsequent snapshot remained correct. Standalone diagnostics also clone their returned snapshots.
- Completed ending restored after reload. Native global-new-game confirmation starts disabled; cancel preserves complete state. Confirmed restart returns to opening and clears only campaign progress. An actually created standalone Room1 save remained byte-identical. Rapid fresh mount/restart settled at museum with zero stale canvas or open dialog.
- Responsive framing/confirmation at390px did not horizontally overflow; full Room1 paper checked at375px. Independent Bảo notebook and Room5 component puzzle/reflection mobile checks passed. Computer keyboard movement is supported; touch walking was not added.

## QA interruptions and limits

One concurrent review build replaced hashed preview assets while the old tab was playing Room4. Its lazy Room5 request then could not fetch the retired asset. Reloading the new build restored all legitimately earned four-room state and mounted Room5; the full final route then passed. This was a changing-build QA environment, not lost progress or a history/puzzle failure. Keep preview build assets stable during a playthrough; hosting deployment was not part of this task.

Two automation-only issues were corrected: Bảo pathfinding needed a margin from a nearby-object boundary; global archive automation initially selected an invisible close button from the inactive child dialog. Visible controls and stable nearest-object routes then passed. No product bypass was added.

Captured runtime exceptions were zero for completed route stages and final/postcheck runs. A final visual check found swaps were briefly interpolating background positions due to the common button transition. Scoped Room5 CSS now changes only filter/border; independent browser proof confirmed correct quadrants immediately, after350ms and on hover, matching the original painting without duplicated quarters. Standalone completion copy/links now point truthfully to the available campaign and local Room2 preview. These final changes passed105/105 and a five-entry build again.

Known Vite Phaser chunk-size advisory remains; no build errors. [Code review GO](code-review.md), [lifecycle](lifecycle.md), [Room5 component QA](final-room.md). Publication/remote merge requires a final narrow verification checkpoint recorded separately.
