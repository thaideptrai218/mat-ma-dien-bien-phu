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
