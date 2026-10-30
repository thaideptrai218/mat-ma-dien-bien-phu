# PDF4 requirements audit

Status: DONE_WITH_CONCERNS

Verified 2026-10-30. Source: supplied PDF4 (private local file) (1,121,299 bytes, 22 pages). Page references below use 1-based PDF page numbers. Read complete extracted text, rendered all 22 pages, personally inspected every render, extracted and enlarged both page-22 puzzle images. Read primary README before this audit; root CLAUDE.md absent. No game implementation or Bảo checkout edits.

Evidence files, local and ignored: `tmp/pdfs/pdf-four/full-text.txt`, `page-01.png` through `page-22.png`, `p22-image-0.png`, `p22-image-1.png`, `crossword-detail.png`. Rendering/extraction used local PyMuPDF. Source PDF unchanged; no upload/publication.

## Controlling user exception

Latest instruction relayed by controller: **giữ lại của Bảo**. Preserve Bảo Room 2 (Bàn cờ Đông Dương), its map and four puzzles; separate `mat-ma-dien-bien-phu-bao` checkout untouched. PDF Room 2 mechanics below describe the document only. They do not authorize replacing the protected implementation. All other maps are rebuilt. This audit does not inspect or assert the exact mechanics of the protected build.

## Complete page inventory

| Pages | Verified content |
| --- | --- |
| 1–5 | Complete Quang museum/time-travel/five-room narrative and return to present. |
| 6 | Four historical stages, periods, team assignments, result/significance. |
| 7 | Only two red project deadline notes: `Dealine: 23h59p thứ 6 (30/10)` and `Quang và Thiện: 23h59p thứ 7 (1/11)`. These are production metadata, not plot/character additions. |
| 8–9 | **Completely blank**, visually confirmed. |
| 10 | Four-step Room 1 chain. |
| 11 | **Completely blank**, visually confirmed. |
| 12–13 | Stage 2 historical account + two written official-reference URLs. |
| 14–15 | Four-step Room 2 chain + chronological ordering note. |
| 16–17 | **Completely blank**, visually confirmed. No hidden Room 3 design. |
| 18–20 | Stage 4 historical account, results, significance, official-reference links. |
| 21 | Seven crossword questions/answers, vertical clue, final slogan, physical room instructions, Canva link. |
| 22 | Two embedded images: seven-row crossword and two 6×5 letter grids. No additional prose stage. |

## Plot and stage contract

Title: **MẬT MÃ ĐIỆN BIÊN PHỦ**. Subtitle: **Hành trình giải mã lịch sử – Viết tiếp câu chuyện hòa bình** (p1).

Protagonist is **Quang**, not Minh. Young university student, energetic, curious, interested in technology, puzzles and mysteries; initially perceives history as dates to memorize (p1). The other speaking entity is the mysterious **system voice**. Historical generals Henri Navarre/Nava and Đờ Cát are discussed in historical material. Team member names on p6–7 are authorship/work allocation; they are not story NPCs. PDF supplies no Hòa/Lan/Tuấn letter subplot.

Opening: visit **Bảo tàng Chiến thắng Điện Biên Phủ**; view artifacts and a painting of victory after 56 days and nights; wonder about experiencing history; touch painting; light/time vortex; awaken inside **Đờ Cát's command bunker on 7/5/1954**. Closed doors, wall maps, chaotic external sounds. System says five consecutive rooms: four challenges and final exit room; collect four picture fragments to complete the last door (p1–2).

| Room | Historical title and period | Required narrative result |
| --- | --- | --- |
| 1 | Xây dựng lực lượng và tạo thế chiến lược — **1950–giữa năm 1953** | Understand long preparation, army/rear strengthening, strategic initiative. Award fragment 1. |
| 2 | Kế hoạch Nava và cuộc tiến công chiến lược Đông – Xuân 1953–1954 — **giữa năm 1953–đầu năm 1954** | Understand attacks on exposed directions force dispersal of French mobile forces. Award fragment 2. Protected Bảo implementation controls mechanics/map. |
| 3 | Chuẩn bị và mở màn Chiến dịch Điện Biên Phủ — **tháng 12/1953–17/3/1954** | Preparation/logistics, tactical change, opening battles. Award fragment 3. |
| 4 | Tiến công quyết định và giành thắng lợi — **30/3–7/5/1954** (p3/p6); detailed chapter heading **Tổng tiến công và giành thắng lợi tại Điện Biên Phủ (1/5–7/5/1954)** (p18) | Include 30/3–30/4 background plus final 1–7/5 offensive, outcome/significance. Award fragment 4. |
| 5 | Final room / picture door / reflection; no formal room title supplied | Assemble all four fragments. Door initially remains closed. Reflect on living responsibly in peace; door opens; return to museum. |

