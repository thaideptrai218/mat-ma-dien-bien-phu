---
date: 2026-10-30
status: completed
tags: [chapter-four, narrative, typography]
---

# Từ hồ sơ ngắn tới bảy lá thư có dòng thời gian

## Bối cảnh

Người dùng muốn màn IV kể chuyện rõ hơn bằng những lá thư có chi tiết và trình tự lịch sử, đồng thời sửa dấu tiếng Việt rời chữ. Phạm vi là `chapter-four.html`; game chính và save cũ giữ riêng. Bản thử trước đã có tuyến chiến hào–A1–sở chỉ huy và chuỗi ô chữ/T-L/rương.

## Điều đã xảy ra

- Bảy hồ sơ thành thư/trang sổ tay hai trang của ba nhân vật hư cấu Hòa, Lan, Tuấn. Trình đọc là giấy HTML có ngày, người gửi/nhận, lời chào và chữ ký. Chỉ sau trang cuối mới sang lời suy luận của Minh, rồi ghi ý cốt lõi; đóng giữa chừng không tự hoàn tất.
- Timeline khóa theo ý đã ghi, không theo việc vừa mở hoặc lật hết thư. Đọc lại thư trước vẫn được; thư tương lai trả lời bằng hướng dẫn tìm thư hiện tại. Sổ tay/mini-map dùng cùng thứ tự, nhưng hàng ô chữ giữ danh sách ID riêng để không làm đổi `TIMTVAL`.
- Nguồn giáo trình và bài chuyên đề được đối chiếu. A1 làm chủ vào rạng sáng 7/5, khác tiếng nổ đêm trước; sở chỉ huy là 17:30 ngày 7/5; số 16.200 gồm tiêu diệt và bắt sống. Thư hậu cảnh năm 1955 tránh đặt kết quả chuyển quân ngay chiều chiến thắng. Mọi lá thư đều ghi sáng tác, không mạo nhận bút tích lịch sử.
- Controller tái hiện và xem ảnh lỗi dấu tách ở font Georgia/fallback trước thay đổi. Đổi màn IV sang Lora/Patrick Hand có đủ glyph Việt, chuẩn hóa NFC và đợi font trước khi tạo Phaser để nhãn Canvas không giữ hình chữ fallback. Font và giấy phép OFL được đóng gói trong dự án.

## Nhìn lại

Thư dài tự nó chưa bảo đảm người chơi hiểu lịch sử. Tách giấy khỏi lời Minh tạo hai nhịp: tiếp nhận câu chuyện rồi rút ra ý nghĩa. Khóa tuần tự chỉ mở sau ghi suy luận giữ mối nối ấy; chỉ kiểm tra thứ tự mảng không đủ vì bản đồ và notebook cũng là đường vào nội dung.

Lỗi chữ cần kiểm tra bằng chính nội dung có dấu và font thực tế đã tải. NFC bảo vệ dữ liệu văn bản; font đầy đủ và thời điểm vẽ Canvas giải quyết phần hiển thị. Test thuần không thay xem ảnh chữ và thử focus/cuộn trên trình duyệt.

## Quyết định và kiểm chứng

Giữ state/cursor bản thử trong phiên, không thêm save/migration. Giữ nguyên đáp án puzzle và tách thứ tự hàng khỏi thứ tự kể. Hai entry vẫn build chung. Không tải giáo trình lên repo hay đưa đường dẫn PDF cá nhân vào tài liệu dùng lâu dài; chỉ ghi nguồn và trang tham chiếu.

Đã có [QA trình đọc](../../plans/261030-letters-timeline/reports/letter-ui-qa.md), [rà soát lịch sử](../../plans/261030-letters-timeline/reports/history-research.md) và [review đạt](../../plans/261030-letters-timeline/reports/code-review.md). Controller đi bộ tới kết qua đủ bảy ý, thử sai/đúng ô chữ, T/L và rương; thư tương lai bị chặn đúng. Sau ba chỉnh văn phong cuối, chạy lại 44/44 test và build hai entry đạt. Bản cuối tải font cục bộ khi chặn HTTPS, đọc/ghi được ở CSS zoom 200% không tràn ngang; reset thực xóa state và cursor. Không lỗi browser. [QA toàn tuyến](../../plans/261030-letters-timeline/reports/letters-journey-qa.md) phân biệt rõ bundle chơi toàn tuyến và chỉnh văn thuần trước build cuối; không gọi CSS zoom là browser zoom.

## Tiếp theo

[Kế hoạch](../../plans/261030-letters-timeline/plan.md) · [Bàn giao](../../plans/261030-letters-timeline/reports/handoff.md). Chỉ bàn giao cục bộ trong lượt này; chưa commit, push hoặc deploy.

Câu hỏi chưa giải quyết: không có trong phạm vi yêu cầu. Chưa kiểm tra Safari/Firefox hay điều khiển đi bộ cảm ứng.
