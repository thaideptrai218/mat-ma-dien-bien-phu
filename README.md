# Mật mã Điện Biên Phủ

**Chơi trực tuyến:** [mat-ma-dien-bien-phu.vercel.app](https://mat-ma-dien-bien-phu.vercel.app/). Đã triển khai production bằng MCP Vercel; [cấu hình và kiểm tra](docs/deployment.md).

Bản chính hiện tại là **hành trình năm phòng hoàn chỉnh**: bảo tàng → Phòng 1: Trước bản kế hoạch → Phòng 2: Bàn cờ Đông Dương → Phòng 3: Hậu phương → Phòng 4: Những ngày quyết định → Phòng 5: ghép ảnh và suy ngẫm → trở lại bảo tàng. Nhân vật được chọn đọc giấy tờ, giải đố và tự tìm đủ bốn mảnh ghép. Game dùng Phaser, JavaScript và tài nguyên cục bộ.

Entry `/` chạy toàn hành trình trong cùng trang/cùng origin; người chơi chọn Long hoặc Quang làm người đồng hành cho trọn lượt, chỉ đổi phòng sau khi tới cửa thật. **Sổ hành trình** giữ toàn văn các giấy đã thu thập ở những phòng trước. Các bản chơi riêng có tại `room-one.html` đến `room-five.html`, dùng save riêng và không được nhập thành thành tích chiến dịch. Phòng 5 độc lập có sẵn bốn mảnh minh họa để thử ghép ảnh và phần kết; tiến độ của nó không ảnh hưởng hành trình chính.

## Chạy cục bộ

Cần **Node.js >=22.12.0** và npm. Trong thư mục dự án:

```powershell
npm ci
npm run dev
```

Mở **[Hành trình đầy đủ](http://127.0.0.1:5173/)**. Bản chơi riêng: [Phòng 1](http://127.0.0.1:5173/room-one.html), [Phòng 2](http://127.0.0.1:5173/room-two.html), [Phòng 3](http://127.0.0.1:5173/room-three.html), [Phòng 4](http://127.0.0.1:5173/room-four.html), [Phòng 5](http://127.0.0.1:5173/room-five.html). Chạy qua HTTP, không mở HTML bằng `file://`.

```powershell
npm test
npm run build
npm run preview
```

Bản build có sáu entry: `index.html` cho chiến dịch và năm bản chơi riêng `room-one.html` tới `room-five.html`. Preview tại **http://127.0.0.1:4173/** với các đường dẫn trên. Dev/preview cố định 5173/4173. Phaser **3.90.0**, Vite **8.3.5** được khóa trong package/lockfile. Đã triển khai production trên Vercel; xem docs/deployment.md.

## Cách chơi

- Bấm bản đồ để nhận focus. Dùng **WASD / phím mũi tên** di chuyển, giữ **Shift** chạy nhanh: 260 → 390 pixel thế giới/giây; tốc độ đường chéo được chuẩn hóa.
- Đến gần vật rồi nhấn **E** hoặc nút tương tác. Vật ở xa không thể mở từ danh sách hay bản đồ.
- **M** mở sơ đồ, **N** mở sổ tay, **Q** thu gọn/mở nhiệm vụ, **Esc** mở tùy chọn khi đang ở bản đồ hoặc đóng bảng đang xem. **Tab** rời canvas để dùng nút HTML.
- Bảng nhiệm vụ góc trên phải có bốn bước và mục tiêu hiện tại. Mini-map góc dưới phải cùng sơ đồ lớn hiển thị vị trí thật, vật cản và dấu vết; không dịch chuyển bằng cách bấm sơ đồ.
- Mở bảng, đổi tab hoặc mất focus sẽ dừng di chuyển. Khi quay lại, nhấn phím mới để tiếp tục.

Trong chiến dịch, đi hết từng phòng và tương tác cửa để chuyển tiếp; mở rương hoặc nhận mảnh chưa thay thao tác ra cửa. **Sổ hành trình** trên thanh chung đọc lại giấy đã kiếm được mà không cấp thêm tiến độ. **Bắt đầu lại phòng** giữ các phòng trước; **Hành trình mới** cần xác nhận và chỉ xóa save chiến dịch. Không nhập thành tích từ bản thử riêng.

### Hai nhân vật: Long và Quang

Khi chơi mới, người chơi chọn **Long** (học sinh hay trốn tiết, dần nhận ra ý nghĩa của việc cố gắng học; có vài câu phản ứng sau Phòng 1, 3, 4 và đoạn kết suy ngẫm riêng) hoặc **Quang** (sinh viên ham học hỏi, mê công nghệ và giải đố; nhân vật ban đầu). Lựa chọn được lưu và khóa suốt lượt chơi; muốn đổi thì **Chơi mới**. Hồ sơ nhân vật nằm ở `src/heroes/` (tên, chân dung, sprite, avatar Hệ Thống, khóa giọng, nội dung riêng); nội dung dùng chung viết với tên “Long” rồi đổi tên theo nhân vật.

- Long xưng “tôi”, gọi Hệ Thống là “bạn”; Quang xưng “mình”, gọi Hệ Thống là “cậu” với giọng lịch sự. Hệ Thống gọi cả hai là “Ký Chủ”.
- Giọng: cả hai route dùng chung Hệ Thống (giọng CapCut ban đầu, biểu tượng ban đầu). Route Long: nhân vật = giọng mck, kể chuyện = giọng nữ truyền cảm (1.05x). Route Quang (toàn bộ giọng ban đầu): nhân vật = CapCut “Thanh Niên Tự Tin”, kể chuyện = giọng đọc bài giảng.

### Nhân vật Long theo ảnh mẫu

Sprite Long có bốn hướng di chuyển. Đi bộ dùng bảy bước luân phiên (10fps); chạy dùng cùng chu kỳ chân ở 15fps để tránh lặp một bên chân. Khi dừng, nhân vật chuyển ngay sang tư thế đứng khép hai chân. File sprite gốc được giữ nguyên. Giảm chuyển động của hệ điều hành giữ hình đứng theo hướng nhưng vẫn cho đi/chạy.

Game nạp ảnh cục bộ trước khi tạo nhân vật. Khung atlas160×192 hiển thị120×144 (tăng 1,5 lần), collider vẫn24×16; tốc độ260/390 và save/câu đố không đổi. [Sprite và thông số](assets/characters/long/README.md), [sprite gốc](assets/characters/long/motion-sheet.png), [atlas có idle](assets/characters/long/motion-sheet-with-idle.png). Phạm vi lần này là sprite khám phá; chân dung hội thoại là tài nguyên riêng.

### Phòng 1 — Trước bản kế hoạch

| Bước | Việc cần làm |
| --- | --- |
| 1 | Đọc lá thư anh Lâm gửi em Tín rồi khám phá sơ đồ lưu trữ trong phòng. Không còn câu đố xếp mảnh thư. |
| 2 | Đọc hết V-01, V-02, P-01, P-02; cùng Long suy luận rồi xác nhận từng hồ sơ. Đối chiếu đủ bốn mặt của tương quan lực lượng; bàn vẫn hiện mã mở ngăn kéo khi xem lại. |
| 3 | Dùng kết quả bàn đối chiếu để mở ngăn kéo; đọc bảng thay số bằng chữ cái và giải danh tính trong điện mật. |
| 4 | Dùng cách gọi vừa suy luận để mở rương, nhận mảnh tranh đầu tiên rồi đi tới cửa phía bắc để hoàn thành phòng. |

Nền lịch sử được mở rộng **1950–7/1953**: Biên giới Thu–Đông 1950, Trung Du, Hòa Bình, Tây Bắc, quân đội trưởng thành và hậu phương vững hơn. Thư đầu năm 1953 chỉ nhìn lại những việc đã qua; không biết trước bổ nhiệm tháng năm hay kế hoạch tháng bảy. Sau khi giải danh tính, có bản tin N-01 nguyên văn về việc bổ nhiệm tháng 5 và thông qua kế hoạch tháng 7/1953. Đây là phần đọc thêm, không thêm điều kiện mở rương hoặc đổi save cũ; người đã giải danh tính có thể mở N-01 trong sổ tay. Thư và bốn giấy cũ có 341–370 từ, N-01 có 331 từ; mỗi tờ năm đoạn.

### Phòng 2 — Bàn cờ Đông Dương

Bản tích hợp giữ bản đồ, bảy manh mối, intro/outro và bốn câu đố: cân lực lượng, dò băng tần, chuỗi nắm đấm và gấp phong bì. Hoàn tất nếp gấp cuối nhận **mảnh II**, rồi đi tới cửa phía đông để sang Phòng 3.

### Phòng 3 — Mật mã hậu phương: Giải cứu tuyến tiếp vận

Trại tiếp vận 3200×2000 đi từ kho hàng qua đường vận chuyển, lều chỉ huy tới trạm tin chiến trường. Năm giấy tờ đầy đủ, 321–340 từ/tờ, xen giữa bốn thử thách:

| Thử thách | Việc cần làm và dữ kiện nhận được |
| --- | --- |
| Hồ sơ bị thất lạc | Phân loại hai mốc 6/12 và 13/3, ba việc chuẩn bị song song; chọn vật tư và lý do sẵn sàng hậu cần → THÁNG 3. |
| Những chuyến hàng | Ghép sáu tranh minh họa với vai trò tiếp vận, hiểu xe thồ và đóng góp của dân công/thanh niên xung phong → NĂM 1954. |
| Hai phương châm | Ghép hai mật lệnh, giải thích đánh giá thực tế, thận trọng và chắc thắng → ĐÁNH CHẮC, TIẾN CHẮC. |
| Bản tin mở màn | Xếp Him Lam, Độc Lập, Bản Kéo đúng ngày 13/15/17 tháng ba, hiểu mở màn/đầu hàng và ý nghĩa → NGÀY 13. |

Đủ cả bốn thử thách mới nhập ngày **13/03/1954** để mở rương; dữ kiện phương châm được giữ riêng, không ép thành ngày. Đến rương nhận riêng **mảnh III**, rồi tới cửa mới hoàn thành. Sáu bức tranh xe thồ, dân công, kéo pháo, gạo, đạn và công binh kể về tuyến hậu cần.

### Phòng 4 — Những ngày quyết định

Phòng 2800×1800 có rương ở giữa, hai bàn mật mã phía sau và bảy giấy tờ quanh tường. Đọc theo dòng thời gian: vòng vây 30/3–30/4 → đợt ba từ 1/5 → A1 đêm 6/5 → sở chỉ huy chiều 7/5 → kết quả → miền Bắc sau Genève 1954 → ý nghĩa độc lập dân tộc. Bảy văn bản có 301–330 từ, mỗi tờ năm đoạn, với giọng thư, nhật ký và báo cáo riêng.

| Bước | Việc cần làm |
| --- | --- |
| 1 | Đọc hết rồi xác nhận lần lượt bảy giấy tờ; sổ tay giữ toàn văn. |
| 2 | Trả lời bảy câu hỏi lịch sử, đối chiếu từng mảnh ghi chú, điền ô chữ và chọn cột dọc tạo thành lời chỉ dẫn. Các câu trả lời tự lưu khi nhập. |
| 3 | Theo chỉ dẫn vừa giải để đọc hai bảng chữ, ghép câu mở khóa. Rương tự mở và đổi hình ngay khi đúng. |
| 4 | Đến gần rương, nhấn E và nhận riêng mảnh IV; đi tới cửa phía bắc mới hoàn thành phòng. |

Giấy đọc dùng văn bản chọn/copy được; thư có lời chào, chữ ký và phong bì. Chữ ký dùng Patrick Hand cỡ 31–38 px, nhấn nghiêng nhẹ; nội dung giữ cỡ đọc bình thường. Đọc hết mới tới suy nghĩ của Long; đóng sớm không nhận dữ kiện. Ô chữ giữ đủ 17 cột trong vùng cuộn ngang trên màn hẹp; các ô chọn hình có kích thước tối thiểu 44 px.

### Phòng 5 — Ảnh chiến thắng và cánh cửa trở về

Bản chiến dịch yêu cầu bốn mảnh thật và đã qua cửa bốn phòng trước khi tới bàn ghép. Bản chơi riêng `room-five.html` có sẵn bốn mảnh minh họa. Cả hai bản đều cho đổi chỗ để ghép bức ảnh, xem cuộc trò chuyện cuối và đi tới cửa. Bản riêng có save riêng, không ghi nhận hoàn tất chiến dịch. Ô suy nghĩ là **tự chọn, không chấm đúng/sai, không lưu hoặc gửi đi**.

## Tiến độ và âm thanh

Chiến dịch dùng **`mat-ma-dien-bien-phu:campaign:v1`**: state đã kiểm tra của từng phòng, tiến trình cửa liên tục và tùy chọn âm thanh chung. Mảnh tranh được tính từ kết quả thật của các phòng, không tin danh sách mảnh hoặc số phòng tùy ý trong save. Reload về điểm vào an toàn của phòng hiện tại. Sổ hành trình đọc lại toàn văn. Phòng 4 tự lưu các câu trả lời đang nhập trong ô chữ; tọa độ, vị trí thước/cursor và lời suy ngẫm cá nhân không được lưu.

Bốn preview Phòng 1–4 giữ khóa riêng `mat-ma-dien-bien-phu:room-one:v1` đến `:room-four:v1`. Bản chơi riêng Phòng 5 dùng `mat-ma-dien-bien-phu:room-five-preview:v1`; không bản nào tự nhập tiến độ vào chiến dịch. Reset phòng hiện tại giữ thành tích trước, loại tiến độ phụ thuộc phía sau; xác nhận hành trình mới chỉ xóa envelope chiến dịch. Dev/preview có vùng lưu riêng theo origin/cổng.

Storage hỏng/bị chặn có thông báo và vẫn chơi trong phiên. **Bật âm thanh** cần thao tác chủ động để mở Web Audio. Chiến dịch giữ một audio controller/context xuyên các phòng; dừng input/âm thanh khi mở sổ chung hoặc mất focus. Kịch bản lồng tiếng gồm 423 dòng thoại (Long, Hệ Thống giọng máy, Lời kể), cùng hiệu ứng âm thanh và nền môi trường theo phòng; nút **Bật lồng tiếng** ở khung bảo tàng và bảng thoại, tùy chọn Lồng tiếng/âm lượng trong cài đặt. Tắt tiếng hoặc thiếu file vẫn chơi trọn bằng chữ. Chưa có backend/tài khoản hay điều khiển đi bộ cảm ứng.

Làm lại giọng sau khi sửa lời thoại (cần CapCut bridge `:8124` và OmniVoice `:8123` của `F:\AI-auto-generate-video`): `npm run voice:script` → `npm run voice:generate` → `npm run voice:master` → `npm run voice:review` (trang nghe duyệt cục bộ `.cache/voice-review.html`). SFX/nền: `npm run audio:sfx`; nguồn và giấy phép ở `public/audio/sfx/credits.json`.

## Tài liệu và trạng thái kiểm chứng

Hiện **119/119 kiểm thử**, build năm entry và [review GO](plans/261031-campaign-link/reports/code-review.md). [Lượt chơi chiến dịch thật](plans/261031-campaign-link/reports/campaign-qa.md) đã qua bảo tàng, đủ năm phòng/bốn mảnh thật, ghép tranh, tiếp tục suy ngẫm để trống, cửa thật, trở về và acknowledgment cuối. Reload ending/audio, sổ hành trình 26 giấy, diagnostics clone, reset giữ preview và màn 390 px được kiểm tra đúng phạm vi báo cáo. [Room 2 độc lập](plans/261031-campaign-link/reports/room-two-qa.md) và [Room 5 component](plans/261031-campaign-link/reports/final-room.md) có bằng chứng riêng. Mã đã push qua [PR #3](https://github.com/thaideptrai218/mat-ma-dien-bien-phu/pull/3), chờ review vào main; đã có bản production Vercel ở đường dẫn đầu trang.

- [Tổng quan](docs/project-overview-pdr.md), [cấu trúc mã](docs/codebase-summary.md), [kiến trúc](docs/system-architecture.md).
- [Quy ước mã](docs/code-standards.md), [thiết kế](docs/design-guidelines.md), [chạy và build](docs/deployment-guide.md), [tiến độ](docs/project-roadmap.md).
- [Cốt truyện game](docs/game-story-v4.docx).
- Mã nguồn: [GitHub](https://github.com/thaideptrai218/mat-ma-dien-bien-phu). Bản public: [Vercel](https://mat-ma-dien-bien-phu.vercel.app/).
