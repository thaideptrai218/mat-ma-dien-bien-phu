# QA toàn tuyến thư và dòng thời gian

Ngày 2026-10-30. Production preview `http://127.0.0.1:4173/chapter-four.html`. Controller kiểm tra browser riêng `letters-journey`; UI designer kiểm tra riêng trong [letter-ui-qa.md](letter-ui-qa.md).

## Kết quả

- Đi thực trên map bằng các sự kiện WASD/Shift/E hướng vào canvas; helper [letters-journey-driver.js](letters-journey-driver.js) chỉ điều khiển input và đọc debug snapshot, không đặt tọa độ/state/hoàn thành puzzle từ API.
- Intro → thư encirclement trang 1/2 → trang 2/2 → Minh suy luận → ghi. Khi mới ghi 1/7, đi đến A1 rồi E: không mở dialog, không discover/read/collect; toast chỉ đến thư objective ngày 1/5. Sau đó quay lại đúng thư, đọc và ghi.
- Tiếp tục A1 → cầu mở sau 3/7 → headquarters → weapons → north → independence. Mỗi thư đều qua hai trang giấy và lời Minh riêng. Đủ 7/7 theo đúng thứ tự; sổ tay hiển thị `30/4/1954`, `1/5/1954`, `Rạng sáng 7/5/1954`, `Chiều 7/5/1954 · sau 17 giờ 30`, `26/5/1954`, `17/5/1955`, `18/5/1955`.
- Ô chữ trống phản hồi lỗi; nhập đáp án có dấu bằng input DOM/listener thật, chọn cột 9 và submit: `TÌM T VÀ L`. Thứ tự hàng vẫn như PDF puzzle, độc lập ngày tháng thư.
- Hai bảng chưa chọn phản hồi lỗi; chọn đủ mười ô T trái và mười ô L phải bằng nút DOM thật rồi đối chiếu: `QUYẾT CHIẾN, QUYẾT THẮNG`.
- Đi đến rương; khẩu hiệu sai giữ rương khóa, khẩu hiệu đúng mở. Sau hoạt ảnh và 1100 ms, lời kết xuất hiện; đã đọc hết 3 lời, `lineIndex:2`, `lastLine:true`, `phase:ending`, `chestProgress:1`, ba flag puzzle/chest đều true. [Ảnh kết](letters-ending.png). Browser error log rỗng.

Toàn tuyến trên bundle `chapterFour-DG0jhoJb.js`, CSS `chapterFour-BU0JUru-.css`. Sau đó chỉnh ba đoạn văn thuần ở thư A1, tổng kết và trang cuối để bỏ từ ngữ gợi bài đố trong lời người viết; không đổi dữ kiện, số trang, UI, luật, map hoặc câu trả lời.

## Build cuối và kiểm tra font cục bộ

Sau chỉnh văn: `npm test` đạt **44/44**, không fail/skip; `npm run build` exit 0, hai entry. Bundle cuối `chapterFour-BVt_6ptL.js`, CSS giữ `chapterFour-BU0JUru-.css`; font Lora và Patrick Hand mỗi file khoảng 212–215 kB. Cảnh báo chunk Phaser 1194,43 kB hiện hữu, không phải lỗi build.

Browser mới `letters-final`: chặn `https://**` trước khi mở bản cuối. Đi từ welcome qua intro tới thư đầu; hai FontFace `loaded`, request TTF đều từ `127.0.0.1:4173/assets/`, không có resource ngoài origin. Computed heading `Trial Serif`, manuscript `Trial Handwriting`. [Ảnh font cuối](letter-final-font.png). Dấu ghép được so với [ảnh lỗi ban đầu](before-letter-reader.png); UI designer đã kiểm tra cmap đủ 90 ký tự Việt U+1EA0–U+1EF9 và ĂăĐđƠơƯư trong cả hai font.

Thử CSS zoom **200%** (không gán là browser zoom): trang vẫn không tràn ngang (`scrollWidth1265 ≤ viewport1280`), dialog rộng1189 và cuộn dọc được; trang sau → suy luận → ghi vẫn hoạt động. Trả zoom100%.

Reset thực qua Hướng dẫn → Chơi lại → xác nhận: mọi discovered/read/collected array rỗng, flag puzzle/chest false, spawn `(2760,1630)`, intro mới. Đọc intro rồi E mở thư đầu ở trang0, `lastPage:false`, xác nhận cursor thư cũng xóa. Error log rỗng. [QA UI](letter-ui-qa.md) bổ sung desktop/375px/viewport thấp, Tab/Enter/Esc và chọn/copy văn bản.

## Giới hạn

Không đo lại âm thanh PCM hoặc tốc độ vì module âm thanh/input không đổi; kiểm chứng trước ở [QA màn IV gốc](../../261030-chapter-four-playable-trial/reports/chapter-four-edge-qa.md). Chưa QA Safari/Firefox hoặc điều khiển đi bộ cảm ứng. Thư là sáng tác, không hiện vật thật; nguồn và locators trong [nghiên cứu](history-research.md). Game chính/save không đổi theo [audit](git-audit.md); không commit/push/deploy.

## Câu hỏi chưa giải quyết

Không có cho phạm vi yêu cầu.
