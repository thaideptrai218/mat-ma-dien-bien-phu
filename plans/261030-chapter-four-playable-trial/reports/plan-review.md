# Chapter-four trial plan review

Date: 2026-10-30. Scope: preimplementation, read-only review of `plan.md`, README, project standards and existing geometry/animation/audio/input/Vite contracts.

## Summary

No concrete blocking contradiction found. Proceed with the standalone trial; no additional product decision is required. No production source or plan changes made.

## Verified content and contracts

- Calculated the seven normalized answers at offsets `[8,7,8,0,8,3,5]`: column 8 reads `TIMTVAL`. Rendering requires 17 columns; no answer extends beyond that width.
- Calculated the supplied 6×5 grids and exact unique selected indices: left T reads `QUYETCHIEN`; right L reads `QUYETTHANG`. Their indices are within 0–29 and contain no duplicate cells.
- Seven clues remain required for the crossword. First three clues gate the bridge; all three must remain reachable from the eastern starting component before unlock. Later puzzle and chest prerequisites prevent guessing the final phrase to bypass stages.
- Proposed east-bank A1 → river bridge → west-bank headquarters route and fictional chest-room distinction are internally consistent. The plan separates late-April introduction, May 1–7 events and post-Genève reflection; it explicitly avoids equating all 16,200 casualties/prisoners with captives or implying immediate reunification on May 7.
- Standalone HTML/ESM entry and separate in-memory state preserve the main game's save/progression contract. Existing character-animation named exports, AudioController preferences/status callback and pure geometry support the intended reuse without inheriting the main scene's fixed map lookup.
- Canvas-only movement/shortcut input, explicit last-line collection, draft preservation, native-dialog stale-close guard, audio gesture unlock and post-close focus-before-cue behavior address the existing integration risks.
- Planned law/geometry tests, real seven-clue UI route, wrong/missing answers, Esc-before-collection, both-entry build and main-game smoke checks correspond to the acceptance requirements.

## Implementation details verified against existing helpers

`collisionRects()` requires `walls`, `props`, and `exits`; locked gate rectangles are read from `exits[].gate` only when `lockedGates:true`. Represent the bridge gate in that supported shape or adapt it locally. Reachability must assert the three prerequisite clues are reachable while locked, west-bank access is blocked then, and all remaining clues/tables/chest are reachable after unlocking. This is an existing API constraint, not a requested plan redesign.

Validate cipher selections as exact cell sets, not merely strings obtainable from alternative/repeated cells. Normalize before checking the crossword/chest text; do not persist or unlock via UI draft values.

## Validation limits

Executed a Node assertion script for crossword alignment, both grids, both extraction paths and unique indices; all passed. Map coordinates and trial implementation do not yet exist, so no geometry, browser, PCM, build or historical-source revalidation is claimed by this preimplementation review. PDF image transcription was supplied by the controller after its direct inspection.

## Unresolved questions

None blocking implementation.

Status: DONE
