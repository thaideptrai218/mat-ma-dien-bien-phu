# Character runtime implementation

Status: DONE_WITH_CONCERNS — runtime implemented; actual asset, manifest and browser verification owned by root remain pending.

## Changes

- `src/game/character-atlas.js`: pure measured atlas layout; canonical `quang-reference`; 160×192 cells, .5 display scale, ground at (80,176); direction rows down/left/right/up. Idle column0, walk1–4 at8fps, run5/6/7/6 at12fps. Every pose uses one uniform transform from the common source crop and ground anchor.
- `src/game/character-animation.js`: Phaser image/JSON preload, synchronous Canvas packing after preload, per-Game texture/animation reuse, no generated placeholder. Rejects dimensions/metadata mismatch, empty tiles, alpha touching tile borders and alpha outside measured crop. Scoped loaderror listener is detached after create and teardown; disposed scenes cannot register animations. Diagnostic exposes detached primitive character data.
- `src/room-one/scene.js`: inherited preload covers all five scenes. Canonical texture/frame0/down-facing spawn. Source body48×32 at offset56,160 with origin(.5,176/192) and scale.5 yields unchanged world24×16 centered on player. Post-physics displacement selects idle/walk/run; clear/blur/modal/hidden-tab paths idle and report blocked motion through existing audio contract. Live cached MediaQueryList.matches holds directional idle under reduced motion; movement remains unchanged. Loading/validation failure pauses physics and shows visible reload instruction without constructing a missing-texture player.
- Two focused test modules cover clips, shared transform, collider math, missing-asset failure, duplicate registration, lifecycle cleanup and diagnostic detachment.
- Final cell width updated to160 after measuring generated running strides; center anchor becomes(80,176) and body offset(56,160). This preserves the exact physical footprint while allowing natural character height without clipping wide running legs.

## Asset contract

Root supplies `assets/characters/quang-reference/motion-sheet.png` and `manifest.json`:

```json
{
  "columns": 8,
  "rows": 4,
  "sourceWidth": 2048,
  "sourceHeight": 1536,
  "crop": {"x": 40, "y": 24, "width": 176, "height": 330},
  "anchor": {"x": 128, "y": 352}
}
```

Numbers above illustrate the schema, not actual asset measurements. Source dimensions must match decoding and divide the grid into integer cells. Crop is one common tile-local integer union containing every alpha pixel. Anchor is a measured common horizontal center and ground baseline; it may fall below visible feet, retaining flight lift. The maximum common uniform scale fits a two-pixel output margin and maps the anchor to (80,176).

## Verification

- Focused command `node --test tests/character-atlas.test.js tests/character-animation.test.js`: 11/11 pass.
- `node --check src/room-one/scene.js`: pass.
- `npm test`: 221/221 discovered tests pass. Auto-discovery repeats baseline test names; focused new-file count is11.
- `git diff --check`: pass; repository emits standard LF→CRLF notices.
- No input, save, audio controller, world geometry, puzzle, donor checkout or preserved Bảo source modifications.
- Build and browser visual/actual-motion checks await root-provided image/manifest. Tests do not claim Phaser browser integration or visual asset approval.

## Unresolved questions

None requiring user input. Actual grid/alpha/ground metadata and final browser/reviewer evidence remain integration work.

