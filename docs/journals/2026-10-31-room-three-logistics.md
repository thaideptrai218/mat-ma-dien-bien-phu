---
date: 2026-10-31
status: verified
scope: room-three-logistics-and-room-one-background
---

# Nền Phòng 1 và tuyến tiếp vận Phòng 3

## Bối cảnh

Người dùng bổ sung nội dung 1950–7/1953 và thiết kế bốn thử thách hậu phương tháng 12/1953–17/3/1954. Giữ gameplay/save Phòng 1, Bảo Phòng 2 và Phòng 4. Chỉ nguồn cung cấp tại máy/PDF/brief 31/10, không web, không ảnh lịch sử mới.

## Thay đổi

Thư Phòng 1 bổ sung Biên giới Thu–Đông 1950, Trung Du, Hòa Bình, Tây Bắc và quân đội/hậu phương trưởng thành, giữ lời văn/chữ ký/các câu cũ. Ngày đầu 1953 không biết trước tháng 5/7. N-01 là giấy riêng 331 từ tháng 7 sau giải danh tính, nói bổ nhiệm tháng 5/thông qua tháng 7/mục tiêu Pháp. Người chơi cũ đã giải danh tính có thể đọc N-01 trong sổ tay mà không đổi state, key hoặc điều kiện rương.

Phòng 3 mới `/room-three.html`, trại 3200×2000 gồm kho, đường, lều chỉ huy, trạm tin và 14 vật E. Năm giấy 321–340 từ/năm đoạn xen bốn hoạt động: chuẩn bị phân nhóm; sáu tranh/hiểu tiếp vận; hai mật lệnh/lý do; Him Lam–Độc Lập–Bản Kéo 13/15/17 và ý nghĩa. Dữ kiện tháng 3/năm 1954/ngày 13 ghép 13/03/1954, phương châm giữ riêng nhưng vẫn phải hoàn thành cả bốn. Rương mở→lấy riêng III→cửa.

## Quyết định và ranh giới

- Ba việc chuẩn bị diễn ra song song, cùng nhóm; hai mốc 6/12 và 13/3 là neo ngày. Không chấm thứ tự giả giữa kho/đường/pháo/công sự.
- Sáu SVG tự vẽ có nhãn minh họa và alt text, không giả ảnh tư liệu. Vai trò xe thồ/dân công/kéo pháo/gạo/đạn/công binh được hỏi cùng ý nghĩa.
- NHANH/CHẮC có ID riêng nhưng đổi hai thẻ cùng chữ vẫn đúng. Đổi phương châm vì thực tế/tương quan/chắc thắng, không chỉ thiếu gạo; không đoán ngày 26/1.
- Bản Kéo đầu hàng 17/3, trên 2.000 bị tiêu diệt/bắt sống thuộc đợt đầu; chiến dịch chưa kết thúc, người viết tháng 3 không kể trước 7/5.
- Save mới `mat-ma-dien-bien-phu:room-three:v1` chuẩn hóa giấy và thử thách như một đồ thị; không khôi phục giấy sau nếu thiếu trạm trước. Không nhập tiến độ 1/4/Bảo, không cấp mảnh khác.
- Dùng lại scene/UI đã cấu hình từ đợt 4; reader/input/audio/font không bị nhân bản. Chỉ đổi caption mặc định Phòng 1 thành 1950–7/1953. Header 1/3/4; Vite đúng ba entry. Không phục hồi map cũ, không commit/push/deploy.

## Kiểm chứng và điều rút ra

68/68 tests/build ba entry/review GO. Test gồm đồ thị phục hồi liên hợp, guard/token, ngữ nghĩa/thẻ chữ tương đương, save cũ/N-01, hình học/SVG/font/audio và hợp đồng 1/4. QA độc lập qua toàn tuyến Phòng 1 mới, N-01 trên save hoàn tất không đổi state; đầu Room 3/reset/reload/audio/375 px và smoke 4/Bảo.

Controller đã chơi thật từ đầu Room 3 qua năm giấy xen bốn hoạt động/câu hỏi, nhập năm sai bị chặn, nhập 13/03/1954 mở rương hiện III, nhận riêng làm mảnh ẩn và tới cửa. Sáu SVG decode đủ trong bãi hàng; thiếu thuốc/lý do chỉ thiếu gạo bị chặn, draft giữ nguyên. Reload khôi phục năm giấy đọc lại/bốn token/các cờ/rương trống, Quang về 300/1720; save 1/4 byte-identical. Đo chuyển động 268,67 đơn vị có 4 tiếng bước/RMS 0,00758, mute 0 và resume sau reload bằng một thao tác. Không exception qua tuyến. Sửa cache cờ rương theo mẫu 4, build và restore thực được kiểm tra lại.

Cần phân biệt nguồn lịch sử với lời kể/ảnh minh họa và phân biệt mở rương với nhặt mảnh. Một khóa ngày có thể ghép từ ba token nhưng vẫn phải kiểm tra đủ bốn hoạt động; token phương châm là phần hiểu lịch sử riêng.

## Việc tiếp theo

Phòng 5, nối tiến độ toàn hành trình và phân phối tài sản thuộc đợt sau. Chưa có điều khiển đi bộ cảm ứng/lồng tiếng/backend; không chứng nhận kiểm thử người chơi thật hoặc toàn tuyến zoom 200%.

[Kế hoạch](../../plans/261031-room-three-logistics/plan.md) · [Brief nguồn](../../plans/261031-room-three-logistics/source-brief.md) · [Nội dung](../../plans/261031-room-three-logistics/reports/content.md) · [QA thực](../../plans/261031-room-three-logistics/reports/qa.md) · [QA độc lập](../../plans/261031-room-three-logistics/reports/independent-qa.md) · [Review](../../plans/261031-room-three-logistics/reports/code-review.md) · [UI](../../plans/261031-room-three-logistics/reports/ui.md) · [Thế giới/minh họa](../../plans/261031-room-three-logistics/reports/world.md)

## Câu hỏi còn mở

Không có câu hỏi chặn phạm vi mới. Phòng 5/tích hợp và giấy phép phân phối cốt truyện/tài sản chưa xử lý trong đợt này.
