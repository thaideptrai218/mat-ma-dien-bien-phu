# Màn IV: kiểm chứng cạnh biên

Ngày: 2026-10-30. Phạm vi: bản thử độc lập `chapter-four.html`; không sửa mã nguồn/kiểm thử/cấu hình. Browser session riêng `dbp-four-edges`; chỉ đọc `chapterFourDebug.getSnapshot()`, không gán tiến độ/vị trí/scene.

## Kiểm thử tự động

- `node --test tests/chapter-four-rules.test.js tests/chapter-four-world.test.js`: **14/14 đạt** (8 luật, 6 thế giới).
- `npm test`: **37/37 đạt**, gồm 23 kiểm thử game chính + 14 mới.
- Kiểm tra nội dung test: có offset/chuỗi `TIMTVAL`, chỉ cột đúng được chấp nhận, chuẩn hóa dấu tiếng Việt/đ/chuỗi tổ hợp, hai hình T/L và tập ô sai/thiếu/thừa/trùng/ngoài giới hạn/không phải số, khóa thứ tự hồ sơ→ô chữ→hình→rương, bất biến state, tùy chọn độc lập; hình học body24×16, cầu khóa/mở, tiếp cận mọi vật tương tác, chặn đọc xuyên tường; phím xóa khi blur/hidden và bỏ repeat cũ.
- Giới hạn: node tests không chứng minh hành trình bằng browser, bố cục, âm thanh PCM hay tính dễ dùng của form. Hành trình đầy đủ do controller kiểm tra riêng.

## Browser

Kiểm tra trên Chromium session riêng `dbp-four-edges`, production `http://127.0.0.1:4173`. Bản cuối tải `chapterFour-CmN86TbV.js` + `chapterFour-BsRK1xbh.css`. Các lần dev bị HMR trước freeze không dùng để kết luận lỗi. Controller chạy build cuối và kiểm chứng hành trình giải hai câu đố/rương riêng.

| Trường hợp | Kết quả |
| --- | --- |
| Esc ở welcome; welcome→hướng dẫn→Esc | Vẫn trở về welcome có nút bắt đầu; không mắc ở canvas chưa bắt đầu. |
| Welcome→hướng dẫn→chơi lại→xác nhận | Bắt đầu thật, hiện intro; sửa allowlist reset trước bắt đầu được kiểm chứng. |
| Intro→Esc | Đóng intro, `started:true`; có thể focus canvas/đọc hồ sơ. |
| Hồ sơ đầu→Esc trước câu cuối | Chỉ `discoveredClueIds:['objective']`; `collectedClueIds:[]`. Không nhận hồ sơ giả. |
| Đi bộ/đọc/ghi | Đã đi đến và ghi đủ 7 hồ sơ bằng KeyboardEvent và nút DOM thật. Cầu khóa ở đầu, mở sau ba hồ sơ đầu. Không gán state, vị trí, scene hoặc save. |
| Ô chữ khi 3/7 | Nhập được draft; nút đối chiếu disabled. Chọn cột 9 bằng focus+Enter; `aria-pressed:true`. |
| M/N/Q trong trường nhập | Thêm chữ `MNQ` vào draft `Sai mnqMNQ`; vẫn là bảng ô chữ, canvas blocked; không mở shortcut. |
| Esc→mở lại ô chữ | Draft `Sai mnqMNQ` và cột9 giữ nguyên. |
| Đối chiếu sai sau 7/7 | Hiện “Hãy kiểm tra các hàng còn trống hoặc chưa đúng.”; draft/cột giữ nguyên; `crosswordSolved:false`. |
| M/N/Q ở canvas | M mở sơ đồ, N mở sổ tay, Q nhắc mục tiêu; Q không tạo modal. |
| Giữ phím→M; repeat cũ sau đóng | Mở modal dừng ngay, tọa độ không đổi trong 250ms; đóng/focus rồi gửi repeat cũ cũng không di chuyển. |
| Đi/chạy Shift | Cùng 1000ms: đi260px, chạy383.5px (xấp xỉ1.5×, sai số frame); thả phím dừng. |
| Reset sau 7/7 + tùy chọn âm lượng1 | State trở về0/7, hai câu đố/rươngfalse, cầu khóa, spawn2760/1630, âm lượng.5/tắt tiếng, intro câu1. |
| Reset draft, lượt kiểm chứng riêng | Đi bộ ghi3 hồ sơ→tới bàn→nhập `resetdraft`/chọn cột9→reset bằng UI→đi bộ ghi3 hồ sơ lại→mở bàn: cả7 trường rỗng, không có cột nào selected. Không reload giữa draft/reset/lượt đọc lại form. |
| Reload | Welcome chưa bắt đầu,0/7, audio uninitialized/tắt/.5, không giữ tiến độ thử. |

