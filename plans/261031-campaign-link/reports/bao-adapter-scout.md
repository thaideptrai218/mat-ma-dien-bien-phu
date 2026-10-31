# Bảo Room 2 adapter scout

Date: 2026-10-31. Status: DONE. Read-only source inspection; no game code, donor, browser, installs, or saves changed. This report is the sole authored file.

## Recommendation

Use canonical `RoomOneScene` and `RoomOneUI`, with a new Room 2 session, state reducer, and small dialog facade. Reuse Bảo's actual `PuzzleView`, `NarrativeView`, `createRoomTexture`, Room 2 data, and pure evaluators. A second Phaser engine or iframe is unnecessary: scene/world injection and panelFactory injection already exist. Do not import donor GameSession, AdventureScene, main, storage, or navigation actions into the running campaign.

Protected donor: `<USER_HOME>/mat-ma-dien-bien-phu-bao`, HEAD `5ff03c241a35bfe4137bc8fd5bebd43079450648`. Its working tree contains the authorized Vietnamese font fixes, including modified room-art/CSS and untracked font helpers. Copy current files, not only git HEAD. Canonical already has compatible local font helpers, DOM helpers, geometry and image assets.

The smallest low-risk preservation boundary is a local donor snapshot under `src/room-two/bao/`, with only import-path adaptation. Full story/world registries can remain inert data in the snapshot; only `navarre-plan` is exposed by the room-two facade. No museum/Him Lam/command-post/peace scene is registered or navigated to. This is safer than manually retyping seven clues, their narrative beats, four puzzles, hints, success/error text and SVG logic. If extracting only Room 2 data, compare every selected object against the donor programmatically.

## Concrete files and dependency closure

Suggested donor snapshot files, preserving implementation except imports:

- `src/room-two/bao/content/story-data.js`: all data/helpers as donor, including generated clue beats and requiresPuzzleId assignment. Room 2 projection exposes only the seven clues, four puzzles, intro/outro and their referenced sources.
- `src/room-two/bao/content/world-data.js`: geometry as donor; facade exposes only `maps['navarre-plan']`.
- `src/room-two/bao/ui/puzzle-view.js`: actual balance/interleave/fist/fold SVG, controls, drafts and feedback.
- `src/room-two/bao/ui/narrative-view.js`: actual original read/record flow; import portrait/emblem from canonical `assets/images/`.
- `src/room-two/bao/ui/puzzle-styles.css`, `narrative-styles.css`: current font-fixed versions. Scope auxiliary donor form/button rules inside the Room 2 modal; do not import whole donor `styles.css`, which would restyle the canonical shell.
- `src/room-two/bao/game/room-art.js`: actual original Canvas room illustration; point `GAME_FONTS` import to canonical helper.
- `src/room-two/bao/core/game-rules.js` plus `save-validation.js`: required if preserving existing evaluator imports verbatim. Import only `evaluatePuzzle`, `checkFistMove`, `currentPuzzleId`, `normalizeAnswer`; do not call old applyAction or old save validation. Alternatively extract those four functions and their tiny private helpers without changing behavior, and adapt PuzzleView's import.
- Existing canonical `src/ui/dom-elements.js` supplies precisely the donor `element/button/paragraph/field/actions` signatures. Existing canonical `src/ui/game-fonts.js`, local fonts and `src/core/world-geometry.js` suffice. Do not duplicate font files or replace shared helpers.

Suggested new integration files:

- `src/room-two/content.js`: restricted data/evaluator facade plus provenance; exports chapter, clues/beats/puzzles/sources and puzzle order.
- `src/room-two/world.js`: RoomOneScene-compatible donor map projection.
- `src/room-two/scene.js`: extends RoomOneScene, supplies donor art and dynamic original exit gate.
- `src/room-two/rules.js`, `save.js`: room-local progress and validation; campaign integration uses actual Room 2 progress, not donor legacy milestones.
- `src/room-two/panels.js`, `ui.js` or `dialog-adapter.js`: mount original donor panels in RoomOneUI; canonical notebook/settings/map remain available.
- `src/room-two/session.js`, `actions.js`: context guards, narrative completion, donor evaluation, audio and campaign transition.
- `src/room-two/main.js`, `styles.css` and a route entry if the campaign uses the existing multi-entry architecture. Await `loadGameFonts(document.fonts)` before constructing scene.

