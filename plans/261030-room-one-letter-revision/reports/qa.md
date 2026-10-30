# Nghiệm thu thư nguyên vẹn — 2026-10-30

Status: PASS. Chỉ sửa bản chính; Bảo giữ nguyên. Không tra web, commit/push hoặc deploy.

## Thay đổi đã xác nhận

- Bỏ hoàn toàn câu đố xếp mảnh thư: không còn fragment export, order/rule, letter-submit hay UI sắp xếp. Tương tác bàn thư mở một bức thư nguyên vẹn.
- Thư Lâm gửi Tín303 từ; V-01 gửi vợ304; V-02 sổ quân nhu296; P-01 báo cáo298; P-02 thư Paris301. Mỗi văn bản có5 đoạn đầy đủ. Nhân vật và ngày dựng truyện được ghi rõ hư cấu bên ngoài lời văn.
- Nội dung gắn Tây Bắc1952, tình thế chủ động đầu1953, kinh nghiệm chiến đấu, trang bị/tiếp tế, quân số được người dùng chấp thuận252.000/445.000, sự phân tán và chi phí/viện trợ. Không đưa hai bước Nava vào đây. [Đối chiếu nguồn cục bộ](content-draft.md).
- Giấy có ngày, lời chào, chữ ký, phong bì/nếp gấp; thư/nhật ký dùng Patrick Hand cục bộ, báo cáo dùng Be Vietnam Pro. Tất cả là HTML chọn/copy được; A-03 nằm ở nhãn ngoài thân thư. Nguồn/nhãn hư cấu luôn tách khỏi lời người viết.

## Kiểm tra

`npm test`: **25 pass,0 fail**. Luật, controller, save, toàn văn/metadata/NFC, font readiness, hình học, input và audio giữ đạt. Test thư mới chứng minh mở giấy không nhận tiến độ, đọc→suy nghĩ vẫn chưa đủ, chỉ xác nhận đúng token mới mở A-03; đóng/confirmation cũ không có hiệu lực. Save cũ đọc lại thư mới mà không reset.

`npm run build`: đạt, một index và font/portrait cục bộ. Advisory kích thước chunk Phaser vẫn có, không lỗi build. [Review](code-review.md): GO, không còn phát hiện cần sửa.

Chơi Chromium tại4173 bằng CDP keyboard down/up thật qua canvas và thao tác form, không setter tọa độ/tiến độ: thư nguyên vẹn→đọc hết→Quang→nhãn A-03→bốn giấy tờ→đối chiếu→ngăn kéo2413→Henri Navarre→rươngNAVA→cửa. Đạt `exitReached`,4 hồ sơ; không exception. Đã thử mã sai1111 rồi đúng, thông báo cũ được xóa. Nút suy nghĩ từng tờ chỉ bật sau khi cuộn hết; ghi dữ kiện vẫn cần xác nhận riêng. Lượt chơi thực dùng bản có luồng mới; sau đó chỉ sửa vài câu văn, chạy lại toàn bộ tests/build.

Đã xem trực tiếp ảnh chụp thư desktop và V-01 mobile. Kiểm tra lại lá thư đầu trên bản build cuối qua sổ tay của save đã hoàn thành:

| Viewport | Chiều cao giấy cuộn | Đáy nút | Tràn ngang giấy |
| --- | --- | --- | --- |
|1440×500|198px|461px|Không|
|375×812|464px|783px|Không|
|375×600|252px|571px|Không|

Patrick Hand thực sự loaded và được dùng cho thân thư. Chữ ký Anh Lâm và nhãn A-03 có mặt khi cuộn cuối; nhãn không phải phần tử con của thân giấy thư. Mở lại không đổi state. Ảnh chụp nằm trong tmp bị gitignore; không thêm ảnh chứa chữ giả làm tài liệu lịch sử.

## Giới hạn

Đây là thư/ghi chép sáng tác theo nguồn được cung cấp, không phải bản sao thư lịch sử có thật. Chất lượng văn chương còn phụ thuộc cảm nhận người chơi; không tuyên bố đã thử với người dùng độc lập. Không làm lại map hay tích hợp các phòng sau trong lượt sửa này. Save cũ giữ tiến độ; đã đọc thư trước thì dùng N để mở bản viết lại.

Không có câu hỏi chặn bàn giao.
