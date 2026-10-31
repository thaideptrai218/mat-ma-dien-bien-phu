# Phase 02 — Sinh giọng TTS + chuẩn hóa phát âm

## Context Links
- Tool: `F:\AI-auto-generate-video\STUDIO.md` (mục CapCut bridge, “Chạy OmniVoice adapter”, “Thư viện giọng dùng lại”).
- CapCut bridge: `services/capcut_tts_server.py` — `GET /health`, `GET /voices`, `POST /tts {text, voiceKey, speed}`, cổng mặc định `8124`.
- OmniVoice: `services/omnivoice_server.py` — `GET /health`, `POST /tts {text, refAudio?, refText?, speed?, pronunciationProfile?}` → `audio/mpeg`, cổng `8123`.
- Hồ sơ giọng kể: `.studio/voices/131af5c2-8d45-4733-8568-9e10166695ee/` (reference.wav + transcript “Nhà nước là một khái niệm rất đặc biệt…”).

## Overview
- Priority: P1. Status: chưa làm.
- Script trong repo game gọi hai dịch vụ trên máy, sinh file thô theo manifest, có cache theo `voiceId`.

## Key Insights
- Hai giọng CapCut được cung cấp dưới dạng preview → dùng đúng `voiceKey` trong `capcut-voice-previews/260822-luan-ngu/manifest.json`, không clone lại.
- TTS tiếng Việt dễ đọc sai: số/ngày, mã ký hiệu, tên nước ngoài, phím tắt. Cần lớp `ttsText` riêng, chữ hiển thị giữ nguyên.
- CapCut là dịch vụ bên ngoài (có thể offline/giới hạn) → chạy theo lô nhỏ, retry có giới hạn, không tự đổi sang giọng khác (đúng nguyên tắc của tool).

## Requirements
- `npm run voice:generate -- --room r1 --voice system` sinh lại đúng phần cần; bỏ qua file đã có cùng id.
- Lưu thô `.cache/voice-raw/<id>.mp3` (gitignore), kèm log JSON (id, engine, thời lượng, lỗi).

## Architecture
`scripts/generate-voice-lines.mjs`
→ đọc manifest → lọc theo cờ → với mỗi câu: `ttsText = applyPronunciation(text)` (`scripts/voice/tts-pronunciation-map.mjs`) → gọi engine theo `voice` → ghi file thô → cập nhật log.
Tốc độ đề xuất: Hệ Thống `1.0`, Quang `1.05`, Lời kể `0.95` (chỉnh sau khi nghe thử).

## Bảng phát âm khởi điểm (mở rộng khi QA)
| Hiển thị | ttsText |
| --- | --- |
| `A-03`, `V-01`, `P-02` | “A không ba”, “V không một”, “P không hai” |
| `2413`, `0612` | “hai bốn một ba”, “không sáu một hai” |
| `13/3/1954`, `7/5/1954`, `6/12/1953` | “mười ba tháng ba năm một nghìn chín trăm năm mươi tư”… |
| `12/1953`, `tháng 5/1953` | “tháng mười hai năm một nghìn chín trăm năm mươi ba”… |
| `WASD`, `E`, `N`, `M`, `Q`, `Shift`, `Esc` | “W A S D”, “phím E”… (đọc tên chữ hoa) |
| `Henri Navarre`, `Nava` | “Hăng-ri Na-va”, “Na-va” |
| `Genève` | “Giơ-ne-vơ” |
| `C1, D1, E1, A1` | “C một, D một, E một, A một” |
| `84`, `44`, `16.200` | chữ số đầy đủ |
| `—`, `·`, `…` | dấu ngắt (phẩy/chấm) |

## Related Code Files
- Tạo: `scripts/generate-voice-lines.mjs`, `scripts/voice/tts-pronunciation-map.mjs`, `scripts/voice/tts-engines.mjs` (client CapCut/OmniVoice), `tests/tts-pronunciation-map.test.js`.
- Sửa: `.gitignore` (`.cache/`), `package.json` (scripts `voice:*`).

## Implementation Steps
1. Health check cả hai dịch vụ; báo rõ dịch vụ nào offline.
2. Client CapCut: `POST http://127.0.0.1:8124/tts`, JSON, nhận audio; timeout 60 s, retry 2 lần.
3. Client OmniVoice: đọc `profile.json` + `reference.wav` (base64 hoặc đường dẫn theo đúng API adapter), `refText` = transcript hồ sơ.
4. Bảng phát âm + test (đầu vào/đầu ra cố định).
5. Chạy thử 1 phòng (Phòng 1, ~25 câu) → nghe → chỉnh tốc độ/phát âm → chạy toàn bộ.

## Todo List
- [ ] Client 2 engine + health check
- [ ] Bảng phát âm + test
- [ ] Sinh thử Phòng 1, duyệt
- [ ] Sinh toàn bộ đợt 1

## Success Criteria
- 100% câu đợt 1 có file thô, log không lỗi; mẫu Phòng 1 được người dùng duyệt giọng/tốc độ.

## Risk Assessment
- CapCut chặn/đổi API → bridge báo lỗi, giữ lựa chọn; phương án dự phòng: OmniVoice clone từ preview (cần đồng ý về quyền giọng).
- OmniVoice thiếu VRAM → `OMNIVOICE_DEVICE=cpu` (chậm, chạy qua đêm).
- Câu dài > giới hạn engine → tách theo câu/dấu chấm rồi nối bằng FFmpeg `concat` với 120 ms im lặng.

## Security Considerations
- Mẫu giọng là dữ liệu nhạy cảm: không copy `.studio/` hay `reference.wav` vào repo game; chỉ commit audio thành phẩm.
- Không gửi gì ngoài nội dung kịch bản tới CapCut.

## Next Steps
- Phase 03 xử lý hậu kỳ file thô.
