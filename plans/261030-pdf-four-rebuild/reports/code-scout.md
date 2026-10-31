# PDF 4 rebuild: active-code scout

Date: 2026-10-30. Read-only source/process inspection; this report is the only file written. Primary: `<USER_HOME>/mat-ma-dien-bien-phu`. Bảo source: `<USER_HOME>/mat-ma-dien-bien-phu-bao`.

Latest steering overrides wholesale old-map removal: preserve Bảo's functional **Bàn cờ Đông Dương / Room 2**, map included; preserve separate Bảo worktree and font fix. Rebuild other stages in canonical primary from PDF 4. No Git publication.

## Active old routes and content to retire

1. `/` or `/index.html` → `src/main.js` → `GameSession` + `AdventureScene`. Its old campaign is `museum → him-lam → campaign-map → command-post → peace → ending`. Maps are six concrete records in `src/content/world-data.js`, including museum/end museum and four near-identical 2400×1440 bunkers. `src/content/story-data.js` owns old dialogue, clues, sources, answers and chapter order. These data cannot remain the active main campaign.
2. `/chapter-four.html` → `src/chapter-four/main.js` → `TrialSession` + `TrialScene`. Entire independent app uses the PDF 3/letters map and old story. Vite explicitly lists `main` AND `chapterFour` in `build.rollupOptions.input`. Remove the old HTML, its explicit Vite input and `src/chapter-four/` tree, rather than only hiding a link. Directory contains `main.js`, `archive-world.js`, `archive-art.js`, `story-data.js`, `letters-data.js`, `trial-actions.js`, `trial-input.js`, `trial-rules.js`, `trial-scene.js`, `trial-session.js`, `styles.css`, `styles/letter-styles.css`, and UI `dom.js`, `help-panel.js`, `letter-panel.js`, `map-panel.js`, `narrative-panels.js`, `puzzle-panels.js`, `trial-interface.js`.
3. `/docs/wireframe/index.html` is a third executable old Him Lam prototype, reachable directly through Vite dev even though not a production build input. It loads `room-art.js`, `sprite-animation.js`, `preview-audio.js`, `camera-preview.js`, `narrative-data.js`, `narrative-controller.js`, `wireframe.js` and `wireframe.css`. User's removal scope supersedes `docs/code-standards.md`'s old “prototype unchanged” sentence. Remove/disable executable prototype route and scripts if “all old maps” includes dev-accessible prototypes; retain PNGs in `docs/wireframe/assets/` if provenance documentation still links them. Historical reports/screenshots are not active maps.
4. Primary `dist/` currently contains both old `index.html` and `chapter-four.html`. Fresh build must replace generated output so preview cannot continue serving the retired chapter. Do not preserve stale generated HTML/assets by copying only a new entry over existing output.

Primary old application-specific files to replace/adapt: `src/app/game-session.js`, `game-actions.js`; `src/core/game-rules.js`, `save-validation.js`, `save-store.js`; `src/game/adventure-scene.js`, `room-art.js`; UI `game-interface.js`, `menu-views.js`, `narrative-view.js`, `archive-view.js`, `puzzle-view.js`, their three CSS files and `src/styles.css`; `src/main.js`, `index.html`. Keeping a helper filename is fine; keeping the old embedded content/answer branches active is not.

## Preserve Bảo Room 2 as functional source

**Important ID distinction:** Bảo Room 2 is **`navarre-plan`**, not primary's `campaign-map`. Do not preserve the latter as a substitute. Bảo's chain is:

`nava-balance → nava-radio → nava-fist → nava-fold`.

Its exact story/map content is embedded in shared files, not an isolated Room 2 folder:

