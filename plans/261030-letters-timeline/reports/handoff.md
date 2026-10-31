---
date: 2026-10-30
status: completed
---

# Bàn giao bản thư màn IV

## Tóm tắt

Đã triển khai và kiểm chứng bảy thư/hồi ký hai trang trên giấy riêng, lời suy luận Minh sau thư và tiến trình theo niên đại. Tệp chạy: `chapter-four.html`; kế hoạch hoàn tất 5/5 mục. Thay đổi cục bộ; chưa commit, push hoặc deploy.

## Chơi và hành vi

Chạy `npm run dev`, mở `http://127.0.0.1:5173/chapter-four.html`; hoặc `npm run build` rồi `npm run preview`, mở cổng 4173 cùng đường dẫn.

WASD/mũi tên để đi, Shift chạy, E tương tác, M bản đồ, N sổ tay, Q nhắc mục tiêu. Mở thư → lật hai trang → **Cùng Minh suy luận** → ghi ý cốt lõi ở lời cuối. Thư tiếp theo chỉ mở sau khi ghi; vòng vàng trên sơ đồ chỉ nơi cần đến, xám là ký ức tương lai. Sổ tay cho đọc lại theo niên biểu. Esc giữ trang trong phiên; reset xóa tiến độ/trang/draft; reload bắt đầu lại.

| Thư | Ngày | Ý cốt lõi |
| --- | --- | --- |
| Những đường hào trong đất | 30/4/1954 | Bị động |
| Lá thư trước giờ xuất kích | 1/5/1954 | Tiêu diệt |
| Khi trời sáng trên A1 | Rạng sáng 7/5/1954 | Một tấn |
| Tin đến lúc chiều muộn | Sau 17:30 ngày 7/5/1954 | Sở chỉ huy trung tâm |
| Những điều sau bản tổng kết | 26/5/1954 | Vũ khí |
| Một năm sau những lá thư | 17/5/1955 | Miền Bắc |
| Lời gửi người đọc mai sau | 18/5/1955 | Độc lập dân tộc |

Ba ý đầu mở cầu; đủ bảy ý mở ô chữ. Thứ tự hàng ô chữ giữ nguyên, cột ghép `TIMTVAL`; hai bảng hình T/L dẫn đến `QUYẾT CHIẾN, QUYẾT THẮNG` để mở rương. Bảy thư và các nhân vật là sáng tác, không phải thư chiến sĩ có thật. Dữ kiện tham chiếu giáo trình *Lịch sử Đảng Cộng sản Việt Nam* (2019), trang in 82–84, 86–87, và nguồn chính thức trong từng thư.

## Kiểm chứng

| Hạng mục | Bằng chứng |
| --- | --- |
| Luật, controller, niên đại, NFC, hai entry build | [44/44 test đạt](letters-rules-qa.md); 21 test màn IV, 23 test game chính. |
| Giấy/phân trang, Esc/reopen, suy luận/ghi, đọc lại, bàn phím, chọn text | [QA UI](letter-ui-qa.md), thử bằng DOM và phím thật. |
| Dấu Việt, font thật, responsive | UI QA tại 1280×900, 375×812, 375×500; Lora/Patrick Hand đã tải và ảnh được kiểm tra. |
| Dữ kiện và ranh giới hư cấu | [Nghiên cứu và rà soát nội dung](history-research.md). |
| [Toàn tuyến](letters-journey-qa.md) | Đi bộ ghi đủ 7 ý, chặn thử A1 tương lai, mở cầu sau 3 ý; thử sai/đúng ô chữ/T-L/rương; tới lời kết cuối, tiến độ rương 1, không lỗi browser. |
| Gate cuối sau ba chỉnh văn phong | 44/44 test, build hai entry exit 0. Bundle `chapterFour-BVt_6ptL.js`, CSS `chapterFour-BU0JUru-.css`. |
| Font và reset bản cuối | Chặn HTTPS trước load: font vẫn loaded từ origin cục bộ, không request ngoài. CSS zoom 200% không tràn ngang, đọc/ghi được. Reset thực xóa arrays/flags và cursor, về spawn (2760,1630). |
| [Review](code-review.md) / [audit](git-audit.md) | Không blocker; game chính/save không diff, không Git mutation/publication; PDF cá nhân không nằm trong deliverable. |

Font cục bộ ở `assets/fonts/`, có giấy phép OFL; bootstrap đợi font trước khi vẽ nhãn Canvas. Không cần mạng để tải font trong lúc chơi. Toàn tuyến được chơi trên bundle `chapterFour-DG0jhoJb.js`, rồi chỉ sửa ba đoạn văn thư 3/5/7 trước build/smoke cuối; không thay dữ kiện, số trang, UI, luật/map/đáp án. Không gọi CSS zoom 200% là browser zoom. QA mới không thay thế bằng chứng game chính/bản thử trước; các mốc cũ giữ tại [roadmap](../../../docs/project-roadmap.md).

## Giới hạn và khuyến nghị

Bản thử không lưu qua tải lại, chưa thay phòng IV của game chính, chưa có điều khiển đi bộ cảm ứng hoặc QA Safari/Firefox. Dữ liệu save game chính giữ riêng. Bản đồ là sơ đồ kể chuyện, không phục dựng quân sự. PDF giáo trình không được đưa vào repo; ảnh trang nghiên cứu nằm trong `tmp/` đã ignore. Vite vẫn cảnh báo kích thước chunk Phaser hiện có; không có lỗi build. Âm thanh PCM/tốc độ không đo lại vì module tương ứng không đổi, giữ bằng chứng tại QA bản thử trước.

Tài liệu đã cập nhật: README, thiết kế, kiến trúc, tóm tắt mã, roadmap và [nhật ký](../../../docs/journals/2026-10-30-letters-timeline.md). [Kế hoạch](../plan.md) đã đồng bộ toàn bộ checklist; liên kết tài liệu nội bộ và đường dẫn nguồn được kiểm tra.

## Câu hỏi chưa giải quyết

Không có trong phạm vi yêu cầu.
