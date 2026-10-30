# Room 1 — thư nguyên vẹn và giọng kể

Status: complete. User rejected torn-letter mechanic and confusing, nonhistorical, artificial prose. [QA](reports/qa.md):25 passing tests, production build, actual full journey, paper/layout/save checks. [Review](reports/code-review.md): GO. No Git publication.

## Deliverable

Replace torn-letter ordering with an intact personal letter. It opens directly as a distinct illustrated HTML paper, full readable text, sender/date/salutation/signature, local handwriting type, fold marks and envelope. No generated raster text. Archival A-03 marking is separate from the writer's prose; Quang notices it after reading. Preserve map, sprint, task HUD, source restrictions, comparison answers, Bảo and existing saves.

Rewrite letter plus four long records with identifiable fictional voices and actual early1953 historical context from supplied lich su.txt only. Literary bodies contain no source disclaimers/game instructions; metadata outside paper clearly identifies creative writing and source-labelled troop figures. No fabricated authenticated historical letters/quotes. Four notes remain complete250–350words each; natural Quang reflections concise. Dates run early1953→March/April→Nava introductionMay; no two-step plan yet.

## Implementation

1. Content owner: letter-document.js, documents.js, content.js; initial reviewed prose draft, then product after GO. Single LETTER_DOCUMENT, same restored-letter id for compatibility; no fragment export.
2. Controller owner/root: remove letter-submit/order intent; open paper directly; current-paper→Quang deduction→final letter confirmation grants existing letterSolved boolean. Reducer letter action no longer evaluates ordering; controller token/view guards apply. Keep save version/key and all later gates.
3. UI/root: letter presentation class, handwriting font localPatrickHand plus existing DBP fonts; recipient/salutation/signoff/archivalmark outside flowing paragraphs, discreet fiction metadata. Full scroll text, native selection/zoom, mobile375; no text embedded in image.
4. Remove obsolete letter puzzle branch; update world labels/art prompts/quest/tutorial wording. Sufficient source clues for existing comparison/identity stages remain.

## Verification

Update meaningful controller tests: direct paper, no progress on open/close, read→deduction→tokenfinalconfirm, stale confirmations rejected. Keep read/collect/comparison/save contracts; old completed saves retain progress. Content fulltext/metadata/source/NFC checks. Build, browser newstart paper layoutdesktop/mobile, no fragmentpuzzle, read→A03→firstnote; unchanged laterchain covered by existingtests and one updated full route if controller flow changed. Reviewer checks new behavior/prose/history fidelity. Update current docs for removed mechanic; no Git publication.

## Boundaries

Only canonical main. No Bảo edits, new historical web research, real attributed letters or Room3–5 changes. Sources: Desktop/lich su.txt + previous local PDF4 audit. Character-level fiction allowed but clearly labelled. Keep source notes outside literarybody and avoid repetitive editorial slogans.
