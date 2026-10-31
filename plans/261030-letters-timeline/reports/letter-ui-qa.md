# Kiểm chứng giao diện thư — 2026-10-30

Status: PASS. Không cần sửa sản phẩm sau integration QA.

## Môi trường và phạm vi

Production preview `http://127.0.0.1:4173/chapter-four.html`, browser session riêng `letters-ui`. Điều khiển bằng nút DOM thật, Tab/Enter/Escape; chỉ đọc snapshot `window.chapterFourDebug.getSnapshot()`. Không sửa state, không teleport, không thay dữ liệu. Thư thật `encirclement`, hai trang, bốn đoạn dài; không dùng dữ liệu mẫu.

## Kết quả

- Bắt đầu → intro → vào bản đồ → nút E gần vị trí spawn mở thư của Hòa, phase `letter`, pageIndex 0, lastPage false; scene paused true.
- Trang sau → pageIndex 1, lastPage true, focus “Trang 2 / 2”, dialog.scrollTop 0. Đóng bằng Escape rồi mở lại: vẫn trang hai; `readLetterIds=[]` và `collectedClueIds=[]`, chưa tự nhận dữ kiện.
- Bàn phím từ heading trang: Tab đến “Trang trước”, Tab đến “Cùng Minh suy luận”, Enter mở phase `reflection`, lineIndex 0. Lúc này chỉ `readLetterIds=['encirclement']`; collected vẫn rỗng.
- Hai lần “Tiếp lời” đến lineIndex 2, lastLine true, sau đó “Ghi manh mối vào sổ” mới có collected `['encirclement']`. Mục tiêu chuyển sang thư 1/5/1954.
- Sổ tay → “Đọc lại thư” mở phase `letter`, nhớ trang hai; không đi thẳng suy luận.
- `Range` chọn đoạn thư: selection bằng chính xác paragraph.textContent; `user-select: text`. Văn bản semantic, chọn/copy được.
- Fonts API: `Trial Handwriting` và `Trial Serif` đã tải; computed manuscript là Trial Handwriting, 21px desktop; 20px/36px trên mobile. FontTools kiểm chứng toàn bộ glyph Việt; ảnh xác nhận dấu gắn liền chữ ở giấy, heading và Minh.
- 1280×900: dialog clientWidth=scrollWidth=863px; không tràn ngang. Nguồn và điều khiển nằm trong native dialog cuộn dọc.
- 375×812: document.scrollWidth=375, dialog clientWidth=scrollWidth=320, clientHeight=792, scrollHeight=1642. Metadata xuống hàng, đoạn thư đọc được, không tràn ngang.
- 375×500: dialog clientHeight=480 < viewport500; clientWidth=scrollWidth=305, scrollHeight=1714. Có thể cuộn tới nút và quay về đầu trang.
- Reduced-motion được bật trong browser, nút trang trước vẫn đưa về pageIndex0, focus heading mới, scrollTop0, scene paused true. Không có hoạt ảnh thừa.
- Browser errors: trống.

## Ảnh đã mở kiểm tra

- [Thư desktop](letter-reader-desktop.png): giấy riêng, tên người viết/nhận, nơi/ngày và chữ viết tay đầy đủ dấu.
- [Thư mobile](letter-reader-mobile.png): 375×812, trang hai, header và văn bản không tràn.
- [Suy luận và dấu Việt](reflection-font.png): Lora trên heading và lời Minh, bước suy luận riêng sau thư.

## Giới hạn

QA này kiểm tra UI thư đầu tiên và readback; full chronology, reset, bảy thư, puzzle/rương do controller kiểm chứng độc lập. Build/syntax đã đạt trước integration; controller chạy lại toàn bộ gates sau khi ghép xong.

Unresolved questions: none.
