---
date: 2026-10-30
status: verified
scope: standalone-tram-room-four
---

# Phòng 4 mới theo phần Trâm trong PDF bản 4

## Bối cảnh

Người dùng yêu cầu làm map 4 của Trâm, giữ Phòng 1 hiện tại và Phòng 2 Bảo. PDF bản 4 tr. 6 ghi phần việc Trâm; tr. 18–22 có diễn biến, kết quả, ý nghĩa, bố cục phòng và hai mật mã. Chỉ dùng nguồn PDF bản 4/bản chữ được cung cấp tại máy, không web. Không phục hồi `chapter-four.html`, bản đồ chiến trường hay chuỗi thư Hòa/Lan/Tuấn cũ.

## Thay đổi

Entry mới `/room-four.html` và `src/room-four/`; `/` vẫn Phòng 1. Map 2800×1800 có rương giữa, hai bàn mật mã phía sau, bảy giấy quanh tường và bàn ô chữ phía bắc. Các vật có đường tiếp cận E thật, camera theo Quang, đi/chạy 260/390, HUD nhiệm vụ và mini-map. Hai phòng có liên kết chủ động, tiến độ riêng.

Bảy văn bản tự nhiên gồm thư, nhật ký và báo cáo, năm đoạn và 301–330 từ/tờ. Nguồn/nhãn hư cấu ngoài thân giấy; ngày thư, người viết/người nhận và chuyện riêng đều sáng tác. Đọc theo 30/3–30/4→1–6/5→đêm A1→chiều 7/5→kết quả→miền Bắc sau Genève 1954→ý nghĩa độc lập dân tộc. Phải đọc hết, nghe hai suy nghĩ của Quang rồi xác nhận; sổ tay giữ toàn văn.

Ô chữ bảy hàng, starts 8/7/8/0/8/3/5, rộng 17 cột; giữ đủ 16 chữ ở hàng “Sở chỉ huy trung tâm” bằng cách thêm một ô cuối thiếu trong PDF. Cột index 8 cho `TIMTVAL`. Hai hình T/L dùng đúng bảng PDF bản 4, gồm `ULTAV`, đọc ra `QUYETCHIEN`/`QUYETTHANG`. Câu cuối đúng tự mở rương và đổi hình; đến rương nhận riêng IV làm mảnh biến mất, rồi mới ra cửa.

## Quyết định và ranh giới

- Giữ đúng tổng 16.200 bị tiêu diệt **và** bắt sống; không biến thành số tù binh. Miền Bắc được đặt sau Genève, không giải phóng ngay 7/5.
- `RoomOneScene` nhận world/art/texture/goal tùy chọn; `RoomOneUI` nhận nhãn/world/panel factory tùy chọn. Mặc định Phòng 1 giữ nguyên. Phòng 4 dùng lại input, reader, font, audio và hình học.
- Save `mat-ma-dien-bien-phu:room-four:v1` chỉ nhận tiền tố tiến độ hợp lệ; view/token chặn callback cũ. Reload về điểm vào; reset chỉ phòng hiện tại. Không nhập save Phòng 1/Bảo.
- Không trao mảnh I–III, tự chuyển sang Bảo hoặc giả kết toàn chiến dịch. Phòng 3/5 và ghép tranh còn chờ triển khai.
- Ô chữ giữ 17 cột trong vùng cuộn ngang; ô hình tối thiểu 44px, đánh số thứ tự đọc, giữ draft khi sai. Desktop cao dưới 700px đặt mini-map dưới trái; desktop thường/mobile vẫn dưới phải.
- Bảo checkout/font/preview 4180 giữ riêng. Không commit, push, deploy hoặc tải PDF nguồn cá nhân.

## Kiểm chứng và điều rút ra

43/43 Node tests và build đúng hai HTML entry đạt; reviewer GO sau kiểm tra luật, save, reader, cấu hình chung, hình học, nguồn và mật mã. Lượt chơi thật dùng bàn phím/E đã qua đủ bảy giấy→ô chữ→cột 9→T/L→câu cuối→rương mở có mảnh→nhận IV và ẩn mảnh→cửa. Đáp án tiếng Việt có dấu được chấp nhận, câu sai bị chặn; không có exception trong tuyến này.

Cần giữ bằng chứng mở rương tách khỏi nhận mảnh: kiểm thử reducer không đủ chứng minh người chơi nhìn thấy rương đổi hình và phải đến gần lấy IV. QA độc lập đã xác nhận thư/A-03 Phòng 1, tương tác đầu Phòng 4, nguồn cục bộ, âm thanh, reload/reset tách save và responsive. Lỗi mini-map bị cắt ở desktop 1264×569 được sửa bằng bố cục màn thấp; bản build cuối được kiểm tra lại. QA độc lập không tự nhận đã chơi đủ bảy giấy, vì tuyến ấy có báo cáo riêng của controller.

## Việc tiếp theo

Phòng 3/5, nối toàn hành trình và phân phối tài sản thuộc đợt sau. Chưa kiểm chứng toàn bộ với zoom 200% hoặc người chơi thật.

[Kế hoạch](../../plans/261030-tram-room-four/plan.md) · [Nội dung và nguồn](../../plans/261030-tram-room-four/reports/content.md) · [QA toàn tuyến](../../plans/261030-tram-room-four/reports/qa.md) · [QA độc lập](../../plans/261030-tram-room-four/reports/independent-qa.md) · [Review](../../plans/261030-tram-room-four/reports/code-review.md) · [UI](../../plans/261030-tram-room-four/reports/ui-implementation.md)

## Câu hỏi còn mở

Không có câu hỏi chặn phạm vi Phòng 4. Giấy phép phân phối cốt truyện/tài sản và chi tiết các phòng còn lại chưa được xử lý trong đợt này.
