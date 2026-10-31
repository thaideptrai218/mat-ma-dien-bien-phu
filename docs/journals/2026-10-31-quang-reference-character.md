# 31/10/2026 — Quang theo ảnh mẫu

Thay sprite pixel vẽ thủ tục bằng nhân vật minh họa dựa trên hình người dùng: tóc nâu/áo nâu đỏ/áo trắng/quần be/túi ô liu. Tạo art bằng imagegen tích hợp, chỉnh hướng trái rồi bổ sung16 tư thế đi có bước chuyển khép rõ ràng. PNG cuối32 ô, nền trong suốt; ảnh tham chiếu riêng không vào repo. Phạm vi lần này là sprite khám phá; chân dung hội thoại giữ tài nguyên riêng.

Idle/walk/run bốn hướng, walk8/run12fps; chạy có pose riêng. Body24×16, đi260/chạy390/camera/save/câu đố giữ nguyên. Loader ảnh/manifest chạy trước create, lỗi có thông báo giữa màn hình và không tạo player giả; các scene con tôn trọng early abort. Reduced-motion giữ idle nhưng vẫn điều khiển được.

Đóng khung theo tâm hông/mặt đất chung, không ép từng ảnh về cùng đáy; flight giữ chân nâng. Frame160×192/scale .5 đủ chỗ cho sải chân, không làm hẹp cả người để né crop. PNG kiểm tra trực tiếp32 ô khác nhau/gutter/crop/contact-passing/flight. Script test chính giới hạn thư mục tests để không chạy lại bản sao ởtmp.

119/119 tests, build năm entry; [review GO](../../plans/261031-quang-reference-character/reports/code-review.md). [QA](../../plans/261031-quang-reference-character/reports/qa.md) dùng phím thật qua tất cả32 frame, collider/tường/đồ vật/camera/pause/blur/reduced-motion, preview2–4/campaignintro và nạp ảnh lỗi1/3/4. Chu kỳ đi mới đã được chấp nhận sau rebuild. Chưa chơi lại toàn bộ câu đố năm phòng cho thay đổi chỉ về nhân vật; regression luật/source vẫn đạt.

Tài sản/cách đóng: [README](../../assets/characters/quang-reference/README.md). Đã push vào [PR #3](https://github.com/thaideptrai218/mat-ma-dien-bien-phu/pull/3) sau kiểm chứng; main chưa merge, không triển khai hosting. [Báo cáo publication](../../plans/261031-quang-reference-character/reports/publication.md).

Câu hỏi chưa giải quyết: không.