Driver controller cung cấp chỉ phát phím/nút và đọc snapshot. Bản driver đầu một lần quá đà gần góc rương (x980/y937.5); đi lên y840 rồi tiếp tục tới bàn được. Đây là sai số waypoint của automation, không phải softlock game. Controller đã thêm khoảng hở cho driver; không sửa physics hay tiến độ để vượt qua.

## Bố cục và âm thanh

- 1280×800: page width1280, footer bottom769, mọi nút dưới bản đồ trong viewport. 1264×569: page width1264, footer bottom538. Ảnh đã xem trực quan.
- 375×667: page width360≤375, dialog y9..658, clientHeight647/scrollHeight2059; scroll đến nút submit được (`scrollTop:1412`, nút nằm y517..579). Grid ô chữ cuộn ngang bên trong, trang không tràn ngang.
- 640×569: page width625≤640, dialog y9..560, clientHeight549/scrollHeight1729; form dùng scroll riêng. Không mất nút cuối hoặc trường nhập.
- Click **Bật âm thanh** thực sau freeze tạo AudioContext running và hai ambient sources. Khi focus canvas, volume1: RMS **0.008117**, peak **0.013608**; có PCM thật, không chỉ cờ enabled. Volume0: nguồn0, RMS/peak0. Mute: enabledfalse, nguồn0, RMS/peak0. Rời focus về nút HTML: modeinactive, im lặng; focus canvas trở lại phát đúng. Reload trả uninitialized/tắt/.5.
- CLI `click` có thể báo Done khi nút nằm dưới viewport mà chưa scroll; đã dùng `scrollintoview` cho control dưới fold. Không coi sự cố CLI này là lỗi sản phẩm.

Ảnh: [desktop welcome](edges-welcome-desktop.png), [desktop thấp](edges-map-short-desktop.png), [ô chữ375](edges-crossword-375.png), [cuộn đến nút375](edges-crossword-375-scroll.png), [ô chữ640](edges-crossword-640.png), [đáp án sai](edges-crossword-wrong.png).

## Save game chính và bản build

- Mở game chính production, bấm bắt đầu thật để tạo save museum/entry v1. Sau đó chơi trial7/7, đổi tùy chọn, reset, reload: chuỗi save **giữ nguyên byte**, vẫn museum/entry, danh sách rỗng, mặc định âm lượng.5/tắt; localStorage chỉ có khóa `mat-ma-dien-bien-phu:save:v1`, không có khóa trial.
- Quay lại `/`: có **Tiếp tục hành trình →**. Hai entry tải được tài nguyên local, không page errors.
- Sau clear request log, fresh-load trial và main riêng: mọi HTTP resource cùng origin127.0.0.1:4173; `external:[]`. Các chunkJS/CSS, chân dung và biểu trưng trả về local. Không click liên kết nguồn lịch sử ra ngoài trong lượt QA.
- Phạm vi browser của báo cáo này xác nhận các cạnh biên tới ô chữ; lượt giải hoàn chỉnh T/L→rương→ending thuộc báo cáo controller. Không nhận là đã kiểm chứng độc lập toàn kết bằng lượt edge này.

## Câu hỏi chưa giải quyết

Không có câu hỏi cần người dùng quyết định. Chưa kiểm tra Safari/Firefox hoặc điều khiển cảm ứng đi bộ (ngoài phạm vi bản thử).
