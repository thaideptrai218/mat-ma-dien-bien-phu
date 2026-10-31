# Màn IV — QA bản chơi thử

Ngày: 2026-10-30. Kết quả: **đạt bản thử cục bộ**. Thử trên Chromium bằng game Phaser thật; không dùng setter tiến độ/tọa độ, không suy từ ảnh prototype cũ. [Kiểm tra cạnh biên độc lập](chapter-four-edge-qa.md) và [review mã](code-review.md) bổ sung cho hành trình controller dưới đây.

## Bản dựng và ranh giới

- Node24.15.0, Phaser3.90.0, Vite8.3.5. `npm test`: **37/37**; `npm run build`: đạt hai entry `index.html` và `chapter-four.html`. Engine chunk lớn có cảnh báo hiện hữu, không ẩn; chưa đo benchmark hiệu năng.
- Production cuối: `chapterFour-CmN86TbV.js`, `chapterFour-BsRK1xbh.css`. Thay đổi cuối chỉ tối ưu chiều cao map desktop để footer trong viewport. Bộ mã hành trình không đổi so với nguồn đã review.
- Bản thử tại `http://127.0.0.1:4173/chapter-four.html`; game chính tại `/`. Không import GameSession/save-store của game chính; trial chỉ giữ state trong phiên.
- Không tự commit, push hoặc deploy ở lượt thiết kế thử này. PDF3 được đọc từ bản người dùng cung cấp, không chỉnh sửa hoặc tự tải lên repo.

## Đối chiếu PDF và dữ kiện

- Đọc đủ hai trang PDF3; xem hai ảnh nhúng ô chữ/bảng mật mã. Canva liên kết không tải được nhưng ảnh nhúng đủ để xác minh bố cục và ký tự.
- Bảy đáp án được giữ; bổ sung đủ16 ô cho `SOCHIHUYTRUNGTAM`. Ô chữ7×17, offsets `[8,7,8,0,8,3,5]`, cột8 zero-index ghép `TIMTVAL`.
- Hai bảng6×5 và hìnhT/L khớp ảnh; các ô đúng đọc `QUYETCHIEN` và `QUYETTHANG`. Mật khẩu cuối chấp nhận chữ có dấu, không dấu, khoảng trắng và dấu câu thông thường.
- Hồ sơ vòng vây cuối tháng4 ghi rõ dẫn nhập. A1 là đêm6→rạng sáng7/5, không gán thắng lợi hoàn toàn ngay đêm6. Mốc sở chỉ huy khoảng17:30 ngày7/5. Tổng16.200 là tiêu diệt và bắt sống, không phải toàn bộ đều bắt sống. Miền Bắc/Genève là hậu cảnh sau chiến dịch.
- Link lịch sử nằm trong từng hồ sơ; lời Minh, khóa cầu ký ức và phòng rương được ghi là hư cấu học tập. Không có hướng dẫn chế tạo/sử dụng vật liệu nổ.

## Hành trình thực tế

1. Mở welcome, bắt đầu, đọc toàn cảnh intro rồi đi vào chiến hào. Spawn(2760,1630), camera ở vùng đông nam, mục tiêu đầu tương tác được ngay.
2. Đi bộ/chạy thật tới objective và encirclement, đọc hết và ghi từng hồ sơ. Lên A1, đọc hồ sơ thứ3; state có ba ID đầu và cầu chuyển từ khóa sang mở.
3. Đi tới cầu Mường Thanh, qua sông vào khu sở chỉ huy phía tây. Thu headquarters, weapons, north, independence. Kết quả7/7, không có hồ sơ tự nhận khi chỉ mở bảng.
4. Đi tới bàn ô chữ. Submit trống bị từ chối, giữ draft. Nhập bảy đáp án bằng control thật, gồm tiếng Việt có dấu. Chọn cột9 bằng focus+Enter rồi đối chiếu; `crosswordSolved:true`, phản hồi `TÌM T VÀ L`.
5. Đi sang bàn mật mã. Submit chưa chọn hình bị từ chối, `cipherSolved:false`. Chọn đúng10 ô mỗi bảng bằng nút DOM; đối chiếu mở khẩu hiệu và đặt `cipherSolved:true`.
6. Đi tới rương. Nhập “chiến thắng” bị từ chối, rương vẫn đóng. Nhập “Quyết chiến, quyết thắng” đúng thì rương mở, có chuyển động và mảnh ghép. Đọc tới câu cuối ending; flags crossword/cipher/chest đều true, đủ7 hồ sơ.

