# Phase 02 — Phòng 2: Bàn cờ Đông Dương (lán điện đài mở sau Cán cân 84)

## Context links
- Donor (CHỈ ĐỌC): `src/room-two/bao/content/world-data.js` (walls, interactables, exits.gate `[2208,532,24,296]`), `bao/content/story-data.js:424-747` (4 puzzle, `requiresPuzzleId`), `bao/ui/puzzle-view.js:139-175` `show()` gọi `this.renderBalance/renderInterleave/renderFist/renderFold(view)` qua instance; `:225-244` balance (input `#balance-weights`, ±, `.balance-scale`, `#balance-readout`, select thẻ việc); `:246-262` interleave (input text `name=french|vietbac`, nút tô chữ lẻ gắn `this.hintUsed`); `:264-301` fist (select `#fist-card/#fist-region`, `#fist-play`); `:303-321` fold (radio `fold-target`, `#fold-code`)
- Adapter: `src/room-two/world.js:4` (WORLD = donor map), `rules.js:20-43` (`submit-puzzle` theo thứ tự PUZZLE_IDS), `session.js:161-179` interact, `ui.js:34-41` (mẫu wrap instance `showFeedback`), `scene.js:16-33` (exit gate), `system-guidance.js:110-127` SYSTEM_HINTS
- Test bảo vệ: `tests/room-two-content.test.js:14-24` (deepEqual WORLD/OBJECTS với snapshot), `:26-36` (SHA thân renderer/art/CSS), `:38-42` (reachability)

## Overview
P1 trong phase này (yêu cầu trực tiếp của người dùng) · pending · L (7h).
Thứ tự hiện tại: Sổ kế hoạch (530,270) → **Cán cân 84** (250,330) → Ghi chú điện đài (2150,200) → **Điện đài** (1950,300) → 4 mẩu tin: nhật ký (285,1040), báo (1250,1060), điện liên quân (1950,1080), lịch 2/1954 (1160,260) → **Sa bàn** (1470,690) → Hồ sơ ĐBP (1765,790) → **Hòm sắt** (1710,730) → Cửa đông (2290,680).

## Key insights
- **Không cần sửa donor.** `show()` gọi renderer qua `this.` ⇒ adapter gán đè method trên instance (`this.puzzle.renderBalance = …`) giống `ui.js:37-41`. Wrapper gọi bản gốc, rồi bổ sung/ẩn node; đồng bộ bằng cách đặt `input.value` + `dispatchEvent(new Event('input'|'change',{bubbles:true}))` ⇒ `set()`/`onInput` của donor cập nhật `draft`; `answerFor` donor tạo payload cũ.
- Input donor bị ẩn phải `readOnly` (không `hidden`+`required` rỗng ⇒ trình duyệt chặn submit âm thầm); readonly bị loại khỏi constraint validation.
- Cổng không được nằm trong WORLD/OBJECTS (test deepEqual) ⇒ file `src/room-two/area-gates.js` riêng.
- Lán đông bắc: x1600–2336, y64–500; vách đáy y500 có khe x1960–2140 (giữa `[1360,500,600,32]` và `[2140,500,196,32]`), vách tây x1568 kín ⇒ 1 rect khóa cả lán.
- Trường hợp duy nhất buộc sửa donor: thay đổi `instruction`/`hints`/text trong `story-data.js` hoặc art lán trong `room-art.js`. Đề xuất né: thêm dòng hướng dẫn phụ của adapter, vẽ cửa bằng overlay scene.

## Requirements
**Cổng `radio-hut`**: rect `[1960,500,180,32]`, style `door` (cửa gỗ lán), mở khi `completedPuzzleIds.includes('nava-balance')`. Notice: "Cửa lán điện đài còn cài. Hệ Thống: cán cân bên bàn Nava chưa khóa." Khớp `PUZZLE_GUIDE['nava-balance']` (`system-guidance.js:95-97`) vốn đã chỉ tới lán.
**Cán cân 84** (giữ `northWeights:44`, `cardSteps` cũ):
- Khay 9 quả cân: 20,20,10,10,10,5,5,2,2 (tổng 84, nhãn "N tiểu đoàn"). Hai đĩa: "Đồng bằng Bắc Bộ" / "Các chiến trường khác". `draft.northWeights = sum(north)`.
- Nút "Đối chiếu" (`#puzzle-submit`) `disabled` khi khay còn quả (submit ngầm bằng Enter cũng không xảy ra) + dòng nhắc "Đặt hết quả cân lên hai đĩa". Khi khay trống: Bắc 44 ⇔ khác 40.
- Ẩn `.balance-scale`, `.balance-weights`, `#balance-readout` donor; vẽ cân riêng (đĩa = drop zone, nghiêng theo north−rest; reduced-motion: không tween); readout riêng "Bắc Bộ: a · Chiến trường khác: b · Trên khay: c".
- Thẻ việc: 5 thẻ kéo vào 3 cột bước (Bước 1/Bước 2/Không thuộc kế hoạch) ⇒ ghi vào select donor + `change`.
- Solved: hiển thị bố trí mẫu 20+20+2+2 | 10+10+10+5+5, khóa.
**Điện đài**: núm xoay 2 nấc chọn tai nghe (Pháp/Việt Bắc) + chữ trên băng thành nút; bấm/kéo chữ → nối vào tai nghe đang chọn; bấm chữ đã đặt → trả về băng; input donor readonly hiển thị từ. Giữ nút "Tô chữ ở vị trí lẻ" + `hintUsed` donor (không ghi đè).
**Sa bàn**: 4 thẻ mũi tên kéo lên 4 ô vùng (hàng drop-pad dưới sơ đồ) ⇒ set `#fist-card/#fist-region` + `change` rồi `#fist-play.click()`; select donor giữ làm đường bàn phím.
**Hòm sắt**: khóa 4 bánh số thay `#fold-code` (0612); radio gấp tới cờ giữ nguyên.

