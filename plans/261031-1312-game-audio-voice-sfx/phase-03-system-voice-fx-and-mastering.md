# Phase 03 — Giọng máy móc cho Hệ Thống + mastering

## Context Links
- Giọng gốc: `F:\AI-auto-generate-video\assets\audio\capcut-voice-previews\260822-luan-ngu\05-co-gai-hoat-ngon-dfb2ac64.mp3`.
- Mẫu đã render (8 s, cùng câu preview; không commit vì quyền giọng chưa rõ, tạo lại được từ chuỗi lọc dưới đây) tại `C:\Users\pgb31\AppData\Local\Temp\claude\C--Users-pgb31\c5c9ddd7-2161-4ee6-8a8d-f82bf232b9e8\scratchpad\system-voice-presets\`:
  - `he-thong-1-nhe.mp3` — EQ băng hẹp + echo kim loại ngắn + bitcrush 15 %.
  - `he-thong-2-vua.mp3` — trộn 35 % robot (afftfilt khử pha) + echo kim loại. **Đề xuất.**
  - `he-thong-3-manh.mp3` — 60 % robot + flanger + bitcrush 9 bit; rõ chất máy, giảm độ dễ nghe.

## Overview
- Priority: P1. Status: preset mẫu xong, chờ người dùng chọn.
- Xử lý toàn bộ file thô bằng FFmpeg theo vai, chuẩn hóa độ lớn, xuất định dạng web.

## Key Insights
- Robot hóa 100 % làm mất chữ tiếng Việt có dấu → luôn trộn dry/wet, giữ dải 160 Hz–6,5 kHz.
- Thêm “chữ ký” Hệ Thống: tiếng *ting* số 80–120 ms trước mỗi lượt nói (SFX phase 04), không nhúng vào file giọng để bật/tắt được.
- Mọi giọng cùng mức loudness để không phải chỉnh âm lượng theo câu.

## Requirements
- Chuỗi lọc Hệ Thống (preset “vừa”):
  `asplit → afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75 → amix 0.65/0.35 → highpass 160 → lowpass 6500 → aecho 0.8:0.55:9|18:0.3|0.2 → loudnorm I=-16:TP=-1.5:LRA=7`
- Quang, Lời kể: `silenceremove` đầu/cuối (ngưỡng -45 dB, giữ 80 ms) → `highpass 70` → `loudnorm I=-16:TP=-1.5`.
- Xuất: MP3 mono 44,1 kHz 64 kbps (tương thích mọi trình duyệt); tên `public/audio/voice/<room>/<voiceId>.mp3`.

## Architecture
`scripts/master-voice-lines.mjs` đọc log phase 02 → chọn chuỗi lọc theo `voice` → `ffmpeg` (spawn, không shell) → ghi thành phẩm + `durationMs` vào manifest (để UI ước thời gian, tô sáng câu đang đọc).

## Related Code Files
- Tạo: `scripts/master-voice-lines.mjs`, `scripts/voice/ffmpeg-voice-presets.mjs`.
- Sửa: `public/audio/voice/manifest.json` (thêm `durationMs`).

## Implementation Steps
1. Người dùng nghe 3 mẫu, chọn preset (có thể trộn: “vừa” + bitcrush nhẹ).
2. Mã hóa preset thành hằng trong `ffmpeg-voice-presets.mjs`.
3. Master thử Phòng 1 → đo `ebur128` → nghe trên loa và tai nghe.
4. Master toàn bộ; ghi `durationMs`.

## Todo List
- [ ] Người dùng chọn preset
- [ ] Script master + presets
- [ ] Master Phòng 1, duyệt
- [ ] Master toàn bộ

## Success Criteria
- Mọi file nằm trong -16 ± 1 LUFS, true peak ≤ -1 dBTP; Hệ Thống nghe “máy” nhưng người chơi chép lại đúng ≥ 95 % chữ khi nghe mù (thử 10 câu).

## Risk Assessment
- `afftfilt` gây độ trễ/comb nhẹ khi trộn dry → chấp nhận như chất kim loại; nếu chói, giảm `win_size` 256 hoặc bỏ nhánh robot (preset “nhẹ”).
- Dung lượng vượt ngân sách → hạ 48 kbps cho độc thoại ngắn.

## Security Considerations
- Chỉ xử lý file cục bộ; không tải lên dịch vụ ngoài.

## Next Steps
- Phase 05 phát các file này; phase 06 nghe duyệt toàn bộ.
