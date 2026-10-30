# Technical plan review — PDF 4 rebuild

Status: **READY — AWAITING USER CONTENT**. Reviewed 2026-10-30 before product implementation. No product/source edits or route deletions performed by this task.

## Scope and evidence

Read primary README, current architecture/code standards, PDF audit and code scout; read Bảo README, reducer, save validator, puzzle view, scene and map/story definitions. Primary `CLAUDE.md` absent. Completed older plans have no blocking unfinished work. Plan uses `ck:plan` and CLI scaffold; no external research performed.

Latest user steering supersedes proposed historical defaults: **stop web research; user will supply historical content**. Product content may use supplied PDF 4 and forthcoming user material only. Existing web research must not be carried into the product. No assumed four-campaign list, `2413` answer, cipher text or Room 3 puzzle evidence selected. Technical architecture is ready; content implementation and map retirement wait.

## Scout conclusions

- Canonical old campaign, separate `chapter-four.html` app and executable wireframe are three distinct active routes. Hiding links cannot remove them; fresh build must remove stale outputs.
- Protected Bảo Room 2 ID is `navarre-plan`, with four-step `balance → interleave → fist → fold`, seven clues, full authored story/dossier and a concrete 2400×1440 map. Primary `campaign-map` is not this room.
- Bảo reducer/UI/save/app/audio form a compatible dependency set. Porting its four puzzle data records into primary's old reducer would break behavior. Extract protected content first, then port compatible systems and replace other campaign registries.
- Font fix includes local Be Vietnam Pro/Lora files, `game-fonts.js`, CSS and load-before-Phaser barrier. Copy assets/contracts to primary; do not modify donor.
- Same legacy v1 key across two variants is unsafe for this new campaign. New namespace and new registry validation required; no legacy inference.

## Shared implementation contracts

1. `story-data.js` remains public facade exporting `chapters`, `chapterOrder`, `roomOrder`, `clues`, `beats`, `puzzles`, `sources`, plus `FRAGMENT_ROOMS = ['foundation','navarre-plan','preparation','victory']`. Split large data into chapter modules and protected `content/bao/`.
2. Chapters keep `id`, titles/period/summary/objective, `clueIds`, `puzzleIds`, `introBeatId`, `outroBeatId`, `nextChapterId`. All seven chapters have map IDs. `roomOrder` contains five room IDs, excluding museum/ending. Count fragments by intersection with `FRAGMENT_ROOMS` only.
3. Puzzles keep Bảo contract: `id`, `chapterId`, `type`, `requiredClueIds`, `requiresPuzzleId`, instructions/hints/feedback and `answerSpec`. New pure evaluators exported through `src/core/puzzles/puzzle-evaluators.js`; `evaluatePuzzle` performs lookup/common clue checks, then dispatches by type. Existing Bảo normalization/error behavior remains. New answer schemas are defined with actual user puzzle material before implementation.
4. UI uses a type renderer registry with per-type draft creation, answer serialization, render/update behavior. Preserve Bảo solved-draft reconstruction, in-session drafts, clue evidence and focus semantics. Add new puzzle modules rather than extending its already large view with every type. Semantic DOM/text nodes; no unsanitized narrative HTML strings.
5. Clues keep `id`, `chapterId`, `beatId`, source references and existing text. Optional `documentId` links to `documents` registry containing `{id,title,kind,dateLabel,byline,pages:[{paragraphs:[]}],sourceIds}`. Documents are paper UI; deduction remains a VN beat. Document ID/phase/final page and active clue/final deduction line gate collection. Protected Bảo clue wording remains unchanged; no replacement invented dossier.
6. Map facade exports `maps` matching chapter IDs and existing dimensions/walls/objects/checkpoints/interaction contracts. New layouts may add visual zone/theme metadata, not independent progression rules. Scene asks controller whether station/exit is usable; reducer is authoritative. Sprint/M/N/Q only on focused canvas, no global interception inside forms.
7. `completedPuzzleIds` remains authoritative for sequential steps. Historical room completion requires all puzzles. Peace contains picture-assembly puzzle, which sets its completion flag; then a separate authored reflection beat completes `peace-outro`. No required free text, scoring or stored private reflection. `enter-chapter ending` and save validation explicitly require that beat; five completed rooms alone are insufficient.
8. Key `mat-ma-dien-bien-phu:save:pdf4:v1`; keep versioned ID-only schema and settings. Validate current IDs, room prefix order, puzzle predecessors, all required collected clues, clue/beat atomic completion, room/puzzle equivalence and ending guard. Do not import old inferred puzzle completion. Safe checkpoint fallback remains map-driven.

