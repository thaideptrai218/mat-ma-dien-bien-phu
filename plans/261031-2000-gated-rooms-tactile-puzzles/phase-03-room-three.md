# Phase 03 — Phòng 3: Trạm tiếp vận (barie đường mở sau bãi hàng)

## Context links
- `src/room-three/world.js:3-51` (vách x1780 `[1780,350,26,280]`,`[1780,900,26,100]`; entry (300,1720); 14 object)
- `src/room-three/rules.js:3-22` (DOCUMENT_ORDER, CHALLENGES xen kẽ giấy→thử thách; `final` cần 4 thử thách)
- `src/room-three/puzzle-data.js:2-7` CHALLENGES (preparation/cargo/strategy/opening + reward THÁNG 3, NĂM 1954, ĐÁNH CHẮC TIẾN CHẮC, NGÀY 13)
- `src/room-three/answers.js` evaluators; `finalCorrect` = 13/03/1954
- Panels: `preparation-panel.js`, `cargo-panel.js`, `strategy-panel.js`, `opening-panel.js`, `puzzles.js:39` (final nhập ngày), `session.js:76` (`show('final',{tokens})`), `puzzle-controls.js:68` `orderedCards`
- `src/room-three/content.js:145-166` SYSTEM_HINTS; test `tests/room-three-world.test.js:15-56`

## Overview
P2 · pending · M (5h). Thứ tự: 01 Hồ sơ chuẩn bị (520,1550) → Tủ hồ sơ (820,1500) → 02 Nhật ký tiếp vận (1280,1310) → **Bãi hàng** (1510,1030) → 03 Hai bức điện (2020,520) → Lều chỉ huy (2280,620) → 04 Thư (2700,880) + 05 Báo cáo (2780,1250) → Trạm điện đài (2670,1510) → Rương (2390,1740) → Cửa (3010,1800).

## Key insights
- Mọi thứ trước `cargo` nằm ở x<1780; mọi thứ sau ở x>1780 ⇒ một hàng rào dọc x1780 là cổng tự nhiên, lại khớp nội dung (công binh mở đường, tranh "Công binh làm đường").
- Rào phải nằm ngoài `WORLD.walls` (test `room-three-world` khẳng định mọi object tới được từ entry và kiểm tra lối đi cụ thể).
- Prop `tools` (x1668–1812) chồng lên khe y630–900 — chấp nhận (va chạm trùng), object `road-tools` (1740,830) vẫn ở phía tây.

## Requirements
**Cổng `supply-road`** (style `barrier`: cọc tre + barie), mở khi `completedChallenges.includes('cargo')`: rect `[1780,44,26,306]`, `[1780,630,26,270]`, `[1780,1000,26,956]`. Mở: cọc đổ sang bên (reduced-motion: biến mất ngay). Notice: "Đường lên lều chỉ huy còn chắn. Bãi hàng tiếp vận chưa thông tuyến."
**Xúc giác** (payload `answers.js` giữ nguyên):
- Chuẩn bị: 5 thẻ A–E kéo lên 3 mốc dòng thời gian → `groups`; vật tư: kéo biểu tượng vào "kho" (bin nhiều chỗ) → `supplies`; câu "vì sao" giữ radio.
- Bãi hàng: 6 nhãn chú thích kéo lên 6 tranh (capacity 1) → `matches`.
- Lều chỉ huy: thẻ chữ ĐÁNH/NHANH/GIẢI QUYẾT/NHANH và ĐÁNH/CHẮC/TIẾN/CHẮC kéo vào khe bức điện → `initial`/`final` (thứ tự id; NHANH/CHẮC hoán đổi như `telegramCorrect`).
- Điện đài: kéo 3 tin vào dòng thời gian → `order`; kéo thẻ ngày lên từng tin → `dates`; select mục tiêu/đầu hàng giữ.
- Rương: khóa 3 khe Ngày/Tháng/Năm; kéo thẻ thưởng đã nhận (NGÀY 13, THÁNG 3, NĂM 1954; ĐÁNH CHẮC TIẾN CHẮC là thẻ nhiễu có sẵn) → ghép `date:"13/03/1954"`; thẻ sai khe ⇒ chuỗi ngày không hợp lệ ⇒ sai trung tính.

## Architecture
`completedChallenges` → `lockedGateIds` → `RoomThreeScene` + map. Panel → token-bins → payload cũ → `actions.js` `*-submit` không đổi. Token thưởng lấy từ `recoveredTokens(state)` (`rules.js:9`) — không tạo dữ kiện mới.

## Related code files
Tạo: `src/room-three/area-gates.js`, `src/room-three/final-lock-panel.js` (nếu `puzzles.js` vượt 200 dòng), `tests/room-three-gates.test.js`.
Sửa: `src/room-three/scene.js` (option `areaGates`, vẽ barie), `session.js`, 4 panel + `puzzles.js`, `puzzle-controls.js` (giữ `orderedCards` làm fallback hoặc thay), `content.js` (SYSTEM_HINTS `final.open` nếu Q3), `styles.css`.

## Implementation steps
1. AREA_GATES + test: khóa → `command-telegrams`, `command-tent`, `opening-letter`, `north-report`, `radio-station`, `chest`, `door`, `field-lamp` không tới; phía tây tới được; mở → tất cả. Bất biến goal theo chuỗi state.
2. Scene/session wiring + notice.
3. Thay select/checkbox bằng token-bins từng panel (giữ `finishForm` submit).
4. Rương: khe ngày dùng token-bins (bin capacity 1, nhận token thưởng).
5. SYSTEM_HINTS `final.open`: "Ký Chủ, ổ khóa rương có ba khe; các thẻ đã khôi phục sẽ vừa vào đó." (không số) → voice:script.
6. Test/build/QA.

