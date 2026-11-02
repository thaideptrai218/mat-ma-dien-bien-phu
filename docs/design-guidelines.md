# Hướng dẫn thiết kế — Mật mã Điện Biên Phủ

Cập nhật 2026-11-01. Campaign năm phòng có museum intro/return, sổ hành trình và mảnh tranh tích lũy thật. Trong campaign, chỉ dùng thanh trên cùng: logo, tên phòng hiện tại, sổ, âm thanh và tùy chọn; không lặp thanh thương hiệu trong từng phòng hoặc hiển thị bộ đếm mảnh. Bản chơi riêng giữ header riêng. Phần mở đầu đặt logo lớn giữa bức ảnh; khi vào phòng, ảnh và thế giới chơi giữ nguyên. Preview 1–5 giữ save riêng; Phòng 5 dùng mảnh minh họa. Giữ góc nhìn trên xuống, xanh đất/ô liu, ánh vàng, giấy ngà và điểm nhấn đồng/đỏ trầm.

## Nhân vật theo ảnh mẫu

Long trong bản đồ: tóc đen dựng, khẩu trang đen kéo xuống cằm, sơ mi trắng, quần đen, giày trắng. Asset RGBA 64 tư thế (8 đi + 8 chạy mỗi hướng), bốn hướng; atlas160×192 hiển thị120×144 ởscale .75, vùng va chạm24×16 đặt đúng tâm vật lý. Giữ chung tỷ lệ và mặt đất giữa các tư thế; khung chạy trên không giữ độ nâng chân. Đi bộ và chạy mỗi loại 8 khung riêng. Giảm chuyển động giữ idle theo hướng, vẫn điều khiển được. [Thông số](../assets/characters/long/README.md), [QA hình mới](../plans/261031-quang-reference-character/reports/qa.md).

## Không gian, mục tiêu và di chuyển

| Phòng | Không gian |
| --- | --- |
| 1 | 2400×1600, hồ sơ hai phía và trục đọc/đối chiếu giữa, cửa bắc. |
| 2 | Bản đồ/gate/props/zones/labels của Bảo giữ nguyên; gate đông mở ở fold cuối. |
| 3 | Trại 3200×2000: kho→đường/tiếp vận→lều chỉ huy→trạm tin,14 anchors. |
| 4 | Archive 2800×1800: rương giữa, hai bàn mật mã sau rương, bảy giấy quanh tường, ô chữ bắc. |
| 5 | 2000×1400: bàn phục dựng, điểm ánh sáng/câu hỏi, cửa bắc và props. |

Đây là sơ đồ học tập, không dựng tọa độ đơn vị/di tích thật. Physics và tầm E cùng nguồn world với mini/full map. Camera theo Long trong biên; map/journal không đi hộ nhân vật. WASD/mũi tên 260, Shift 390 chuẩn hóa đường chéo; E vật gần, M map, N sổ phòng, Q nhiệm vụ, Esc tùy chọn/đóng. Form giữ nhập liệu bình thường; blur/modal/tabẩn xóa phím giữ.

HUD phòng góc phải có mục tiêu/tiến độ; mini-map thường dưới phải, desktop thấp dùng vị trí gọn dưới trái để tránh cắt/chồng. Thanh campaign có tên phòng hiện tại, Sổ hành trình, âm thanh, tùy chọn và restart; không hiển thị bộ đếm mảnh hay lặp logo phòng. Không link nhảy tới phòng chưa đạt. Chuyển phòng sau cửa thật, có khoảng loading sau await hủy Game cũ, không giữ canvas/listener cũ.

## Giấy đọc và sổ hành trình

Giấy nguyên văn HTML chọn/copy được, cuộn trong native dialog; giữ lời chào, chữ ký và ngày viết theo từng dạng giấy. Lâm/Thành nhìn lại Biên giới 1950/Trung Du/Hòa Bình/Tây Bắc trong thư đầu 1953; bổ nhiệm tháng 5/thông qua tháng 7 nằm riêng N-01 sau identity. Không thêm lời hướng dẫn giải đố vào thân thư.

Phòng 1 có thư/bốn hồ sơ 341–370 từ và N-01331 từ; Phòng 3 năm giấy 321–340 từ; Phòng 4 bảy giấy 301–330 từ, mỗi giấy năm đoạn và hai suy nghĩ Long riêng. Đọc hết→Long→explicit confirmation mới thu thập; đóng sớm không tính. Bảo giữ original narrative/clue beats, final “Ghi manh mối”, phản hồi/hint/outro và renderer nguyên gốc; không rewrite văn bản để giống reader khác.

Sổ phòng/N giữ giấy và token của phòng. **Sổ hành trình** giữ toàn văn giấy đã thu thập, các đoạn manh mối Phòng 2, N-01 và cuộc trò chuyện cuối khi đã đạt; chỉ đọc, không cấp mảnh hoặc làm thay bước hiện tại. Mở sổ chung pause phòng/input/audio; đóng cần phím mới.

## Bốn thử thách lịch sử

