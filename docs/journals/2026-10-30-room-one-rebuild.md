---
date: 2026-10-30
status: pending-validation
scope: standalone-room-one
---

# Thay entry chính bằng Phòng 1 độc lập

## Bối cảnh

PDF bản 4 đặt Quang vào hành trình năm phòng: bốn thử thách lịch sử lấy bốn mảnh tranh, sau đó ghép tranh/suy ngẫm. Người dùng yêu cầu giữ Phòng 2 của Bảo. Nguồn mới `lich su.txt` hỗ trợ tình thế từ đầu năm 1953 nhưng thiếu các chiến dịch cần cho chuỗi thẻ 1950–1953 trong thiết kế trước. Phạm vi được chấp thuận hiện tại là Phòng 1 có thể giải hết bằng so sánh tương quan, không triển khai các phòng 3–5.

## Thay đổi

Ứng dụng mới ở `src/room-one/`, entry `/`: thư ghép → A-03 → bốn hồ sơ đầy đủ → đối chiếu → ngăn kéo → điện mật → rương/mảnh tranh đầu tiên → cửa hoàn thành. Session/actions nối reducer/save thuần, scene/physics/input và UI HTML. Tái dùng helper hình học, sprite/animation, Web Audio và font; không nhập lại nội dung/session app cũ.

Thế giới 2400×1600 có hai phía hồ sơ, đi/chạy 260/390, E gần vật, M/N/Q, Esc, HUD bốn bước góc trên phải và mini-map góc dưới phải. Hồ sơ nguyên văn tách khỏi suy luận Quang; sổ tay đọc lại toàn văn. Các giấy vô danh/thư là sáng tác cho trò chơi, không phải thư thật hay trích dẫn lịch sử.

## Quyết định và ranh giới

- Chỉ dùng PDF bản 4 và bản chữ người dùng cung cấp, không web. Không sửa đoán các ngày/tỷ lệ/tên hỏng để làm đáp án.
- 252.000/445.000 là quân số được chấp thuận theo tài liệu cung cấp, có nhãn nguồn; không khẳng định kiểm chứng độc lập.
- `2413`, A1Z26 và tên cần giải là cơ chế hoàn thiện do trò chơi thiết kế. Nava được giới thiệu cuối chuỗi; không dạy hai bước kế hoạch trong Phòng 1.
- Save riêng `mat-ma-dien-bien-phu:room-one:v1`; giữ bước hợp lệ/tùy chọn, không tọa độ/cursor/draft. Reload về điểm vào an toàn.
- Rương chỉ trao mảnh thứ nhất. Tương tác cửa mới hoàn thành phòng; không giả lập kết toàn chiến dịch.
- Bảo checkout/Phòng 2/sửa font/preview 4180 giữ nguyên. Bảng hoàn thành chỉ mở liên kết khi người chơi chọn; không tự chuyển chương hoặc đồng bộ save.
- Nghỉ sử dụng app chính cũ, `chapter-four.html`/cây màn IV và wireframe thực thi sau khi bản thay thế sẵn sàng. Giữ nguồn hình ảnh, PDF/Word và báo cáo cũ để truy vết.
- Không commit, push, deploy hoặc tải PDF cá nhân trong lượt này.

## Kiểm chứng và việc tiếp theo

Các tài liệu hiện hành đã chuyển sang mô tả Phòng 1. Bản cuối đạt24/24 test, build một entry và lượt chơi bàn phím/E từ lá thư giấy riêng tới cửa hoàn thành. QA độc lập xác nhận nhiệm vụ, map, reset, âm thanh, font cục bộ và màn hẹp. Không lấy số kiểm thử hoặc kết quả nghiệm thu bản cũ làm kết quả bản mới.

Đã kiểm tra chặn vượt bước, kết thúc giấy/suy luận, reset/callback cũ, save/reload, reachability, tốc độ, focus, camera/mini-map, font tải localhost, màn hẹp và âm thanh. Đo650ms: đi169 đơn vị, chạy253,5;2tiếng bước với RMS≈0,00391. Hồ sơ V-01 đầy đủ trên375×812 không tràn ngang. Chưa chứng nhận zoom200% hoặc kiểm thử người chơi thật. [QA và giới hạn](../../plans/261030-pdf-four-rebuild/reports/room-one-qa.md) · [roadmap](../project-roadmap.md).

## Câu hỏi còn mở

Không có quyết định người dùng nào chặn Phòng 1 trong phạm vi đã duyệt. Chi tiết Phòng 3 và tích hợp toàn bộ hành trình là công việc của milestone sau.
