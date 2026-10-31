# Phase 03 — Giọng máy móc cho Hệ Thống + mastering

## Context Links
- Giọng gốc: `F:\AI-auto-generate-video\assets\audio\capcut-voice-previews\260822-luan-ngu\05-co-gai-hoat-ngon-dfb2ac64.mp3`.
- Mẫu đã render (8 s, cùng câu preview; file tạm ngoài repo, tạo lại được từ chuỗi lọc dưới đây) tại `C:\Users\pgb31\AppData\Local\Temp\claude\C--Users-pgb31\c5c9ddd7-2161-4ee6-8a8d-f82bf232b9e8\scratchpad\system-voice-presets\`:
  - `he-thong-1-nhe.mp3` — EQ băng hẹp + echo kim loại ngắn + bitcrush 15 %.
  - `he-thong-2-vua.mp3` — trộn 35 % robot (afftfilt khử pha) + echo kim loại.
  - `he-thong-3-manh.mp3` — 60 % robot + flanger + bitcrush 9 bit; rõ chất máy. **Người dùng đã chọn (2026-10-31).**

## Overview
- Priority: P1. Status: preset **mạnh** đã chọn; chưa master hàng loạt.
- Xử lý toàn bộ file thô bằng FFmpeg theo vai, chuẩn hóa độ lớn, xuất định dạng web.

## Key Insights
- Robot hóa 100 % làm mất chữ tiếng Việt có dấu → luôn trộn dry/wet, giữ dải 160 Hz–6,5 kHz.
- Thêm “chữ ký” Hệ Thống: tiếng *ting* số 80–120 ms trước mỗi lượt nói (SFX phase 04), không nhúng vào file giọng để bật/tắt được.
- Mọi giọng cùng mức loudness để không phải chỉnh âm lượng theo câu.

## Requirements
- Chuỗi lọc Hệ Thống (preset “mạnh”, đã chọn):
  `asplit → afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75 → amix 0.4/0.6 → flanger delay=2:depth=2:speed=0.3 → acrusher bits=9:mode=log:aa=1:mix=0.3 → highpass 180 → lowpass 6000 → aecho 0.8:0.6:7|14:0.35|0.25 → loudnorm I=-16:TP=-1.5:LRA=7`
- Quang, Lời kể: `silenceremove` đầu/cuối (ngưỡng -45 dB, giữ 80 ms) → `highpass 70` → `loudnorm I=-16:TP=-1.5`.
- Xuất: MP3 mono 44,1 kHz 64 kbps (tương thích mọi trình duyệt); tên `public/audio/voice/<voiceId>.mp3` (thư mục phẳng; phòng nào dùng câu nào nằm trong `rooms` của manifest).

## Architecture
`scripts/master-voice-lines.mjs` đọc log phase 02 → chọn chuỗi lọc theo `voice` → `ffmpeg` (spawn, không shell) → ghi thành phẩm + `durationMs` vào manifest (để UI ước thời gian, tô sáng câu đang đọc).

## Related Code Files
- Tạo: `scripts/master-voice-lines.mjs`, `scripts/voice/ffmpeg-voice-presets.mjs`.
- Sửa: `public/audio/voice/manifest.json` (thêm `durationMs`).

## Implementation Steps
1. ~~Người dùng chọn preset~~ → đã chọn “mạnh”. Vì preset mạnh giảm độ dễ nghe, kiểm tra kỹ câu dài/nhiều số ở bước 3.
2. Mã hóa preset thành hằng trong `ffmpeg-voice-presets.mjs`.
3. Master thử Phòng 1 → đo `ebur128` → nghe trên loa và tai nghe.
4. Master toàn bộ; ghi `durationMs`.

## Todo List
- [x] Người dùng chọn preset (mạnh)
- [ ] Script master + presets
- [ ] Master Phòng 1, duyệt
- [ ] Master toàn bộ

## Success Criteria
- Mọi file nằm trong -16 ± 1 LUFS, true peak ≤ -1 dBTP; Hệ Thống nghe “máy” nhưng người chơi chép lại đúng ≥ 95 % chữ khi nghe mù (thử 10 câu).

## Risk Assessment
- Preset mạnh có thể làm mất chữ ở câu dài/nhiều số → nếu bài nghe mù < 95 %, giảm wet 0.6 → 0.5 hoặc bitcrush mix 0.3 → 0.2 cho riêng câu đó (cờ `fxOverride` trong manifest), không đổi preset chung.
- Dung lượng vượt ngân sách → hạ 48 kbps cho độc thoại ngắn.

## Security Considerations
- Chỉ xử lý file cục bộ; không tải lên dịch vụ ngoài.

## Next Steps
- Phase 05 phát các file này; phase 06 nghe duyệt toàn bộ.
