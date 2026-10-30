---
title: "Standalone Room 1 playable milestone"
status: pending
priority: P1
created: 2026-10-30
---

# Room 1 playable milestone

## Scope and controlling requirements

Build canonical `/` as a new, fully solvable standalone Room 1. Current scope: early 1953 strategic comparison, ending with introduction of Nava and first picture fragment. Later PDF 4 rooms remain planned. Sources: supplied PDF 4 plus user `Desktop/lich su.txt`; no internet. Read [source-quality audit](reports/history-text-quality.md) and [technical gate](reports/room-one-plan-review.md).

Preserve separate Bảo checkout/Room 2/font fix and port 4180 preview untouched. Completion offers explicit `http://127.0.0.1:4180/` link; it does not auto-navigate, select Bảo chapter, copy progress or write Bảo storage. No Git publication, deployment or source-PDF upload.

## User-visible design

- 2400×1600 map, Vietnam zone left and French zone right. Letter `(1200,1250)`, wall map `(1200,280)`, documents V1 `(430,650)`, V2 `(630,980)`, P1 `(1970,650)`, P2 `(1770,980)`, comparison `(1200,820)`, drawer `(2030,320)`, chest `(780,300)`, door `(1200,100)`. Coordinates are object anchors, not player spawn/collision centers; validate reachable interaction space around each.
- Top-right quest HUD: four main steps, current subgoal, collapse/expand. Bottom-right minimap; M opens full map. Both reflect actual position, room geometry, collision obstacles and discovered/current target markers; no click teleport.
- WASD/arrows, E nearby-object interaction, Shift sprint 260→390 units/s with normalized diagonal movement and no stamina; movement/camera/animation/audio remain real. M/N/Q shortcuts only from game context. Modal/blur clears held keys and velocity.
- Every object has specific Quang thoughts/reactions for first inspection and repeat inspection, including locked/early/wrong-step situations. E only nearby, reachable objects; no automatic walking or global remote interaction.
- Four complete paper documents V1/V2/P1/P2, about 250–350 Vietnamese whitespace-separated words each, original faithful game prose with source badge. Render full text with readable scrolling/pages; no synopsis substitutions, clipped paragraphs or abbreviated notebook copies. Paper reader is separate from Quang deduction/reaction.

## Strict solvable chain

1. Restore four torn letter pieces → read restored letter → Quang's thought/final confirmation. Letter directs to A-03; do not unlock subsequent stage from merely opening/closing the paper.
2. Select A-03 on wall map → find/read four full documents → hear each Quang deduction → final confirmation collects that document. Compare troop numbers 252,000 vs 445,000; equipment limited vs modern; initiative vs dispersion; supply vs financial/war-cost pressures. All four collected documents required before successful comparison. No two-step Nava-plan teaching yet.
3. Correct comparison reveals drawer code `2413`. Open drawer only after comparison and correct code → A1Z26 substitution evidence → decode `HENRINAVARRE`. Evidence and instructional wording make the answer derivable; no arbitrary guessing gate.
4. Identify `NAVA` at chest only after decoding → chest opens/first picture fragment → interact with door → honest Room 1 completion panel and optional explicit Bảo link. No fake full-campaign ending or invented subsequent-room entry.

Drawer code/cipher/chest answers are approved puzzle mechanics. The two troop totals are explicitly accepted user-supplied transcript figures; label as such, not independently verified statistics. Do not use corrupt months, dates, percentages, names or attributed quotations from transcript as exact answers. Do not import research from outside permitted sources.

## Architecture and ownership

New isolated application under `src/room-one/`: `main.js`, `session.js`, `actions.js`, `rules.js`, `save.js`, `content.js`, `documents.js`, `world.js`, `scene.js`, `art.js`, `input.js`, `ui/*`, `styles.css`. Reuse generic geometry/character/audio/font contracts without importing old campaign content or old sessions. Keep new logic modular at real boundaries.

