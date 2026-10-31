# Kiến trúc hệ thống

Cập nhật 2026-10-31. `/` chạy chiến dịch bảo tàng → phòng 1–5 → bảo tàng trong cùng origin. Bốn entry `room-one.html`, `room-two.html`, `room-three.html`, `room-four.html` là preview với save riêng. Phòng 5 không có entry tự cấp mảnh. Phaser vẽ thế giới; HTML/native dialog hiển thị giấy, câu đố và sổ chung.

## Runtime và vòng đời

`src/campaign/main.js` đợi font rồi tạo `CampaignRuntime`, sở hữu store/UI, một AudioController và `SessionHost`. Host tải session từng phòng, giữ một Game/canvas đang hoạt động. Các constructor `(root, options={})` nhận `{storage,audio,isPaused,onExit}`; `(root)` vẫn chạy preview độc lập. Storage null được tôn trọng, không rơi về localStorage ngoài ý muốn.

UI phòng gửi intent → controller kiểm tra view/token → reducer thuần → state hợp lệ → render/save. Storage adapter chuyển lệnh save thường vào snapshot phòng trong envelope chiến dịch. `onExit` chỉ chạy sau cửa thật; mở rương hoặc nhận mảnh không chuyển phòng. Parent truyền mảnh đã suy ra, không cấp thành tích từ các preview hoặc tab Bảo.

`SessionHost` tuần tự hóa replace bằng queue/epoch: await destroy trước mount, bỏ import/mount đã lỗi thời sau restart. `disposeRoomSession` đánh dấu disposed đồng bộ, vô hiệu callback, gỡ pagehide/input/UI/observer/RAF, teardown scene khi physics còn sống, chờ Phaser Game DESTROY thực và hết stack sự kiện rồi mới xóa DOM. Không dựa vào SHUTDOWN khi hủy Game. Shared audio thuộc parent; child không đóng context. [Hợp đồng lifecycle](../plans/261031-campaign-link/reports/lifecycle.md).

## Các phòng và đồ thị tiến độ

Scene chung kế thừa `preload()` cho PNG/manifest nhân vật cục bộ. `character-atlas.js` giữ một phép biến đổi chung cho32 ô; `character-animation.js` đăng ký texture/clip một lần trong mỗi Game. Chỉ chuyển idle/walk/run sau bước physics thật, giữ cadence8/12fps riêng; reduced-motion chọn idle. Nạp ảnh lỗi thì pausephysics, hiện thông báo giữa màn hình và không tạo sprite giả. Các scene con không tạo lớp phủ nếu base chưa có player. Collider nguồn48×32/offset56,160/scale.5 trở thành24×16 đặt tâm tại vị trí người chơi. [Hợp đồng](../assets/characters/quang-reference/README.md) · [Review](../plans/261031-quang-reference-character/reports/code-review.md).

- Phòng 1: thế giới 2400×1600; thư → A-03 → bốn hồ sơ → đối chiếu → ngăn kéo/tên → rương I → cửa. Nền 1950–7/1953: thư đầu năm chỉ nhìn lại; N-01 tháng bảy đọc sau giải danh tính, không thêm gating cũ.
- Phòng 2: world/gate/art và renderer puzzle/narrative gốc Bảo; bảy clues, chín beats, bốn puzzles. Registry deep-compare với donor, renderer/art bodies và CSS đối chiếu hash. Adapter không gọi reducer/save legacy hoặc dựng thành tích bảo tàng/Him Lam giả. Fold cuối hợp lệ cấp II; cửa đông mới sang 3, không thêm rương/pickup hoặc bắt đọc hết outro. [Bảo toàn nguồn](../plans/261031-campaign-link/reports/room-two.md).
- Phòng 3: trại 3200×2000, năm giấy xen bốn thử thách. Chuẩn bị song song → sáu vai trò tiếp vận → hai phương châm/lý do → tin 13/15/17. `answers.js` kiểm tra ngữ nghĩa/tập lựa chọn; thẻ NHANH/CHẮC cùng chữ được đổi tương đương. Đủ bốn mới dùng 13/03/1954; mở rương → nhận III → cửa.
- Phòng 4: archive 2800×1800, bảy giấy theo thời gian → ô chữ 17 cột → cột index 8/TIMTVAL → T/L → câu cuối → rương mở → lấy IV → cửa. Hàng bốn đủ 16 chữ; bảng L giữ ULTAV. Không thay nội dung lịch sử khi nối campaign.
- Phòng 5: 2000×1400; đủ bốn mảnh thật và cửa trước mới ghép đúng bốn phần tư → cuộc trò chuyện → xác nhận tiếp tục → cửa thật. Ô suy nghĩ cá nhân chỉ ở DOM, không gửi intent/persist. Sau exit 5, runtime hiện museum-return; acknowledgment mới đặt endingSeen.

`world.js` của mỗi phòng là nguồn hình học cho collision, tầm E và map. RoomOneScene nhận world/art/key/goal tùy chọn; các phòng truyền cấu hình riêng. Camera kẹp trong biên, đi/chạy 260/390 chuẩn hóa đường chéo, footsteps lấy chuyển động thật. Bố cục học tập không phải tọa độ đơn vị lịch sử.

