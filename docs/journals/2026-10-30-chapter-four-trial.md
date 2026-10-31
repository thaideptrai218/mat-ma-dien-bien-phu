---
title: Bản thử màn IV — Những ngày quyết định
date: 2026-10-30
status: completed
---

# Nhật ký — bản thử màn IV

## Bối cảnh

Người dùng yêu cầu thử màn 4 theo PDF bản 3 và map mới sát tuyến kể chuyện. Giữ game chính bốn phòng và save v1; tạo entry `chapter-four.html` với state riêng trong phiên. PDF hai trang/hai hình mật mã đã được controller xem; liên kết Canva không truy cập được, ảnh nhúng đủ đối chiếu. Không tải PDF gốc bản 3 lên repo.

## Điều đã xảy ra

Map Phaser 3200×1920 đi từ chiến hào đông nam qua A1 phía đông, cầu Mường Thanh vượt sông và sở chỉ huy phía tây. Phòng ký ức hư cấu đặt rương giữa, hai bàn phía bắc. Bảy hồ sơ phân bố theo diễn biến; ba hồ sơ đầu mở cầu, chỉ bấm ghi ở câu cuối mới nhận. Đủ bảy hồ sơ mới giải ô chữ 7×17, cột 8 zero-index đọc `TIMTVAL`; đúng tập ô T/L trên hai bảng 6×5 cho khẩu hiệu mở rương. Reducer khóa đủ các bước, không thể đoán mật khẩu bỏ qua.

Giữ dữ kiện theo nguồn: tổng 16.200 là tiêu diệt và bắt sống, sửa ý trong PDF dễ hiểu nhầm tất cả bị bắt sống; A1 làm chủ rạng sáng 7/5; Genève/Miền Bắc là hậu cảnh sau chiến dịch, không đồng nghĩa thống nhất ngay 7/5. Minh, khóa cầu và phòng rương là sáng tạo học tập.

Review phát hiện ba lỗi Medium: thay control làm mất focus khi đọc liên tiếp, tùy chọn sáng chỉ đổi state, rương đổi hình tĩnh thay vì hoạt ảnh. Đã sửa/re-review: focus tới control tiếp, filter 1,18 trên canvas, tween rương 800 ms và ending sau 1100 ms; giảm chuyển động mở ngay. Guard reset/shutdown hủy tween/timer và ngăn callback audio cũ.

## Kiểm chứng và nhìn lại

14 test mới và toàn bộ 37 test đạt; build hai HTML entry đạt. Controller đi bộ thật tới 7/7 hồ sơ, giải ô chữ và T/L, thử sai rồi đúng khẩu hiệu, xem rương và đọc câu cuối kết. Snapshot rương lần lượt khoảng 0 / 0,262 / 0,724 / 0,996 / 1; PCM rương RMS 0,016957 xác nhận tín hiệu trình duyệt. Không coi cờ audio hoặc build thành bằng chứng đã nghe/chơi được.

QA độc lập xác nhận Esc sớm, draft sai/đóng, reset draft bằng lượt đi bộ tiếp theo không reload, phím giữ/repeat và form, Shift, sơ đồ, viewport nhỏ và âm lượng/mute. Tạo save chính thật rồi đi trial/reset/reload vẫn giữ nguyên byte; quay về chính có Continue. Hai entry chỉ tải tài nguyên local, không page error. Lượt edge tới ô chữ, không nhận là độc lập giải hết T/L/rương. Ảnh toàn cảnh dùng cùng hàm vẽ map để xem bố cục, không giả ảnh viewport gameplay.

## Quyết định và bàn giao

Bản thử là entry riêng, không thay phòng 4 chính; chưa lưu trial qua tải lại, chưa có di chuyển cảm ứng/lồng tiếng. M/N/Q, mini-map và Shift chỉ có trong trial. Bundle cuối `chapterFour-CmN86TbV.js` / `chapterFour-BsRK1xbh.css`; CSS cuối chỉnh chiều cao map để footer vừa viewport, không đổi logic hành trình.

Không commit, push hoặc deploy trong lượt thiết kế này; repo game chính đã công khai từ lượt trước, thay đổi mới vẫn cục bộ. [Kế hoạch](../../plans/261030-chapter-four-playable-trial/plan.md) đã đồng bộ 6/6 mục qua tệp persistent vì không có Task API. [QA](../../plans/261030-chapter-four-playable-trial/reports/chapter-four-qa.md) · [cạnh biên](../../plans/261030-chapter-four-playable-trial/reports/chapter-four-edge-qa.md) · [review](../../plans/261030-chapter-four-playable-trial/reports/code-review.md) · [bàn giao](../../plans/261030-chapter-four-playable-trial/reports/handoff.md).

## Câu hỏi chưa giải quyết

Không có cho phạm vi bản thử đã yêu cầu.
