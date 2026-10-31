# Phòng 4 của Trâm — nghiệm thu 2026-10-30

Status: PASS for the standalone Room4 preview. No commit, push, deployment or new web research. Play at `http://127.0.0.1:4173/room-four.html`; Room1 remains at `/`, Bảo remains separate on4180.

## Source and implemented scope

PDF4 p6 explicitly labels stage4 “Trâm”; p18–22 supplies its history, room and exact puzzle sheets. Implemented a new2800×1800 archival room: center chest, two cipher tables behind it, seven surrounding paper stations and northern crossword/exit. No old river/bridge map restored. It is a learning-room layout, not a literal battlefield reconstruction.

Seven natural papers contain302/311/301/310/319/317/330 Vietnamese spacewords,5 paragraphs each. Dates run lateMarch/April siege→May offensive→night6May A1→7May headquarters→results→1954afterGenève→independence significance. Named people/personal circumstances are fictional and labelled outside prose. The16,200 figure means killed/captured; northern liberation is not attributed to7May. Source and authored content details: [content report](content.md).

Crossword answers/starts match the supplied sheet. The sixteen-letter headquarters answer is displayed in full (minimal repair to the PDF's fifteen drawn cells). Seventeen columns; common column index8 yieldsTIMTVAL. Two exact6×5 grids including `ULTAV` produceQUYETCHIEN andQUYETTHANG through exactT/L cell sets. Correct final phrase automatically opens chest; pickup and door remain separate actions. Only fragmentIV awarded; Room5 and integration with other rooms remain pending.

## Tests, build and review

- Final `npm test`: **43 passed,0 failed**. Includes Room1/shared regressions and Room4 chronological read/confirmation, active-token guards, exact source geometry/letter extraction/shapes, accents includingĐ, prerequisite bypass, chest-open versus pickup, isolated/malformed/blocked saves and all14 reachable E anchors.
- Final `npm run build`: passed; `dist/index.html` and `dist/room-four.html` only. Local fonts/portrait included. Existing Phaser chunk-size advisory remains; no compile error. No lint command configured.
- [Code review](code-review.md): GO, no remaining actionable findings. [Independent browser QA](independent-qa.md):43 tests, Room1 default letter flow, Room4 first paper, map, reset/reload, sound and responsive checks passed.
- [UI verification](ui-implementation.md) separately identifies its isolated panel harness; those screenshots are not passed off as a gameplay journey.

## Actual complete gameplay

Chromium preview4173. Used trusted CDP keyboard down/up through actual canvas movement and E, native forms/buttons and actual document scrolling. No coordinate/progress setters or fake solved saves. Started with only the isolated browser's Room4 key cleared, read/confirmed all seven complete papers, resumed from their persisted state after reload, then completed every puzzle and exited.

1. Each full paper matched all source paragraphs in the DOM. Deduction disabled until bottom; collection remained false until Quang's separate confirmation. All7 collected in order.
2. Reached northern crossword; wrong row rejected without losing the remaining input. Correct inputs included accented `Bị động` and `Độc lập dân tộc`. All7 correct opened the column sheet without revealing its solution first.
3. Wrong column8(display numbering) rejected; column9(index8) yieldedTÌM T VÀ L.
4. Walked to both tables, wrong incomplete shapes rejected, exact selected cells yieldedQUYETCHIEN/QUYETTHANG. Boards solved only after deliberate submit.
5. At center chest, wrong shortened phrase rejected; full accented “Quyết chiến, Quyết thắng” opened visible raised lid/cavity/glowing fragment. Snapshot `chestOpen=true`, `fragmentVisible=true`, `fragmentCollected=false`.
6. Interacted with chest again and confirmed pickup. Fragment disappeared from the open chest, `fragmentCollected=true`; took no other fragments. Reached northern door, interacted, completion view visible, `exitReached=true`. No runtime exceptions.

Full journey snapshots visually inspected: paper, filled crossword, selectedT/L, opened chest and completion. Initial navigator timing clipped a furniture corner; navigation was replanned with wider floor clearance, without changing the game's geometry or moving the player directly. Saved-paper resume also exercised normal reload behavior.

## Save, audio and responsive behavior

Completed save reload retained all flags and open empty chest; spawned1400/1630 safely. Notebook contained all7 full read-only papers. Room1 key was byte-for-byte unchanged by the Room4 session.

Trusted sound click enabled Web Audio. Real walking produced2 footsteps and RMS≈0.00421; saved enabled sound resumed after reload in one explicit gesture, mute left0active sources. No narration/TTS.

Independent QA confirms Room1 remains2400×1600 with intact letter/A-03 flow, and its header link opens Room4. Room4 maps use2800×1800/actual marker; clicking map does not move player. Reset confirmation clears only this room and reopens working intro. All fonts loaded locally.

Final responsive checks:1264×569 fits full viewport; compact minimap moves lower-left to avoid stacking with top-right tasks. At1280×720 minimap remains lower-right with no overlap. At375×812 quest collapse/expanded290px panel, minimap and interaction control do not overlap. Native full-paper reader remains selectable; seventeen-column crossword scrolls within its panel, six-by-five shape cells remain≥44px. Error notices now flow below the form rather than cover submit buttons.

## Practical limits

Standalone rooms1/4 and Bảo2 are not one synchronized campaign. Room3/5 remain pending. Keyboard desktop exploration; mobile reading/puzzles are responsive, no touch walking controls. Historical facts follow supplied material rather than new independent research; fictional letters are not archival quotations. No real-user playtime or screen-reader certification claimed.

Unresolved questions: none blocking this room.