Room 4 period headings differ, but content itself includes both intervals. Safest faithful organization: overall 30/3–7/5, subsections 30/3–30/4 and 1–7/5. No missing stage between Rooms 3 and 4 is specified.

Final-room question (p3): “Nếu được sinh ra trong hòa bình, ngươi sẽ làm gì để xứng đáng với những hy sinh đã làm nên hòa bình ấy?” Quang's model answer (p4) covers learning history correctly, valuing peace, sharing those values, studying/training and contributing to the community. Door message: **“Lịch sử đã được viết bằng sự hy sinh của thế hệ trước. Phần tiếp theo sẽ được viết bằng hành động của thế hệ hôm nay.”** Return to same painting; new understanding of courage, solidarity, sacrifice, responsibility and practical gratitude. Last line (p5): **“Mật mã cuối cùng đã được giải, nhưng câu chuyện hòa bình vẫn đang chờ thế hệ hôm nay viết tiếp.”**

PDF is linear prose and does not prescribe a scored player-written answer, exact text matching, skip/refusal, privacy, or storage behavior for this reflection. Controller's accepted design: reflection has skip and no judgment. Keep Quang's authored conclusion available without grading the player's beliefs.

## Room 1 — exact specified chain (p10)

1. **Torn letter on table.** Table inscription: “Muốn biết sức mạnh đến từ đâu, hãy khôi phục lời nhắn đã bị chia cắt.” Restore it. Correctly joined backs form a **map and A-03 marker**.
2. **Wall map → envelope A-03.** Match A-03 to a cell of the wall map. Envelope at that cell contains **four campaign cards** and instruction: “Những dấu mốc chỉ có ý nghĩa khi được đặt đúng trình tự.” Sort them chronologically.
3. **Campaign order → drawer.** Card-back symbols produce drawer code; document says **“chẳng hạn 2413”**. Thus `2413` is an example, not an immutable historical answer. Drawer contains **encoded telegram and character substitution table**. Telegram instruction: “Đối phương đang tìm cách giành lại quyền chủ động. Hãy tìm tên người được giao nhiệm vụ này.”
4. **Decode Henri Navarre / identify Kế hoạch Nava → iron box.** System accepts these findings; keyword opens iron box containing **fragment 1** and message leading onward.

Required objects: table/letter, wall map with addressable A-03, envelope with four cards, drawer, encoded telegram, conversion table, iron box, outgoing instruction/door. Their exact physical coordinates are not supplied.

**Missing from PDF:** complete letter wording; fragment count/cuts/orientation; map dimensions/content beyond A-03; campaign names/dates/order; actual card-back symbols; exact cipher mapping/ciphertext; whether final input needs name, plan or both; exact onward message. Any concrete implementation of those is authored completion. Do not claim the PDF supplies it. Room1 historical explanation p2/p6: resistance army/rear strengthened, victories shifted war balance, US assistance increased, France sent Nava to seek decisive victory.

## Room 2 — PDF reference only, protected Bảo mechanics take precedence

Historical account (p12): May 1953 Henri Navarre sent as French commander with US backing. Build strong mobile forces; defensive North/offensive South in 1953–54, later offensive North once stronger. Late September 1953 Politburo direction: attack relatively exposed directions, coordinate theaters, force enemy dispersal. Mid-November 316 Division moves northwest; French parachute occupation Điện Biên Phủ begins 20/11/1953. 6/12/1953 Politburo approves operation and opens campaign. Attacks: **Lai Châu 10/12/1953; Trung – Hạ Lào from 21/12/1953; Thượng Lào from 26/1/1954; Bắc Tây Nguyên from 27/1/1954**. These weaken concentrated mobile-force strategy and prepare decisive battle.

PDF setting (p14): staff room; Indochina wall map; table has Nava summary, four event cards, attack-direction cards; locked file box requires word and date code; contains fragment 2.

1. Join **two split plan pieces** (mobile-force building + decisive-victory aim). Reverse instruction: “Muốn phá thế tập trung, hãy tìm những hướng khiến đối phương phải chia quân.”
2. Four chronological events: **Navarre arrival 5/1953 → Politburo Đông–Xuân policy late 9/1953 → French occupation 20/11/1953 → Politburo campaign decision 6/12/1953**. Instruction: “Đặt các quyết định vào đúng thời điểm, rồi đọc dấu mốc cuối cùng.” Correct order reveals **0612**.
3. Four marked map sites: **Lai Châu, Trung – Hạ Lào, Thượng Lào, Bắc Tây Nguyên**. Match direction cards using nearby location/date sources. Each correct placement moves one French-force symbol to respond there. When all four correct: “Các hướng tiến công đã buộc quân Pháp phải làm gì với lực lượng cơ động?” Answer **PHÂN TÁN LỰC LƯỢNG**; explicitly accept short **PHÂN TÁN**.
4. Enter **PHÂN TÁN + 0612** to open box and award fragment 2. Message: “Kế hoạch tập trung quân của đối phương đã bị phá vỡ. Hành trình giải mã vẫn còn tiếp tục.”

