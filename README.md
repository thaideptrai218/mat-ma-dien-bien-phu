# Mật mã Điện Biên Phủ

Bản chính hiện tại là **hành trình năm phòng hoàn chỉnh**: bảo tàng → Phòng 1 → **Phòng 2 của Bảo** → Phòng 3 hậu phương → Phòng 4 của Trâm → Phòng 5 ghép tranh/suy ngẫm → trở lại bảo tàng. Quang đọc giấy tờ, giải đố và tự kiếm đủ bốn mảnh tranh. Game dùng Phaser, JavaScript và tài nguyên cục bộ.

Entry `/` chạy toàn hành trình trong cùng trang/cùng origin; chỉ đổi phòng sau khi tới cửa thật. **Sổ hành trình** giữ toàn văn các giấy đã thu thập ở những phòng trước. Các bản thử riêng vẫn có tại `room-one.html`, `room-two.html`, `room-three.html`, `room-four.html`, dùng save riêng và không được nhập thành thành tích chiến dịch. Checkout gốc và preview [Bảo 4180](http://127.0.0.1:4180/) giữ nguyên, không cần mở tab ấy để hoàn thành bản chính.

## Chạy cục bộ

Cần **Node.js >=22.12.0** và npm. Trong thư mục dự án:

```powershell
npm ci
npm run dev
```

Mở **[Hành trình đầy đủ](http://127.0.0.1:5173/)**. Bản thử riêng: [Phòng 1](http://127.0.0.1:5173/room-one.html), [Phòng 2](http://127.0.0.1:5173/room-two.html), [Phòng 3](http://127.0.0.1:5173/room-three.html), [Phòng 4](http://127.0.0.1:5173/room-four.html). Chạy qua HTTP, không mở HTML bằng `file://`.

```powershell
npm test
npm run build
npm run preview
```

Bản build có năm entry: `index.html` cho chiến dịch và bốn bản thử `room-one.html` tới `room-four.html`. Phòng 5 chỉ mở trong chiến dịch khi có đủ thành tích thật. Preview tại **http://127.0.0.1:4173/** với các đường dẫn trên. Dev/preview cố định 5173/4173; Bảo gốc ở 4180. Phaser **3.90.0**, Vite **8.3.5** được khóa trong package/lockfile. Chưa triển khai hosting.

## Cách chơi

- Bấm bản đồ để nhận focus. Dùng **WASD / phím mũi tên** di chuyển, giữ **Shift** chạy nhanh: 260 → 390 pixel thế giới/giây; tốc độ đường chéo được chuẩn hóa.
- Đến gần vật rồi nhấn **E** hoặc nút tương tác. Vật ở xa không thể mở từ danh sách hay bản đồ.
- **M** mở sơ đồ, **N** mở sổ tay, **Q** thu gọn/mở nhiệm vụ, **Esc** mở tùy chọn khi đang ở bản đồ hoặc đóng bảng đang xem. **Tab** rời canvas để dùng nút HTML.
- Bảng nhiệm vụ góc trên phải có bốn bước và mục tiêu hiện tại. Mini-map góc dưới phải cùng sơ đồ lớn hiển thị vị trí thật, vật cản và dấu vết; không dịch chuyển bằng cách bấm sơ đồ.
- Mở bảng, đổi tab hoặc mất focus sẽ dừng di chuyển. Khi quay lại, nhấn phím mới để tiếp tục.

Trong chiến dịch, đi hết từng phòng và tương tác cửa để chuyển tiếp; mở rương hoặc nhận mảnh chưa thay thao tác ra cửa. **Sổ hành trình** trên thanh chung đọc lại giấy đã kiếm được mà không cấp thêm tiến độ. **Bắt đầu lại phòng** giữ các phòng trước; **Hành trình mới** cần xác nhận và chỉ xóa save chiến dịch. Không nhập thành tích từ bản thử riêng.

### Phòng 1 — Trước bản kế hoạch

| Bước | Việc cần làm |
| --- | --- |
| 1 | Mở lá thư anh Lâm gửi em Tín, đọc hết rồi cùng Quang nhận ra ký hiệu lưu trữ A-03. Không còn câu đố xếp mảnh thư. |
| 2 | Đọc hết V-01, V-02, P-01, P-02; cùng Quang suy luận rồi xác nhận từng hồ sơ. Đối chiếu đủ bốn mặt của tương quan lực lượng. |
| 3 | Dùng mã từ bàn đối chiếu để mở ngăn kéo; đọc bảng thay số bằng chữ cái và giải tên người trong điện mật. |
| 4 | Dùng tên theo cách gọi tiếng Việt để mở rương, nhận mảnh tranh đầu tiên rồi đi tới cửa phía bắc để hoàn thành phòng. |

Nền lịch sử được mở rộng **1950–7/1953**: Biên giới Thu–Đông 1950, Trung Du, Hòa Bình, Tây Bắc, quân đội trưởng thành và hậu phương vững hơn. Thư đầu năm 1953 chỉ nhìn lại những việc đã qua; không biết trước bổ nhiệm tháng năm hay kế hoạch tháng bảy. Sau khi giải danh tính, có bản tin N-01 nguyên văn về việc bổ nhiệm tháng 5 và thông qua kế hoạch tháng 7/1953. Đây là phần đọc thêm, không thêm điều kiện mở rương hoặc đổi save cũ; người đã giải danh tính có thể mở N-01 trong sổ tay. Thư và bốn giấy cũ có 341–370 từ, N-01 có 331 từ; mỗi tờ năm đoạn.

### Phòng 2 của Bảo — Bàn cờ Đông Dương

Bản tích hợp giữ bản đồ, bảy manh mối/toàn văn, intro/outro và bốn câu đố gốc của Bảo: cân lực lượng, dò băng tần, chuỗi nắm đấm và gấp phong bì. Mã, lời dẫn, phản hồi sai/đúng và renderer gốc được đối chiếu bằng dữ liệu/hash; không thay bằng cơ chế Room 2 khác trong PDF. Hoàn tất nếp gấp cuối nhận **mảnh II**, rồi đi tới cửa phía đông để sang Phòng 3; không thêm rương hay bước nhận lại mảnh. [Bảo toàn bản gốc](plans/261031-campaign-link/reports/room-two.md).

### Phòng 3 — Mật mã hậu phương: Giải cứu tuyến tiếp vận

Trại tiếp vận 3200×2000 đi từ kho hàng qua đường vận chuyển, lều chỉ huy tới trạm tin chiến trường. Năm giấy tờ đầy đủ, 321–340 từ/tờ, xen giữa bốn thử thách:

| Thử thách | Việc cần làm và dữ kiện nhận được |
| --- | --- |
| Hồ sơ bị thất lạc | Phân loại hai mốc 6/12 và 13/3, ba việc chuẩn bị song song; chọn vật tư và lý do sẵn sàng hậu cần → THÁNG 3. |
| Những chuyến hàng | Ghép sáu tranh minh họa với vai trò tiếp vận, hiểu xe thồ và đóng góp của dân công/thanh niên xung phong → NĂM 1954. |
| Hai phương châm | Ghép hai mật lệnh, giải thích đánh giá thực tế, thận trọng và chắc thắng → ĐÁNH CHẮC, TIẾN CHẮC. |
| Bản tin mở màn | Xếp Him Lam, Độc Lập, Bản Kéo đúng ngày 13/15/17 tháng ba, hiểu mở màn/đầu hàng và ý nghĩa → NGÀY 13. |

Đủ cả bốn thử thách mới nhập ngày **13/03/1954** để mở rương; dữ kiện phương châm được giữ riêng, không ép thành ngày. Đến rương nhận riêng **mảnh III**, rồi tới cửa mới hoàn thành. Sáu hình xe thồ, dân công, kéo pháo, gạo, đạn và công binh là **tranh SVG sáng tác có nhãn minh họa**, không phải ảnh tư liệu.

### Phòng 4 của Trâm — Những ngày quyết định

Phòng 2800×1800 có rương ở giữa, hai bàn mật mã phía sau và bảy giấy tờ quanh tường. Đọc theo dòng thời gian: vòng vây 30/3–30/4 → đợt ba từ 1/5 → A1 đêm 6/5 → sở chỉ huy chiều 7/5 → kết quả → miền Bắc sau Genève 1954 → ý nghĩa độc lập dân tộc. Bảy văn bản có 301–330 từ, mỗi tờ năm đoạn, với giọng thư, nhật ký và báo cáo riêng.

| Bước | Việc cần làm |
| --- | --- |
| 1 | Đọc hết rồi xác nhận lần lượt bảy giấy tờ; sổ tay giữ toàn văn. |
| 2 | Trả lời bảy câu hỏi lịch sử, điền ô chữ và chọn cột dọc tạo thành lời chỉ dẫn. |
| 3 | Tìm hình T và L trên hai bảng chữ, ghép câu mở khóa. Rương tự mở và đổi hình ngay khi đúng. |
| 4 | Đến gần rương, nhấn E và nhận riêng mảnh IV; đi tới cửa phía bắc mới hoàn thành phòng. |

Giấy đọc dùng văn bản chọn/copy được. Ngày viết, nguồn và nhãn hư cấu nằm ngoài lời văn; thư có lời chào, chữ ký và phong bì. Đọc hết mới tới suy nghĩ của Quang; đóng sớm không nhận dữ kiện. Ô chữ giữ đủ 17 cột trong vùng cuộn ngang trên màn hẹp; các ô chọn hình có kích thước tối thiểu 44 px.

### Phòng 5 — Bức tranh và cánh cửa trở về

Đủ bốn mảnh thật và đã ra cửa bốn phòng trước mới tới bàn phục dựng. Chọn hai mảnh để đổi chỗ, ghép đúng bốn phần tư của bức tranh. Cửa vẫn chờ cuộc trò chuyện cuối giữa Quang và hệ thống; có ô viết suy nghĩ **tự chọn, không chấm đúng/sai, không lưu hoặc gửi đi**. Có thể để trống, tiếp tục rồi đi tới cửa thật. Trở lại cùng bức tranh trong bảo tàng và bấm **Khép lại hành trình** mới ghi hoàn tất. Tranh SVG dùng ở mở đầu, mảnh ghép và đoạn trở về là minh họa do dự án sáng tác, không phải bản sao tranh bảo tàng.

## Nguồn và cách kể

Chỉ dùng PDF bản 4, `lich su.txt` tại máy và [nội dung người dùng bổ sung ngày 31/10](plans/261031-room-three-logistics/source-brief.md); không nghiên cứu lịch sử trên web. Quang, người viết thư, chuyện riêng, điện mật và căn phòng là sáng tác, không phải thư thật, lời chứng hay trích dẫn lịch sử. Sơ đồ là bố cục học tập, không phục dựng di tích/tuyến tác chiến.

Quân số **252.000 phía Việt Nam / 445.000 phía Pháp** trong Phòng 1 dùng theo tài liệu cung cấp, có nhãn **“Số liệu theo tài liệu cung cấp”**. Không coi các số ấy là thống kê được kiểm chứng độc lập. Các đoạn hỏng của bản chữ không dùng làm đáp án bắt buộc. Phòng 1 giới thiệu Henri Navarre/Nava ở cuối chuỗi; nội dung hai bước của kế hoạch Nava dành cho Phòng 2.

Phòng 4 theo phần Trâm ở tr. 6, 18–22 của PDF bản 4. **16.200** là tổng quân địch **bị tiêu diệt và bắt sống**; miền Bắc được giải phóng trong bước chuyển sau Genève, không gộp vào ngày 7/5. Ô chữ giữ nguyên đáp án lịch sử, bổ sung một ô cuối còn thiếu ở hàng “Sở chỉ huy trung tâm” để đủ 16 chữ. Chi tiết đối chiếu nguồn và hai bảng mật mã có trong [báo cáo nội dung](plans/261030-tram-room-four/reports/content.md).

Phòng 3 giữ ngày Him Lam 13/3, Độc Lập 15/3, Bản Kéo đầu hàng 17/3; **trên 2.000** bị tiêu diệt/bắt sống là kết quả đợt đầu, không phải đáp án số lượng bắt buộc. Không coi 17/3 là kết thúc chiến dịch, không gán ngày đổi phương châm chưa được cung cấp. [Đối chiếu nội dung mới](plans/261031-room-three-logistics/reports/content.md) ghi rõ phạm vi nguồn và các ngày thư hư cấu.

Nguồn PDF cá nhân không được tải lên hoặc đưa vào gói website. Xem [audit PDF](plans/261030-pdf-four-rebuild/reports/pdf-requirements.md) và [audit chất lượng bản chữ](plans/261030-pdf-four-rebuild/reports/history-text-quality.md).

## Tiến độ và âm thanh

Chiến dịch dùng **`mat-ma-dien-bien-phu:campaign:v1`**: state đã kiểm tra của từng phòng, tiến trình cửa liên tục và tùy chọn âm thanh chung. Mảnh tranh được tính từ kết quả thật của các phòng, không tin danh sách mảnh hoặc số phòng tùy ý trong save. Reload về điểm vào an toàn của phòng hiện tại. Sổ hành trình đọc lại toàn văn; không lưu tọa độ, draft hay lời suy ngẫm cá nhân.

Bốn bản thử giữ khóa riêng `mat-ma-dien-bien-phu:room-one:v1`, `:room-two:v1`, `:room-three:v1`, `:room-four:v1` với cùng tiền tố. Không tự chuyển/import các khóa này hoặc save gốc của Bảo sang chiến dịch. Reset phòng hiện tại giữ thành tích trước, loại tiến độ phụ thuộc phía sau; xác nhận hành trình mới chỉ xóa envelope chiến dịch. Dev/preview có vùng lưu riêng theo origin/cổng.

Storage hỏng/bị chặn có thông báo và vẫn chơi trong phiên. **Bật âm thanh** cần thao tác chủ động để mở Web Audio. Chiến dịch giữ một audio controller/context xuyên các phòng; dừng input/âm thanh khi mở sổ chung hoặc mất focus. Âm nền, bước chân và hiệu ứng cục bộ; chưa có lồng tiếng/TTS/backend/tài khoản hay điều khiển đi bộ cảm ứng.

## Tài liệu và trạng thái kiểm chứng

Hiện **105/105 kiểm thử**, build năm entry và [review GO](plans/261031-campaign-link/reports/code-review.md). [Lượt chơi chiến dịch thật](plans/261031-campaign-link/reports/campaign-qa.md) đã qua bảo tàng, đủ năm phòng/bốn mảnh thật, ghép tranh, tiếp tục suy ngẫm để trống, cửa thật, trở về và acknowledgment cuối. Reload ending/audio, sổ hành trình 26 giấy, diagnostics clone, reset giữ preview và màn 390 px được kiểm tra đúng phạm vi báo cáo. [Room 2 độc lập](plans/261031-campaign-link/reports/room-two-qa.md) và [Room 5 component](plans/261031-campaign-link/reports/final-room.md) có bằng chứng riêng. Git update theo sau kiểm chứng; chưa triển khai hosting.

- [Kế hoạch Phòng 1](plans/261030-pdf-four-rebuild/phase-room-one-playable.md), [nhật ký thay mới](docs/journals/2026-10-30-room-one-rebuild.md).
- [Kế hoạch nối toàn hành trình](plans/261031-campaign-link/plan.md), [lifecycle](plans/261031-campaign-link/reports/lifecycle.md), [bảo toàn Bảo](plans/261031-campaign-link/reports/room-two.md), [nhật ký tích hợp](docs/journals/2026-10-31-campaign-integration.md).
- [Kế hoạch Phòng 3 và bổ sung Phòng 1](plans/261031-room-three-logistics/plan.md), [nguồn/nội dung](plans/261031-room-three-logistics/reports/content.md), [UI](plans/261031-room-three-logistics/reports/ui.md), [thế giới](plans/261031-room-three-logistics/reports/world.md), [nhật ký](docs/journals/2026-10-31-room-three-logistics.md).
- [Kế hoạch Phòng 4](plans/261030-tram-room-four/plan.md), [nội dung và mật mã](plans/261030-tram-room-four/reports/content.md), [UI](plans/261030-tram-room-four/reports/ui-implementation.md), [nhật ký Phòng 4](docs/journals/2026-10-30-tram-room-four.md).
- [Tổng quan](docs/project-overview-pdr.md), [cấu trúc mã](docs/codebase-summary.md), [kiến trúc](docs/system-architecture.md).
- [Quy ước mã](docs/code-standards.md), [thiết kế](docs/design-guidelines.md), [chạy và build](docs/deployment-guide.md), [tiến độ](docs/project-roadmap.md).
- Nguồn truyện các phiên bản trước: [PDF bản 2](docs/game-story-v2.pdf), [Word](docs/game-story.docx). Các tệp giữ provenance, không thay phạm vi PDF bản 4 đã chấp thuận.
- Mã nguồn: [GitHub](https://github.com/thaideptrai218/mat-ma-dien-bien-phu). Cập nhật tích hợp chỉ thực hiện sau kiểm chứng; không coi push mã là triển khai hosting. Giấy phép phân phối cốt truyện và tài sản chưa xác định.
