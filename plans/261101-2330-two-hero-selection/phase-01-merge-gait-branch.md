---
phase: 1
title: "Gộp nhánh fix/alternating-sprite-gait"
status: completed
priority: P1
effort: "3h"
dependencies: []
---

# Phase 1: Gộp nhánh sprite-gait

## Overview
Đưa `origin/fix/alternating-sprite-gait` (55 file: nhịp chân, sprite idle, tên phòng, logo, 26 câu đổi lời) vào nhánh hiện tại trước khi làm tính năng, tránh giải xung đột manifest hai lần. Thử gộp trong worktree đã cho thấy chỉ xung đột `public/audio/voice/manifest.json`.

## Requirements
- Functional: giữ sprite/idle mới, giữ 18 clip narrator kiếm lai đã tạo (`d73a8af`).
- Non-functional: nhánh của Thái, không sửa nội dung của họ ngoài việc giải xung đột.

## Related Code Files
- Modify: `public/audio/voice/manifest.json` (xung đột), `plans/**/reports/voice-script.csv` (sinh lại)
- Read: `tests/system-address-dialogue.test.js` (2 test sẽ hỏng, sửa ở phase 3)

## Implementation Steps
1. `git merge origin/fix/alternating-sprite-gait`; xung đột manifest → `git checkout --theirs` rồi `npm run voice:script` dựng lại.
2. Kiểm tra mã clip narrator đã tạo vẫn còn (id theo nội dung): chạy `npm run voice:master` xem còn thiếu bao nhiêu.
3. Chỉ ghi danh sách câu thiếu audio (dự kiến 26: 6 narrator, 10 Hệ Thống, 10 Long); thu ở phase 5, không thu ngay.
4. Chạy `npm test`: chấp nhận 2 test xưng hô hỏng (phase 3 sửa); các test khác phải qua. Chạy `npm run build`.
5. Commit merge (không trailer Claude-Session).

## Success Criteria
- [x] Merge commit, không còn conflict marker.
- [x] Chỉ 2 test xưng hô hỏng, mọi test khác xanh; build qua.
- [x] Danh sách câu thiếu audio được ghi lại.

## Risk Assessment
Xung đột ngữ nghĩa (test/lời thoại) → lộ ở phase 3. Nếu chủ nhánh đã gộp vào `main` trước, dùng `main` thay vì nhánh.
