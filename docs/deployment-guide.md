# Chạy, build và lưu tiến độ

Cần Node.js >=22.12.0 và npm. Phaser 3.90.0/Vite 8.3.5 khóa trong package-lock.json. Từ thư mục dự án:

```powershell
npm ci
npm run dev
```

Mở **http://127.0.0.1:5173/** để chơi chiến dịch: bảo tàng→phòng 1–5→bảo tàng. Không mở HTML bằng file://. Các preview độc lập:

| Đường dẫn | Bản thử |
| --- | --- |
| `/room-one.html` | Phòng 1, chuyển khỏi entry gốc `/`. |
| `/room-two.html` | Bản local tích hợp từ Bảo, không mở iframe/port 4180. |
| `/room-three.html` | Phòng 3 hậu phương. |
| `/room-four.html` | Phòng 4 của Trâm. |

Phòng 5 chỉ mở trong chiến dịch khi có đủ mảnh thật/cửa trước, không có preview cấp mảnh.

```powershell
npm test
npm run build
npm run preview
```

Preview **http://127.0.0.1:4173/**; dev/preview cố định 5173/4173. Dist có đúng năm HTML: index,room-one,room-two,room-three,room-four, cùng tài nguyên local/lazy chunks. Không phục hồi chapter-four.html hoặc prototype cũ. Sau build lại, reload tab cũ nếu nó còn giữ lazy chunk hash của build trước. Chưa có hosting deployment; cập nhật Git sau review/QA, không coi push mã là deploy.

## Chiến dịch và preview có save riêng

Global key **`mat-ma-dien-bien-phu:campaign:v1`** giữ nested room snapshots và shared settings. Current room/mảnh/return được suy từ tiến độ hợp lệ; reload về safe spawn phòng hiện tại. Không nhập save preview hoặc donor vào campaign.

Bốn preview dùng `mat-ma-dien-bien-phu:room-one:v1`, `:room-two:v1`, `:room-three:v1`, `:room-four:v1` cùng tiền tố. N-01 vẫn đọc được từ save Phòng 1 đã giải danh tính; phần mở rộng không đổi key/gating preview cũ.

**Bắt đầu lại phòng** giữ các phòng trước và bỏ phần hiện tại/phụ thuộc sau. **Hành trình mới** cần xác nhận, chỉ reset envelope chiến dịch, không xóa preview/donor keys. Reload không giữ tọa độ/cursor/draft, suy nghĩ cá nhân Room 5 không lưu ở bất kỳ chế độ nào. Đổi origin/cổng tạo vùng lưu khác. Storage hỏng/bị chặn vẫn chơi trong phiên và có thông báo.

## Bảo gốc được bảo toàn

Checkout `../mat-ma-dien-bien-phu-bao`, preview **http://127.0.0.1:4180/** là donor gốc, không thay đổi bởi build/reset chiến dịch. Bản campaign dùng bản sao local có manifest/hash, original renderers/evaluators/map; không dùng external-tab progress. [Báo cáo fidelity](../plans/261031-campaign-link/reports/room-two.md). Nếu cần chạy preview gốc, dùng lệnh dự án của Bảo trong đúng checkout, không ghi output bản chính vào đó.

## Điều khiển và tài nguyên

Bấm canvas, WASD/mũi tên đi, Shift chạy 260→390, E vật gần, M map, N sổ phòng, Q nhiệm vụ, Esc đóng/tùy chọn. Sổ hành trình trên header giữ giấy đã kiếm ở các phòng; mở sổ pause room/input/audio, không dịch chuyển từ map/journal. Qua cửa thật mới chuyển room.

Be Vietnam Pro/Lora/Patrick Hand, chân dung, sáu SVG hậu cần và victory-painting đều local. Tranh do dự án sáng tác, không ảnh tư liệu. Không CDN/TTS hoặc tải PDF nguồn lên website. Campaign giữ một Web Audio controller/context; bật/resume từ gesture, preference tách runtime permission. Chuyển phòng giữ setting chung, preview vẫn độc lập.

## Kiểm chứng

105/105 tests/build năm entry và [review GO](../plans/261031-campaign-link/reports/code-review.md). [Full campaign PASS](../plans/261031-campaign-link/reports/campaign-qa.md): năm cửa/bốn mảnh thật/ghép/blank reflection/cửa trở về/museum acknowledgment; ending reload, shared audio,26 archive entries, global reset và preview isolation. Giữ preview assets ổn định trong lượt chơi; QA ghi rõ concurrent-build interruption và reload không mất tiến độ. [Kế hoạch](../plans/261031-campaign-link/plan.md) · [Lifecycle](../plans/261031-campaign-link/reports/lifecycle.md) · [README](../README.md).