Ordering explicitly mandated p15: **event cards before map**, since 6/12 precedes the subsequent attacks. Room2 only awards fragment2; Room3 entry design belongs to that stage team. PDF no coordinates or actual geographic outline. Compare implementation rather than overwriting protected Bảo on the assumption this supersedes user instruction.

## Room 3 — narrative requirements, no detailed minigame pages

Only p2–3/p6 describe this room. Pages16–17 are actually blank; there is no detailed mechanism, cipher/grid/map drawing or answer key to recover.

Must cover:

- Period **December1953–17March1954**.
- Maps, battle diagrams, preparation documents.
- Chronological sequencing of events and decoding tactical guidance.
- Change from **“đánh nhanh, giải quyết nhanh” → “đánh chắc, tiến chắc”** (this exact initial wording is what PDF p3 prints).
- Transport food/weapons, pull artillery to battlefield, construct positions, soldiers and civilian supply labor; prudence, determination, collective effort.
- **13/3/1954 Him Lam** opens campaign; then attack **Độc Lập**; **Bản Kéo French forces surrender 17/3**, northern sector collapses (p6).
- Complete room and award **fragment3**.

PDF does **not** provide change-of-method date, Độc Lập date, puzzle count, exact event cards/order beyond described history, mechanical interactions, solution code, reward container, or exact objects/positions. Controller can author concrete puzzles consistent with verified historical material; label them implementation design, not transcription.

## Room 4 — historical material and exact puzzle chain

Historical display material (p18–19): second offensive begins **30/3**, battles C1/A1, trenches tighten ring and control much of Mường Thanh airfield, supply deteriorates and French position **bị động** by late April. Third offensive **1/5**, remaining points in east/west, deeper trenches. **Night6/5**, approximately **one ton** explosive under A1 then infantry advance. **7/5**, assault command center; about **17:30**, capture Đờ Cát and entire command staff; **“Quyết chiến – Quyết thắng”** flag on bunker; pursue remaining forces at night. **56 days/nights**, **16,200 killed/captured**. Capture arms, depots, equipment; destroy strongpoint group and Nava plan. Decisive blow to French effort, favorable basis for **1954 Genève** ceasefire; northern liberation/rear for later reunification; encouragement to anti-colonial independence movements.

Physical room specification (p21):

- **Treasure chest at center**, contains final/4th fragment.
- Historical documents/images on surrounding walls: final offensive, A1, Đờ Cát capture time, campaign results.
- **Table behind chest**, carrying **two cipher boards**.
- **Cipher1 must be solved before final cipher**. Historical answers → crossword → choose proper vertical column → clue → final letter-grid code → input; system correct notice makes chest **open automatically**.
- No 3200×1920 layout, bridge, trench journey, hill traversal, seven letter quests, Hòa/Lan/Tuấn NPCs or 1955 timeline are required by this PDF. Those are pre-existing design choices, not this source's map specification.

### Cipher1: questions and exact answers (p21, image p22)

| Row | Question focus | PDF answer | Uppercase, unaccented entry | Answer length |
| --- | --- | --- | --- | --- |
| 1 | Third-offensive objective for remaining positions | Tiêu diệt | TIEUDIET | 8 |
| 2 | French position by lateApril after defense weakens | Bị động | BIDONG | 6 |
| 3 | Tons of explosive used at A1 night6/5 | Một Tấn | MOTTAN | 6 |
| 4 | Target of direct assault 7/5 to end battle | Sở chỉ huy trung tâm | SOCHIHUYTRUNGTAM | **16** |
| 5 | Captured item in addition to 16,200 troops | Vũ khí | VUKHI | 5 |
| 6 | Liberated Vietnamese region/revolution rear | Miền bắc | MIENBAC | 7 |
| 7 | World independence-movement aim | Độc lập dân tộc | DOCLAPDANTOC | 12 |

Image instructions: **VIẾT HOA**, **KHÔNG thêm dấu**. Choose a top-to-bottom vertical column producing a meaningful phrase; it is clue to final code. Page21 explicitly says correct vertical column is **“cột dọc đầu tiên”**, and clue **TÌM T VÀ L**. Do not confuse with first character of every answer; rows have staggered starts.

Exact drawn geometry, zero-based columns relative to left edge of row4:

