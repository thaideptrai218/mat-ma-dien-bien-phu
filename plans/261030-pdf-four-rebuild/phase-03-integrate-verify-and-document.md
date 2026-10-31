---
phase: 3
title: "Integrate verify and document"
status: pending
effort: ""
---

# Phase 3: Integrate verify and document

## Overview

Controller integrates after content/world/UI are ready, verifies the complete journey, then retires old executable routes and updates current documentation.

## Implementation Steps

1. Use chapter order `museum, foundation, navarre-plan, preparation, victory, peace, ending`; `roomOrder` is the five challenge/final rooms; `FRAGMENT_ROOMS` contains first four only. Finish each historical room only after every puzzle; peace after picture assembly; ending additionally requires `peace-outro`.
2. Use save key `mat-ma-dien-bien-phu:save:pdf4:v1`; validate only new campaign registries and dependency invariants. Do not infer PDF progress from legacy save or Bảo's old v1. Save remains ID-only; document cursors, puzzle drafts, reflection text and audio runtime stay out.
3. Guard final-line collection by active beat/clue identity, reader phase and cursor. Guard stale callbacks on reset/modal replacement. Preserve Bảo room-outro exit lock and add equivalent final-room ending lock in reducer and validator.
4. Port/adapt focused Bảo rule/font/save tests; replace old campaign fixtures; preserve generic geometry/audio tests. Test all new evaluators, missing clues, predecessor bypass, malformed saves, all five room flags and exactly four fragments.
5. Run reachability for every interaction/checkpoint with locked and completed exits, then complete journey in real browser using controls. Cover reload mid-chain, paper close/reopen, peace assembly-before-reflection, ending bypass, reset/storage failure, 375px and 200% zoom, local Vietnamese fonts with outside network blocked, audio activation and focus loss.
6. Once replacement is verified, remove `src/chapter-four/`, `chapter-four.html`, executable HTML/JS/CSS under `docs/wireframe/` (keep image assets), old imports/tests and Vite second entry. Fresh production build must eliminate stale generated routes. Check removed paths in dev and preview, not only menu links.
7. Update README and current docs for actual new story, controls, single entry, save key, source policy, protected exception and measured QA. Keep historical reports visibly historical. No commit/push/deploy/PDF upload.

## Success Criteria

- [ ] `npm test` and `npm run build` pass; focused coverage contains real behavior and donor preservation evidence.
- [ ] Independent code review checks progression/save/UI contracts after integration.
- [ ] Full browser route reaches museum ending with four fragments, assembly and completed reflection beat.
- [ ] Bảo checkout remains unchanged; retired routes absent from source and fresh build.
- [ ] Current docs make no stale old-map, dual-entry, old save or unverified QA claims.

## Risks and rollback

Room-count arithmetic can unlock ending before reflection: explicit ending guard required in reducer and save validator. Save isolation avoids legacy ID collisions. Build only canonical directory; leave Bảo preview/process intact. Restore only task-owned canonical edits if necessary; retain user data and historical artifacts.
