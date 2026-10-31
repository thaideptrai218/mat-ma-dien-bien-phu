# Code review — letters, chronology and Vietnamese typography

Date: 2026-10-30. Review target: implemented chapter-four letters/timeline/font change against `plan.md` and `reports/plan-review.md`. Reviewed independently; no product or test edits.

## Verdict and findings

**PASS for code review. No actionable correctness or security defect found in the reviewed scope.** Browser rendering, real focus behavior and the complete walking route remain separate acceptance evidence; this review does not infer them from unit tests.

Read README, code standards, architecture, implementation plan/review and history-research report; inspected story/letter data, reducer, controller, paper/reflection/notebook/map UI, dialog lifecycle, session reset, scene/world/art, fonts/styles, both entry points and the letter/rules/world tests. No project `CLAUDE.md` exists. Applied `ck:code-review` spec-compliance and evidence-verification checks.

## Spec compliance and contract checks

| Contract | Result and evidence |
| --- | --- |
| Seven original detailed letters; separate Minh reflections | Seven dated letter records, each with two pages/four connected paragraphs, author/recipient, greeting/signature; three separate reflection lines per clue. Paper displays fiction notice and source links. Historical review separately verifies source/date claims. |
| Final paper page → reflection → final reflection collection | `finish-letter` requires matching active letter, final page, discovery and current/prior-collected eligibility. It records only `readLetterIds`. `collectClue` requires matching final reflection; reducer also requires discovery, letter completion and current eligibility. Rejected collection cannot close the panel or announce success. |
| Chronology and replay | `getNextClue` selects first uncollected story record. `canReadClue` is shared by reducer/controller/scene. Future discovery, completion and collection are rejected; prior collected records remain replayable. Notebook read intent requires discovery. Reading alone does not unlock the successor. |
| Original puzzles and bridge | Explicit crossword IDs/offsets preserve original row order and `TIMTVAL` while story starts encirclement → objective. Original T/L cells, phrase and state gates remain pinned by tests. East-side clue IDs/labels swapped together; bridge still requires those same three reachable records. |
| Close/reopen/reset | Letter and reflection cursors use separate maps. Letter cursor retained per clue; reopening final page still requires explicit reflection action. Session start replaces progress and calls `resetDrafts`, clearing both cursor maps and puzzle drafts. Dialog open/close clears active narrative; a queued old close cannot clear a new open panel. |
| Modal pause and focus implementation | Uses existing single native dialog, preserves outside opener, blocks scene through modal callback, and explicitly focuses new page heading after replacing page controls. Paper→reflection keeps dialog open/input blocked. Runtime keyboard/focus behavior belongs to browser QA. |
| Vietnamese fonts and text | Local Lora/Patrick Hand TTFs and both OFL notices present. Bootstrap awaits both Lora weights and handwriting font load attempts before session/Canvas creation. Baked map labels use Lora 600; DOM prose/headings and affected SVG labels use local serif; Windows HUD/SVG system sans remains Segoe UI. Native selectable paragraphs, NFC helper and no character-span splitting. Tests confirm authored text NFC; actual glyph attachment remains a visual check. |
| Main-game/save isolation | Separate `chapter-four.html` module entry; trial state and cursors held in memory. Trial imports existing audio, character and geometry helpers, with no main session/save-store/storage dependency or write path. Fonts/CSS imported only by trial entry. |

## Verification evidence

- Independently reran **`npm test`: 44 passed, 0 failed, skipped, cancelled or todo** (1.32 s runner duration). Includes real reducer/controller negative gates, immutable/idempotent transitions, original puzzle outputs, whole rule progression, world reachability, input interruption and main-game/save tests.
- Read tester's `letters-rules-qa.md`: focused 21/21 and production build exit 0, both HTML entries emitted. Verified current `dist` contains both entry files and both bundled font assets. Did not rebuild during concurrent production browser QA or claim an independent build run.
- Source review establishes no unsafe HTML insertion in new story UI: `element` uses normalized `textContent`; sources are authored fixed HTTPS links and external links carry `noopener noreferrer`. No new backend, credential, user-data transfer or persistence surface.
- Visual/font baseline and screenshots, 375px/200% layout, offline font requests, cursor reset in actual dialog, focus return and full bridge/puzzle/chest journey are assigned to browser QA. Static reasoning and the controller harness cannot prove those properties alone.

## Unresolved questions

None requiring user input. Integrate the separate browser QA result before final acceptance.

Status: DONE
Summary: Implemented contracts pass independent code review and fresh 44-test run; no product fix requested.
Concerns/Blockers: No code blocker. Browser acceptance evidence remains owned by the controller/QA task.
