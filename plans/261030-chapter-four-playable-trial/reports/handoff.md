---
title: Bàn giao bản thử màn IV
date: 2026-10-30
status: completed
---

# Bàn giao bản thử màn IV

Status: DONE

## Kết quả

[Kế hoạch](../plan.md) hoàn tất 6/6 mục; không phase file riêng, đồng bộ qua plan persistent vì không có Task API. Bản thử độc lập tại **http://127.0.0.1:5173/chapter-four.html** khi dev hoặc **http://127.0.0.1:4173/chapter-four.html** sau `npm run build` / `npm run preview`. Lệnh đầy đủ trong [README](../../../README.md).

Map 3200×1920: chiến hào → A1 → cầu Mường Thanh → sở chỉ huy/phòng rương. Bảy hồ sơ → ô chữ → hình T/L → khẩu hiệu → rương/mảnh ghép/lời kết. Có M/mini-map, N, Q, Shift, VN và audio/tùy chọn. Trial không persistence, không thay game chính/save v1. Không commit/push/deploy trong lượt này; thay đổi mới còn cục bộ, repo chính đã công khai trước đó. PDF bản 3 không tải lên repo.

## Kiểm chứng

| Hạng mục | Bằng chứng |
| --- | --- |
| Luật/hình học/input | 14/14 mới; toàn bộ 37/37 đạt, gồm 23 test chính. |
| Build | Hai HTML entry đạt; `chapterFour-CmN86TbV.js` / `chapterFour-BsRK1xbh.css`. |
| Toàn tuyến controller | Đi bộ/đọc/ghi 7/7, ô chữ, T/L, khẩu hiệu sai/đúng, hoạt ảnh rương và câu cuối kết; không setter state/tọa độ. [QA](chapter-four-qa.md). |
| Cạnh biên độc lập | Esc/draft/reset thực không reload, input/form, sprint/map, viewport, mute/volume/PCM, save chính nguyên byte, tài nguyên local và 0 page error. [Edge QA](chapter-four-edge-qa.md). |
| Review | 3 lỗi Medium đã sửa/re-review: focus, tăng sáng, tween rương; 0 blocker. [Mã](code-review.md), [kế hoạch trước code](plan-review.md). |
| Tài liệu | [Thiết kế](../../../docs/design-guidelines.md), [kiến trúc](../../../docs/system-architecture.md), [cấu trúc mã](../../../docs/codebase-summary.md), [roadmap](../../../docs/project-roadmap.md), [chạy thử](../../../docs/deployment-guide.md), [nhật ký](../../../docs/journals/2026-10-30-chapter-four-trial.md). |

Rương mở 800 ms, ending sau 1100 ms; reduced motion mở ngay. PCM rương RMS 0,016957 là đầu ra trình duyệt, không kiểm định loa vật lý. [Toàn cảnh map](map-overview.png) render bằng cùng hàm vẽ để trình bày bố cục, không viewport gameplay. Edge QA không tự nhận giải toàn kết; toàn tuyến do controller kiểm tra riêng.

Đã kiểm tra 71 liên kết local trong 9 tài liệu/plan/journal/handoff: 0 đích thiếu; `git diff --check` không lỗi khoảng trắng. Review ghi bundle trước chỉnh chiều cao desktop; controller/tester xác nhận build cuối, không gán lượt build/browser cuối cho reviewer.

## Giới hạn

Sơ đồ kể chuyện hư cấu, không phục dựng chiến trường. Ưu tiên bàn phím máy tính; chưa có cảm ứng đi bộ, lưu trial, lồng tiếng hoặc QA Safari/Firefox. Cảnh báo kích thước chunk engine hiện hữu được ghi trong QA; chưa đo benchmark hiệu năng.

## Câu hỏi chưa giải quyết

Không có cho phạm vi bản thử.
