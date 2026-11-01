---
phase: 6
title: "Test, duyệt trình duyệt, review"
status: completed
priority: P1
effort: "4h"
dependencies: [5]
---

# Phase 6: Kiểm chứng và review

## Overview
Xác nhận trong trình duyệt thật cả hai route end-to-end, chạy code-reviewer, dọn các mục chưa kiểm chứng từ trước.

## Implementation Steps
1. `npm test` toàn bộ + `npm run build`.
2. Trình duyệt (script puppeteer sẵn có): mỗi route đi từ chọn nhân vật → Phòng 1-5 → kết; chụp ảnh: sprite 4 hướng + idle, chân dung, avatar Hệ Thống, Phòng 2 (không sót tên sai).
3. Nghe mẫu giọng mỗi route (user).
4. Chạy `code-reviewer` trên diff; sửa lỗi.
5. Cập nhật docs (`README`, `docs/*`), roadmap/changelog; ghi credit.
6. Kiểm tra repo public: không có `.studio`, `.cache`, reference voice, token; ảnh avatar nén; không trailer Claude-Session.

## Success Criteria
- [x] Test + build xanh.
- [x] Hai route chơi trọn vẹn không lỗi console, không lẫn tên/giọng.
- [x] Review GO.
- [x] User xác nhận trước khi push; push bằng tài khoản baodzchimto.

## Risk Assessment
Phòng 2 donor chỉ kiểm được trong trình duyệt (test dùng dữ liệu giả); phải xem thật. Save cũ của người chơi đang giữ lựa chọn mặc định `long` → kiểm tra không phá tiến độ.