| Row | Start column | Drawn cells | Index within answer at common column8 (zero-based) | Extracted letter |
| --- | --- | --- | --- | --- |
| 1 | 8 | 8 | 0 | T |
| 2 | 7 | 6 | 1 | I |
| 3 | 8 | 6 | 0 | M |
| 4 | 0 | **15** | 8 | T |
| 5 | 8 | 5 | 0 | V |
| 6 | 3 | 7 | 5 | A |
| 7 | 5 | 12 | 3 | L |

Thus common column8 yields **TIMTVAL**, spaced **TÌM T VÀ L**. There is a **real source artwork defect**: row4 draws 15 cells, but exact given answer requires16. Minimal runnable correction: keep all starts/extraction alignment and add one trailing cell to row4. Do not silently truncate correct historical answer. This is an implementation repair of PDF image, not exact grid fidelity.

### Cipher2: exact p22 two 6×5 grids and traversal

Grid1, upper left:

```text
Q U Y E T
U N C A H
A M H T A
C T I C N
A A E L G
M T N A T
```

Grid2, lower right (its upper edge aligns with bottom row of grid1):

```text
Q N A V E
U L T A V
Y N L N I
E B C L O
T Q M A L
T H A N G
```

Find **T shape in grid1**: whole top row left→right **QUYET**, then middle column (1-based column3) rows2→6 **CHIEN** → **QUYETCHIEN**. Find **L shape in grid2**: first column top→bottom **QUYETT**, then last row columns2→5 **HANG** → **QUYETTHANG**. Final specified answer **QUYẾT CHIẾN, QUYẾT THẮNG**. Grid image includes dashed answer line below and says accurate code opens hidden chest to collect final fragment.

P22 top-left wording also says a “con dấu thông hành” to pass next historical milestone; this is generic puzzle-sheet wording. Plot/p21 consistently require four picture fragments and fragment4 chest; no separate stamp-collection system is specified.

## References actually present in PDF

P6 has unresolved attribution snippets (`mod.gov.vn+1`, `mod.gov.vn+2`, `Bộ Tư lệnh Lăng Hồ Chí Minh+1`, `Bảo tàng Lịch sử Quân sự Việt Nam+1`), not usable direct citations.

P13 printed URLs:

- https://baotanglichsu.vn/vi/Articles/3097/13850/ke-hoach-na-va-va-chien-cuc-djong-xuan-1953-1954.html
- https://baotanglichsu.vn/VI/Articles/3097/74810/ky-niem-70-nam-ky-ket-hiep-djinh-geneva-1954-2024-moc-son-lich-su-cua-ngoai-giao-cach-mang-viet-nam-bai-1-con-djuong-djen-hoi-nghi-geneva.html

P20 embedded link targets (tracking removed here):

- https://baotanglichsu.vn/vi/Articles/2002/67999/tran-quyet-chien-chien-luoc-tieu-diet-tap-djoan-cu-djiem-djien-bien-phu-13-3-7-5-1954-djot-iii-djon-quyet-djinh.html
- https://caa.gov.vn/Pages/Print.aspx?NewsId=20240329111742840
- https://tulieuvankien.dangcongsan.vn/ho-so-su-kien-nhan-chung/su-kien-va-nhan-chung/chien-thang-lich-su-dien-bien-phu-751954-3368

P21 puzzle-design reference: https://www.canva.com/design/DAGrKfWwiWk/1hueEeBBFheip7blJP9kfA/edit. Did not access Canva; embedded p22 assets were sufficient and authoritative for this extraction. Did not independently browse historical references during this source audit; historical factual checking is a separate verification task.

## Unspecified product decisions

PDF prescribes no engine, screen sizes, movement keys, mobile controls, save system, exact map dimensions, minimap, sound implementation, hints/penalties/timers, accessibility, title/menu, transition mechanics, or artwork. Intro says sounds exist in scene, not a specific audio API or voice actor. Five rooms means **four historical challenges + final assembly/reflection**, not a four-room game and not a five-stage1954–1975 campaign. Names/titles supplied only through above narrative; do not invent claim of explicit PDF names for Room5.

## Unresolved questions / concrete concerns

1. Room1 exact letter/cards/cipher contents absent; controller must author/verify details. `2413` is example. Can implement autonomously within approved rebuild scope and describe authored completion accurately.
2. Room3 detailed minigames entirely absent; controller must author mechanics aligned to narrative/history. Blank pages are verified, not extraction loss.
3. Crossword row4 art short by1 cell. Recommend one trailing cell; preserve answer/extraction alignment. Must report fidelity limitation.
4. Room4 period heading varies; use30/3–7/5 overall and1–7/5 final section. No blocker.
5. Protected Bảo Room2 may differ from PDF mechanism; user protection overrides. Preserve build and document the intentional exception. No changes authorized here.
