# Trâm Room 4 — code review

2026-10-30 — **GO for the reviewed code. No remaining actionable findings.** Final visible gameplay acceptance remains lead-owned. Reviewer changed this report only.

## Scope

Reviewed all `src/room-four/` modules, the Room 4 plan and source audit, shared Room 1 scene/UI/map/panel changes, local-font/input/audio interfaces, route links, Vite entries and affected tests. Applied `ck:scout` and `ck:code-review` with base/web checklists. Checked the permitted PDF4 full-text excerpt and audit for p18–22. No web research.

## Progression and runtime boundaries

- Paper reading/collection enforces a contiguous historical sequence. Collection requires the active editable reader's deduction, matching document ID/action and current token; closing invalidates it. Notebook rereads are read-only.
- All seven documents precede crossword submission. The correct crossword precedes column selection; the column precedes either exact T/L cell set; both boards precede the final phrase. Shape validation rejects duplicates, extra cells, invalid indices and the wrong board.
- The final phrase opens the chest automatically and updates its scene overlay. It does not award the fragment. Nearby chest interaction and its own confirmation award only fragment IV; the door remains gated until that pickup.
- Save data uses `mat-ma-dien-bien-phu:room-four:v1`, preserves only valid dependency prefixes and restores consistent chest/fragment/exit state. Room 1/Bảo storage is not copied or inferred. Invalid/blocked storage leaves session play available.
- Configured scene world/art/texture/goal defaults preserve Room 1. Every geometry, spawn, nearest-object, bounds, goal, snapshot and reset path uses `this.map`. Both Room 4 maps receive its configured world. Input clearing, normalized 260/390 motion, actual-distance footsteps and native paper reader remain shared.
- Chest visual flags can arrive before scene creation, redraw after creation/reset and hide the fragment after collection. Cached flags avoid rebuilding its graphics on every position update. Deferred modal callbacks retain their active-panel guard; render does not replace open puzzle drafts.

This local single-player change adds no server, authentication, database, secret, private-text or network-data boundary. Native text/SVG construction avoids untrusted HTML. Links are explicit; Bảo opens separately with `noopener noreferrer` and no progress transfer. No new shared-state race, unbounded query or unhandled error path was found.

## Source and UI checks

- Crossword rows, starts and 17-column geometry match the audited PDF arrangement. The full 16-letter `SOCHIHUYTRUNGTAM` is retained through the documented one-cell artwork correction; column 8 yields `TIMTVAL`.
- Both 6×5 boards, including L row `ULTAV`, reproduce the source. Their exact unique traversals yield `QUYETCHIEN` and `QUYETTHANG`. Vietnamese `Đ/đ` normalizes to `D`, so accented answers remain usable.
- The seven full texts contain 302, 311, 301, 310, 319, 317 and 330 Vietnamese whitespace words. They retain source/fiction metadata outside literary prose, distinct fictional voices and separate Quang thoughts.
- Historical statements match the supplied PDF: the March/April siege, 1 May offensive, approximately one ton at A1 on the night of 6 May, headquarters capture around 17:30 on 7 May, combined 16,200 killed/captured total, weapons and later significance. Northern liberation is expressly placed after Genève rather than on 7 May. Personal dates/circumstances remain fictional; no 1955 scene or restored old letter campaign is introduced.
- Inspected the supplied mobile paper/crossword screenshots: native Vietnamese text is legible, envelope/paper is distinct and the exact-width crossword has horizontal scrolling. This visual readback does not substitute for a full real playthrough.

## Findings corrected during review

- `content.js` first chest reaction previously claimed it was open before the final phrase; first door reaction claimed the fragment was still inside after collection. The revised text now matches the applicable states.
- Completion initially lacked the promised optional Bảo link; the explicit separate link is now present.
- Shared notebook/settings/map eyebrows initially retained Room 1's `01` label. Room 4 now replaces only that default eyebrow with `04`, preserving Room 1 defaults and source/author headings.
- The earlier column-clue visibility fix was reread: column views receive `columnSolved`, not `crosswordSolved`, so the UI does not announce the decoded instruction prematurely.

## Verification and follow-up

Reviewer ran fresh **`node --test`: 43 passed, 0 failed**, including all retained Room 1/font/audio tests, Room 4 content/cipher/dependency/save/token tests and reachable E approaches for all fourteen Room 4 anchors.

Reviewer ran fresh **`npm run build`: passed**, producing exactly `dist/index.html` and `dist/room-four.html`. The existing Phaser size warning remains; it is not a new functional failure. Test/type coverage percentages not measured; no lint script configured.

The lead owns the full real keyboard/E/DOM journey, Room 1 browser smoke, reload/reset/wrong-answer checks, chest-open versus fragment-pickup visual readback, mobile final puzzles and Bảo preview/status confirmation. Unit adapters and pure reachability checks are not claimed as gameplay. Do not mark those final acceptance checks complete from this report alone. No plan status was changed by reviewer.

## Unresolved questions

None.