## Todo
- [ ] gates + tests
- [ ] wiring + barie art
- [ ] preparation/cargo/strategy/opening tactile
- [ ] final lock slots
- [ ] hints + voice:script
- [ ] test/build/QA

## Success criteria
- Test cũ `room-three-*` xanh; evaluators không đổi; ngày 13/3/1954 giữ.
- Không vào nửa đông trước bãi hàng; mở ngay sau thử thách.
- Bàn phím hoàn thành 5 thao tác.

## Risk
| Rủi ro | K×T | Giảm thiểu |
|---|---|---|
| Rào dài 1.900px "biến mất" trông lạ | TB×Thấp | art: cọc ngả + dây chùng, giữ dấu vết không va chạm |
| Kéo-thả làm 4 panel nặng hơn (nhiều thẻ) | TB×TB | dùng chung token-bins; giữ câu hỏi radio/checkbox ngắn |
| Lối đi giữa `tools` và rào hẹp | Thấp×TB | test reachability `road-tools` khi khóa |

## Security
Không đổi save; text qua textContent.

## Next steps
Phụ thuộc phase 6. Cập nhật mục Room 3 trong `docs/code-standards.md` (graph giữ nguyên + cổng).

## Implementation status (2026-10-31) — DONE (pending voice:script)
Thiết kế cuối (thay cho 1 barie duy nhất): 5 cổng, mỗi cổng đúng 1 cách mở, cố định trong `src/room-three/area-gates.js` (không vào WORLD.walls). Tiến trình: kho đầu → sân sổ → bãi hàng → trại chỉ huy → trại đông → trạm điện đài.

| # | id | Vị trí / kiểu | Chặn | Cách mở | Điều kiện / câu đố (thành phần dùng chung) |
|---|---|---|---|---|---|
| 1 | depot-rope | dây kho dọc x1090 (rope) | sổ tiếp vận + toàn bộ phần sau | auto | xong Hồ sơ chuẩn bị (tủ hồ sơ) |
| 2 | cargo-pen | rào vây bãi hàng 300x300 (bars), cửa phía nam | bãi hàng tiếp vận | puzzle | kéo thẻ "Công binh làm đường" vào ổ khóa (token-bins), dựa Sổ người đi cùng chuyến hàng |
| 3 | road-barrier | barie đường x1780 (barrier) | lều chỉ huy, hai bức điện, toàn bộ phía đông | auto | xong Bãi hàng (cargo) |
| 4 | east-yard-curtain | tấm bạt dọc x2540 (curtain) | thư 04, báo cáo 05, trạm điện đài, cửa ra | auto | xong Hai bức điện ở lều chỉ huy (strategy) |
| 5 | radio-pen | dây vây trạm điện đài 300x300 (rope), cửa phía bắc | trạm điện đài | puzzle | thước trượt tới ngày Độc Lập bị tiêu diệt (range-ruler), dựa Thư 04 |

- Rương và cửa ra nằm ngoài các rào; vẫn khóa bằng cốt truyện như cũ (4 thử thách, mảnh tranh).
- Cổng puzzle không bao giờ tự mở; `legacy` chỉ là lưới an toàn cho save cũ (tiến độ chỉ có thể có sau cổng ⇒ cổng mở).
- Lưu: `state.doorsSolved` (save v1, tương thích ngược: thiếu ⇒ [], id lạ bị loại). `goals.js` chỉ chuyển mục tiêu sang cửa khi trạm nằm sau cổng puzzle còn khóa.
- Thông báo chạm cổng: auto "Hệ Thống: Ký Chủ hãy …", puzzle "Nhấn E để mở khóa".
- Xúc giác (payload `answers.js` giữ nguyên): Chuẩn bị = kéo 5 thẻ vào 3 mốc + kéo vật tư vào kho (có 2 thẻ nhiễu) + radio; Bãi hàng = kéo 6 chú thích lên 6 tranh (khay dính khi cuộn); Lều chỉ huy = kéo từ vào 2×4 khe; Điện đài = kéo 3 tin vào dòng thời gian + kéo 3 ngày lên tin + select/checkbox; Rương = kéo thẻ thưởng đã nhận vào khe Ngày/Tháng/Năm ⇒ `13/03/1954`. Thiếu thẻ ⇒ nhắc trung tính, không tính lần sai. `orderedCards`/select bị gỡ.
- SYSTEM_HINTS: cập nhật `open` của preparation/cargo/strategy/opening/final, thêm `door-cargo-pen`, `door-radio-pen` (không chữ số, "Ký Chủ"). Còn lại: lead chạy `npm run voice:script` rồi sinh audio.
- Test: `tests/room-three-gates.test.js` (1 cách/cổng, có cả 2 loại, reachability từng cổng + không có điểm E nào tới được khi khóa, mục tiêu tới được suốt cốt truyện, save cũ), `tests/room-three-tactile.test.js`. `tests/system-address-dialogue.test.js`: thêm 2 khóa door vào danh sách Phòng 3.
- Mã: `area-gates.js`, `tactile-model.js` (thuần), `tactile-board.js`, `door-panel.js`; sửa scene/session/actions/ui/panels/puzzles/panel 4 trạm/rules/save/goals/content/styles.
