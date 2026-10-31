---
title: Âm thanh game — lồng tiếng Quang/Hệ Thống/Lời kể + SFX + môi trường
status: validated
created: 2026-10-31
validated: 2026-10-31
branch-base: feat/quang-system-guidance (từ feat/complete-five-room-campaign, PR #3)
---

# Kế hoạch âm thanh — Mật mã Điện Biên Phủ

Lồng tiếng toàn bộ lời nói của nhân vật (Quang, Hệ Thống, Lời kể) trong một đợt, thay cue tổng hợp đơn giản bằng bộ SFX có chủ đích, thêm nền môi trường theo từng phòng. **Không có nhạc nền.** Game vẫn phải chơi trọn bằng chữ khi tắt tiếng, thiếu file hoặc trình duyệt chặn audio.

## Giọng (đã chốt với người dùng)

| Vai | Engine | Nguồn | Khóa / hồ sơ |
| --- | --- | --- | --- |
| Hệ Thống | CapCut TTS `:8124` + FFmpeg preset **mạnh** | Cô Gái Hoạt Ngôn | `capcut:d1c749e2fea5836aed206f5bdfb2ac64` |
| Quang | CapCut TTS `:8124` | Thanh Niên Tự Tin | `capcut:8669555e4b5874c320ccab7085231c13` |
| Lời kể | OmniVoice `:8123` (clone zero-shot) | `voice-sources/260911-giong-doc-bai-giang.wav` | hồ sơ `131af5c2-8d45-4733-8568-9e10166695ee` (đã có transcript) |

Tool: `F:\AI-auto-generate-video` (CapCut bridge `POST /tts {text, voiceKey, speed}`; OmniVoice `POST /tts {text, refAudio, refText, speed}`). Không sửa repo tool; script gọi API từ repo game.

## Khối lượng — một đợt duy nhất (đếm từ code 2026-10-31)

| Nhóm | Câu | Ký tự | Ghi chú |
| --- | --- | --- | --- |
| Hệ Thống | 55 | ~6.900 | intro/GUIDE/ending 5 phòng + khung mở đầu |
| Quang hội thoại | 56 | ~6.200 | gồm lời kể VN Phòng 2 |
| Quang độc thoại `REACTIONS` | 123 | ~6.800 | câu ngắn khi bấm E vào vật |
| Quang suy luận sau tư liệu (`reflection`) | 36 | ~2.900 | Phòng 1/3/4 |
| Câu inline trong session/actions | ~30 | ~2.000 | chuyển vào content trước (phase 01) |
| Lời kể | 5 + ~12 đoạn khung | ~4.500 | Phòng 5, bảo tàng mở/kết |

Thực tế 332 câu (Quang 255 · Hệ Thống 59 · Lời kể 18, ~30.700 ký tự), ~35 phút audio, ~15–17 MB MP3 mono 64 kbps, tải lười theo phòng. Văn bản tư liệu (thư, báo cáo) **không** lồng tiếng.

## Phases

| # | Phase | Trạng thái | File |
| --- | --- | --- | --- |
| 1 | Kịch bản lồng tiếng + manifest có hash | **Xong** (332 câu) | [phase-01](phase-01-voice-script-and-manifest.md) |
| 2 | Sinh giọng TTS + chuẩn hóa phát âm | **Xong** (332/332, 0 lỗi) | [phase-02](phase-02-tts-generation-pipeline.md) |
| 3 | Giọng máy móc Hệ Thống + mastering | **Xong** (-17,3…-16,3 LUFS, 14 MB) | [phase-03](phase-03-system-voice-fx-and-mastering.md) |
| 4 | SFX + nền môi trường (không BGM) | **Xong** (33 SFX + 7 nền, 3,8 MB) | [phase-04](phase-04-sfx-and-ambience.md) |
| 5 | Tích hợp vào game (player, mixer, cài đặt) | **Xong** (154 test) | [phase-05](phase-05-game-audio-integration.md) |
| 6 | QA nghe duyệt + phát hành | Kỹ thuật xong, đã push `feat/system-voice-only`. Người dùng báo đã tự test (2026-10-31), **chưa có biên bản nghe duyệt từng câu**; ASR 45/332 câu; **chưa mở PR** | [phase-06](phase-06-listening-qa-and-delivery.md) |

Thứ tự: 1 → 2 → 3 (2–3 lặp theo phòng); 4 song song với 1–3; 5 cần manifest của 1 và vài file mẫu của 3; 6 cuối.

## Phụ thuộc chính

- Lời thoại đã ổn định trên nhánh `feat/quang-system-guidance` (sửa chữ sau khi sinh giọng → hash đổi → test báo “giọng cũ”, phải sinh lại câu đó).
- CapCut bridge + OmniVoice chạy được trên máy (GPU 6 GB hoặc `OMNIVOICE_DEVICE=cpu`).
- FFmpeg có sẵn (`ffmpeg` trong PATH, đã kiểm tra).

## Quyết định đã xác nhận (2026-10-31)

1. Dùng giọng CapCut trong bản phát hành công khai: **được** (người dùng xác nhận).
2. Preset Hệ Thống: **mạnh**.
3. 123 câu độc thoại `REACTIONS` (và suy luận/câu inline của Quang): **lồng tiếng ngay đợt 1**.
4. Lời đáp cuối Phòng 5 giữ “Tôi…” theo cốt truyện: **giữ**.
5. Nhạc nền: **không**; chỉ nền môi trường + SFX.
