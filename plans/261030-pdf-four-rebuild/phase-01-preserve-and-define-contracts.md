---
phase: 1
title: "Preserve and define contracts"
status: pending
effort: ""
---

# Phase 1: Preserve and define contracts

## Overview

Read-only technical preparation complete; implementation pending user content. Context: [PDF requirements](reports/pdf-requirements.md), [code scout](reports/code-scout.md), [review](reports/plan-review.md).

## Implementation Steps

1. Keep separate `../mat-ma-dien-bien-phu-bao` untouched. Before integration, capture its Room 2 dependency closure and compare resulting canonical records with donor by stable IDs.
2. Extract protected `navarre-plan` chapter, intro/outro, seven `nava-*` clues/beats, four puzzles (`nava-balance`, `nava-radio`, `nava-fist`, `nava-fold`), all referenced source/shared data and concrete map into `src/content/bao/`. Preserve original text, coordinates, answers, hints, SVG/fold data and prerequisite chain. Only outgoing destination may change.
3. Port compatible Bảo engine/UI/audio/font barrier into canonical project. Do not copy its other old campaign records. Retain generic character animation, geometry and input interruption behavior.
4. Freeze shared contracts in review report: chapter/puzzle/clue registries, type evaluator/renderer registries, fragment-room identity, document reader and ending guard.
5. Wait for user material before finalizing historical narrative, missing puzzle answers, new room/object arrangement or retiring old routes. No external research or invented replacement history.

## Files and ownership

Controller owns preservation baseline, `src/app/*`, `src/core/game-rules.js`, `save-validation.js`, `save-store.js`, `src/main.js`, HTML/Vite, retirement and integration docs. Content worker owns `src/content/*` excluding world modules, plus new pure puzzle evaluators. Detailed ownership in [review](reports/plan-review.md).

## Success Criteria

- [ ] User historical material received and reconciled with PDF; missing content decisions explicit.
- [ ] Protected data dependency inventory and donor invariants captured before any port.
- [ ] Worker contracts and disjoint file ownership agreed; no Bảo checkout mutation.

## Risks and rollback

Shared Bảo data are embedded in registries; copying only four puzzle records loses dossier/fold/telegram dependencies. Preserve full closure first. Keep donor unchanged and existing local work intact; revert only task-owned edits if integration fails.
