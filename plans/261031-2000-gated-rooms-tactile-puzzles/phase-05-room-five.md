# Phase 05 — Phòng 5: Phục dựng (rèm sáng mở sau khi ghép tranh)

## Context links
- `src/room-five/world.js:2-24` (vách `[460,360,300,32]`,`[1240,360,300,32]`; door (1000,108); reflection (1455,287); entry (1000,1220))
- `src/room-five/rules.js:15-33` (assembly `order===[0,1,2,3]` + đủ 4 mảnh → reflection → exit)
- `src/room-five/panels.js:19-54` ghép tranh: bấm 2 ô để đổi chỗ, `assembly-draft`/`assembly-submit`
- `src/room-five/actions.js:37-49`; `src/room-five/scene.js:5-31` (overlay cửa)
- `src/room-five/content.js:74-79` SYSTEM_HINTS assembly; test `tests/room-five-world.test.js:6-19`

## Overview
P3 · implemented 2026-10-31 (voice script regeneration pending) · S (2h). Thứ tự: Bàn phục dựng (1000,770) → Nơi ánh sáng (1455,287) → Cửa (1000,108).

## Key insights
- Nơi ánh sáng & cửa đều ở dải bắc y<360; khóa logic đã có, cổng chỉ làm cho người chơi thấy "rèm mở" khi tranh liền nét — nhẹ, đúng không khí kết.
- Suy nghĩ cá nhân (textarea) không đụng tới (privacy, code-standards).

## Requirements
**Cổng `light-curtain`** (style `curtain`, rèm vải mờ), mở khi `state.assemblySolved`: `[48,360,412,32]`, `[760,360,480,32]`, `[1540,360,412,32]`. Mở: rèm kéo sang hai bên 400 ms; reduced-motion: tức thì. Notice: "Tấm rèm sáng còn buông. Bức tranh trên bàn chưa liền nét."
**Xúc giác**: kéo mảnh tranh thả lên ô khác ⇒ đổi chỗ (cùng `order` + `assembly-draft`), giữ bấm-chọn-đổi hiện có và aria hiện có (`panels.js:26-49`).

## Architecture
`assemblySolved` → gate → `RoomFiveScene`/map. Kéo-thả: token-bins chế độ swap (bin capacity 1, thả vào bin đầy ⇒ đổi).

## Related code files
Tạo: `src/room-five/area-gates.js`, `tests/room-five-gates.test.js`.
Sửa: `src/room-five/scene.js`, `session.js`, `panels.js`, `room-five.css`. SYSTEM_HINTS giữ nguyên (đã không nói về thao tác).

## Implementation steps
1. AREA_GATES + test: khóa → reflection, door không tới; assembly, lamp, satchel tới; mở → tất cả.
2. Wiring scene/session/map + notice.
3. Drag-swap trong `assembly()`.
4. Test/build/QA (cả chế độ campaign: thiếu mảnh vẫn đúng thông báo cũ).

## Todo
- [x] gates + tests (`tests/room-five-gates.test.js`)
- [x] curtain art + wiring (shared `gate-art` / `SceneGates`; no new art)
- [x] drag-swap (`assembly-pieces.js`; click-swap kept)
- [x] tests + vite production bundle green; UI checked in a throwaway dev harness (in-memory storage, since removed); full campaign QA still manual

## Implemented gate table (final; supersedes the single-gate draft above)

| # | id | method | style | rects | guards | opens when | legacy (old saves) |
|---|---|---|---|---|---|---|---|
| 1 | `reconstruction-hall` | puzzle (E at the rope) | rope | [48,890,1904,24] | assembly table | `doorsSolved` has id | `assemblySolved`, or `seenObjectIds` has `assembly` |
| 2 | `light-curtain` | auto | curtain | [48,360,412,32] [760,360,480,32] [1540,360,412,32] | reflection light, door | `assemblySolved` | `reflectionSeen` |

Door puzzle (gate 1, about 15 s): drag fragment numerals I-IV onto four room plaques (plaques out of order; fragment N came from room N). Payload `room-1,room-2,room-3,room-4` is checked in `rules.js` (`solve-door`); result kept in new `doorsSolved` (absent in old saves -> `[]`). Hints: `SYSTEM_HINTS['door-reconstruction-hall']` (Ký Chủ, no digits). Lamp and satchel stay reachable from the entry before the rope opens.
Files: new `area-gates.js`, `door-puzzle-panel.js`, `assembly-pieces.js` (`shuffledPieces` moved here so node tests do not import CSS); edited `rules/save/actions/scene/session/panels/content.js`, `room-five.css`, `tests/room-five-content.test.js` (import path), `tests/system-address-dialogue.test.js` (one id added to the Room 5 list).
Open: `npm run voice:script` still required for the new hint text before `tests/voice-manifest.test.js` is green.

## Success criteria
- `room-five-*` test cũ xanh; order [0,1,2,3] giữ; reflection payload không đổi.
- Rèm mở ngay khi ghép xong; reload sau khi ghép → rèm đã mở.

## Risk
| Rủi ro | K×T | Giảm thiểu |
|---|---|---|
| Cảnh "cửa mở" `setDoorOpen` vẽ chồng rèm | Thấp×Thấp | depth rèm < overlay cửa; test snapshot |

## Security
Không đụng textarea cá nhân, không lưu draft.

## Next steps
Phụ thuộc phase 6. QA toàn campaign museum→1→…→5→return.
