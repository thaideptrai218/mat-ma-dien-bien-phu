---
phase: 2
title: "Rebuild content world and interface"
status: pending
effort: ""
---

# Phase 2: Rebuild content world and interface

## Overview

Implement only after user content arrives. Parallel work uses disjoint content, world and UI ownership; controller integrates rules and application. No narrative or map implementation authorized in this planning turn.

## Implementation Steps

1. Content worker reconciles PDF/user evidence, records provenance, builds four historical chapters plus fifth room and return; imports protected Bảo records without paraphrasing.
2. Build Room 1 chain: restored letter → A-03 map envelope → campaign ordering → drawer → substitution/identity → iron box. Exact evidence and answers await user; do not assume campaign cards or `2413`.
3. Keep Bảo Room 2 mechanics unchanged. Build Room 3 sequencing/tactical/logistics interactions only from supplied material; PDF blank pages 16–17 supply no missing mechanism.
4. Room 4: seven surrounding historical documents, central chest, two cipher boards behind it. Crossword row starts `[8,7,8,0,8,3,5]`, 17-column extent, row 4 corrected to 16 cells; column 8 reads `TIMTVAL`. Exact PDF T/L grids including right-board row 2 `ULTAV`; final `QUYETCHIENQUYETTHANG`. Chain prerequisites enforced before chest opens.
5. World worker builds distinct archive, supply/preparation, command-memory, final-gallery and museum layouts around agreed interactions; imports actual Bảo map. No cloned old bunker walls for new rooms and no old 3200×1920 outdoor bridge route.
6. UI worker extracts Bảo puzzle renderer without behavioral changes, adds new type renderers as separate modules, paper reader followed by Quang deductions, picture assembly and ungraded optional reflection. Four fragment slots NW/NE/SW/SE; five room flags never render five pieces.
7. Add M map, N notebook, Q objective and Shift sprint to canonical scene. Modal/forms/blur/reduced motion retain interruption and accessibility behavior.

## Files and contracts

Content: `src/content/{story-data,foundation-data,preparation-data,victory-data,peace-data,documents-data}.js`, `src/content/bao/*`, `src/core/puzzles/*`. World: `src/content/world-data.js`, `src/content/worlds/*`, `src/game/*`. UI: `src/ui/*`, `src/styles.css`. Controller changes app/rules/save/main separately. Type/payload details finalized from user material; no guessed answer contract becomes historical content.

## Success Criteria

- [ ] Every historical claim/evidence is traceable to PDF or supplied user content; authored mechanics clearly distinguished.
- [ ] Bảo Room 2 deep-equality/invariant tests pass; predecessor and seven-clue behavior unchanged.
- [ ] New room geometry is distinct, reachable and compatible with safe checkpoints/camera.
- [ ] Documents and deductions are separate; close/reopen cannot grant progress early.
- [ ] Four fragments, fifth assembly and reflection sequence work without judging the player's answer.

## Risks and rollback

Avoid parallel edits to root registries while other workers import them; content worker exports stable registries first, world/UI consume those IDs. Missing history is a content dependency, not permission to fabricate. Keep retirement until replacement passes integration so failed work does not leave an empty playable app.