- Phòng 1 giữ thư → bản đồ lưới → hồ sơ/đối chiếu/điện/rương I; người chơi tự tìm vị trí lưu trữ, lời thoại và nhiệm vụ không đọc đáp án. Sau khi giải bàn đối chiếu, mã ngăn kéo tiếp tục hiển thị khi người chơi mở lại bàn. Không ghép mảnh thư; N-01 tự chọn không đổi gating/save cũ. Hai bước Nava thuộc Bảo.
- Bảo giữ cân lực lượng, băng tần, chuỗi nắm đấm, nếp gấp, mã và lời feedback gốc. Fold hợp lệ cấp II và mở gate; outro có thể đóng sớm, không thêm chest/pickup hoặc điều kiện đọc mới.
- Phòng 3 phân loại 5 thẻ: decision 6/12, opening 13/3, ba việc chuẩn bị giữa song song. Ghép 6 SVG/hiểu xe thồ và sức dân; sắp hai mật lệnh với thẻ NHANH/CHẮC hoán đổi tương đương, hỏi sure-victory/reality; tin 13/15/17/ngữ nghĩa. Đủ cả 4 token trước 13/03/1954; phương châm giữ riêng, rương→pickup III→cửa.
- Phòng 4 giữ ô chữ, bảy câu hỏi theo giấy đã đọc và hai bàn mật mã dùng chỉ dẫn từ ô chữ. Sau khi chọn cột, nhân vật chỉ nhắc chuỗi `TIMTVAL` và tự hỏi ý nghĩa; không đọc ra lời giải. Ghép hai nửa câu thành khẩu hiệu để mở rương rồi lấy mảnh IV. Tên bàn và gợi ý Hệ Thống không tiết lộ hình cần dò; lời chỉ dẫn trước đó là căn cứ suy luận.

Các form native, lựa chọn ngữ nghĩa rõ, nút lên/xuống có nhãn, vùng bấm hướng tới 44 px, draft còn khi sai/mở lại. Không dùng AI chấm lời giải tự do. Mảnh chỉ từ kết quả thật của mỗi phòng; common inventory không tự điền đủ bốn.

## Tranh cuối, suy ngẫm và trở về

Ảnh chiến thắng dùng ở phần mở đầu, bốn phần tư ghép 2×2 và return. Phần mở đầu đặt logo ở giữa ảnh; khung bảo tàng giữ đúng tỷ lệ 3:2. Trước puzzle cần đủ I–IV và các cửa trước; chọn hai native buttons để swap, hỗ trợ keyboard, thứ tự đúng mới hoàn tất assembly. Chữ ký ở cuối giấy dùng Patrick Hand cục bộ, 31–38 px theo bề rộng màn hình, xoay nhẹ để tách khỏi phần văn bản.

Ghép xong cửa vẫn chờ cuộc trò chuyện. Hiển thị câu hỏi từ PDF bản 4/phòng 5 và lời đáp sáng tác của Long; ô suy nghĩ cá nhân **optional/ungraded/skippable**, không truyền qua callback/payload/save hoặc network. Blank vẫn tiếp tục. Nút tiếp tục hoàn tất đoạn trò chuyện rồi người chơi phải đến cửa E. Không dùng câu trả lời cá nhân làm mật khẩu tư tưởng.

Museum return hiển thị cùng tranh và thông điệp cuối. Nút “Khép lại hành trình” là acknowledgment riêng mới ghi complete; không kết thúc campaign ngay sau phòng 4 hoặc assembly. Hành trình mới cần xác nhận, không xóa preview/donor; reset phòng giữ earlier progress và bỏ phần phụ thuộc.

## Chữ, tài sản và phạm vi kiểm chứng

Font Be Vietnam Pro/Lora/Patrick Hand local, font gate trước Canvas; giấy mực xanh/ivory/copper, source ngoài vùng prose, tiếng Việt NFC, zoom/chọn/copy bình thường. CSS reduced-motion bỏ hiệu ứng không cần thiết. Dialog có close/Esc/focus rõ, native scrolling; màn hẹp có vùng đọc/thẻ thao tác đủ dùng, không khóa zoom. Bảo giữ font fixes/CSS hiện có.

Quân số 252.000/445.000 giữ đúng ngữ cảnh; trên 2.000 đợt đầu khác 16.200 toàn chiến dịch; miền Bắc sau Genève, không đoán ngày đổi phương châm. Sáu SVG tiếp vận là hình minh họa. Âm thanh được đóng gói cục bộ, một shared controller trong campaign, gesture unlock; không TTS/touch walking.

119 tests/build năm entry và [full campaign QA](../plans/261031-campaign-link/reports/campaign-qa.md) đạt đến museum acknowledgment: wrong assembly denied, door đóng trước reflection, blank continue hợp lệ, physical exit/return, archive 26 entries. Màn 390 px framing/confirmation và 375 px giấy, Room 5 component mobile kiểm tra theo phạm vi riêng; không suy screen-reader/touch support từ screenshots.

[Kế hoạch](../plans/261031-campaign-link/plan.md) · [Bảo toàn Bảo](../plans/261031-campaign-link/reports/room-two.md) · [Nội dung hậu cần](../plans/261031-room-three-logistics/reports/content.md) · [Nội dung Trâm](../plans/261030-tram-room-four/reports/content.md)
