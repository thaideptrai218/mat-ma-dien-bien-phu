# Phase 01 — Phòng 1: Kho lưu trữ (gian V/P mở sau A-03)

## Context links
- `src/room-one/world.js:3-53` (walls `:8-9` vách x988 & x1376; entry `:37`; 13 objects)
- `src/room-one/rules.js:15-36` reducer: letter → map(A03) → read/collect ×4 → comparison → drawer(2413) → identity(HENRINAVARRE) → chest(NAVA) → exit
- `src/room-one/session.js:76-103` `interact`/`isLocked`; reset `:120-126`
- `src/room-one/ui-puzzles.js:20-70` bảng đối chiếu (2 ô số + 6 select); `:72-101` form drawer/identity/chest
- `src/room-one/content.js:151-172` SYSTEM_HINTS (a03, comparison, drawer, identity, chest)
- Phase 06 (area-gates, token-bins, combination-dial)

## Overview
P2 · pending · M (5h). Thứ tự hiện tại: Thư (1200,1250) → Bản đồ A-03 (1200,280) → V-01 (430,650), V-02 (630,980), P-01 (1970,650), P-02 (1770,980) → Bàn đối chiếu (1200,820) → Ngăn kéo (2030,320) → Rương (780,300) → Cửa (1200,100).

## Key insights
- Đọc hồ sơ vốn đã khóa logic bằng `envelopeOpened` (`session.js:96`) ⇒ cổng chỉ "vật chất hoá" khóa sẵn có, không thêm bước.
- Phòng giữa (x1024–1376) chứa entry, thư, bản đồ, bàn đối chiếu, cửa ⇒ khóa hai gian không chặn bước 1.
- Vách x988 hở ở y 48–144, 374–520, 720–1100, 1290–1552 (tương tự x1376) ⇒ 8 rect.

## Requirements
**Cổng `archive-wings`** (style `bars`, "song gỗ tủ lưu trữ"), mở khi `state.envelopeOpened`:
`[988,48,36,96],[988,374,36,146],[988,720,36,380],[988,1290,36,262]` + bản x1376 tương ứng. Notice: "Hai gian lưu trữ còn cài then. Phong bì ở ô bản đồ sẽ có chìa." (không đáp án).
**Xúc giác** (payload giữ nguyên):
- Bàn đối chiếu: 8 thẻ dữ kiện (252.000, 445.000, Còn hạn chế, Hiện đại, Giữ thế chủ động, Lực lượng phân tán, Tiếp tế hậu cần, Tài chính chi phí chiến tranh) trộn chung một khay → kéo vào 8 ô (capacity 1). Xuất `{troopVN:Number, troopFrance:Number, equipmentVN…}` như `ui-puzzles.js:63-66`. Thẻ chỉ hiện khi hồ sơ đã ghi (đã có điều kiện 4/4).
- Ngăn kéo: khóa 4 bánh số → `code` (2413).
- Điện mật: giữ ô nhập, thêm bảng chữ A–Z thành nút bấm chèn chữ (alphabet `ui-puzzles.js:83-84` đổi span → button) + nút xoá.
- Rương: khóa 4 bánh chữ A–Z → `keyword` (NAVA).
- Bản đồ A-03: giữ nguyên (đã là bấm ô).

## Architecture
`state.envelopeOpened` → `lockedGateIds(R1_GATES)` → `scene.setLockedGates`, `ui.render({lockedGateRects})`. Panels: token-bins/dial → `emit('comparison-submit'|'drawer-submit'|'chest-submit', payload cũ)` → `actions.js` không đổi.

## Related code files
Tạo: `src/room-one/area-gates.js`, `tests/room-one-gates.test.js`.
Sửa: `src/room-one/session.js` (truyền `areaGates`, `onGateBlocked`, render gate), `src/room-one/ui-puzzles.js`, `src/room-one/content.js` (SYSTEM_HINTS `comparison.open`, `drawer.open`, `chest.open` — chỉ nếu Q3 đồng ý), `src/room-one/styles.css`.
Không sửa: `scene.js`, `ui-map.js`, `ui.js`, `ui-elements.js` (phase 6 / dùng chung phòng khác).

## Implementation steps
1. `area-gates.js` export `AREA_GATES` (8 rect, `unlockedBy: s => s.envelopeOpened`).
2. Session (`session.js:26-32` hiện chỉ truyền callbacks): `new RoomOneScene({...,onGateBlocked}, {areaGates: AREA_GATES})` (các option khác giữ default của `scene.js:10-11`); trong `render()` gọi `setLockedGates` + truyền `lockedGateRects`.
3. Comparison → token-bins; giữ submit button.
4. Drawer/chest → combination-dial; identity → keypad.
5. SYSTEM_HINTS (nếu duyệt): ví dụ `drawer.open`: "Ký Chủ, xoay bốn bánh khóa của ngăn kéo này." `chest.open`: "Ký Chủ, chiếc rương có khóa chữ, cần một từ lấy từ danh tính vừa giải." Không chữ số. Chạy `npm run voice:script`.
6. Test + build.

## Todo
- [ ] AREA_GATES + test reachability
- [ ] session wiring + notice
- [ ] comparison token-bins
- [ ] dial drawer/chest, keypad identity
- [ ] SYSTEM_HINTS + voice:script (nếu duyệt)
- [ ] npm test / build / QA tay

## Success criteria
- Test mới: `worldWithGates(WORLD, AREA_GATES, createState())` → v1,v2,p1,p2,drawer,chest KHÔNG tới được; letter, map-a03, comparison, door tới được; với `envelopeOpened:true` → tất cả tới được.
- Bất biến: với chuỗi state chuẩn (mới → letterSolved → envelopeOpened → …), `goalFor(s).id` luôn tới được.
- `tests/room-one-*.test.js` cũ xanh; đáp án 2413/HENRI NAVARRE/NAVA/252000/445000 không đổi.

## Risk
| Rủi ro | K×T | Giảm thiểu |
|---|---|---|
| Thẻ 252.000/445.000 làm câu đố dễ hơn (không phải nhớ số) | TB×TB | Q2: thêm thẻ nhiễu từ chính hồ sơ V/P [UNVERIFIED có số khác] |
| Prop lamp/crate/radio (tùy chọn) nằm sau cổng | Chắc×Thấp | Chấp nhận; chỉ là đồ vật phụ |
| Đổi hint → manifest voice lệch | Cao×TB | voice:script trong cùng commit |

## Security
Không đổi save; text qua textContent.

## Next steps
Phụ thuộc phase 6. Cập nhật `docs/codebase-summary.md` mục Phòng 1.
