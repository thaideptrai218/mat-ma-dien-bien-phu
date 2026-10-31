# Trâm Room 4 — plan review

2026-10-30 — **GO for implementation. No blocking plan defect.** No product edits.

Read the plan, README, PDF4 p18–22 audit and current Room 1 scene/UI/map/save contracts. Used local evidence only; no web. This approves the approach, not future code or historical letters not yet written.

## Source and puzzle checks

- The center chest, surrounding historical papers, two later cipher boards and automatic opening after the final answer agree with the PDF audit. The archive layout and seven fictional papers are identified as implementation choices, not a battlefield reconstruction or copied historical correspondence.
- The chronology separates 30 March–30 April, the final offensive from 1 May, A1 on the night of 6 May, headquarters capture around 17:30 on 7 May, campaign results and later significance. Northern liberation belongs to the later Genève context; do not phrase it as an event completed on 7 May. March/May letter dates and character experiences must stay visibly fictional.
- Independently computed the seven answer lengths: **8, 6, 6, 16, 5, 7, 12**. Starts **8, 7, 8, 0, 8, 3, 5** fit 17 columns and common column 8 yields **TIMTVAL**. Extending the fourth answer to 16 cells is the previously audited PDF drawing repair, not a new historical claim.
- Exact T indices yield **QUYETCHIEN**; exact L indices on the **ULTAV** grid yield **QUYETTHANG**. Set validation must reject duplicates and extra cells as planned. Final code and fragment 4 correspond to the source; opening the chest must remain distinct from walking up to collect the fragment.

## Integration checks required by the plan

Ownership is disjoint: world owner parameterizes the shared scene; UI owner parameterizes UI/map/panel rendering; root owns new progression/persistence/entry integration. Default options preserve Room 1 behavior. This is a reasonable domain-specific reuse boundary; no whole-engine duplication is needed.

Final review should verify every shared `WORLD` reference, artwork/texture key, spawn, goal lookup, snapshot, minimap and full-map path uses the configured world. Shared HTML labels and panel dispatch must select Room 4 without changing Room 1 defaults. Confirm the chest overlay also handles scene readiness, save reload and reset.

The specified independent save key, chronological paper guards, active final-confirmation tokens and predecessor checks cover the progression risks. Preserve drafts during ordinary rendering. A full new browser route and Room 1 smoke are necessary after the shared changes; Bảo must retain its separate source, port and storage.

One concrete implementation caution: Room 1's existing normalizer removes `Đ` instead of mapping it to `D`. If the new crossword accepts accented Vietnamese, handle `đ/Đ` before stripping characters so **BỊ ĐỘNG** and **ĐỘC LẬP DÂN TỘC** normalize correctly. Requiring uppercase unaccented input is also consistent with the PDF, provided the UI says so clearly.

No new permission or user clarification is required. Build, tests and rendered source fidelity remain implementation acceptance work.

## Unresolved questions

None.
