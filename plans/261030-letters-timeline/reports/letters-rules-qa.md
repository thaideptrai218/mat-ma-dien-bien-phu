# Letter rules and controller QA — 2026-10-30

## Summary

PASS: focused chapter-four suite **21/21**, full project suite **44/44**, production build for both HTML entry points. Zero failed, skipped, cancelled or todo tests. Only test files and this report changed by this task; no product edits or Git operations.

## Changes and evidence

- Updated `tests/chapter-four-rules.test.js` fixtures to discover → complete letter → collect deduction. Full chronological progression still solves crossword → T/L boards → chest; original exact row IDs/offsets, `TIMTVAL`, cipher boards and phrase remain pinned independently of the new story order.
- Updated historical source contract to accept either an HTTPS source link or the local coursebook reference. Each clue still has three distinct Minh reflection lines.
- Added seven focused tests in `tests/chapter-four-letters.test.js` covering strictly increasing parseable dates, letter metadata, multiple pages and at least four prose paragraphs, separate Minh reflections, and NFC content.
- Tested current/future/unknown IDs, undiscovered completion, collection before letter reading, immutable state, repeated-action identity, prior-letter replay and independent fresh progress arrays. Reading the current letter alone does not expose the successor.
- Controller harness invokes the real `trial-actions.js` exports and reducer. Verifies undiscovered/future notebook reads and future map interactions, informative next-letter hint, final matching letter phase before reflection, final matching reflection before collection, wrong IDs and rejected commits producing no close/toast/focus success side effects.
- Existing geometry checks still prove all first-three-letter approaches reachable with bridge closed, HQ inaccessible until bridge unlock, and all clues/puzzles/chest reachable afterwards. Existing interruption test still verifies M shortcut, modal input block, Shift clearing and stale keyboard-repeat rejection.

## Commands and results

| Command | Result |
| --- | --- |
| `node --test tests/chapter-four-rules.test.js tests/chapter-four-letters.test.js tests/chapter-four-world.test.js` | 21 passed, 0 failed; 370 ms runner duration |
| `npm test` | 44 passed, 0 failed, 0 skipped; 1.88 s runner duration |
| `npm run build` | Exit 0; both `dist/index.html` and `dist/chapter-four.html` emitted; bundled Lora and Patrick Hand font assets present |
| `git diff --check -- tests/chapter-four-rules.test.js tests/chapter-four-letters.test.js` | Exit 0 |

Build warning: Phaser bundle remains 1,194.43 kB minified (318.49 kB gzip), exceeding Vite's 500 kB warning threshold. No unresolved import or build errors.

## Limits and remaining QA

No coverage percentage collected; evidence is behavioral assertions plus full suite/build. Controller harness does not substitute for native browser modal/focus/layout checks. Fresh-state tests verify reducer reset state, not actual UI cursor reset. Browser QA must check close/reopen page retention, reset cursors, keyboard/focus, 375px/zoom overflow, real Vietnamese font shaping, offline font loading and full manual route. Historical accuracy requires the separate sources review; NFC and increasing dates establish text/data invariants only.

## Unresolved questions

None. No test failure requires a product fix from this run.

Status: DONE
Summary: Intentional letter contracts tested; full automated suite and both-entry build pass.
Concerns/Blockers: Browser rendering/focus and source accuracy remain separate QA responsibilities.
