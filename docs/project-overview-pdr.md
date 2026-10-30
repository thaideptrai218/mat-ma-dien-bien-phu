# Tổng quan và yêu cầu sản phẩm

Mật mã Điện Biên Phủ là game khám phá/visual novel lịch sử tiếng Việt. Entry `/` nối bảo tàng→bốn thử thách lịch sử→phòng ghép tranh/suy ngẫm→trở về bảo tàng. Quang là sinh viên thích công nghệ và giải đố; chuyến du hành là hư cấu học tập theo PDF bản 4. Chỉ lịch sử do người dùng cung cấp, không nghiên cứu web.

## Hành trình hiện tại

| Giai đoạn | Nội dung và điều kiện hoàn tất |
| --- | --- |
| Bảo tàng | Quang chạm tranh chiến thắng, vào không gian hư cấu hầm Đờ Cát 7/5/1954; hệ thống giải thích năm phòng/bốn mảnh. |
| Phòng 1 — Trước bản kế hoạch | Biên giới 1950/Trung Du/Hòa Bình/Tây Bắc, quân đội/hậu phương, tình thế hai phía 1953. Thư→A-03→bốn hồ sơ→đối chiếu→điện danh tính→N-01 tháng 7→rương I→cửa. N-01 không thêm khóa/gating cũ. |
| Phòng 2 — Bảo | Giữ exact world/bảy manh mối/bốn câu đố/renderers gốc: cân, băng tần, nắm đấm, gấp phong bì. Fold cuối hợp lệ cấp II, cửa đông sang 3; donor 4180 không bị sửa. |
| Phòng 3 — Hậu phương | Năm giấy/bốn hoạt động xen kẽ: chuẩn bị song song, sáu vai trò vận chuyển, phương châm/lý do,13/15/17 March/ý nghĩa. Đủ cả 4 token→13/03/1954→rương→pickup III→cửa. |
| Phòng 4 — Trâm | Bảy giấy 30/3–7/5 và ý nghĩa 1954; ô chữ→cột→T/L→câu cuối→rương→pickup IV→cửa. Giữ 16.200 tiêu diệt/bắt sống và miền Bắc sau Genève. |
| Phòng 5 | Chỉ bốn mảnh thật/các cửa trước mới ghép đúng 2×2. Lắng nghe cuộc trò chuyện, ô cá nhân tùy chọn/không chấm/không lưu; continue rồi đến cửa thật. |
| Bảo tàng trở về | Cùng bức tranh, lời kết, acknowledgment riêng mới ghi campaign complete. |

Mảnh chỉ từ kết quả thật, không cấp lạiI–IV ở phòng cuối, không nhập thành tích preview. Tất cả chuyển phòng cùng origin, không iframe/cross-origin shortcut. Bốn preview 1–4 có đường dẫn riêng; Phòng 1 chuyển từ `/` sang room-one.html. Room 5 không có entry auto-grant.

## Trải nghiệm và dữ liệu

- WASD/mũi tên, Shift 260/390, E gần-only, M mini/full map, N sổ trong phòng, Q HUD góc phải. Sổ hành trình trên header giữ toàn văn giấy đã kiếm qua các phòng, gồm clue beats Bảo; không biến thành tóm tắt.
- Scene geometry/va chạm/camera theo đúng world: Phòng 1 2400×1600, Bảo exact donor, hậu phương 3200×2000, Trâm 2800×1800, phòng cuối 2000×1400. Bố cục học tập, không tọa độ lịch sử.
- Giấy full prose, nguồn/fiction riêng, đọc cuối→Quang→xác nhận; readonly reread không cấp tiến độ. Personal reflection không vào payload/save/network; blank vẫn tiếp tục, không có đáp án tư tưởng bắt buộc.
- Global key `mat-ma-dien-bien-phu:campaign:v1`, rooms sanitize/chuỗi exit liên tục, mảnh/current room suy ra. Reset phòng giữ trước, restart global có xác nhận chỉ global key; preview và donor tách biệt.
- Một parent runtime/session/Game tại một thời điểm, shared audio; async destroy thực trước mount phòng mới. Font/art/audio local, gesture mở tiếng, storage lỗi vẫn chơi được. Không tài khoản/backend/TTS/touch walking.

## Nguồn và phạm vi bảo toàn

PDF bản 4, lich su.txt và [brief 31/10](../plans/261031-room-three-logistics/source-brief.md) là nguồn lịch sử; không độc lập nghiên cứu lại. Quân số 252.000/445.000 có nhãn nguồn; trên 2.000 chỉ đợt đầu,16.200 toàn chiến dịch; không đoán ngày đổi phương châm. Thư/nhân vật/ngày riêng là hư cấu; sáu SVG tiếp vận và victory-painting là minh họa sáng tác, không ảnh tư liệu/bản sao hiện vật. Không tải private PDF/transcript lên Git/website.

Bảo được sao từ current donor với font fixes, bảo toàn dữ liệu/renderer/art/CSS bằng deep comparison/body hash; original checkout/4180 không sửa. Cơ chế Room 2 Bảo được giữ theo yêu cầu, không thay bằng phiên bản puzzle khác trong PDF. [Provenance](../plans/261031-campaign-link/reports/room-two.md).

## Kiểm chứng và tiếp theo

105/105 tests/build năm entry và [review GO](../plans/261031-campaign-link/reports/code-review.md). [Full campaign QA](../plans/261031-campaign-link/reports/campaign-qa.md) qua năm exits/bốn mảnh thật/ghép/reflection trống/cửa/museum acknowledgment, ending/audio reload, archive 26 entries và reset giữ preview. Room 2 standalone/Room 5 component có phạm vi riêng, không thay full route. Git update sau kiểm chứng, không hosting. Chưa chứng nhận screen-reader/real-user timing/touch walking; giấy phép phân phối tài sản cần xác định.

[Kế hoạch tích hợp](../plans/261031-campaign-link/plan.md) · [README](../README.md) · [Kiến trúc](system-architecture.md) · [Tiến độ](project-roadmap.md)