Campaign-owned route/progress files will additionally link canonical rooms 1/2/3/4/5. Keep their ownership outside donor snapshot modules.

## Exact renderer contract

`PuzzleView` is the only export from donor `ui/puzzle-view.js`:

```js
new PuzzleView({ dialog, getState, onIntent });
puzzle.show(puzzleId, { focus }); // focus is optional CSS selector
puzzle.showFeedback(text, tone); // error(default), success, hint
puzzle.clearDrafts();
```

`renderBalance/renderInterleave/renderFist/renderFold` are instance methods but rely on their class's `show`, draft and feedback lifecycle. Reusing the whole class preserves its behavior better than invoking four render methods independently. Drafts are a Map by puzzle ID, maintained across HUD render and close/reopen; clear on reset. `show()` reconstructs solved answers from answerSpec after reload. Wrong fist region preserves prior moves; correct pair out of turn resets the hand. Fourth valid move emits submit automatically.

Minimal `getState()` projection:

```js
{
  chapterId: 'navarre-plan',
  completedPuzzleIds: [], // exact valid prefix of the four donor IDs
  completedRoomIds: [],   // ['navarre-plan'] only after final fold
  discoveredClueIds: [],
  collectedClueIds: [],
  hintLevels: {},
  completedBeatIds: []    // used by NarrativeView/controller
}
```

No old room IDs or museum beat need to be fabricated for these renderers/evaluators. HUD can receive a separate canonical projection, e.g. `collectedNoteIds = collectedClueIds`, `seenObjectIds = discoveredClueIds`, with actual goal/steps/count.

Dialog facade requirements:

```js
dialog.show({title, kicker, content, focus, variant});
dialog.close();
```

Implement show through `RoomOneUI.show('bao-content', data)` and its injected panelFactory. Panel factory returns `{node, afterOpen?, cleanup?}`; `node` contains title/kicker and the original `content` DOM, `afterOpen` honors provided focus when connected. Keep one native dialog and canonical modal-open/modal-close callbacks so movement/audio pause consistently. Canonical show also focuses first input/select after opening; fist focus requests target that same first select. Canonical dialog class can include original `vn-dialog` when variant requests it; retain `r1-modal` and Room 2 scope. Do not instantiate old DialogController, which assumes `#game-dialog/#dialog-content/#game-host` shell nodes.

Additional document hooks from PuzzleView: a connected hidden live region `#game-announcement` is mandatory (announce writes without null guard); `game-open-notebook` CustomEvent must open the Room 2 notebook. The class also queries its own `#sequence-cards`, `[data-item-id]`, and `#puzzle-feedback`; only one puzzle panel should be mounted at a time.

Emitted intents:

| Intent | Payload / handling |
| --- | --- |
| `submit-puzzle` | `{puzzleId, answer}`; require active puzzle view/ID, current prefix step, all required recorded clues; evaluate then commit |
| `use-hint` | `{puzzleId}`; increment bounded hintLevels, show original hint through showFeedback; first radio hint exposes highlighter |
| `play-cue` | `{kind}`; original weight/static/chain/fold/unlock/error cues; dispatch locally |
| `collect-clue` | `{clueId}` from NarrativeView only at final line; validate active clue/beat and discovery |
| `complete-beat` | `{beatId}` from NarrativeView; validate active beat and final line |

`finish-peace` exists in unused PuzzleView.showPeace but must not be exposed in Room 2. Notebook should only offer discovered clues/beats for reread; rereading an unrecorded clue must still allow final record. Clear NarrativeView active cursor when closing/replacing/resetting. Its `.getActive()` returns `{beatId, clueId, lineIndex, lastLine}` and `.clear()` invalidates it. It directly calls dialog.close when rereading already collected clues.

## Evaluators and state mapping

