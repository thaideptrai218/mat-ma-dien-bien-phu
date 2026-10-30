# Hướng dẫn thiết kế — Mật mã Điện Biên Phủ

Cập nhật 2026-10-31. Campaign năm phòng có museum intro/return, common journal và mảnh tranh tích lũy thật. Preview 1–4 giữ save riêng và được ghi rõ trên link. Giữ góc nhìn trên xuống, xanh đất/ô liu, ánh vàng, giấy ngà và điểm nhấn đồng/đỏ trầm; không đưa giao diện app cũ vào bản chính.

## Không gian, mục tiêu và di chuyển

| Phòng | Không gian |
| --- | --- |
| 1 | 2400×1600, hồ sơ hai phía và trục đọc/đối chiếu giữa, cửa bắc. |
| 2 | Bản đồ/gate/props/zones/labels của Bảo giữ nguyên; gate đông mở ở fold cuối. |
| 3 | Trại 3200×2000: kho→đường/tiếp vận→lều chỉ huy→trạm tin,14 anchors. |
| 4 | Archive 2800×1800: rương giữa, hai bàn T/L sau rương, bảy giấy quanh tường, ô chữ bắc. |
| 5 | 2000×1400: bàn phục dựng, điểm ánh sáng/câu hỏi, cửa bắc và props. |

Đây là sơ đồ học tập, không dựng tọa độ đơn vị/di tích thật. Physics và tầm E cùng nguồn world với mini/full map. Camera theo Quang trong biên; map/journal không đi hộ nhân vật. WASD/mũi tên 260, Shift 390 chuẩn hóa đường chéo; E vật gần, M map, N sổ phòng, Q nhiệm vụ, Esc tùy chọn/đóng. Form giữ nhập liệu bình thường; blur/modal/tabẩn xóa phím giữ.

HUD phòng góc phải có mục tiêu/tiến độ; mini-map thường dưới phải, desktop thấp dùng vị trí gọn dưới trái để tránh cắt/chồng. Header campaign có phòng hiện tại, mảnh thật, Sổ hành trình và restart; không link nhảy tới phòng chưa đạt. Chuyển phòng sau cửa thật, có khoảng loading sau await hủy Game cũ, không giữ canvas/listener cũ.

## Giấy đọc và sổ hành trình

Giấy nguyên văn HTML chọn/copy được, cuộn trong native dialog. Nguồn/ngày/hư cấu ngoài thân thư, có greeting/signature đúng loại. Lâm/Thành nhìn lại Biên giới 1950/Trung Du/Hòa Bình/Tây Bắc trong thư đầu 1953; bổ nhiệm tháng 5/thông qua tháng 7 nằm riêng N-01 sau identity. Không thêm lời hướng dẫn giải đố vào thân thư.

Phòng 1 có thư/bốn hồ sơ 341–370 từ và N-01331 từ; Phòng 3 năm giấy 321–340 từ; Phòng 4 bảy giấy 301–330 từ, mỗi giấy năm đoạn và hai suy nghĩ Quang riêng. Đọc hết→Quang→explicit confirmation mới thu thập; đóng sớm không tính. Bảo giữ original narrative/clue beats, final “Ghi manh mối”, phản hồi/hint/outro và renderer nguyên gốc; không rewrite văn bản để giống reader khác.

Sổ phòng/N giữ giấy và token của phòng. **Sổ hành trình** giữ toàn văn prior collected papers, các đoạn clue gốc Bảo, N-01 và cuộc trò chuyện cuối khi đã đạt; readonly, không cấp mảnh hoặc làm thay bước hiện tại. Mở sổ chung pause phòng/input/audio, đóng cần phím mới; source labels vẫn thấy trong reread.

## Bốn thử thách lịch sử

