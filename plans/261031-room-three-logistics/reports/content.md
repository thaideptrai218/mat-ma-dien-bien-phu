# Content/source mapping — Room 1 context and Room 3 logistics

Status: DONE for owned content, after root relayed plan-review GO. Date: 2026-10-31. Read README, current code standards, approved natural Room1 letters, plan and supplied source brief. No web; no Bảo/Room4 edits. Sources: [user-supplied brief](../source-brief.md), PDF4 p3/p6/p12 and local source audit. Content is authored prose, not independent historical verification. Draft source mapping was written before GO; product edits began afterward.

## Room 1 boundaries

Preserve all existing paragraphs, writer names, early1953 date, greeting/signature and archive A-03. Expand retrospective lines naturally: Border Thu–Đông1950 marks a new stage; stronger army/rear; Trung Du, Hòa Bình, Tây Bắc with no invented dates. Existing 252.000/445.000 figures retain supplied-source labels. French military/economic US-aid dependence remains before identity; no appointment/approval foreknowledge.

New separate N-01 report after identity: appointment Henri Navarre May1953 → French government approval July1953 → decisive military victory/ending war favorably for France. No two-step plan teaching. Its own July date, fiction/source metadata and two Quang thoughts. Root controls flow/save compatibility/notebook.

## Room 3 source-to-paper mapping

| Paper | Voice/date | Supplied facts retained |
| --- | --- | --- |
| preparation-record | Trịnh Văn Quý, fictional compiler, March1954 retrospective report | 6/12 decision; Võ Nguyên Giáp responsible for command; people/weapons/ammunition/food/medicine, roads/guns/positions; parallel preparation, basic completion earlyMarch, sustaining long combat. |
| supply-journal | Bùi Thị Duyên, fictional civilian carrier, earlyMarch diary | Bicycle loads on difficult terrain; carriers; soldiers pulling guns; rice; ammunition; engineers keeping roads open; civilians/youth/public contributions. No invented load capacity. |
| command-telegrams | Hoàng Văn Tâm, fictional staff copyist, pre-opening diary | Original Đánh nhanh, giải quyết nhanh → Đánh chắc, tiến chắc; evaluate reality, careful command, certain victory. No26January date, not merely food shortage. |
| opening-letter | Nguyễn Văn Sơn to sister Nguyễn Thị Cúc, fictional letter 16March | Him Lam13March opens campaign, Độc Lập15March; no knowledge of17March surrender or7May victory. |
| north-report | Lê Đức Hải, fictional compiler,18March report | Bản Kéo surrender17March under encirclement/pressure; northern/northeastern defense broken; >2,000 killed/captured, vehicles/equipment losses; expanded control/access to Mường Thanh; next phases still ahead, rear contribution. |

Each paper: five paragraphs,250–400 whitespace words, source/fiction outside prose, two short Quang thoughts, summary. Actual counts: preparation328, supply321, command337, opening323, north340. Any personal date/circumstance is labelled fiction. No authentic quotation claim. Logistics matter alongside assessment/command; do not reduce doctrine change to rations alone. March witnesses never foretell7May; opening letter dated16March does not know Bản Kéo17March.

## Puzzle contracts

Four challenges/paper gates match root plan. Preparation IDs a/b/c/d/e: decision6Dec, three unordered preparation cards, opening13Mar. Cargo IDs bicycle/porters/artillery/rice/ammunition/engineers. Telegrams use four unique card IDs within each phrase but duplicate printed NHANH/CHẮC words remain equivalent; root validates semantic equivalence. Opening events preserve13/15/17March dates. `REWARDS` derives `{id,label}` from challenge data: THÁNG3, NĂM1954, ĐÁNH CHẮC, TIẾN CHẮC, NGÀY13; final13/03/1954 remains gated by all four in root rules.

Content ending gives only fragmentIII and acknowledges four restored information tokens; other rooms retain independent state. All fourteen object IDs receive first/repeat/locked reaction arrays. The six cargo pictures are explicitly labelled authored illustrations in intro; they are not supplied archival photographs.

## Room 1 measurements and chronology

Existing paragraphs/sentences, names, signatures, initial early1953 date and A-03 remain. Appended retrospective context brings V-01 to369words, V-02 to343, P-01 to341, P-02 to344; Lâm's letter370. Expanded upper bound450 is requested scope, not a workaround for a functional failure. New N-01 has five paragraphs/331words and separate July1953 metadata; mentions appointmentMay and approvalJuly, decisive military victory/favorable termination. It does not teach the two-step plan or predict1954 as a July witness. Early-paper/intro/reaction JSON still excludes Nava identity and1954/1955.

## Validation and integration boundary

`node --test tests/room-three-content.test.js tests/room-one-content.test.js`: **14/14 passed**, including word counts/full paragraphs, source/fiction separation, all14reactions, facts/dates/doctrine, six roles, exact activity gates, unordered preparation grouping, duplicate printed telegram words, derived token labels, NFC, independent ending and early/July temporal separation.

Owned product files: Room1 `letter-document.js`, `documents.js`, `content.js`, new `nava-context.js`; Room3 `documents.js`, `content.js`, `puzzle-data.js`; new `tests/room-three-content.test.js`. No rules/UI/world/save/Bảo/Room4 edits. Root owns July bulletin opening/notebook/save compatibility, activity validators, browser integration and final review; this report does not claim those accepted yet.

Unresolved questions: none.