- `src/content/story-data.js`: `chapters['navarre-plan']`, `navarre-plan-intro`, `navarre-plan-outro`; seven clue records and their `*-story` beats: `nava-planner`, `nava-radio-note`, `nava-diary`, `nava-newspaper`, `nava-allied-telegram`, `nava-calendar`, `nava-dbp-dossier`; all four `nava-*` puzzle records; shared telegram/fold data and source records they reference; footer code assigning `requiresPuzzleId` along each chapter's puzzle list. Keep full authored instructions, clues, hints, messages, answers, SVG/fold texts and source metadata. Update only surrounding new-stage links when integrating.
- `src/content/world-data.js`: `maps['navarre-plan']`, its shared bunker wall/checkpoint dimensions, `furniture('navarre-plan')`, seven clue positions, four station positions, theme, labels and two zone tints. Map is 2400×1440 and uses shared bunker factory. New outgoing destination may be adapted; do not recreate the retained room from a generic substitute.
- `src/core/game-rules.js`: `currentPuzzleId`, `normalizeAnswer`, `checkFistMove`, balance/interleave/fist/fold evaluator branches and state reducer with `completedPuzzleIds`, predecessor gating and “room complete only after every step.” Primary's reducer only supports sequence/campaign/telegram and would destroy this behavior.
- `src/core/save-validation.js`: per-puzzle state integrity, predecessor checks, room/puzzle completion equivalence, outro `requiresRoomCompletion`. Primary validator does not understand the Bảo chain.
- `src/ui/puzzle-view.js` + `puzzle-styles.css`: balance controls/SVG, interleaved tape and channel inputs, sequential fist board/feedback, fold SVG/target/lock-code controls, per-step recorded clue panel. All SVG helper functions are in this same JS file, not separate modules.
- `src/app/game-actions.js`: selects the current puzzle; respects station prerequisites; step-specific success/errors/cues; requires Room 2 outro before exit. `src/ui/game-interface.js`: HUD and puzzle routing use `currentPuzzleId`/per-step progress. `src/app/game-session.js`: controller contract expected by these modules. Preserve compatible `narrative-view.js`, `archive-view.js`, `dialog-controller.js`, `dom-elements.js`, CSS and HTML IDs (`#game-announcement` is used by puzzle announcements).
- `src/game/room-art.js`: Bảo room-specific scale/fist-table/chest/calendar/rack art, zone/label drawing and `GAME_FONTS` Canvas font. `src/game/adventure-scene.js` consumes the map. Keep shared scene/input geometry contracts.
- `src/audio/synth-voices.js` includes puzzle sound kinds `weight`, `static`, `chain`, `fold`, `unlock`, `error`; keep Bảo version with `audio-controller.js`. Copying only primary synth would lose retained puzzle cues.

Lowest-risk integration recommendation: canonical primary retains Bảo's compatible engine/UI/puzzle implementation and Room 2 data, while replacing every other active old stage/story with PDF 4. Do not copy Bảo's entire content registries unchanged: that would reintroduce its old Him Lam/command-post/peace/museum stories. Do not edit/remove the separate Bảo worktree. Archive/report old proof as historical; no commit/push/deploy requested.

## Independent reusable modules and fonts

- Primary `src/core/world-geometry.js` is content-independent; exports movement normalization, collision rectangles, body dimensions, checkpoint fallback, interaction line-of-sight and flood reachability. Keep this contract and re-run on new maps.
- `src/game/character-animation.js` draws a four-direction character with reduced-motion variants; no map/story imports. Internal `minh-*` texture keys are technical names, not a stage dependency. Reuse unless new art is required.
- `src/game/scene-input.js` is generic focused-canvas WASD/arrows/E input with interruption/repeat safeguards. Adapt new map controls if needed. Chapter-four input has sprint and map shortcuts but belongs to retired tree; salvage deliberately only if needed.
- `src/ui/dom-elements.js`, `dialog-controller.js` provide reusable DOM/modal behavior. Preserve native focus, textContent safety and interruption handling while binding the new shell.
- Existing emblem/portrait PNGs and source/license assets can remain independent of removed maps.
- **Port Bảo font fix:** `src/ui/game-fonts.js`, `src/ui/font-styles.css`; `assets/fonts/BeVietnamPro-Regular.ttf`, `BeVietnamPro-SemiBold.ttf`, `BeVietnamPro-Bold.ttf`, `lora-variable.ttf`, `lora-italic-variable.ttf`, `be-vietnam-pro-OFL.txt`, `lora-OFL.txt`, `README.md`. `src/main.js` must await `loadGameFonts(document.fonts)` before creating Phaser; import font CSS; use `DBP Text` / `DBP Display` for body, display, SVG and Canvas. Bảo `room-art.js` already does this. Primary main currently uses system fonts; old chapter-four uses Lora/Patrick Hand under separate Trial families. Keep Patrick Hand/license only if the new paper-reader intentionally uses it; font files themselves are not old maps.

## Save contracts and incompatibility

Both worktrees currently use the **same key** `mat-ma-dien-bien-phu:save:v1` and schema `version: 1`. Primary state fields: `chapterId`, `checkpointId`, `completedRoomIds`, `discoveredClueIds`, `collectedClueIds`, `completedBeatIds`, `hintLevels`, settings (`brightness`, `reducedMotion`, `audioEnabled`, `audioVolume`). Bảo adds `completedPuzzleIds`; its old-compatible validator infers this field from completed rooms when absent. Registry IDs differ (`campaign-map` vs `navarre-plan`) despite same key/version.

