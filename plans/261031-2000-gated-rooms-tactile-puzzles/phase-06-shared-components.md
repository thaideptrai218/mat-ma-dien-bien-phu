# Phase 06 — Hạ tầng chung: cổng khu vực + linh kiện xúc giác

## Context links
- `src/core/world-geometry.js:6-9` `collisionRects` (chỉ gate của `exits`), `:44` `buildReachability`
- `src/room-one/scene.js:9-18` constructor options; `:41-46` dựng `solids` từ `collisionRects`; `:179` `resetPosition`; teardown `:197`
- `src/room-two/scene.js:16-33` mẫu cổng có sẵn (zone vào `solids` + `gateArt`, `body.enable`)
- `src/room-one/ui-map.js:12` `createRoomMap(snapshot, compact, world)`; `src/room-one/ui.js:92-95,123` snapshot được merge rồi vẽ map
- `src/ui/dom-elements.js:2-17` `element()` (on* → addEventListener; textContent only)
- `docs/code-standards.md` (một world source cho collision/mini/full map; không lưu draft; textContent)

## Overview
Ưu tiên P2 · pending · chặn phase 1–5. Xây 1 lần, dùng ở 5 phòng: (a) cổng khu vực dữ liệu thuần + hiển thị trong scene/map; (b) 3 linh kiện xúc giác có model thuần test được bằng `node --test`.

## Key insights
- Mọi scene phòng đều `extends RoomOneScene` (`src/room-{two,three,four,five}/scene.js:1`) ⇒ thêm hỗ trợ cổng ở base 1 chỗ.
- Test world hiện có gọi `buildReachability(WORLD, …)` không có cổng ⇒ cổng KHÔNG được nhập vào `WORLD.walls` (giữ test cũ xanh); dùng mảng `AREA_GATES` riêng.
- Repo không có jsdom ⇒ tách model (thuần) / view (DOM mỏng).
- Payload cũ là hợp đồng: linh kiện chỉ xuất chuỗi/số/mảng như input cũ.

## Requirements
- Cổng: `{id, rects:[[x,y,w,h]…], style:'bars'|'rope'|'curtain'|'barrier', unlockedBy(state)→bool, notice}`; trạng thái suy ra từ save, không thêm field.
- Va vào cổng khóa → `callbacks.onGateBlocked(id)` (throttle ≥1,5 s) → session đặt notice trung tính (không voice, không đáp án).
- Mở cổng: fade 250 ms; reduced-motion → tức thì.
- Token-bins: kéo bằng pointer (chuột/cảm ứng, không HTML5 DnD), bấm-chọn rồi bấm-đích, bàn phím (Enter/Space nhấc, Tab/mũi tên tới đích, Enter thả, Esc huỷ, Delete trả về khay); aria-live thông báo.
- Dial: `role="spinbutton"`, ArrowUp/Down, nút ▲▼, `aria-valuetext`; bảng ký tự số hoặc chữ.
- Range-ruler: `<input type="range">` gốc (bàn phím native) + lớp vẽ.

## Architecture
```
save state ──lockedGateIds(gates,state)──► scene.setLockedGates(ids) ─► zones in solids + overlay
                                     └──► lockedGateRects → ui.render({lockedGateRects}) → createRoomMap
UI pointer/keys ─► token-bins-model / dial-model (thuần) ─► onChange(value) ─► panel ghi payload cũ
```
- `src/core/area-gates.js` (thuần): `lockedGates(gates,state)`, `lockedGateRects(gates,state)`, `worldWithGates(world,gates,state)` → `{...world, walls:[...world.walls,...rects]}` (cho test reachability).
- `RoomOneScene` option `areaGates=[]`; trong `create()` sau `solids`: mỗi rect một zone static trong group riêng `gateSolids` + collider có callback; `setLockedGates(ids)` bật/tắt `body.enable` + overlay; `getSnapshot().lockedGateIds`; teardown dọn.
- `createRoomMap`: vẽ `snapshot.lockedGateRects` (màu nâu đỏ, nét đứt).

## Related code files
Tạo: `src/core/area-gates.js`, `src/ui/tactile/token-bins-model.js`, `src/ui/tactile/token-bins-view.js`, `src/ui/tactile/dial-model.js`, `src/ui/tactile/combination-dial.js`, `src/ui/tactile/range-ruler.js`, `src/ui/tactile/tactile.css`, `tests/area-gates.test.js`, `tests/tactile-models.test.js`.
Sửa: `src/room-one/scene.js`, `src/room-one/ui-map.js`. Xoá: không.

## Implementation steps
1. `area-gates.js` + test (gate rỗng → map y nguyên; rect thêm đúng).
2. `token-bins-model.js`: `create({tokens,bins,placement})`, `move(state,tokenId,binId)` (tôn trọng `capacity`, `accepts`), `contents`, `sum(binId)`, `isEmpty(binId)`; bất biến (trả object mới).
3. `token-bins-view.js`: render khay + bins = `<button>`; pointerdown/move/up + `setPointerCapture` + `document.elementFromPoint` → `[data-bin]`; click-click; phím như Requirements; `onChange(state)`.
4. `dial-model.js` (`step(value,±1,alphabet)`, wrap) + `combination-dial.js` (N bánh, `onChange(string)`).
5. `range-ruler.js` (min/max/step, label, `onChange(n)`).
6. `tactile.css`: focus ring rõ, vùng chạm ≥44px, `@media (prefers-reduced-motion: reduce){transition:none;animation:none}`.
7. Scene: option `areaGates`, `setLockedGates`, overlay vẽ theo `style`, throttle `onGateBlocked`, snapshot, teardown.
8. Map: vẽ `lockedGateRects`.
9. `npm test` + `npm run build`.

## Todo
- [ ] area-gates.js + test
- [ ] token-bins model/view
- [ ] dial model/view
- [ ] range-ruler
- [ ] tactile.css
- [ ] RoomOneScene gate support
- [ ] ui-map gate drawing
- [ ] npm test, build xanh

## Success criteria
- `tests/area-gates.test.js`, `tests/tactile-models.test.js` xanh; toàn bộ test cũ xanh (đặc biệt `room-two-content`, `room-*-world`).
- Scene không truyền `areaGates` hành xử y như cũ (snapshot `lockedGateIds: []`).
- Mọi thao tác linh kiện làm được chỉ bằng bàn phím (QA tay).

## Risk
| Rủi ro | Khả năng×Tác động | Giảm thiểu |
|---|---|---|
| Collider cổng bật lại khi Quang đứng trong rect (reset) | Thấp×Cao | Session reset gọi `resetPosition()` trước `render()` (đã đúng ở R1 `session.js` reset, R2 `session.js:188`); thêm assert: entry không nằm trong rect nào |
| Pointer drag lệch khi modal cuộn | TB×TB | hit-test bằng `elementFromPoint` theo client coords, không tự tính offset |
| Phá hành vi scene của 5 phòng | Thấp×Cao | default `areaGates=[]`, test snapshot |

## Security
Chỉ textContent; không lưu draft/tọa độ (đúng code-standards); không input mạng.

## Next steps
Mở khoá phase 1–5. Ghi chú docs: `docs/system-architecture.md` (cổng khu vực), `docs/code-standards.md` (linh kiện xúc giác + a11y).
