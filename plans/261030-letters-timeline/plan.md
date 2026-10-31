---
title: Thư tay và dòng thời gian màn IV
status: completed
priority: P1
effort: medium
branch: main
tags: [chapter-four, letters, timeline, typography]
created: 2026-10-30
date: 2026-10-30
---

# Thư tay và dòng thời gian màn IV

## Phạm vi và hợp đồng

Đổi bảy hồ sơ màn IV thành thư/hồi ký sáng tác có ngày tháng, đọc trên trang giấy riêng rồi chuyển sang suy luận của Minh; game chính và save cũ giữ nguyên. Dựa PDF giáo trình do người dùng cung cấp và nguồn lịch sử chính thống. Không sao chép thư thật, không tải PDF lên repo, không xuất bản/commit.

Thứ tự đọc: encirclement (30/4/1954) → objective (1/5) → a1 (rạng sáng 7/5) → headquarters (sau 17:30 ngày 7/5) → weapons (26/5) → north (17/5/1955, sau rút quân) → independence (18/5/1955). Hàng ô chữ giữ nguyên thứ tự và vị trí gốc độc lập thứ tự truyện, vẫn đọc TIMTVAL.

UI: trang giấy có ngày, người viết/nhận, lời chào, 3–4 đoạn kể, chữ ký; chia trang rõ ràng, văn bản semantic chọn/copy được, không nhét thư vào bong bóng Minh. Đọc trang cuối rồi chọn chuyển sang suy luận; chỉ ghi manh mối sau lời suy luận cuối. Đóng/reopen giữ trang nhưng không tự nhận dữ kiện. Sổ tay là timeline, có đọc lại thư đã tìm. Trên map đổi hai hồ sơ đầu để tuyến di chuyển cùng thời gian; hồ sơ tương lai có lời nhắc tìm thư hiện tại. M/N/Q/Shift/modal, cầu, hai puzzle/rương và âm thanh giữ hoạt động.

Typography: kiểm tra lỗi dấu tách bằng nội dung thực và font đã tải; chuẩn hóa NFC, dùng font có đủ glyph Việt, không giãn/chẻ dấu kết hợp, thử từ có dấu trên trang thư, suy luận, HUD. Ưu tiên font cục bộ, không phụ thuộc mạng khi chơi.

## Phân công và touchpoints

- Nội dung: `story-data.js`, module thư mới; source report có trang PDF/URL và giới hạn hư cấu.
- UI: `ui/letter-panel.js`, `ui/narrative-panels.js`, `ui/trial-interface.js`, CSS thư/font riêng.
- Luật/controller/map: `trial-rules.js`, `trial-actions.js`, `archive-world.js`, `ui/map-panel.js`, marker scene nếu cần.
- Kiểm chứng: tests luật + đọc/đóng/trang/chuyển suy luận, tiến trình timeline, font Việt desktop/mobile; build hai entry và hành trình puzzle.

## Tiêu chí đạt

1. Bảy thư đủ chi tiết (nhiều đoạn, nhân vật/khung cảnh/chuyển biến), ngày tháng đúng trình tự, không giả thư thật; nguồn dữ kiện truy được.
2. Tương tác mở thư riêng, không đọc thư bằng miệng Minh; chỉ suy luận sau trang cuối, rồi mới nhận ý cốt lõi.
3. Chưa đến lượt không thể discover/read/collect hồ sơ tương lai; đã đọc được xem lại; reset xóa mọi tiến độ mới.
4. Cầu/ô chữ/T-L/rương vẫn hoàn tất với nguyên đáp án; ô chữ không đổi hàng khi đổi thứ tự truyện.
5. Dấu tiếng Việt liền chữ, không tràn ngang ở 375px, đọc bàn phím/zoom được; không chia codepoint của ký tự có dấu.
6. Test/build/review đạt, cập nhật README và docs có ý nghĩa; không đổi game chính/save, không Git publication.

## Tiến độ

- [x] Đọc README, scout và ghi hợp đồng
- [x] Đối chiếu PDF/nguồn và duyệt kế hoạch
- [x] Viết thư, giao diện, luật timeline và sửa chữ
- [x] Test, browser QA, review và sửa lỗi thực
- [x] Đồng bộ tài liệu và bàn giao

Hoàn tất 5/5 mục: 44/44 test, build hai entry, QA trình đọc desktop/mobile, tuyến bảy thư/puzzle/rương và review đều đạt. Sau ba chỉnh văn phong cuối đã chạy lại test/build và smoke font cục bộ khi chặn HTTPS, CSS zoom 200%, đọc/ghi/reset thực; không lỗi browser. Không có phase file riêng; đã đồng bộ toàn bộ checklist và kiểm tra liên kết tài liệu. [Nguồn](reports/history-research.md) · [QA luật](reports/letters-rules-qa.md) · [QA UI](reports/letter-ui-qa.md) · [QA toàn tuyến/bản cuối](reports/letters-journey-qa.md) · [Review](reports/code-review.md) · [Audit](reports/git-audit.md) · [Bàn giao](reports/handoff.md).

## Rủi ro và phục hồi

Thứ tự hàng cipher khác thứ tự truyện: giữ explicit row IDs. Mốc hậu chiến tránh gộp thành chiều 7/5 hoặc khẳng định toàn miền Bắc đã giải phóng ngay tháng 7/1954. Trang thư dài phải cuộn/native dialog và có nút trang; không bắt đo thời gian đọc. Có thể hoàn nguyên các module màn IV riêng; game chính không có thay đổi nghiệp vụ.
