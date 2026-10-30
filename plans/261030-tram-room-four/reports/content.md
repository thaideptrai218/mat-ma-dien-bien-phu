# Room 4 content and cipher verification

Status: DONE. Verified 2026-10-30. Scope: `src/room-four/documents.js`, `content.js`, `puzzle-data.js`, `tests/room-four-content.test.js`. No internet, source upload, Bảo edits, commit or deployment.

Read README, code standards, reviewed Room 4 plan, prior PDF audit, PDF4 extracted p6 and p18–22, and Room 1's approved natural letters. Project CLAUDE.md absent. Local `Desktop/lich su.txt` checked for relevant campaign passages; no additional facts or damaged figures/dates taken from it. Historical material in this slice follows PDF4.

## Papers and provenance

Seven papers, five paragraphs each. Space-separated word counts exclude metadata, greeting/signature and Quang reflections:

| ID | Kind | Words | Historical material |
| --- | --- | --- | --- |
| east-offensive | Letter | 302 | 30/3–30/4, eastern C1/A1 fighting, trenches, most of Mường Thanh airfield controlled, French position bị động. |
| final-assault | Report | 311 | Third offensive from 1/5, tiêu diệt remaining positions east/west, extend trenches, prepare general assault. |
| a1 | Journal | 301 | Tunnel preparation, approximately one ton explosive night 6/5, subsequent infantry attack, A1 taken. |
| headquarters | Letter | 310 | 7/5 assault command center, about 17:30 capture Đờ Cát and command staff, flag, pursuit during the night. |
| results | Report | 319 | 56 days/nights, 16,200 killed **and** captured, weapons/stores/equipment, Nava defeat, favorable basis for Genève 1954. |
| north | Journal | 317 | Explicitly after Genève 1954; northern liberation and construction of a rear for later southern liberation and reunification. |
| independence | Letter | 330 | International encouragement to anti-colonial struggle for national independence/self-determination. |

PDF4 p6 identifies Trâm as stage author, not a story character. Fictional writers/recipients: Nguyễn Văn Bình, Trần Thị Sen; Đặng Văn Nghi; Lê Xuân Phúc; Vũ Thị Hạnh, Vũ Thị Nga; Phạm Đức Kiên; Đỗ Thị Thu; Nguyễn Ngọc Liên, Lê Minh Đức. Personal lives, letters, reports, diaries, writing dates and emotions are invented and disclosed in metadata. Source and fiction labels stay outside literary bodies. No invented authentic quotation; no Hòa/Lan/Tuấn or 1955 subplot.

Each paper has two short, separate Quang thoughts. Intro and all fourteen objects have conversation/reaction data. Ending awards only fragment IV, requires walking to the door, and states Room 5 remains pending; it claims no first-three-fragment ownership or completed campaign ending.

## Exact ciphers and source corrections

- Answers: `TIEUDIET`, `BIDONG`, `MOTTAN`, `SOCHIHUYTRUNGTAM`, `VUKHI`, `MIENBAC`, `DOCLAPDANTOC`.
- Starts: `8,7,8,0,8,3,5`; total width 17. Column 8 yields `TIMTVAL`. Row 4 retains the entire 16-letter answer: add only the missing trailing cell from the defective 15-cell PDF artwork.
- Question 5 corrects PDF's captured-only wording to **tiêu diệt và bắt sống 16.200**, consistent with p19; answer remains `VUKHI`. Question 6 clarifies the later Genève context without changing `MIENBAC`.
- T grid: `QUYET/UNCAH/AMHTA/CTICN/AAELG/MTNAT`; cells `0,1,2,3,4,7,12,17,22,27` → `QUYETCHIEN`.
- L grid: `QNAVE/ULTAV/YNLNI/EBCLO/TQMAL/THANG`; cells `0,5,10,15,20,25,26,27,28,29` → `QUYETTHANG`. Second row is PDF4 `ULTAV`, not old `UITAV`.

## Verification

`node --test tests/room-four-content.test.js tests/room-one-content.test.js`: **11/11 passed**. Checks exact answers/geometry/shapes, full answer derivation from linked prose, chronological facts, corrected casualty wording, northern liberation timing, 250–350 words, five paragraphs, separate source/fiction/reflections, all reaction keys, NFC and standalone ending. Root integration review/build/browser verification remains controller responsibility.

Unresolved questions: none.