| Owner responsibility | Files | Contract |
| --- | --- | --- |
| Content | `content.js`, `documents.js` | Stable object/document IDs, complete documents, restored letter/pieces, Quang reactions, instructions and source labels; no world/core/UI edits. |
| Rules and persistence | `rules.js`, `save.js`, focused rules/save tests | Pure sequential progression and validated isolated storage; no DOM/Phaser/content rewriting. |
| World and scene | `world.js`, `scene.js`, `art.js`, `input.js`, focused reachability tests | Agreed anchors, real collisions, nearest reachable E target, actual camera/position snapshot and sprint. |
| UI | `ui/*`, `styles.css` | HUD/map/notebook/full paper/puzzle/completion views; send intents, never independently grant progress. |
| Controller/integration | `main.js`, `session.js`, `actions.js`, root HTML/Vite, reusable font assets if needed, retirement/docs/integration QA | Bind contracts, active-reader final-confirmation guard, startup/font/audio barriers, complete journey and retire old routes. |

Workers are not alone; never revert another owner's edits. Reports under this plan's `reports/`. Controller fixes integration points by coordination; avoid shared-file parallel edits.

## State and intent contracts

- State records immutable completed stage IDs, seen object IDs, collected document IDs and fragment/completion booleans; preserve safe checkpoint/settings if supported. Use private key `mat-ma-dien-bien-phu:room-one:v1`; never read/infer old game/Bảo saves. Drafts, dialogue/page cursor, arbitrary coordinates and private free text stay runtime-only.
- Reducer checks prerequisites for every transition; guessed correct A-03/code/name/chest cannot skip earlier stages. Store validator applies the same dependency invariants and rejects duplicate/unknown IDs or impossible completion combinations.
- UI emits object ID and answer intent; controller verifies currently active view, object and reader phase. Paper finish only after last page/end of full text; deduction confirmation only on active final line. Closing/reopening or late callback after reset grants nothing. Rules also reject document collection before A-03 unlock.
- Session owns current nearest object and scene blocking; world snapshot supplies player coordinates/map bounds/obstacles to both map views. UI renders the snapshot, never moves player. `Q` reveals/toggles current quest; `N` notebook rereads complete collected documents.
- Four quest groups represent the chain above; current subgoal is derived from state. Completion panel requires fragment and door interaction; a locked door reaction cannot complete the room.

## Implementation sequence and verification

1. Freeze IDs/export/intent payload contracts with workers. Record Bảo checkout/preview baseline; no donor mutation.
2. Implement content, pure rules/storage, world/scene and UI with disjoint ownership; controller integrates session/actions/main. Keep old entry intact until replacement build is runnable.
3. Focused tests: valid full chain; every premature correct answer; all four document final confirmations; malformed save/storage failures; reset/stale-reader callbacks; normalized 260/390 speeds; all objects/checkpoints reachable with real collision and safe spawn.
4. Browser play via visible movement/E/UI from letter to door. Verify full document word counts/text and source badge, thought reactions for every prop, top-right quest/collapse, actual-position minimap/full map, sprint, focus interruption, Vietnamese fonts offline, narrow viewport/zoom, save/reload/reset and audio. Do not use state setters/teleport to claim route completion.
5. Only after new room is ready, switch index entry, remove old primary active campaign routes/maps, `chapter-four.html`/`src/chapter-four/` and executable wireframe HTML/JS/CSS while retaining source images. Replace obsolete importing tests. Fresh build must contain only intended entry; old URLs cannot load their old apps in dev or preview. Preserve Bảo separate checkout/port.
6. Update README/current docs for standalone Room 1, actual controls/source policy/save and Bảo completion link; say later rooms are planned. Run final test/build and browser acceptance; report measured results/remaining limitations, not old full-campaign QA counts.

## Acceptance and rollback

- [x] Entire chain solvable and no predecessor bypass; exactly first picture fragment awarded.
- [x] Four full source-labelled notes, separate Quang deductions, specific first/repeat reactions, final-confirmation collection guards.
- [x] Quest top-right; map/minimap accurate; real movement/collision/camera/sprint/input interruption.
- [x] Current index is new Room 1; old primary apps/maps retired after replacement; fresh build clean.
- [x] Bảo source/fonts/preview unchanged; link explicit and does not mutate progress.
- [x] Focused tests, build and complete real browser journey pass; docs describe milestone honestly.

Completed2026-10-30. Evidence: [final QA](reports/room-one-qa.md), [independent QA](reports/room-one-independent-qa.md), [code review](reports/room-one-code-review.md). Only this Room1 milestone is complete; the full PDF4 campaign remains pending.

Do not reset unrelated local work or wipe unrelated storage. Revert only task-owned integration if needed; keep old entry until new app is ready to avoid an empty playable project. Current scope has no unresolved user decision blocking work; later full-campaign details remain pending.
