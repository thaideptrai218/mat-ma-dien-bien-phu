# Room 1 final acceptance — 2026-10-30

Status: PASS for the standalone Room 1 milestone. Rooms 3–5/full PDF4 campaign remain pending. No commit, push or deployment performed.

## Automated and review

- `npm test`: **24 passed, 0 failed**. Tests cover prerequisite bypass, all four read/confirmation gates, stale callbacks, restored-letter confirmation, save repair/storage errors, source-labelled full content, geometry/reachability, normalized sprint/input interruption, audio lifecycle and font readiness.
- `npm run build`: passed; one `dist/index.html` entry with local font/portrait assets. Vite reports its existing Phaser chunk-size advisory; no compilation failure. No lint script configured.
- [Code review](room-one-code-review.md): GO, no remaining actionable findings. [Independent QA](room-one-independent-qa.md): assigned browser checks pass, independently reran all 24 tests.

## Actual full browser journey

Preview `http://127.0.0.1:4173/`, Chromium, 1440×1000. Navigated the collision map using trusted CDP keyboard down/up events through the game's canvas handlers. Filled native UI controls; did not set coordinates, state, saves or progression to pass a stage. Cleared only the isolated QA browser's Room1 save before starting.

1. Walked to letter, interacted with E, reordered all four fragments. Restored full letter appeared on a separate paper, then Quang deduction, then explicit A-03 confirmation. Merely assembling did not set `letterSolved`.
2. Walked to wall map, chose A-03; found V-01, V-02, P-01, P-02 physically.
3. Each complete paper had a disabled deduction button until its scroll reached the bottom. Paragraph word counts: **339, 333, 337, 346**. Each Quang deduction needed separate final confirmation before collection; all four collected.
4. Filled four comparison rows, recorded code2413, walked to drawer. Wrong1111 left drawer locked; correct2413 opened identity form without stale error. Decoded Henri Navarre, opened chest with NAVA, received first fragment, walked to and interacted with northern door.
5. Final snapshot: four notes collected, all Room1 flags true including `exitReached`; completion view visible, only first fragment awarded. No runtime exceptions. Reload retained completion and spawned Quang at1200/1410.

Screenshots visually inspected from ignored local `tmp/`: gameplay, restored letter, full paper, mobile paper and completion. They are QA captures rather than product assets.

## Movement, reactions and input

- Real650ms movement: walking169 world units, sprint253.5; ratio**1.5** (260/390 per second). Animation, camera and map follow actual post-physics position.
- Opened M while holding movement+Shift: position stopped; closing did not restart movement. Auto-repeat after closing could not rearm the held key.
- Walked to lamp, crate and radio twice each; each first/repeated response differed. Early chest interaction gave locked reflection, no fragment. Reload retained observed props and restored safe spawn.
- Independent QA verified top-right quest click and Q collapse, actual minimap/map marker1200/1410, no map teleport, reset→fresh intro→start button, local fonts and narrow UI.

## Paper, font, audio and scope

- V-01 at375×812: full five paragraphs plus end marker remained in the scroll reader; page scrollWidth375, no horizontal overflow. Paper and Vietnamese marks visually inspected. Independent narrow map/settings/notebook checks passed.
- Five local font faces loaded from localhost; no external font/resource requests in independent browser run. Bootstrap font tests exercise every face and Vietnamese text. Authored content is NFC.
- Real trusted audio click enabled running/audible Web Audio. Walking169 units produced**2 footsteps**, measured RMS≈0.00391, peak≈0.00625; mute left0active sources. Independent enable/mute and nonzero audio measurement also passed. Synthesized sound only, no narration/TTS.
- Old primary content/maps/session/UI, chapter-four app and executable wireframe removed. Fresh build has one entry. Old URL SPA fallback displays current Room1, never the retired app. Shared geometry/animation/audio/fonts retained.
- Protected Bảo checkout still at5ff03c241a35bfe4137bc8fd5bebd43079450648 with its unchanged preexisting dirty font files; preview4180 returned200. New Room1 never reads/writes Bảo save.

## Practical limits

Keyboard desktop gameplay; narrow reading UI works but no touch walking controls. Bảo link opens its separate build and does not synchronize or auto-select progress. No real-player timing/accessibility study, screen-reader certification or 200% zoom acceptance claimed. Historical prose uses only supplied sources; troop totals are explicitly labelled, not independently verified. Later campaign rooms remain planned.

Unresolved questions: none blocking this milestone.