## File ownership after content arrives

| Owner | May change | Must not change |
| --- | --- | --- |
| Content/evaluators worker | `src/content/story-data.js`, new per-stage/document/source modules, `src/content/bao/*`, `src/core/puzzles/*`, focused new evaluator/content tests | World modules, `src/core/game-rules.js`, save/app/UI |
| World/input worker | `src/content/world-data.js`, `src/content/worlds/*`, `src/game/adventure-scene.js`, room art/helpers, scene input, world reachability tests | Story registry, app/core save/rules, UI |
| UI worker | `src/ui/*`, `src/styles.css`, new puzzle/paper/map/final-room views and styles | `src/app/*`, core rules/save, story/world registries, main/HTML/Vite |
| Controller | `src/app/*`, root core rules/save/store, `src/main.js`, `index.html`, Vite, donor baseline/assets, legacy deletion, integration tests/docs/review | Separate Bảo checkout; other workers' active files without coordination |

Each worker receives exact read/modify paths, acceptance criteria, primary work context and this reports directory. Workers are not alone; no reverting others' edits. Content IDs/contracts land before world/UI binding. Controller coordinates any cross-owner adjustment.

## Review findings and resolutions

| Concern | Resolution / evidence |
| --- | --- |
| Fifth room wrongly means fifth piece | Separate `FRAGMENT_ROOMS`; test HUD and state with all five completed flags. |
| Existing `canEnterChapter` count unlocks ending too early | Add explicit `peace-outro` requirement in reducer and validator. Bảo source currently relies on chapter index/completed-room length. |
| Old `finish-peace` expects only three previous rooms | Replace old special action with picture-puzzle completion plus separate reflection beat; test forged direct actions. |
| Shared donor registry hides dependencies | Extract by ID with closure; deep-compare seven clues/beats, four puzzle records and concrete map, allowing only outbound route linkage. Preserve evaluation tests. |
| New states accepted from old saves | Distinct key; remove donor legacy puzzle-inference compatibility from new namespace. |
| Documents auto-collect from closing or stale callback | Active reader/beat identity, phase and final cursor checked at intent boundary; no collection on close. |
| Crossword source has 15 cells for 16-letter answer | Add trailing cell only; keep starts and common column 8. Mark as source artwork repair. |
| Right grid accidentally copied from old trial | Use PDF `ULTAV` row 2; compare exact 6×5 grids and solution coordinate paths. |
| Deleting old routes before content replacement leaves broken app | No deletion this turn; retire only after coherent replacement and validation. |
| Existing historical defaults exceed latest user instruction | Withdraw all defaults; no new research or authored historical content. Await user supply. |

## Verification and rollback

Before integration capture donor Room 2 invariants and current working-tree state. Preserve generic geometry/audio tests and donor font tests; add puzzle predecessor/clue checks, complete new route, save-forgery rejection, final-room ordering, four-piece accounting and reachable station/exit/checkpoint tests. Browser play must use visible controls through all rooms, confirm ending, reload/reset, document final-line gating, map controls, keyboard/modal focus, audio, Vietnamese SVG/Canvas/paper text, narrow viewport and offline assets. Unit route simulation alone is insufficient browser evidence.

Run narrow tests first, then suite and production build once integration changes shared contracts. Fresh build and dev/preview route checks prove retirement. Any failing preservation or route check blocks delivery; fix concrete cause. Roll back only task-owned canonical edits; never reset unrelated user changes, wipe storage wholesale or alter Bảo donor/process. No push, deployment or PDF publication.

## Unresolved content needed

- Room 1: supplied history; torn-letter full wording and cuts, campaign names/dates/cards/symbols, A-03 evidence, intended drawer code, telegram/substitution table and accepted identity/box keyword.
- Room 3: complete historical source material and intended puzzle evidence/mechanics/answers. PDF has narrative requirements but blank detail pages.
- Any additional user stage 1 history or corrections to the supplied PDF to incorporate.

These are content dependencies, not an approval request. Technical plan ready; dependent implementation awaits user material.