## Architecture
```
RoomTwoUI ctor ─► installTactileStations(this.puzzle, {onIntent}) (wrap 4 renderer + clearDrafts)
state.completedPuzzleIds ─► lockedGateIds(AREA_GATES) ─► RoomTwoScene.setLockedGates / ui.render({lockedGateRects})
```
Draft xúc giác (vị trí quả cân/chữ) gắn vào object draft donor ở runtime (`draft.r2Pans`, `draft.r2Tape`), mất khi `clearDrafts` — không vào save (đúng code-standards).

## Related code files
Tạo: `src/room-two/area-gates.js`, `src/room-two/tactile-stations.js` (cài wrapper), `src/room-two/tactile-balance-station.js`, `src/room-two/tactile-radio-station.js` (fist/fold nhỏ để trong tactile-stations nếu <200 dòng), `tests/room-two-gates.test.js`, `tests/room-two-tactile.test.js` (model thuần: tổng đĩa, ghép chữ băng).
Sửa: `src/room-two/ui.js` (1 dòng cài), `src/room-two/scene.js` (truyền `areaGates`), `src/room-two/session.js` (render gate, `onGateBlocked`, map rects), `src/room-two/system-guidance.js` (SYSTEM_HINTS open — nếu Q3), `src/room-two/styles.css`.
KHÔNG sửa: `src/room-two/bao/**`, `src/room-two/world.js`.

## Implementation steps
1. `area-gates.js` + test: khóa → `nava-radio-note`, `nava-radio-station` không tới được, 9 object còn lại tới được; mở → tất cả. Bất biến goal: `goalFor` qua chuỗi state chuẩn luôn tới được.
2. Scene: `super(callbacks,{…,areaGates: AREA_GATES})`; session `render()` gọi `setLockedGates`.
3. `tactile-stations.js`: lưu bản gốc `orig = view.renderBalance.bind(view)`; gán wrapper; tương tự 3 renderer kia; wrap `clearDrafts`.
4. Balance → token-bins (khay/2 đĩa) + token-bins (thẻ việc), disable submit.
5. Radio → dial 2 nấc + tile băng.
6. Fist drop-pad; Fold combination-dial.
7. SYSTEM_HINTS open (không chữ số): balance "Ký Chủ, đặt các quả cân lên hai đĩa theo lề Sổ kế hoạch của Nava."; radio "Ký Chủ, hai bức điện chen nhau trên một sóng; xoay núm để chọn tai nghe rồi nhặt chữ từ băng." → `npm run voice:script`.
8. `npm test` (đặc biệt `room-two-content` SHA) + build + QA bàn phím.

## Todo
- [ ] area-gates + reachability/goal tests
- [ ] scene/session wiring + notice + map
- [ ] wrapper install (không chạm bao/)
- [ ] balance tactile + submit guard
- [ ] radio dial + tiles (giữ hintUsed)
- [ ] fist drop-pad, fold dial
- [ ] hints + voice:script
- [ ] test/build/QA

## Success criteria
- `git diff --stat src/room-two/bao` rỗng; SHA test xanh.
- Cán cân chỉ khóa khi Bắc 44 & khác 40 & khay trống; evaluator nhận `{northWeights:44}` y cũ (`rules.js:37-43`).
- Không thể vào lán trước Cán cân; sau đó cửa mở ngay (không reload).
- Toàn bộ 4 trạm chơi xong chỉ bằng bàn phím.

## Risk
| Rủi ro | K×T | Giảm thiểu |
|---|---|---|
| Donor đổi tên/ID DOM → wrapper vỡ | Thấp×Cao | donor bị khóa SHA; wrapper fail-safe: không tìm thấy node ⇒ để nguyên UI donor |
| `show()` render lại sau mỗi nước sa bàn | Chắc×Thấp | wrapper chạy lại mỗi lần render, state ở draft |
| Lời instruction donor nói "84 quả cân" | Chắc×Thấp | dòng phụ adapter: "Mỗi quả cân ghi số tiểu đoàn" |
| Người chơi tiết kiệm save đứng trong lán? | Không có (vị trí không lưu, spawn `checkpoints[0]` `session.js:90`) | — |

## Security
Không thêm innerHTML; không đổi save key/schema.

## Next steps
Phụ thuộc phase 6. Cập nhật `docs/gd2-room-2-level-plan.md` + `plans/261031-campaign-link/reports/room-two.md` (wrapper là ranh giới bảo toàn mới).
