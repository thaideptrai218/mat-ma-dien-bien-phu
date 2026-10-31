# Phase 04 — Phòng 4: Lưu trữ chiến thắng (khu mật mã mở sau cột dọc)

## Context links
- `src/room-four/world.js:3-51` (vách y414 `[830,414,330,30]`,`[1640,414,330,30]`; vách dọc `[1120,796,28,292]`,`[1652,796,28,292]`; entry (1400,1630))
- `src/room-four/rules.js:23-41` (7 giấy → crossword → `column===8` → shape T/L → final `QUYETCHIENQUYETTHANG` → fragment → exit)
- `src/room-four/crossword.js:13-27,101-105` (nút chọn cột 1–17 → `column-submit {column}` 0-based)
- `src/room-four/puzzles.js:5-47` bảng T/L (bấm ô), `:49-72` final nhập câu
- `src/room-four/puzzle-data.js:14-24` BOARDS (phrase QUYETCHIEN / QUYETTHANG)
- `src/room-four/content.js:134-155` SYSTEM_HINTS; test `tests/room-four-world.test.js:7-40`

## Overview
P2 · pending · M (4h). Thứ tự: 01 (360,1330) → 02 (330,760) → 03 A1 (620,320) → 04 Sở chỉ huy (2180,320) → 05 (2470,760) → 06 (2420,1320) → 07 (1770,1540) → Ô chữ (1400,240) → **Cột dọc** → Bàn T (1080,570) + Bàn L (1720,570) → Rương (1400,950) → Cửa (1400,100).

## Key insights
- Tư liệu 03/04 nằm ở dải bắc nên không thể khóa dải bắc; vùng giữa (bàn T/L + rương) chỉ dùng sau cột dọc ⇒ dây chắn hình hộp quanh vùng giữa là cổng hợp lý, lối vòng hai bên (x<830, x>1970) vẫn thông lên ô chữ.
- Ô chữ là nhớ từ ⇒ giữ gõ phím (YAGNI); xúc giác dồn vào cột, T/L, rương.

## Requirements
**Cổng `cipher-cordon`** (style `rope`, cọc đồng + dây nhung bảo tàng), mở khi `state.columnSolved`: `[1160,414,480,30]` (khe giữa vách y414), `[830,444,30,706]`, `[1940,444,30,706]`, `[830,1120,1140,30]`. Notice: "Dây chắn khu mật mã còn căng. Lời chỉ dẫn ở ô chữ sẽ mở lối."
**Xúc giác**:
- Cột dọc: thước đọc trượt (range-ruler 1–17) phủ cột trên bảng; nút "Đọc cột này" → `column-submit {column: value-1}` (đáp án vẫn 8).
- T/L: thêm "bút dò" — giữ chuột/ngón tay quét qua ô để chọn liên tiếp; bấm từng ô + bàn phím giữ nguyên; payload `selected` cũ.
- Rương: hai dải chữ đã nhận (đọc từ BOARDS phrase của bảng đã giải) kéo vào 2 khe khóa → `phrase` ghép theo thứ tự khe (QUYẾT CHIẾN QUYẾT THẮNG). Ô nhập cũ giữ ẩn-readonly làm hiển thị.

## Architecture
`columnSolved` → gate; panel → range-ruler/token-bins → `column-submit`/`shape-submit`/`final-submit` cũ.

## Related code files
Tạo: `src/room-four/area-gates.js`, `tests/room-four-gates.test.js`.
Sửa: `src/room-four/scene.js` (option `areaGates`, vẽ dây), `session.js`, `crossword.js` (`columnPanel`), `puzzles.js`, `content.js` (SYSTEM_HINTS `column.open`, `final.open` nếu Q3), `styles.css`.

## Implementation steps
1. AREA_GATES + test: khóa → `board-t`, `board-l`, `chest` không tới; 7 giấy, crossword, door, lamp, radio tới được; mở → tất cả; bất biến goal.
2. Wiring scene/session/map + notice.
3. `columnPanel`: range-ruler + highlight cột (CSS class theo value).
4. Bút dò: pointerdown → toggle mode, pointerenter trên ô → áp mode; pointerup kết thúc.
5. Final: token-bins 2 dải × 2 khe.
6. Hints (không số): column "Ký Chủ, trượt thước đọc dọc theo ô chữ, cột nào thành lời?"; final "Ký Chủ, đặt hai dải chữ vào khóa rương theo đúng thứ tự." → voice:script.
7. Test/build/QA.

## Todo
- [ ] gates + tests
- [ ] wiring + rope art
- [ ] ruler cột
- [ ] bút dò T/L
- [ ] khóa 2 dải
- [ ] hints + voice:script
- [ ] test/build/QA