Donor exports `evaluatePuzzle(id, answer, collectedClueIds) -> {ok,messageKey}`, `checkFistMove(id,moves) -> {ok,done,error,index?}`, `normalizeAnswer(string)`, and `currentPuzzleId(state)`. Evaluation validates clues but does not enforce previous-puzzle completion; the new reducer must enforce exact prefix independently. `currentPuzzleId` returns first unsolved, or final puzzle after all solved.

Do not reuse donor `applyAction`, `canEnterChapter`, or `validateSave` for the campaign. Those encode `museum-intro`, old `roomOrder=['him-lam','navarre-plan','command-post','peace']` and original room completion prefix. Calling them from canonical Room 1 would require inventing old museum/Him Lam completion and unrelated clue records.

Recommended local persisted fields: version, introSeen (or completedBeatIds), discoveredClueIds, collectedClueIds, completedPuzzleIds, completedBeatIds, hintLevels, exitReached and audio preferences. Validate known unique IDs, collected subset discovered, recorded clue ↔ completed clue beat, exact solved prefix, each solved puzzle's recorded clues, outro only after all puzzles, and exitReached only after fold. Fragment II can be derived from valid final-fold completion. Never persist DOM, active cursor, input drafts, actor position or audio nodes. Either use a campaign-owned nested room-two state or its own new canonical key; never read/write Bảo's `mat-ma-dien-bien-phu:save:v1` key.

Original answers and own-clue dependencies:

| ID | Type / required clues | Exact answer shape |
| --- | --- | --- |
| `nava-balance` | balance / `nava-planner` | `{cardSteps:{'defend-north':'step-1','attack-south':'step-1','move-north':'step-2','decisive-win':'step-2',withdraw:'none'},northWeights:44}` |
| `nava-radio` | interleave / `nava-radio-note` | `{french:'TAPTRUNG',vietbac:'PHANTAN'}`; accents/spaces/punctuation ignored, channels matter |
| `nava-fist` | fist / `nava-diary,nava-newspaper,nava-allied-telegram,nava-calendar` | `{moves:[{card:'lai-chau',region:'tay-bac'},{card:'tha-khet',region:'trung-lao'},{card:'nam-hu',region:'thuong-lao'},{card:'kon-tum',region:'tay-nguyen'}]}` |
| `nava-fold` | fold / `nava-dbp-dossier` | `{target:'dbp',code:'0612'}`; code `06/12` normalizes, `612` fails |

Preserve original feedback selection: missing-clues has controller text, wrong-target uses selected target.hint, other message keys use puzzle.messages then original generic fallback. First three success cases reopen solved current panel with successText and next-step toast. They do not auto-open the next station.

## Exact world projection and scene API

```js
const donor = maps['navarre-plan'];
const WORLD = {
  ...donor,
  objects: [...donor.interactables, ...donor.exits],
};
```

Keep original `interactables` too: donor Canvas art iterates them, while canonical scene/minimap uses `objects`. Geometry is frozen in donor; build a new outer object, don't mutate it. Keep all props, walls, labels, zone tints and theme unchanged. Canonical collision helper already treats donor props (solid omitted) as solid, matching donor.

Map is 2400×1440. Entry `(580,350)`, hall `(1120,680)`, archive `(600,1080)`, east `(2070,720)`. Canonical scene currently spawns only `checkpoints[0]` and does not track donor checkpoint entry. Restoring at entry follows current canonical rooms; preserving donor checkpoint saves needs explicit scene support rather than pretending it already exists.

| Clue stable ID | Position |
| --- | --- |
| `nava-planner` | 530,270 |
| `nava-calendar` | 1160,260 |
| `nava-radio-note` | 2150,200 |
| `nava-diary` | 285,1040 |
| `nava-newspaper` | 1250,1060 |
| `nava-allied-telegram` | 1950,1080 |
| `nava-dbp-dossier` | 1765,790 |

Each clue radius is 180. Station radius is 150:

| Station stable ID | puzzleId | Position |
| --- | --- | --- |
| `nava-balance-station` | `nava-balance` | 250,330 |
| `nava-radio-station` | `nava-radio` | 1950,300 |
| `nava-fist-station` | `nava-fist` | 1470,690 |
| `nava-fold-station` | `nava-fold` | 1710,730 |

`navarre-plan-exit` at `(2290,680)`, radius 150, gate `[2208,532,24,296]`. Keep actual exit ID/geometry but ignore donor toChapterId=`command-post` in the adapter; new campaign transition points to canonical Room 3. No remote station/clue activation from minimap. Scene uses nearest target plus wall-only line of sight; session should recheck nearby ID/radius before opening.

Canonical scene injection:

```js
super(callbacks, {
  world: WORLD,
  artFactory: (scene, world) => createRoomTexture(scene, world),
  sceneKey: 'room-two',
  textureKey: 'room-navarre-plan', // actual donor returned key; teardown must match
  initialGoal: 'nava-planner',
});
```

Callback API: `{onInteract(id),onPosition(position),onShortcut(key),isPaused(),audio}`; optional onReady(scene). Scene methods: setGoal(id),focus(),clearKeys(),getPosition(),getSnapshot(),resetPosition(). Add original gate collider/graphics in subclass create after super; update gate body.enable and art visibility from completed fold; restore correct state after scene readiness. Donor art itself does not render/remove this gate. Its createRoomTexture returns `room-${map.id}` and ignores canonical third texture-key arg.

Canonical RoomOneScene retains shared character, responsive Phaser, Shift/M/N/Q controls and mini-map. This is integration shell behavior; donor map/puzzles/texts remain exact. Avoid stale async focus/callbacks after navigation/reset. Tear down listener `game-open-notebook` when session ends.

## Final fold, outro, fragment II, exit

Actual donor sequence in `app/game-actions.js`:

1. Submit fold and evaluate correct `target='dbp'`, normalized `code='0612'`, own clue recorded and previous puzzle solved.
2. Old reducer appends `nava-fold`; all four solved appends `navarre-plan` to completedRoomIds. Gate body becomes disabled immediately.
3. Play unlock cue. Success text says hòm opens and “mảnh ghép thứ hai”. Controller opens `navarre-plan-outro` automatically if not completed; three original lines remain unchanged.
4. Completing final narrative line records outro; it closes and focuses map. Donor outro is not an exit prerequisite: Esc can close early, but room/fold remains completed.
5. Walk to eastern exit and interact. Old donor changes to old `command-post`; new adapter must instead mark exitReached and invoke campaign Room 3 transition.

There is no `fragmentII`, `fragmentCollected`, `fragments`, or fragment inventory field in donor state. Fragment II is already awarded in original final-fold success/outro prose. Recommended campaign event: idempotent II award on validated final-fold commit (not on entering room, collecting a clue, or navigating directly to Room 3); derive/migrate this from valid completed Room 2 fold. Physical exit separately marks room exited and advances campaign. Do not add a new fragment-collection puzzle or extra chest step absent from Bảo's flow. Room 3/4 still award their own actual fragments.

## Verification for the adapter

- Compare donor-selected chapter/clues/beats/puzzles/map deeply with local facade; preserve original answers, hints, source metadata, seven clue coordinates and four station IDs.
- Pure tests for own-clue requirements, exact puzzle prefix, wrong answers, missing recording, hint bounds, duplicate awards, malformed restore, and II only from validated fold.
- Verify renderer behavior in browser: all four exact controls/SVG, first radio hint highlighter, wrong fist region vs wrong turn, final auto-submit, fold preview and `0612` leading zero, original outro and real exit.
- Check canonical focus pause/fresh keydown, live announcement node, notebook reread, solved panels after reload, narrow screen/SVG fonts, map furniture/gate collision and campaign progression.
- Old donor currently has 17 game-rules tests, eight specific to Room 2; those test the old whole-game state. Reuse assertions/evaluator cases without manufacturing old campaign milestones. Scout did not run tests/build/browser.

Unresolved questions: None blocking the adapter. Full donor checkpoint-resume behavior is an optional fidelity choice beyond current canonical safe-entry restoration; do not claim it without implementing it.
