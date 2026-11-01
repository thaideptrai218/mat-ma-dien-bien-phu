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
- [x] Trình duyệt, cả hai route, không lỗi console: chọn nhân vật, intro, Phòng 1-4 mở đúng sprite/tên, Phòng 2 donor (tên + chân dung), Phòng 5 đọc hết đoạn suy ngẫm (Long có đoạn học tập, Quang không lẫn tên).
- [ ] Chơi giải trọn các câu đố Phòng 1, 3, 4 và màn trở lại bảo tàng bằng tay (chưa làm: các câu phản ứng sau Phòng 1/3/4 và màn kết chỉ được kiểm bằng test đơn vị).
- [x] Review: không có lỗi nghiêm trọng (DONE_WITH_CONCERNS); đã sửa mục Medium; mục Low còn lại ghi trong báo cáo.
- [x] Push bằng tài khoản baodzchimto lên `feat/system-voice-only` (user chọn "push ngay, nghe sau", 2026-11-02; commit 9109466). Chưa có PR vào `main`.

## Risk Assessment
Phòng 2 donor chỉ kiểm được trong trình duyệt (test dùng dữ liệu giả); phải xem thật. Save cũ của người chơi đang giữ lựa chọn mặc định `long` → kiểm tra không phá tiến độ.
