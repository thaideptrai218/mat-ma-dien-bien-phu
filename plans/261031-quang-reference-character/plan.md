# Quang — reference character sprite and animation

Status: implemented; review GO,119/119 tests and five-entry build pass; final rebuilt browser QA accepted. Publication complete through [PR #3](https://github.com/thaideptrai218/mat-ma-dien-bien-phu/pull/3); [publication audit](reports/publication.md). [QA](reports/qa.md), [review](reports/code-review.md), [asset](../../assets/characters/quang-reference/README.md).

## Output and scope

Replace the procedural pixel character in the canonical five-room campaign and standalone previews with a local transparent raster sprite sheet based on the supplied illustrated student. Preserve dark brown wavy hair, rust/brown open overshirt, white T-shirt, beige trousers, pale sneakers and olive shoulder bag. No military uniform, scarf, weapons or new costume. Use built-in imagegen with the supplied image as identity/style reference. No historical research or changes to protected Bảo checkout, room content, world geometry, save or puzzles.

Target one eight-column/four-direction sheet: down/front, left, right, up/back; each row idle + four walk poses + three distinct running poses. Idle holds a natural pose, walk cycles four frames, run uses distinct contact/flight frames at a faster cadence. Four directional views keep bag/clothing continuity. If generated sheet geometry differs from requested canvas dimensions, use measured source grid metadata and a deterministic runtime Canvas atlas packing step; never hand-replace generated art with simple placeholder shapes. Maintain uniform per-pose scale and grid-centered body/ground reference; transparent whitespace can be normalized with one shared bounding region, not independent pose scaling. Validate every tile has alpha and no neighboring pose leaks.

Final local assets under `assets/characters/quang-reference/`, source/animation spec beside them or under the plan. Native reference file stays outside repo. Existing dialogue portrait may be aligned with the same design if generation supplies a suitable companion; principal acceptance is actual movement sprite/animation, not only a portrait or mockup.

## Integration

Current `src/game/character-animation.js` draws 20 procedural poses and creates quang-normal/steady animations. Shared `src/room-one/scene.js` creates a sprite using stale minh-normal key, then plays the Quang animation. Replace with a single canonical texture/key and explicit idle/walk/run clips. Add inherited preload for all five scenes; await sprite texture before creating the player. Reuse each Game's textures/animations without duplicates.

Target normalized atlas cell160×192 at .5 display scale, ground anchor(80,176). Keep world collider24×16 exactly: sourcebody48×32, offset(56,160), origin(.5,176/192). Shadow/camera/name stay at existing physical position; movement260/390 unchanged. Character visible height about80–90 worldpx, readable with room furniture. Animation follows actual post-physics movement; pushing walls, blur, modal and hidden tab must idle and stop footstep motion. Reduced-motion mode holds an appropriate idle frame while movement remains usable. Extend readonly snapshot with texture/frame/motion/body dimensions for real QA only, no setters.

## Ownership and work

- Root: asset generation/inspection, manifest/packing, final integration and browser evidence.
- Animation worker after reviewed plan: character module/shared scene plus focused tests, clear ownership agreed before edits. Do not alter donor/room2 preserved source, physics size, input, saves or audio.
- Reviewer: plan and final changed code, concrete evidence; no product edits.

## Verification

Focused manifest/frame/clip tests first, then existing105 regression tests and five-entry build. Inspect source and in-game sprites at normal scale and zoom. Actual WASD four directions, Shift distinct run, stopping, wall block, dialog/blur pause, camera follow, same24×16 collider and stable feet; previews/campaign reload and Room2 inherited scene smoke. Local assets decode, no black background or seams/clipping/blank frames. Review before handoff; update current character docs and existing PR only once verified. Keep source/frames matching the supplied style without claiming exact likeness to a real person.

Unresolved blocking questions: none; preserve existing top-down exploration and supplied outfit.