- Phòng 1 giữ thư/A-03/hồ sơ/đối chiếu/điện/rương I, không ghép mảnh thư; N-01 tự chọn không đổi gating/save cũ. Hai bước Nava thuộc Bảo.
- Bảo giữ cân lực lượng, băng tần, chuỗi nắm đấm, nếp gấp, mã và lời feedback gốc. Fold hợp lệ cấp II và mở gate; outro có thể đóng sớm, không thêm chest/pickup hoặc điều kiện đọc mới.
- Phòng 3 phân loại 5 thẻ: decision 6/12, opening 13/3, ba việc chuẩn bị giữa song song. Ghép 6 SVG/hiểu xe thồ và sức dân; sắp hai mật lệnh với thẻ NHANH/CHẮC hoán đổi tương đương, hỏi sure-victory/reality; tin 13/15/17/ngữ nghĩa. Đủ cả 4 token trước 13/03/1954; phương châm giữ riêng, rương→pickup III→cửa.
- Phòng 4 giữ ô chữ 17 cột/starts và đáp án đủ 16 chữ hàng 4 (thêm một ô cuối thiếu trong PDF), cột index 8/TIMTVAL, hai bảngT/L gồm ULTAV, câu cuối→rương tự mở→pickup IV→cửa. Lưới cuộn ngang nội bộ, không ép chữ quá nhỏ.

Các form native, lựa chọn ngữ nghĩa rõ, nút lên/xuống có nhãn, vùng bấm hướng tới 44 px, draft còn khi sai/mở lại. Không dùng AI chấm lời giải tự do. Mảnh chỉ từ kết quả thật của mỗi phòng; common inventory không tự điền đủ bốn.

## Tranh cuối, suy ngẫm và trở về

`victory-painting.svg` là tranh sáng tác, cùng một ảnh ở bảo tàng mở đầu, bốn phần tư ghép 2×2 và return. Caption/alt ghi minh họa, không ảnh/bản sao tranh thật. Trước puzzle cần đủ I–IV và các cửa trước; chọn hai native buttons để swap, hỗ trợ keyboard, thứ tự đúng mới hoàn tất assembly.

Ghép xong cửa vẫn chờ cuộc trò chuyện. Hiển thị câu hỏi từ PDF bản 4/phòng 5 và lời đáp sáng tác của Quang; ô suy nghĩ cá nhân **optional/ungraded/skippable**, không truyền qua callback/payload/save hoặc network. Blank vẫn tiếp tục. Nút tiếp tục hoàn tất đoạn trò chuyện rồi người chơi phải đến cửa E. Không dùng câu trả lời cá nhân làm mật khẩu tư tưởng.

Museum return hiển thị cùng tranh và thông điệp cuối. Nút “Khép lại hành trình” là acknowledgment riêng mới ghi complete; không kết thúc campaign ngay sau phòng 4 hoặc assembly. Hành trình mới cần xác nhận, không xóa preview/donor; reset phòng giữ earlier progress và bỏ phần phụ thuộc.

## Chữ, tài sản và phạm vi kiểm chứng

Font Be Vietnam Pro/Lora/Patrick Hand local, font gate trước Canvas; giấy mực xanh/ivory/copper, source ngoài vùng prose, tiếng Việt NFC, zoom/chọn/copy bình thường. CSS reduced-motion bỏ hiệu ứng không cần thiết. Dialog có close/Esc/focus rõ, native scrolling; màn hẹp có vùng đọc/thẻ thao tác đủ dùng, không khóa zoom. Bảo giữ font fixes/CSS hiện có.

Chỉ PDF bản 4/bản chữ/brief cung cấp, không web. Quân số 252.000/445.000 có nhãn; trên 2.000 đợt đầu khác 16.200 toàn chiến dịch; miền Bắc sau Genève, không đoán ngày đổi phương châm. Sáu SVG tiếp vận/painting là minh họa, không ảnh tư liệu. Không đưa private PDF vào website/Git. Âm tổng hợp local, một shared controller trong campaign, gesture unlock; không TTS/touch walking.

105 tests/build năm entry và [full campaign QA](../plans/261031-campaign-link/reports/campaign-qa.md) đạt đến museum acknowledgment: wrong assembly denied, door đóng trước reflection, blank continue hợp lệ, physical exit/return, archive 26 entries. Màn 390 px framing/confirmation và 375 px giấy, Room 5 component mobile kiểm tra theo phạm vi riêng; không suy screen-reader/touch support từ screenshots.

[Kế hoạch](../plans/261031-campaign-link/plan.md) · [Bảo toàn Bảo](../plans/261031-campaign-link/reports/room-two.md) · [Nội dung hậu cần](../plans/261031-room-three-logistics/reports/content.md) · [Nội dung Trâm](../plans/261030-tram-room-four/reports/content.md)