[Driver QA](journey-driver.js) chỉ phát KeyboardEvent xuống listener canvas, bấm nút/trường nhập đang render và đọc snapshot. BFS dùng hình học world để định hướng, không gán player position, state, collider hoặc save. Driver tăng khoảng hở sau một lỗi waypoint sát góc rương; người kiểm tra độc lập đã đi vòng bình thường. Một số lệnh CLI click control khuất báo Done nhưng không kích hoạt; các bước đó được làm lại bằng scrollIntoView hoặc Esc. Không ghi nhận chúng là lỗi game hay một bước đã hoàn thành.

## Chuyển động, hiển thị và tiếng

- Đã quan sát cảnh chiến hào, A1, cầu/sông và phòng sở chỉ huy khác nhau; camera theo người chơi qua những khu ngoài viewport đầu. Vật cản/ranh sông dùng cùng hình học với nền; kiểm thử flood/body xác nhận cầu là lối nối duy nhất và tất cả vật tương tác có lối tiếp cận.
- Kiểm tra độc lập: đi260px trong1000ms, chạy383.5px cùng khoảng thời gian (xấp xỉ1.5×, sai số frame). M/N/Q đúng khi focus canvas; gõ MNQ trong form vẫn nhập chữ. Mở modal dừng phím giữ; repeat cũ sau đóng không làm đi lại.
- Hoạt ảnh đi bốn hướng tái dùng atlas đang chạy thật theo displacement; tiếng bước chỉ phát khi dịch chuyển. Không có bước giả khi giữ vào tường hoặc đọc bảng.
- Rương mở thực: snapshot progress khoảng0 lúc36ms,0.262 lúc109ms,0.724 lúc310ms,0.996 lúc706ms,1 lúc1006ms. Sau1100ms hiện ending; giảm chuyển động dùng mở ngay. Reset/shutdown hủy tween đã được review.
- Đầu ra PCM thực qua Analyser: ô chữ đúng ở dialogue có3 cue sources,0 ambient, RMS0.008418/peak0.017856. Rương sau mở109ms có5 sources (2 nền+3 cue), RMS0.016957/peak0.038998. Đây là tín hiệu trình duyệt, không phải kiểm định loa vật lý hoặc lời thoại thu âm.
- Kiểm tra độc lập mute/volume0 đều nguồn0 và PCM0; reload tắt/uninitialized/.5. Brightness là canvas filter1.18, không đổi màu giấy dialog. Native Enter hai lần giữ focus trên hành động tiếp theo, đã review và thử browser.
- Bản CSS cuối ở1280×800 footer bottom769; ở1264×569 footer bottom538. Màn nhỏ dùng scroll native dialog và vùng cuộn ngang riêng của ô chữ, không tràn ngang toàn trang. Chi tiết/ảnh trong báo cáo cạnh biên.

## Game chính và tài nguyên

Kiểm tra độc lập đã tạo save museum thật, rồi đi7 hồ sơ, reset và reload trial. Chuỗi localStorage save chính giữ nguyên; quay về `/` vẫn có Continue. Hai HTML entry tải localJS/CSS/engine/ảnh, không request tài nguyên ngoài và không page error. Shared character/audio/geometry modules không có thay đổi Git.

## Ảnh và phạm vi

- [Toàn cảnh map mới](map-overview.png): render trực tiếp bằng cùng hàm nền và hình rương của scene, dùng để xem bố cục; không giả là ảnh toàn viewport gameplay.
- [Chiến hào](trench-start.png), [A1](a1-landmark.png), [cầu Mường Thanh](muong-thanh-bridge.png), [phòng ký ức](hq-memory-room.png).
- [Ô chữ](crossword-solved.png), [hai hình T/L](t-and-l-cipher.png), [rương và phần kết](chest-ending.png).

Map là sơ đồ kể chuyện3200×1920; không mô phỏng đúng tỷ lệ, đường tiến quân hoặc kiến trúc di tích. Bản thử ưu tiên bàn phím máy tính, chưa có di chuyển cảm ứng hay lưu trial. Không có lỗi chặn hoặc câu hỏi sản phẩm chưa giải quyết.
