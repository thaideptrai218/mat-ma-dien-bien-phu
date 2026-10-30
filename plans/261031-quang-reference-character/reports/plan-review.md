# Quang character plan review

Date: 2026-10-31
Decision: **GO for asset generation and scoped implementation.** Final implementation/asset QA remains required.

## Scope

Reviewed `plan.md`, README, code standards, shared character/scene/input/lifecycle code, Room 2–5 scene inheritance, session renderer configuration, snapshot entry points, and installed Phaser 3.90.0 Arcade Body source. Plan review only; no product code or asset edits. Recent git diff contains publication documentation; proposed character work is not implemented.

## Critical / high blockers

None in the proposed design. The atlas contract and collider math are compatible with current exploration mechanics.

## Verified contracts

- All five room scenes use `RoomOneScene`; later room classes do not override `preload()`. A base preload reaches all scenes without touching preserved Bảo source.
- Existing create uses stale `minh-normal`, then immediately plays `quang-normal`. Replace initial texture/frame together with registration; do not retain this missing-key path.
- Phaser Body scales source dimensions and offsets. For cell 128×192, scale .5, origin (64,176), source body 48×32, offset (40,160): world body is 24×16, top-left relative to player (-12,-8), center offset (0,0). Verified against installed `Body.updateBounds/updateFromGameObject` and an executed numeric check.
- Current `afterPhysics()` measures actual displacement after WORLD_STEP; retain this for movement/wall-idle/audio. Shift currently changes animation timeScale only; new distinct run clips must replace that old behavior.
- Current snapshot public entry points structured-clone diagnostics. Add plain primitive frame/motion/body values, never Phaser objects or setters.
- Rendering already enables antialiasing and round pixels. Existing speed/input/save/world geometry need no change.

## Implementation requirements / scout findings

1. **Shared source ground must be measured.** A common union crop preserves relative alignment only if generated poses already share registration. Map one measured source ground baseline to target y=176 and one shared horizontal reference to x=64, using one uniform scale/translation across 32 tiles. Centering the union bounding box alone does not guarantee the requested foot anchor. Do not independently bottom-align flight frames: run feet should rise relative to the ground. Reject/regenerate tiles whose source placement defeats common alignment.
2. **Validate actual generated grid.** Record decoded image dimensions and integer per-tile crop rectangles; verify all 8×4 tiles have nonempty alpha, transparent outer margin and no neighboring pose contamination. A global alpha channel alone does not prove each tile is transparent or isolated. Confirm all four views preserve handed bag/strap placement. The concrete source grid is necessarily pending generation.
3. **Use loader lifecycle, and handle invalid assets explicitly.** `create()` after Phaser preload is the correct synchronization point; do not introduce an unawaited image/decode promise inside create. Missing/decode/metadata errors must stop character construction with a clear failure path, rather than registering empty frames or silently spawning Phaser's missing texture. Guard late callbacks/packing after teardown and remove any added listeners.
4. **Apply canonical dimensions consistently.** Set display scale .5 and source body 48×32, offset (40,160), origin (.5,176/192) together. Keeping the old `PLAYER_BODY.width/height` in `setSize()` would halve the physical footprint to 12×8. Keep pure world geometry at 24×16 and verify runtime body bounds after a physics step.
5. **Update every animation call site.** Initial create, clearKeys, and afterPhysics currently pass the old boolean walking contract. Explicit idle/walk/run state must cover all three. Per row use idle 0, walk 1–4, run 5,6,7,6, with row base offsets. Avoid retaining the old sprint timeScale multiplier on an already faster run clip.
6. **Reduced motion needs a real source.** Current scene never supplies the existing `reduced` argument; CSS media queries do not affect Phaser. Read `prefers-reduced-motion` and hold directional idle while allowing movement/audio distance reporting. If subscribing to changes, clean the listener on teardown. This is accepted plan behavior, not an existing working feature.
7. **Preserve independent Game ownership.** Texture/animation caches belong to each Phaser Game. Reuse within that Game, allow fresh loading for campaign successor Games; avoid a module-global “loaded” flag. Preserve donor checkout and `src/room-two/bao/` fidelity hashes.
8. **Visual QA must include ground and full cycle.** Inspect all 32 tiles individually and in game, four movement directions, both speeds, Shift press/release while moving, stop/wall block, modal/blur/hidden tab, reduced motion, resets/reloads, inherited Room 2, and stable shadow/name/camera position. Browser-loaded build URLs must resolve local assets in all five entries.

## Plan completeness / next actions

Plan establishes scope, ownership, physical contract and validation gates. Proceed with generation; write measured manifest before packing. Focused manifest/clip tests should assert concrete frame mapping and dimensions rather than merely call helpers. Existing 105 tests and five-entry build remain implementation exit gates; neither has been re-run during this plan-only review. Asset identity/style, seam/alpha quality and exact per-frame ground cannot be approved until generated output exists.

## Metrics

- Product files modified: 0.
- Runtime tests/build: not run; pre-implementation review.
- Static/runtime-source checks: all room inheritance, all character animation call sites, exact body transform.
- Auth/database/data-leak checks: no new boundary in this scoped local renderer/asset plan; no server or persistence change.

## Unresolved questions

None blocking. Actual source grid/baseline and visual quality remain generation outputs to measure, not assumptions.
