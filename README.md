# Mật mã Điện Biên Phủ

Visual novel lịch sử kết hợp khám phá và giải đố 2D bằng tiếng Việt. Theo Quang từ bảo tàng qua bốn căn phòng ký ức rồi trở về hiện tại. Game dùng Phaser, JavaScript và tài nguyên cục bộ; dựa trên cốt truyện PDF người dùng cung cấp.

Đã hoàn tất và kiểm chứng cục bộ toàn hành trình sau phê duyệt “duyệt và làm full” ngày 2026-10-29. Mã nguồn chia sẻ trên [GitHub](https://github.com/thaideptrai218/mat-ma-dien-bien-phu); game chưa được triển khai thành website trực tuyến.

Bản hiện tại là hành trình Điện Biên Phủ với bốn thử thách. Tuyến năm chặng 1954–1975, mini-map, bản đồ phím M và chạy nhanh Shift là các ý tưởng mở rộng, chưa có trong mã chạy hiện tại.

23 kiểm thử và build đạt; đã chơi tới kết bảo tàng, kiểm tra lưu/tiếp tục/reset, bàn phím, camera, âm thanh, ba kích thước màn hình và zoom trình duyệt 200%. Lượt chơi độc lập cũng tới kết khi chặn mạng ngoài, không có storage và Web Audio. Xem [QA game chính](plans/261029-1757-mat-ma-dien-bien-phu-game/reports/game-qa.md), [QA cạnh biên](plans/261029-1757-mat-ma-dien-bien-phu-game/reports/game-edge-qa.md) và [review mã](plans/261029-1757-mat-ma-dien-bien-phu-game/reports/game-code-review.md).

## Chạy game

Cần **Node.js >=22.12.0** và npm. Lấy mã nguồn:

```powershell
git clone https://github.com/thaideptrai218/mat-ma-dien-bien-phu.git
cd mat-ma-dien-bien-phu
```

Trong thư mục dự án:

```powershell
npm ci
npm run dev
```

Mở **http://127.0.0.1:5173**. Game chính phải chạy qua HTTP; không mở trực tiếp `index.html` bằng `file://`.

```powershell
npm test
npm run build
npm run preview
```

Bản build nằm trong `dist/`; xem tại **http://127.0.0.1:4173** sau khi build. Hai cổng cố định; dừng tiến trình đang chiếm cổng nếu Vite báo lỗi. Phaser **3.90.0**, Vite **8.3.5** được khóa chính xác trong `package.json` và `package-lock.json`.

## Cách chơi

- Bấm bản đồ hoặc **Đi vào bản đồ**, dùng **WASD / phím mũi tên** để di chuyển; camera theo Quang và dừng ở biên. **E** tương tác với dấu vết hoặc cửa gần nhất.
- **N** mở sổ tay. **Esc** tạm rời bảng đang đọc hoặc mở tùy chọn khi focus ở bản đồ. **Tab** rời bản đồ để dùng các nút HTML; Enter/Space kích hoạt nút, phím mũi tên dùng trong danh sách chọn.
- Đọc bằng **Tiếp lời** hoặc **Đọc toàn cảnh**. Đến câu cuối, phải bấm **Ghi manh mối** mới nhận dữ kiện; mở rồi đóng bảng không tính. Sổ tay và **Lời đã đọc** cho đọc lại cả lời kể còn dang dở.
- Mở **Ghép hồ sơ**, dùng nút ↑/↓ và các ô chọn để giải đố; có gợi ý. Giải đúng mở cửa phía đông, nhưng vẫn cần đi tới cửa và tương tác để sang phòng.
- Mở bảng, rời focus hoặc đổi tab sẽ dừng di chuyển; khi quay lại cần focus bản đồ và nhấn phím mới.

| Thử thách | Việc cần làm |
| --- | --- |
| Him Lam | Ghi đủ bốn manh mối, xếp chuẩn bị → pháo binh chiều 13/3/1954 → bộ binh → thắng lợi trận mở màn. |
| Bàn cờ Đông Dương | Ghi bảy manh mối rồi giải bốn bước nối tiếp, mỗi bước ở một trạm trong phòng: cân 84 tiểu đoàn của Kế hoạch Nava, tách hai bức điện chung một sóng, mở từng ngón nắm đấm thép theo thứ tự nơi tập trung quân 2 → 5, gấp bản đồ tới nơi quyết chiến và mở hòm sắt. Bảng câu đố hiện sẵn các dữ kiện đã ghi cho bước đang làm. |
| Sở chỉ huy | Ghi ba manh mối, ghép ba mẩu bản tin và chọn ngày sự kiện. |
| Cánh cửa hòa bình | Có thể đọc thêm, chọn việc làm hoặc viết suy nghĩ; được để trống và bước tiếp, không chấm quan điểm đúng/sai. |

Sau cửa cuối, Quang trở lại bảo tàng và có lời kết. Hai manh mối hòa bình là tùy chọn; suy nghĩ riêng chỉ ở bảng đang mở, không gửi hoặc lưu.

## Tiến độ và âm thanh

Tiến độ tự lưu bằng `localStorage` trong trình duyệt hiện tại: chương, manh mối đã thấy/đã ghi, lời kể hoàn tất, gợi ý, tùy chọn và **checkpoint an toàn gần nhất đã đi vào**. Tiếp tục trở về checkpoint, không khôi phục chính xác vị trí hay câu thoại đang đọc. Lời mở đầu chưa hoàn tất sẽ được mở lại. Save gắn với địa chỉ/cổng trình duyệt; bản dev và preview có tiến độ riêng.

**Bắt đầu lại** yêu cầu xác nhận rồi xóa tiến độ và đặt lại tùy chọn. Save hỏng hoặc bị chặn sẽ có thông báo, vẫn chơi được trong phiên; nếu trình duyệt chặn xóa, tiến độ cũ có thể còn sau tải lại.

Bấm **Bật âm thanh** để mở Web Audio sau thao tác chủ động. Có âm nền, bước chân theo chuyển động và hiệu ứng giấy/đúng/sai; có **Tắt âm thanh** và âm lượng trong tùy chọn. Rời tab/focus sẽ ngừng tiếng. Sau tải lại hoặc khi trình duyệt suspend audio, bấm **Bật lại âm thanh**; tùy chọn đã lưu không tự cấp quyền phát. Lời kể luôn là văn bản; chưa có lồng tiếng hoặc TTS.

## Nội dung và phạm vi

Quang, lời tự sự, mẩu điện và kiến trúc hầm là hư cấu học tập; sơ đồ giải đố không theo tỷ lệ, không phải phục dựng di tích hoặc một tuyến tiến công. Mốc lịch sử có nguồn trong **Tư liệu & cách kể** và sổ tay. Him Lam là trận mở màn, khác chiến thắng toàn chiến dịch 7/5/1954. Biểu trưng/chân dung là minh họa mới; xem [nguồn hình ảnh](docs/image-prompts.md).

Ưu tiên bàn phím máy tính; chưa có điều khiển đi bộ bằng cảm ứng, tài khoản, backend hoặc hosting. Chưa xác định giấy phép phân phối cốt truyện và tài sản.

## Tài liệu phát triển

- [Cốt truyện bổ sung (PDF, bản 2)](docs/game-story-v2.pdf).
- [Cốt truyện (Word)](docs/game-story.docx).
- [Thiết kế GĐ2 – Phòng 2: Bàn cờ Đông Dương](docs/gd2-room-2-design.md) và [plan màn chơi (Thái)](docs/gd2-room-2-level-plan.md).
- [Tổng quan và yêu cầu](docs/project-overview-pdr.md), [cấu trúc mã](docs/codebase-summary.md), [kiến trúc](docs/system-architecture.md).
- [Quy ước mã](docs/code-standards.md), [chạy và build](docs/deployment-guide.md), [tiến độ](docs/project-roadmap.md).
- [Phạm vi truyện và nguồn lịch sử](docs/game-proposal.md), [công nghệ](docs/tech-stack.md), [thiết kế](docs/design-guidelines.md).
- [Kế hoạch triển khai](plans/261029-1757-mat-ma-dien-bien-phu-game/plan.md), [nhật ký quyết định](docs/journals/2026-10-29-full-game.md).

Bản mẫu chương I trong [docs/wireframe/index.html](docs/wireframe/index.html) là bản Canvas độc lập giữ để đối chiếu thiết kế, không có lưu tiến độ hoặc các chương sau. Hướng dẫn HTTP phía trên dành cho game chính.
