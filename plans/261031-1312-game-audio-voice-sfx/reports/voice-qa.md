# Voice QA — 2026-10-31

## Sinh + hậu kỳ
- 332/332 câu có file (`public/audio/voice/<id>.mp3`), 0 lỗi sinh. CapCut: Hệ Thống 59, Quang 255; OmniVoice: Lời kể 18.
- Tổng ~27,7 phút, 14 MB (MP3 mono 64 kbps).
- Hệ Thống: preset “mạnh” (robot 60 % + flanger + bitcrush 9 bit).
- Sửa ở tool `F:\AI-auto-generate-video\services\capcut_tts_server.py`: thêm trạng thái `queueing` (CapCut đổi tên trạng thái hàng đợi; bridge cũ báo `UPSTREAM_STATE` cho mọi yêu cầu). Chưa commit bên repo tool.

## Đo kỹ thuật (ffmpeg ebur128, toàn bộ 332 file)
| Chỉ số | Kết quả | Mục tiêu |
| --- | --- | --- |
| Integrated loudness | -17,3 … -16,3 LUFS | -16 ± 1 (9 câu ngắn < 3 s ở -17,1…-17,3: limiter giữ đỉnh; chấp nhận ±1,5) |
| True peak | ≤ -1,0 dBFS | ≤ -1 |
| Tốc độ đọc | 3 câu “bất thường” đều do chữ hiển thị khác chữ đọc (tiền tố `Quang:`, số → chữ) | — |

## Kiểm tra nghe tự động (Gemini ASR, 2026-10-31)
- Chép lời mù 22/332 câu trước khi hết quota Gemini (lỗi 429 với 14 câu; chưa chạy phần còn lại).
- Lỗi thật phát hiện: CapCut đọc chữ cái đứng riêng sai (A→“anh”, V→“năm”, P→“Vi”, Q→“cuộn”, E→“em-mờ”). Đã thêm quy tắc đọc tên chữ cái tiếng Việt (a, vê, pê, quy, e…) trong , sinh lại và master lại 37 câu bị ảnh hưởng.
- Hệ Thống preset mạnh: câu dài vẫn nghe ra ý, có chữ lệch (vd. “Phòng một” → “Trong một”). Cần người nghe xác nhận đạt ≥ 95 %.
- Chạy tiếp khi có quota: script  (resume được), kết quả ở .

## Trình duyệt
- Phòng 3, 4: 20/22 mục đạt; 2 lỗi nhỏ (thiếu chime ở câu Hệ Thống đầu tiên, còn sót highlight sau Esc) đã sửa (158 test). Chi tiết: [browser-audio-qa-rooms-3-5](browser-audio-qa-rooms-3-5.md). Phòng 5 chỉ kiểm tra bằng unit test (cần đủ 4 mảnh từ hành trình thật).

## Chưa làm (cần người)
- Nghe duyệt từng câu: `npm run voice:review` → mở `.cache/voice-review.html`, đánh Đạt/Sai, xuất CSV câu Sai → bổ sung `scripts/voice/tts-pronunciation.mjs` → `npm run voice:script && npm run voice:generate && npm run voice:master`.
- Nghe mù 10 câu Hệ Thống (preset mạnh) để xác nhận ≥ 95 % nghe được chữ.
- Chơi trọn hành trình có tiếng trên Chrome/Edge/Firefox (+ Safari nếu có).

## Câu hỏi mở
- Câu nào phát âm sai? (chờ người dùng nghe duyệt)