Old checkpoint IDs such as `entry` are only validated as bounded strings in pure schema, then scene resolves safe declared points, falling back to `entry`. A new PDF campaign must not accept an old save merely because generic IDs match. Use a distinct new campaign key/schema/content identity (e.g. PDF 4 save namespace) and validate new chapter/puzzle IDs. Keep Bảo per-puzzle semantics for retained Room 2. Do not silently reinterpret primary's `campaign-map` solved state as Bảo's four solved puzzles. User requested restart, so offer new run under new contract; explicit retirement of known legacy key can be scoped without clearing unrelated localStorage.

`chapter-four` has **no localStorage persistence**; state and letter cursor live in its session. Its removal needs no key migration. Browser saves are origin-scoped, so changing dev/preview port does not migrate anything.

## Tests: port/remove versus retain

Primary `tests/game-rules.test.js` is entirely tied to old registry IDs/answers/four-room journey. Replace with PDF 4 journey tests; preserve only invariant test intent. Primary `tests/chapter-four-rules.test.js`, `chapter-four-letters.test.js`, `chapter-four-world.test.js` target retired module tree and must retire or deliberately port to PDF 4 behavior. Do not leave tests requiring deleted modules.

`tests/save-store.test.js`: keep storage failure/corrupt JSON/sanitization/idempotence guarantees; replace old museum/Him Lam fixtures and update version namespace. `tests/world-geometry.test.js`: keep diagonal normalization and generic connected-map/gated-exit/checkpoint checks; retarget registry and replace Him Lam coordinate assertions. `tests/audio-controller.test.js` is content-independent and should remain.

From Bảo, preserve Room 2 tests in `tests/game-rules.test.js` beginning around line 178: four-step gating, per-step clue requirements, balance 44/84, radio separation/normalization/channel distinction, fist wrong-region versus wrong-turn behavior, fold target/date `0612`, outro lock and `completedPuzzleIds` validation. Adapt initial surrounding journey fixtures only. Port `tests/game-fonts.test.js` unchanged where possible: font barrier for all weights/styles, asynchronous and synchronous failures, no FontFaceSet fallback. Do not copy Bảo's old four-room end-to-end test as current acceptance.

## Documentation and build claims to replace

Current active claims appear in `README.md`, `docs/project-overview-pdr.md`, `codebase-summary.md`, `system-architecture.md`, `project-roadmap.md`, `design-guidelines.md`, `deployment-guide.md`, `game-proposal.md`, `tech-stack.md`, `code-standards.md`. They claim old four rooms, dual production entries, PDF 3 separate trial, v1 save, 23/44 tests and prototype preserved. Rewrite current-state sections after actual implementation/QA; historical plan/journal reports can stay clearly historical. `README` links PDF v2/Word as primary story and must point current scope to PDF 4 as appropriate without exposing personal source paths.

`vite.config.js`: keep local strict port and Phaser chunk settings; remove old chapter-four input. `package.json`: current scripts `dev`, `build`, `preview`, `test`; no extra old stage command. Keep dependencies locked unless implementation requires change. Clean/fresh production build and inspect output/route behavior after deleting old entry.

## Scoped running processes

Inspection found **only** `127.0.0.1:4180`, PID **288** `node.exe`, command uses `<USER_HOME>/mat-ma-dien-bien-phu-bao/node_modules/.../vite/bin/vite.js preview --host 127.0.0.1 --port 4180`. Parent PID **3128** `cmd.exe` runs `vite preview --host 127.0.0.1 --port 4180`. No listeners on 5173, 5174 or 4173 at inspection. No process stopped. If stopping is needed later, re-identify exact PID/command first; do not kill all Node processes or delete Bảo. Running canonical primary on its normal free port avoids disturbing Bảo preview.

Status: DONE

Summary: Identified all three old executable routes, primary stale build output, Bảo Room 2 dependency closure, reusable font/audio/geometry/input assets, save collision and focused test/doc updates. Recommended new canonical primary preserving actual Bảo Room 2 behavior and separate Bảo worktree.

Concerns: PDF 4 content decisions belong to the PDF/story audit; this scout did not inspect source PDF. Existing docs' “preserve prototype” instruction is stale relative to latest user removal scope. Recheck listening PIDs before any later process action.
