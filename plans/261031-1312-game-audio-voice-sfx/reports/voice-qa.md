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

## Chưa làm (cần người)
- Nghe duyệt từng câu: `npm run voice:review` → mở `.cache/voice-review.html`, đánh Đạt/Sai, xuất CSV câu Sai → bổ sung `scripts/voice/tts-pronunciation.mjs` → `npm run voice:script && npm run voice:generate && npm run voice:master`.
- Nghe mù 10 câu Hệ Thống (preset mạnh) để xác nhận ≥ 95 % nghe được chữ.
- Chơi trọn hành trình có tiếng trên Chrome/Edge/Firefox (+ Safari nếu có).

## Câu hỏi mở
- Câu nào phát âm sai? (chờ người dùng nghe duyệt)
