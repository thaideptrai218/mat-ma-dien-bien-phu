# Brainstorm: chọn nhân vật Long / Quang

Date: 2026-11-01 · Branch: feat/system-voice-only

## Yêu cầu
- Màn chọn nhân vật trước phần mở đầu; khóa suốt lượt chơi, lưu vào save, muốn đổi thì chơi mới.
- **Quang** (nhân vật ban đầu): giọng ban đầu; giới thiệu mới do user viết (xem dưới).
- **Long**: giới thiệu mới kiểu học sinh hư; vài câu phản ứng giữa các phòng cho thấy dần đổi thái độ; đoạn kết Phòng 5 ngộ ra ý nghĩa của việc cố gắng học.
- Đổi toàn bộ "tao" → "tôi" (cả hai nhân vật). Hệ Thống vẫn gọi "Ký Chủ".
- Route Long: Hệ Thống dùng giọng **he-thong-v2** (profile `af29261d`) + avatar TL-36 (ảnh user cung cấp, ghi credit "Wrxdie" trong README và màn giới thiệu; user xác nhận có quyền).
- Làm sau khi gộp `fix/alternating-sprite-gait` (xung đột manifest, 26 câu đổi lời, 2 test xưng hô hỏng — được giải quyết bởi đổi tao → tôi).

## Giới thiệu Quang (văn bản user cung cấp)
Quang là một sinh viên trẻ năng động, ham học hỏi và yêu thích khám phá những điều mới lạ. Cậu có niềm đam mê với công nghệ, những trò chơi giải đố và các câu chuyện bí ẩn. Tuy nhiên, đối với Quang, lịch sử đôi khi vẫn chỉ là những trang sách với các mốc thời gian và sự kiện cần ghi nhớ, chưa thực sự trở thành những câu chuyện mà cậu có thể cảm nhận bằng chính mình.

## Phương án (chọn A)
- **A. Một bộ nội dung có tham số theo hồ sơ nhân vật** ← chọn. Mã clip = hash(giọng + nội dung) nên câu giống nhau dùng chung clip.
- B. Nhân đôi file nội dung 5 phòng: vi phạm DRY, dễ lệch.
- C. Đổi tên lúc chạy, chung audio: không khả thi, tên nằm trong tiếng.

## Thiết kế
1. `hero-profiles`: tên, sprite, chân dung, avatar Hệ Thống, bộ giọng, ghi đè câu thoại.
   - Quang: sprite/chân dung cũ khôi phục từ git (trước `6ac4a35`).
   - Long: sprite 16 cột + idle từ nhánh gait.
2. Màn chọn: 2 thẻ, lưu save, khóa.
3. Khóa giọng theo hồ sơ (`system` / `system-v2`...) thay cho `'Long' → 'quang'` ở `src/audio/voice-id.js`.
4. Bộ giọng:
   - Quang: Hệ Thống = CapCut "Cô Gái Hoạt Ngôn" + robot "mạnh"; Quang = mck; narrator = "Giọng đọc bài giảng" 1.0.
   - Long: Hệ Thống = he-thong-v2; Long = mck; narrator = "kiếm lai" 1.05x.
5. Phòng 2 donor (khóa hash): chỉ đổi qua wrap `hero-name.js` / `system-guidance.js`.
6. Thứ tự: gộp nhánh gait → hồ sơ + màn chọn → tao→tôi → nội dung Long/Quang → thu âm → test + duyệt trình duyệt. Mỗi giai đoạn commit riêng.

## Rủi ro
- Thu âm là phần nặng nhất: ~152 câu Hệ Thống v2 + mọi câu đổi chữ (tao→tôi, tên, nội dung mới) cho cả 2 route. Cần OmniVoice; route Quang cần CapCut bridge bật.
- v2 mới chỉ có 2 file nghe thử (`output/he-thong-v2/test-raw.mp3`, `test-robot.mp3`); chưa thu câu nào của game. Nghe thử vài câu trước khi thu cả loạt (nhân bản từ lời hát có thể không ổn định khi đọc thoại).
- Sprite: nạp theo nhân vật (Quang giữ walk cũ).
- Repo PUBLIC: kiểm tra credit/quyền ảnh trước khi push; không commit reference voice, `.studio`, `.cache`.
- Các mốc "chưa kiểm chứng" từ trước vẫn mở: Phòng 2 chưa xem trình duyệt, 47+18 clip chưa nghe, chưa chạy code-reviewer.

## Câu hỏi còn mở
1. v2 dùng bản thô hay bản có hiệu ứng robot? Mặc định: robot (theo cách Hệ Thống luôn được làm), đổi bằng một cờ cấu hình.
2. Narrator của route Quang: "bài giảng" 1.0 (mặc định) hay kiếm lai?
3. Nội dung chi tiết Long (giới thiệu, câu phản ứng từng phòng, kết): user duyệt bản nháp trước khi thu âm.
