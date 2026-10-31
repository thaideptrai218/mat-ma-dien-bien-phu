---
title: "Cổng mở dần + thao tác vật lý cho câu đố 5 phòng"
description: "Mỗi phòng thêm một cổng khu vực mở theo bước đã xong; câu đố gõ số/chọn đổi thành kéo-thả, núm xoay, thước trượt; đáp án và sự kiện lịch sử giữ nguyên."
status: pending
priority: P2
effort: 30h
branch: feat/system-voice-only
tags: [gameplay, puzzles, accessibility, phaser, room-two-donor]
created: 2026-10-31
---

# Cổng mở dần & câu đố xúc giác

Nguyên tắc: 1 cổng/phòng, mở bằng cờ đã có trong save (không đổi schema); thao tác mới chỉ tạo đúng payload cũ cho reducer/evaluator hiện tại. Mọi kéo-thả có đường bấm/bàn phím; tôn trọng `prefers-reduced-motion`.

## Bảng đề xuất

| Phòng | Cổng (khóa → mở bởi) | Thao tác xúc giác | Effort |
|---|---|---|---|
| 1 | Hai gian lưu trữ V/P (8 song gỗ ở x988/x1376) → `envelopeOpened` (A-03) | Bàn đối chiếu: kéo 8 thẻ dữ kiện vào ô; ngăn kéo: khóa 4 bánh số (2413); rương: khóa 4 bánh chữ (NAVA); điện mật: bàn phím chữ A1Z26 | M 5h |
| 2 | Lán điện đài đông bắc (cửa x1960–2140,y500) → `nava-balance` xong | Cán cân: kéo quả cân 20,20,10,10,10,5,5,2,2 (=84) lên 2 đĩa → 44/40; thẻ việc kéo vào cột bước; điện đài: núm chọn tai nghe + kéo chữ từ băng; sa bàn: kéo mũi tên vào vùng; hòm sắt: khóa 4 bánh số (0612) | L 7h |
| 3 | Barie đường lên lều chỉ huy (rào x1780) → challenge `cargo` | Kéo thẻ vào mốc thời gian; kéo chú thích lên tranh; xếp chữ điện vào khe; kéo tin/ngày lên dòng thời gian; rương: kéo 3 thẻ thưởng vào khe Ngày/Tháng/Năm (13/03/1954) | M 5h |
| 4 | Dây chắn khu mật mã T/L + rương → `columnSolved` | Thước trượt đọc cột; bút dò quét ô T/L; rương: kéo 2 dải khẩu hiệu vào khóa (QUYẾT CHIẾN QUYẾT THẮNG) | M 4h |
| 5 | Rèm sáng phía bắc (cửa + nơi ánh sáng) → `assemblySolved` | Kéo mảnh tranh vào ô (đổi chỗ), giữ bấm-đổi | S 2h |
| 6 | Hạ tầng chung: `area-gates`, scene gate, map gate, token-bins, combination-dial, range-ruler | — | L 7h |

Toạ độ cổng đã thử bằng `buildReachability` (2026-10-31): đúng các object dự kiến bị chặn, còn lại tới được từ entry.

## Phase

| # | File | Status | Phụ thuộc |
|---|---|---|---|
| 6 | [phase-06-shared-components.md](phase-06-shared-components.md) | pending | — (làm trước) |
| 1 | [phase-01-room-one.md](phase-01-room-one.md) | pending | 6 |
| 2 | [phase-02-room-two.md](phase-02-room-two.md) | pending | 6 |
| 3 | [phase-03-room-three.md](phase-03-room-three.md) | pending | 6 |
| 4 | [phase-04-room-four.md](phase-04-room-four.md) | pending | 6 |
| 5 | [phase-05-room-five.md](phase-05-room-five.md) | pending | 6 |

Phase 1–5 chạy song song sau 6 (mỗi phase chỉ chạm thư mục phòng của mình; `src/room-one/scene.js`, `ui-map.js`, `ui.js` thuộc phase 6).

## Dữ liệu chảy

save flags (cũ) → `lockedGateIds(AREA_GATES, state)` → scene zones/overlay + mini/full map. Thao tác UI → model thuần (token-bins/dial) → payload cũ (`northWeights`, `code`, `date`, `order`, `column`, `phrase`) → reducer/evaluator không đổi.

## Rủi ro chính

- Donor Bảo: chỉ wrap method trên instance `PuzzleView` trong adapter (như `showFeedback` đang làm); KHÔNG sửa `src/room-two/bao/**`. Test SHA giữ nguyên.
- `tests/room-two-content.test.js` deepEqual WORLD với donor → cổng Phòng 2 phải ở file riêng, không nhập vào WORLD/OBJECTS.
- Đổi text SYSTEM_HINTS ⇒ `tests/voice-manifest.test.js` fail cho tới khi `npm run voice:script` (+ sinh audio). Hint TTS không được chứa chữ số.
- Không có DOM harness: logic để ở model thuần (test node), view kiểm thủ công.
- Toạ độ cổng phải được test reachability (khóa: mục tiêu sau cổng không tới được; mở: tới được; goal hiện tại luôn tới được).

## Rollback

Mỗi phòng: `AREA_GATES = []` tắt cổng; bỏ 1 dòng `install…`/import component để về UI cũ. Không migration ⇒ rollback không đụng save.

## Câu hỏi mở (cho người dùng)

1. Bộ quả cân 20×2,10×3,5×2,2×2 (tổng 84, nhiều lời giải cho 44) có được không, hay muốn đúng 4 quả 2/5/10/20 lặp tuỳ ý?
2. Bàn đối chiếu Phòng 1: thẻ số 252.000/445.000 có cần thẻ nhiễu không (chỉ lấy số có trong hồ sơ V/P)?
3. Cho phép đổi câu `open` trong SYSTEM_HINTS (phải chạy lại voice:script/generate — có quyền TTS không?) hay để hướng dẫn thao tác ở dòng chữ trong panel, không lồng tiếng?
4. Phòng 1 có chấp nhận khóa cả hai gian (8 song) hay chỉ khóa gian P (Pháp)?
5. Phòng 4: giữ ô chữ gõ phím (đề xuất giữ) — đồng ý?
