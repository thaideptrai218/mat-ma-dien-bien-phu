# Room 2 implementation

Date: 2026-10-31. Status: DONE; parent browser/integration review pending. Ownership: `src/room-two/**`, `tests/room-two-*.test.js`, this report. No donor files, shared source, HTML, or other rooms edited.

## Result and public contract

- `session.js` exports `RoomTwoSession(root, options={storage,audio,isPaused,onExit})`. Explicit storage null stays null; default is standalone localStorage. Injected audio belongs to parent. Disposed/parent-paused controllers cannot act. `destroy()` returns the shared helper's cached promise. Parent pause covers scene and audio; stored pagehide/document notebook listeners are disposed.
- `rules.js` exports `createState`, `reduce`, `rendererState`. State is version 1, flat audioEnabled/audioVolume, discovered/collected clue IDs, completed puzzle/beat IDs, bounded hints, introSeen, fragmentCollected and exitReached. No museum/Him Lam fake achievements. Original renderers receive a projection with chapterId and derived completedRoomIds.
- `save.js` exports `SAVE_KEY='mat-ma-dien-bien-phu:room-two:v1'`, `sanitizeSave`, `loadSave`, `persistSave`. Restore sanitizes own clue/beat records and exact puzzle prefix, derives II from all four valid puzzles, and only retains exitReached after II. Stored inventory booleans cannot award II. No access to Bảo's original save key.
- `archive.js` exports `getArchiveEntries(state)` for earned full papers. Entry schema: `{id,room:2,title,kind:'clue',body,paragraphs:string[],source:string,fictionDisclosure:string}`. Paragraphs contain every original clue-beat line; body preserves the original summary. Entries and paragraph arrays are frozen; reading does not mutate progress. Source is original source titles joined for display.
- `main.js` imports local fonts, canonical styles and Room 2 CSS, awaits fonts, creates standalone session and links campaign/Room1/Room3. Read-only `window.getRoomTwoSnapshot()` returns cloned state, scene/audio diagnostics and current view. Root owns its HTML/Vite entry.

## Bảo preservation

Captured protected donor current working tree (font fixes included), HEAD `5ff03c241a35bfe4137bc8fd5bebd43079450648`. No donor write or reset. `bao/provenance.json` stores SHA-256 for the original story/world/rules/renderers/art/CSS and renderer bodies with import lines removed. All original hashes rechecked unchanged after implementation.

`bao/content/story-data.js` contains only navarre-plan chapter, its seven original clues and nine beats (intro/outro plus clue beats), four original puzzles and referenced sources. `bao/content/world-data.js` contains exact original Room 2 map. Independent `bao/donor-snapshot.json` is the donor-captured fixture used by deep fidelity tests. Original PuzzleView, NarrativeView and createRoomTexture have **import changes only**; original current font-fixed puzzle/narrative CSS copied verbatim. Original pure evaluator functions extracted without old progression/save reducers. No old map scene/navigation is activated.

Original map props/walls/labels/zones/stations/clues/checkpoints remain intact; canonical RoomOneScene receives the same geometry plus an `objects` projection. RoomTwoScene adds the original dynamic exit-gate body and bars at `[2208,532,24,296]`. Gate unlocks at final fold; real eastern door interaction commits exit and defers onExit in campaign. Original outro auto-opens at fold, and early close remains allowed. No new chest/pickup step or extra outro prerequisite added.

Canonical UI shell mounts original puzzle/narrative DOM through an injected panel factory, retains drafts, supplies connected #game-announcement, handles notebook events, and pauses motion in dialogs. The original seven clue stories must reach their final “Ghi manh mối” action to record; notebook can reopen discovered unfinished papers. Original mistake/success/hint text, balance SVG, tape highlighter, hand SVG, fold preview and automatic fourth fist submission remain in donor code.

## Verification

- `node --test tests/room-two-content.test.js tests/room-two-rules.test.js tests/room-two-actions.test.js`: **13 passed, 0 failed**.
- Deep fidelity compares every exposed chapter/clue/beat/puzzle/source/map object with captured donor snapshot; body hashes prove original renderers/art unchanged after imports; CSS hashes unchanged.
- Real map reachability with body clearance covers all original clues/stations and unlocked exit.
- Tests cover atomic recording, active final-cursor/controller guards, parent pause/disposal, exact puzzle prefix, own clue requirements, wrong balance/channels/fist/leading-zero code, II versus door, restore attacks/skipped steps/outro/hints, isolated storage failures and read-only full archive.
- Narrow Vite production compile of `src/room-two/main.js` with `write:false`: **passed**, 10 outputs, no dist mutation. All renderer/session/UI/scene imports resolved.
- Re-read original donor files and compared every manifest SHA after implementation: unchanged.

Parent integration checks still required: complete actual browser Room 2 path through all four stations/outro/exit, responsive/focus/audio behavior and campaign transitions/reload. No browser completion is claimed by these tests. Root is adding the donor-specific audio cue branches; Room 2 emits weight/static/chain/fold/unlock/error as requested.

Unresolved questions: None.
