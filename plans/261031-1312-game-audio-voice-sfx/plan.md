---
title: Âm thanh game — lồng tiếng Quang/Hệ Thống/Lời kể + SFX + môi trường
status: proposed
created: 2026-10-31
branch-base: feat/quang-system-guidance (từ feat/complete-five-room-campaign, PR #3)
---

# Kế hoạch âm thanh — Mật mã Điện Biên Phủ

Lồng tiếng toàn bộ hội thoại (Quang, Hệ Thống, Lời kể), thay cue tổng hợp đơn giản bằng bộ SFX có chủ đích, thêm nền môi trường theo từng phòng. Game vẫn phải chơi trọn bằng chữ khi tắt tiếng, thiếu file hoặc trình duyệt chặn audio.

## Giọng (đã chốt với người dùng)

| Vai | Engine | Nguồn | Khóa / hồ sơ |
| --- | --- | --- | --- |
| Hệ Thống | CapCut TTS `:8124` + FFmpeg “máy móc” | Cô Gái Hoạt Ngôn | `capcut:d1c749e2fea5836aed206f5bdfb2ac64` |
| Quang | CapCut TTS `:8124` | Thanh Niên Tự Tin | `capcut:8669555e4b5874c320ccab7085231c13` |
| Lời kể | OmniVoice `:8123` (clone zero-shot) | `voice-sources/260911-giong-doc-bai-giang.wav` | hồ sơ `131af5c2-8d45-4733-8568-9e10166695ee` (đã có transcript) |

Tool: `F:\AI-auto-generate-video` (CapCut bridge `POST /tts {text, voiceKey, speed}`; OmniVoice `POST /tts {text, refAudio, refText, speed}`). Không sửa repo tool; script gọi API từ repo game.

## Khối lượng (đếm từ code 2026-10-31)

| Nhóm | Câu | Ký tự | Ghi chú |
| --- | --- | --- | --- |
| Hệ Thống | 55 | ~6.900 | intro/GUIDE/ending 5 phòng + khung mở đầu |
| Quang hội thoại | 56 | ~6.200 | gồm lời kể VN Phòng 2 |
| Quang độc thoại (REACTIONS) | 123 | ~6.800 | câu ngắn khi bấm E vào vật — đợt 2 |
| Lời kể | 5 + ~12 đoạn khung | ~4.500 | Phòng 5, bảo tàng mở/kết |

Ước lượng ~27 phút audio, ~10–13 MB MP3 mono 48–64 kbps, tải lười theo phòng. Tư liệu đọc (thư, báo cáo) **không** lồng tiếng.

## Phases

| # | Phase | Trạng thái | File |
| --- | --- | --- | --- |
| 1 | Kịch bản lồng tiếng + manifest có hash | Chưa làm | [phase-01](phase-01-voice-script-and-manifest.md) |
| 2 | Sinh giọng TTS + chuẩn hóa phát âm | Chưa làm | [phase-02](phase-02-tts-generation-pipeline.md) |
| 3 | Giọng máy móc Hệ Thống + mastering | Preset mẫu đã có | [phase-03](phase-03-system-voice-fx-and-mastering.md) |
| 4 | SFX + nền môi trường | Chưa làm | [phase-04](phase-04-sfx-and-ambience.md) |
| 5 | Tích hợp vào game (player, mixer, cài đặt) | Chưa làm | [phase-05](phase-05-game-audio-integration.md) |
| 6 | QA nghe duyệt + phát hành | Chưa làm | [phase-06](phase-06-listening-qa-and-delivery.md) |

Thứ tự: 1 → 2 → 3 (2–3 lặp theo phòng); 4 song song với 1–3; 5 cần manifest của 1 và vài file mẫu của 3; 6 cuối.

## Phụ thuộc chính

- Lời thoại đã ổn định trên nhánh `feat/quang-system-guidance` (sửa chữ sau khi sinh giọng → hash đổi → test báo “giọng cũ”, phải sinh lại câu đó).
- CapCut bridge + OmniVoice chạy được trên máy (GPU 6 GB hoặc `OMNIVOICE_DEVICE=cpu`).
- FFmpeg có sẵn (`ffmpeg` trong PATH, đã kiểm tra).
- Quyết định quyền sử dụng giọng CapCut khi phát hành công khai (xem câu hỏi mở).

## Câu hỏi mở

1. Điều khoản CapCut TTS có cho dùng giọng trong sản phẩm phát hành công khai (Vercel) không? Nếu không chắc: dùng OmniVoice clone từ mẫu có quyền, hoặc chỉ dùng nội bộ/lớp học.
2. Chọn preset Hệ Thống nào (nhẹ / vừa / mạnh) — file mẫu ở phase 3.
3. Lồng tiếng 123 câu độc thoại REACTIONS ngay đợt 1, hay để đợt 2?
4. Lời đáp cuối của Quang ở Phòng 5 giữ “Tôi…” theo cốt truyện (đã giữ) — xác nhận.
5. Có cần nhạc nền (BGM) không, hay chỉ nền môi trường + SFX (đề xuất: chỉ môi trường, YAGNI)?
