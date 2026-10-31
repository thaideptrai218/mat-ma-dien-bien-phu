# Quy ước mã game

Áp dụng campaign 1–5 và preview 1–4, cập nhật 2026-10-31. JavaScript ES modules, Phaser 3.90.0, HTML/native dialog, Web Audio; tiếng Việt NFC, stable IDs. YAGNI/KISS/DRY và pattern hiện có.

## Ranh giới và lifecycle

- `src/campaign/` giữ global store/runtime/host/framing/archive; từng room giữ rules/save/controller/world/UI. Không đặt tiến độ campaign trong renderer hoặc scene.
- Constructor `(root)` tiếp tục chạy standalone; options `{storage,audio,isPaused,onExit}` chỉ thêm khi tích hợp. Storage null là explicit override. Shared audio thuộc parent, không đóng hoặc thay callback của parent.
- `destroy()` async/idempotent, invalidates callbacks trước await; cleanup native listeners/UI/observer/RAF, teardown scene khi physics còn sống, chờ Game DESTROY xong mới xóa DOM/mount successor. Không dựa vào SHUTDOWN của Game.destroy.
- Host queue/epoch phải loại import/transition cũ khi restart. Không tạo phòng kế tiếp trực tiếp trong save callback hoặc stack sự kiện DESTROY. onExit chỉ sau real-door commit hợp lệ.
- Parent overlay pause input/audio; mọi action router, callback và render từ session disposed/paused phải bị chặn. Diagnostics structuredClone, không product teleport/progress setters.

## Save và tiến độ

- Campaign key `mat-ma-dien-bien-phu:campaign:v1`; nested rooms sanitize bởi từng room và chuỗi exit liên tục. Không tin currentRoom/fragment list hoặc returned/ending flags vượt điều kiện.
- MảnhI từ chestOpened hợp lệ,II từ final fold/prefix Bảo,III/IV từ pickup thật. Phòng 5 cần đủ mảnh/cửa trước; assembly→reflection→door→museum acknowledgment tách bước.
- Shared settings là authoritative khi mount/merge. Không để default audio phòng mới ghi đè preference đã chọn. Runtime unlock tách preference.
- Preview keys room-one/two/three/four:v 1 với tiền tố `mat-ma-dien-bien-phu:` giữ riêng; không auto-migrate/import donor/preview vào campaign. Reset room giữ trước/cắt downstream; global new game xác nhận, chỉ reset campaign envelope.
- Không lưu tọa độ, cursor, draft hoặc suy nghĩ cá nhân Room 5; suy nghĩ không vào payload/validator/network. Optional, để trống được, không chấm.
- Storage hỏng/bị chặn có thông báo, vẫn chơi trong phiên. Hồ sơ cần đọc cuối và current Long confirmation; readonly reread không cấp tiến độ.
- Room 3 giữ graph giấy/thử thách xen kẽ; ba việc chuẩn bị cùng nhóm, NHANH/CHẮC hoán đổi tương đương. Room 4 giữ bảy giấy→ô chữ→cột→T/L→rương→pickup→cửa.

## Bảo toàn nội dung và tương tác

- Donor Bảo chỉ đọc. `src/room-two/bao/` expose đúng navarre-plan; deep-compare registries và renderer/art/CSS hashes. Chỉ import adapter được đổi ở renderer; không gọi legacy applyAction/save hoặc thêm thành tích giả/rương mới.
- E cần vật gần và đường tiếp cận; một world source cho collision/mini/full map. Đi 260/chạy 390 chuẩn hóa đường chéo, footsteps theo actual movement. Không dịch chuyển từ map hoặc journal.
- Canvas shortcuts theo focus; native forms giữ nhập liệu; modal/blur/hidden/disposal xóa phím giữ. Font/art/audio cục bộ, font đợi trước Canvas.
- Văn bản dùng textContent/native DOM, không ghép HTML từ input/save. Source/fiction nằm ngoài thân giấy. Full journal giữ toàn văn đã kiếm được, gồm clue beats Bảo, không rút thành tóm tắt.
- Chỉ PDF bản 4/bản chữ/brief đã cung cấp, không nghiên cứu lịch sử web. Không đoán ngày đổi phương châm hoặc gán ngày Trung Du/Hòa Bình chưa có. Giữ 252.000/445.000 theo nguồn, trên 2.000 đợt đầu,16.200 toàn chiến dịch và miền Bắc sau Genève.
- Sáu SVG hậu cần và tranh victory-painting là sáng tác có nhãn/alt text, không ảnh tư liệu hoặc bản sao tranh bảo tàng. Không tải PDF cá nhân lên website/Git.

## Kiểm chứng và bàn giao

Tên file kebab-case/export có tên; cân nhắc split khi có ranh giới thực, không tách chỉ để đạt số dòng. Test hẹp trước, rồi regression/build và actual route. Giữ test donor fidelity, graph/save/lifecycle, predecessor/token guards và optional reflection privacy.

Không nhận fixtures/DOM harness là full campaign QA. Chơi thật museum→1→2→3→4→5→return/ack, kiểm tra một canvas/dialog/audio, reload/reset và preview keys không đổi. Git update sau review/QA theo quyền đã có; không force-push, không secret/private sources; hosting là việc riêng chưa thực hiện.

## Linh kiện xúc giác và cổng khu vực

- Linh kiện dùng chung ở `src/ui/tactile/`: model thuần (`token-bins-model`, `dial-model`, `range-model`, bất biến, test bằng node) tách khỏi view DOM mỏng (`token-bins-view`, `combination-dial`, `range-ruler`). Linh kiện chỉ tạo đúng payload cũ cho reducer/evaluator; không lưu draft hay tọa độ.
- Mọi thao tác kéo-thả phải có đường bấm-bấm và bàn phím (Enter/Space nhấc, Tab/mũi tên chọn đích, Enter thả, Esc hủy, Delete trả khay), vùng chạm ≥44px, thông báo aria-live; animation tôn trọng `prefers-reduced-motion`. Hit-test bằng `elementsFromPoint`, không dùng HTML5 DnD.
- Cổng khu vực là dữ liệu thuần `src/core/area-gates.js` (`AREA_GATES` riêng mỗi phòng, không nhập vào `WORLD`); trạng thái suy từ cờ save, predicate lỗi coi như đang khóa. Mỗi cổng cần test reachability bằng `worldWithGates`.

[Kế hoạch](../plans/261031-campaign-link/plan.md) · [Lifecycle](../plans/261031-campaign-link/reports/lifecycle.md) · [Bảo toàn Bảo](../plans/261031-campaign-link/reports/room-two.md)
