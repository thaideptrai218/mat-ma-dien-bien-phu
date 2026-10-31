# Chơi thử phiên bản Bảo

Ngày 2026-10-30. Yêu cầu: tải bản GitHub của Bảo và chơi thử. Lấy `origin/main` tại commit `5ff03c241a35bfe4137bc8fd5bebd43079450648`, merge PR #2 của Bao31203. Tạo worktree detached riêng `mat-ma-dien-bien-phu-bao`; không merge/stash/reset bản thư màn IV đang làm ở checkout chính.

## Chạy và kiểm chứng

- `npm ci`: thành công, 0 vulnerability được npm báo; package/lock không đổi.
- `npm test`: 31/31 đạt, không fail/skip. `npm run build`: đạt; cảnh báo chunk Phaser hiện hữu.
- Preview chạy `http://127.0.0.1:4180/` bằng `npm run preview -- --port 4180`. Asset chính `index-DbIBKZW-.js`; nhân vật Quang.
- Browser QA riêng `bao-qa`, đi bộ thật bằng WASD/E và dùng các control HTML, chỉ đọc `gameDebug.getSnapshot()`. Không đặt state, tọa độ hoặc save. Dùng helper input đã có từ QA game chính.
- Đọc mở đầu bảo tàng, đi sang Him Lam, ghi bốn hồ sơ, xếp đúng trình tự, mở cửa và hoàn tất intro Bàn cờ Đông Dương. Công cụ khởi động lại giữa lượt; kiểm tra snapshot thấy bước này đã hoàn thành nên tiếp tục từ Room 2, không chạy lại.
- Ghi đủ bảy hồ sơ Room 2; trực tiếp tương tác từng trạm trên map, hoàn tất bốn bước. Chỉ sau bước cuối `navarre-plan` mới nằm trong `completedRoomIds`.

| Bước | Thử sai | Kết quả đúng |
| --- | --- | --- |
| Cán cân 84 | Đúng thẻ nhưng 42 quả cân: giữ khóa, chỉ dẫn đọc lề sổ. | 44 quả cân + năm thẻ đúng bước: hoàn thành `nava-balance`. |
| Điện đài hai tai nghe | Hai từ bị đảo tai nghe: chỉ rõ kênh đang ngược. | Pháp “TẬP TRUNG”, Việt Bắc “PHÂN TÁN”: hoàn thành `nava-radio`, chấp nhận dấu Việt. |
| Nắm đấm thép | Sai vùng và đúng cặp nhưng sai lượt: phản hồi tương ứng, không tự hoàn tất. | Lai Châu/Tây Bắc → Thà Khẹt/Trung Lào → Nậm Hu/Thượng Lào → Kon Tum/Tây Nguyên: hoàn thành `nava-fist`. |
| Bản đồ gấp | Plây-ku với mã đúng: giải thích sai nơi; Điện Biên Phủ với `612`: nhắc mã cần bốn số. | Điện Biên Phủ + `0612`: hoàn thành `nava-fold`, hiện outro. |

Đọc hết outro, đi tới cửa rồi E: chuyển thành công sang `command-post`, đọc intro mới. Đây là điểm dừng lượt QA; không tuyên bố đã chơi tới ending toàn game trong lượt này.

Ảnh: [cán cân](261030-bao-balance.png), [sa bàn](261030-bao-fist.png), [bản đồ gấp](261030-bao-fold.png). Browser error log cuối rỗng; cả ba ảnh được xem lại. Worktree bản Bảo giữ sạch; không sửa mã hay tạo commit/push.

## Giới hạn và ghi chú

Phát hiện trực quan: một số tiêu đề serif vẫn bị tách dấu tiếng Việt, thấy rõ ở “Nắm đấm thép” trong [ảnh sa bàn](261030-bao-fist.png). Bản Git của Bảo chưa có font Lora/Patrick Hand từ bản thư màn IV cục bộ. Ghi nhận lỗi hiển thị; giữ checkout Bảo nguyên trạng để xem đúng phiên bản trên Git.

Một đoạn đường QA từ điện đài đặt Quang sát mép cửa nên va tường; căn lại vị trí giữa cửa rồi đi tiếp bình thường. Đây là lỗi đường đi của helper, không ghi là lỗi game. Browser headed đã mở cho người dùng; lượt QA chạy browser headless riêng vì cửa sổ headed không có focus lúc công cụ gửi phím. Âm thanh chưa được xác minh trong lượt này: trình duyệt QA giữ AudioContext suspended, không khẳng định có tiếng hoặc kết luận lỗi game.

Không gộp bản màn IV/thư cục bộ vào bản của Bảo. Dữ liệu lưu gắn với origin/cổng riêng, không thao tác save game ở cổng 4173. Không thay quyền cộng tác, repo visibility hay nhánh main cục bộ.

## Câu hỏi chưa giải quyết

Không có để chạy và chơi thử bản Bảo.