## Giấy đọc, sổ chung và UI

Reader dùng nguyên văn HTML chọn/copy được; nguồn/hư cấu ngoài thân giấy. Đọc đến cuối → suy nghĩ Quang → token xác nhận hiện hành mới thu thập. Đóng/reset/dispose vô hiệu callback cũ; notebook reread không cấp tiến độ.

`src/campaign/archive.js` tập hợp giấy đã kiếm được từ phòng 1–5, gồm toàn bộ các đoạn clue gốc Bảo và N-01 khi đủ điều kiện. Sổ hành trình pause child input/audio qua isPaused; không cho gửi intent trong lúc overlay mở. Có sổ trong phòng và sổ xuyên phòng, không rút hồ sơ thành tóm tắt.

RoomOneUI nhận nhãn/ngày/world/panel factory; Bảo bọc DOM renderer gốc vào shell chung. Header chiến dịch có sổ, kho mảnh, mục tiêu và restart; link preview ghi rõ save riêng. WASD/Shift/E/M/N/Q/Esc theo focus, form giữ hành vi nhập bình thường. Modal/blur/tab ẩn xóa phím giữ, vận tốc và bước chân. Desktop thấp dùng mini-map gọn, map lớn nhận đúng world hiện tại.

## Lưu, phục hồi và reset

Khóa chiến dịch `mat-ma-dien-bien-phu:campaign:v1` chứa version, introSeen, rooms, settings, endingSeen. `sanitizeCampaign` dùng sanitizer từng phòng, chỉ giữ chuỗi exit liên tục và tối đa một phòng đang chơi. Mảnh I từ chestOpened hợp lệ, II từ fold/fragment đã kiểm tra, III/IV từ pickup. Phòng 5 chỉ phục hồi với đủ mảnh/cửa trước; return/ending không thể vượt assembly/reflection/exit 5. Không tin currentRoom hoặc danh sách mảnh tùy ý.

Bốn preview giữ key `mat-ma-dien-bien-phu:room-one:v1`, `:room-two:v1`, `:room-three:v1`, `:room-four:v1` cùng tiền tố; không migrate/import các key này hoặc save donor. Room 3 giữ graph giấy/thử thách chung; Room 4 giữ tiền tố bảy giấy/câu đố. Reload về safe spawn của phòng hiện tại, không lưu tọa độ, draft, cursor hoặc lời suy ngẫm.

Reset phòng giữ các room trước và cắt current/downstream/ending phụ thuộc. Global new game có xác nhận, chỉ reset envelope campaign; epoch chặn callback/import cũ hồi sinh session. Storage lỗi vẫn chơi trong phiên với thông báo. Shared settings là nguồn âm thanh khi tạo phòng/merge save, không để default phòng mới ghi đè preference chung.

## Âm thanh, tài sản và nguồn

Một AudioController/context xuyên campaign; parent giữ ownership/status callback, child đổi mode. Preview sở hữu audio riêng. Runtime unlock/resume vẫn cần gesture; preference đã lưu không cấp quyền phát. Cue Bảo được bổ sung tương thích; không TTS/dịch vụ ngoài.

Be Vietnam Pro/Lora/Patrick Hand và ảnh đều cục bộ, đợi font trước Canvas. Sáu SVG hậu cần và victory-painting.svg là minh họa sáng tác. Cùng tranh dùng ở museum intro, bốn mảnh và return, không giả ảnh/bản sao hiện vật. Lịch sử chỉ PDF bản 4, bản chữ và brief cung cấp; nội dung cũ được giữ. Các nhãn 252.000/445.000, trên 2.000 đợt đầu và 16.200 toàn chiến dịch giữ đúng ngữ cảnh; không đoán ngày đổi phương châm.

## Kiểm chứng hiện tại

119/119 tests/build năm entry và [review GO](../plans/261031-campaign-link/reports/code-review.md). [QA toàn campaign](../plans/261031-campaign-link/reports/campaign-qa.md) qua năm exits/bốn mảnh/assembly/blank reflection/physical door/return/ack, archive 25→26, ending/audio reload, reset/epoch/clone và preview isolation. Donor 4180 giữ nguyên. Một concurrent build làm tab cũ mất lazy hash; reload phục hồi bốn exits thật và vào 5, không mất progress. Git theo sau verification, không hosting.

[Kế hoạch tích hợp](../plans/261031-campaign-link/plan.md) · [Cấu trúc mã](codebase-summary.md) · [Quy ước](code-standards.md)

## Cổng khu vực (area gates)

`save state → lockedGateIds(AREA_GATES, state) → scene.setLockedGates(ids)` (zone tĩnh + overlay theo `style`, fade 250 ms, tức thì khi reduced-motion) và `lockedGateRects → ui.render() → createRoomMap` (ô nét đứt). `RoomOneScene` nhận option `areaGates`, gọi `callbacks.onGateBlocked(id)` (throttle 1,5 s) khi Quang đụng cổng khóa và `callbacks.onGateOpened(id)` khi cổng vừa mở; snapshot có `lockedGateIds`. Mặc định `areaGates=[]` không đổi hành vi.
