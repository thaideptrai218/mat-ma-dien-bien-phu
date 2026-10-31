# Room 3 UI implementation

2026-10-31 — DONE. Native DOM only; no dependencies, remote assets or web research. Read README, source brief, plan-review GO and existing design guidelines. Applied ui-ux-pro-max local product/style/type/color searches, then frontend-design and web-guideline guidance. React/framework rules evaluated: not applicable to this vanilla JS/Phaser project.

## Delivery

- `src/room-three/ui.js` configures RoomOneUI with Room 3 world, dates, subtitle and panel factory. Existing complete paper reader and real-world map retained. Per-view drafts survive HUD renders, wrong answers and close/reopen; reset clears drafts.
- `panels.js` handles notebook and fragment III completion. Notebook keeps earned tokens and whole-document reread intents; completion links only to Rooms 1/4 and explicitly leaves Room 5 pending.
- `preparation-panel.js`: five cards assigned to two date anchors or the unordered preparation period; four supply checkboxes and sustained-combat purpose.
- `cargo-panel.js`: six actual SVG illustrations, descriptive alternative text, reserved 3:2 image space, native caption selects, transport reason and contributor choices. Visible text says these are recreated illustrations, not archival photographs.
- `strategy-panel.js`: two independent shuffled word sets, native up/down buttons, semantic reason and insight choices. Moving existing DOM rows restores focus to the same button and announces the new position. Duplicate displayed words keep separate source IDs.
- `opening-panel.js`: shuffled three-event order, date selects, opening/surrender places and meaning choices. All required dates visible as choices; no invented doctrine-change date.
- `puzzles.js` and `puzzle-controls.js`: shared native controls and final date seal. Date cards display day/month/year; doctrine has its own PHƯƠNG CHÂM card. Final input begins empty with the required format example. Solved activities show canonical facts/reward without editable controls or submit intents.
- `styles.css`: olive/earth/ivory archive palette, existing local Vietnamese fonts, vertical mobile timeline, readable native controls, 44px targets, static notices below form. HUD stays upper right; short desktop places compact minimap lower left and fits exactly 100dvh. Existing reduced-motion/focus rules retained.

## Actual checks

All eight new JS files pass `node --check`.

Fresh browser session against local Vite on port 5193. A temporary isolated UI harness instantiated the actual RoomThreeUI and actual panels/data/assets; harness removed after checks. These verify UI behavior, not gameplay progression or controller security; root performs the complete room route separately.

- 375×812: five preparation selects; changing first select to `decision` survives wrong-answer notice and close/reopen. Eight telegram cards render; moving second row up keeps its button focused and updates draft order. Opening has three event cards and five selects, without horizontal overflow.
- 375×812 cargo: six images all load, correct visible provenance note, image and question layouts readable; modal scrollWidth equals clientWidth after styles load. Submit remains reachable after long gallery. Screenshots [gallery](ui-cargo-375.png), [question/submit](ui-cargo-bottom-375.png).
- 375×812 whole-paper reader: all five supply-journal paragraphs present as native selectable text; continue disabled initially, enabled only after actual reader bottom, then emitted `document-finish` with `supply-journal`. No horizontal overflow. [Paper](ui-paper-375.png).
- 375×812 final: empty input, placeholder `13/03/1954`, card headings NGÀY / THÁNG / NĂM / PHƯƠNG CHÂM. [Final](ui-final-375.png).
- 320×740 strategy: no page/dialog horizontal overflow; every arrow 44×44px or larger. Solved opening has zero inputs/selects/forms and exactly three historical event facts. [Strategy](ui-strategy-320.png).
- 1264×569: body scrollHeight exactly 569; minimap x20–195, quest panel x954–1240, interact x532–731. No map/HUD/interaction overlap or viewport clipping. [Short desktop](ui-hud-1264x569.png).
- Reviewed actual screenshots for mobile preparation, cargo, strategy and full handwritten paper. Local handwritten font preserves Vietnamese diacritics; source/fiction metadata remains outside prose.

## Integration notes

Root imports Room 1 base CSS, letter CSS, local fonts and Room 3 CSS. UI emits intents only; root enforces prerequisites and canonical grading. Design-guideline addition should describe Room 3 palette, five long papers, four varied native activities and separate doctrine/date tokens; shared docs remain root-owned.

Unresolved questions: none. Full gameplay/E traversal, state/save isolation, build and cross-room regressions belong to integration QA; not claimed here.
