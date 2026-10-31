# Room 4 UI implementation

2026-10-30. Status: DONE. Local sources only; no web.

## Delivered

- RoomFourUI reuses RoomOneUI through optional subtitle/date/room-label/world/panel-factory configuration. Defaults preserve Room 1. Shared compact/full map accepts the actual world. Settings reset copy describes the current room.
- Whole paper reader reused unchanged, including source/fiction context, native selectable prose, scrolling and deliberate finish action. No excerpts or duplicated letter content.
- Crossword: seven full questions, seven native inputs, 17-column staggered preview. Answer contents appear from typing; canonical contents only after solution. Accented input preview maps Đ/đ correctly. Column deduction has 17 numbered native buttons; no correct-column highlight or keyword before solved.
- T/L boards: exact supplied letters in 6×5 native button grids. Selected cells show geometric reading order, a live letter reading and reversible toggles. Submit emits exact selected indices; progression belongs to session/rules. Final phrase form emits original input. Completion displays fragment IV and pending Room 5, with Room 1 link.
- Archival green, ivory, copper and restrained red accent. Existing local Lora/Be Vietnam Pro/Patrick Hand retained. Horizontal puzzle scrolling stays inside the diagram; board cells stay at least 44px wide. UI performs no movement or progression grants.

## Verification

Syntax checks pass for all touched JS. `npm test`: 28/28 at the UI checkpoint; integration tests were still being added by other owners. `npm run build` passes with both intended entries; existing Phaser bundle-size advisory remains.

Isolated Chromium panel harness at 375×812, plus 320px and 1440px checks. This validates UI contracts; it does not claim the full movement/progression route.

- Crossword: 7 inputs, 7 rows, 60 active cells. `Bị động` previews `BIDONG`. Render and same-view error feedback retain the original input node and draft.
- Column: all 17 buttons; unsolved view does not contain decoded keyword. Button 9 emits `column-submit {column:8}`. Compact/full maps both use `0 0 2800 1800`.
- Boards: 30 buttons. Exact T selection reads `QUYETCHIEN`; exact L reads `QUYETTHANG`. Toggle removes/re-adds a cell; submitted arrays match source sets. Render retains selection. At 320px, cell width 44.59px, dialog client/scroll width both 283px; no horizontal dialog overflow.
- All seven documents include every original paragraph and their fiction disclosure. Final Vietnamese phrase emits unchanged and survives render feedback.

Screenshots visually reviewed: [crossword mobile](ui-crossword-mobile.png), [board mobile](ui-board-mobile.png), [paper mobile](ui-paper-mobile.png), [column desktop](ui-column-desktop.png).

## Integration notes

Root owns full gameplay route, Room 1 smoke, final docs and source review. UI skill catalog read in required order; configured skill Python venv absent, so database search scripts could not run. Existing approved project palette/type/reader supplied design constraints. Project CLAUDE.md and docs/development-rules.md absent; supplied AGENTS rules applied.

Unresolved questions: none.
