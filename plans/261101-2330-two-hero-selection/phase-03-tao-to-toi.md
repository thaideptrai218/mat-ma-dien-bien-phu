---
phase: 3
title: "Đổi xưng hô tao → tôi"
status: completed
priority: P1
effort: "3h"
dependencies: [2]
---

# Phase 3: tao → tôi

## Overview
Đổi toàn bộ "tao" thành "tôi" cho cả hai nhân vật (33 chỗ, 7 file). Hệ Thống vẫn gọi nhân vật là "Ký Chủ". Việc này cũng sửa 2 test xưng hô hỏng sau phase 1.

## Requirements
- Functional: mọi lời của nhân vật nói với Hệ Thống dùng "tôi"; câu phải còn tự nhiên (tao → tôi kéo theo "mày/mình" nếu có).
- Non-functional: sửa tiếng Việt chỉ bằng Edit/node, không PowerShell Get-Content/Set-Content; Phòng 2 chỉ qua `system-guidance.js`.

## Related Code Files
- Modify: `src/room-one/content.js` (7), `src/room-three/content.js` (7), `src/room-four/content.js` (5), `src/room-five/content.js` (5), `src/campaign/framing.js` (2), `src/room-two/system-guidance.js` (5), `tests/system-address-dialogue.test.js` (2)

## Implementation Steps
1. Liệt kê từng dòng chứa `\b[Tt]ao\b` kèm ngữ cảnh; sửa tay từng câu (không replace hàng loạt: "tao" còn là từ khác như "tao nhã").
2. Cập nhật `tests/system-address-dialogue.test.js` sang quy tắc mới: nhân vật xưng "tôi", Hệ Thống gọi "Ký Chủ".
3. `npm run voice:script`; ghi danh sách câu đổi (id mới) cho phase 5.
4. Cập nhật docs/ghi chú quy tắc xưng hô (README/docs, memory dự án).

## Success Criteria
- [x] `rg "\b[Tt]ao\b"` trong `src/` không còn lời thoại.
- [x] 2 test xưng hô xanh với quy tắc mới; toàn bộ test xanh.

## Risk Assessment
Câu Phòng 5 giữ "Tôi…" riêng → nay trùng quy tắc chung, kiểm tra không còn ngoại lệ thừa. Mỗi câu đổi = thu lại một clip.