## Success criteria
- `room-four-*` test cũ xanh; reducer không đổi; QUYẾT CHIẾN QUYẾT THẮNG giữ.
- Không tới bàn T/L/rương trước cột dọc.
- Thước & khóa thao tác được bằng bàn phím (range native, token-bins phím).

## Risk
| Rủi ro | K×T | Giảm thiểu |
|---|---|---|
| Khóa 2 dải chỉ 50% đoán | Chắc×Thấp | chấp nhận ("nhè nhẹ"); sai → neutral + hint card |
| Lamp prop sát dây đáy (y1166 vs 1150) | Thấp×Thấp | test reachability `lamp` |
| Dải chữ hiển thị trước khi giải bảng | Thấp×TB | chỉ đưa phrase của bảng `boardXSolved` |

## Security
Như phase khác.

## Next steps
Phụ thuộc phase 6.

## Implementation status (2026-10-31) — DONE (pending voice:script)
Thiết kế cuối (thay cho 1 dây chắn duy nhất): 7 cổng cắt đại sảnh thành chuỗi khu, mở theo đúng thứ tự đọc 7 tư liệu; mỗi cổng đúng 1 cách mở, cố định trong `src/room-four/area-gates.js` (không vào WORLD). Puzzle gate không bao giờ tự mở; `legacy` chỉ là lưới an toàn cho save cũ (đã đọc/ghi tư liệu sau cổng).

| # | id | Khu mở ra | Rect(s) | Cách mở | Điều kiện / câu đố |
|---|---|---|---|---|---|
| 1 | final-assault | 02 (tây) | [48,1030,782,32] | auto | đã ghi tư liệu 01 |
| 2 | a1-night | 03 + gian ô chữ + cửa (tây bắc/bắc) | [48,430,782,32] | puzzle | kéo thẻ "Tổng công kích" vào ổ khóa (token-bins) |
| 3 | headquarters | 04 (đông bắc) | [1800,48,32,366] | auto | đã ghi tư liệu 03 (A1) |
| 4 | results | 05 (đông) | [1970,520,782,32] | puzzle | xoay 4 bánh số thành giờ chiếm sở chỉ huy (combination-dial) |
| 5 | north | 06 + máy điện đài (đông nam) | [1970,1000,782,32] | puzzle | thước trượt tới số ngày đêm chiến dịch (range-ruler) |
| 6 | independence | 07 (nam) | [1580,1150,32,602] + [1990,1032,32,720] | auto | đã ghi tư liệu 06 |
| 7 | cipher-cordon | bàn T, bàn L, rương | hộp [1160,414,480,30] [830,444,30,706] [1940,444,30,706] [830,1120,1140,30] | auto | `columnSolved` |

- 4 auto + 3 puzzle (trộn, không xen kẽ cứng). Khu đầu (lối vào + tư liệu 01 + đèn) luôn mở. Gian ô chữ + cửa cùng khu với A1 (ô chữ vẫn khóa theo logic 7 tư liệu).
- Chạm cổng khóa: auto -> "Hệ Thống: Ký Chủ hãy … trước"; puzzle -> "Nhấn E để mở khóa" (E tại ổ khóa `door:<id>`; mục tiêu hiện tại tự chỉ vào ổ khóa nếu bị chắn).
- Lưu: `state.doorsSolved` (save cũ thiếu field -> []), sanitize theo DOOR_IDS. Reducer action `door`; UI emit `door-submit`.
- Xúc giác: giữ ô chữ gõ; cột chọn bằng thước trượt 1–17 + tô sáng cột (`column-submit {column:value-1}`); bàn T/L có bút dò quét (`shape-sweep-model.js`, pointer + Bresenham, bàn phím vẫn bấm từng ô); rương: kéo 2 dải QUYẾT CHIẾN / QUYẾT THẮNG vào 2 khe (`final-strips-*.js`), phrase ghép theo thứ tự khe.
- Hint (Hệ Thống, tự lên khi sai): cập nhật column / board-t / board-l / final; thêm door-a1-night, door-results, door-north. Cần `npm run voice:script` + sinh audio (voice-manifest đỏ do đổi SYSTEM_HINTS).
- Test: `tests/room-four-gates.test.js` (1 cách/cổng, có cả 2 loại, reachability từng cổng theo khu, goal tới được suốt cốt truyện, save cũ), `tests/room-four-tactile.test.js`; thêm 3 khóa door-* vào dòng Room 4 của `tests/system-address-dialogue.test.js`. QA headless Chrome (room-four.html): bump + notice, 3 loại khóa, thước cột, bút dò, 2 dải rương đều qua.
