# Phase 04 — Hiệu ứng âm thanh (SFX) + nền môi trường

## Context Links
- Engine hiện có: `src/audio/audio-controller.js` (mode exploration/dialogue/inactive, mute khi mất focus), `src/audio/synth-voices.js` (cue tổng hợp: `paper, reveal, success, error, weight, static, chain, fold, unlock`, bước chân, nền 58 Hz + gió).
- Nơi gọi cue: `s.audio.playCue(...)` trong `src/room-*/actions.js`, intent `play-cue` của Phòng 2.

## Overview
- Priority: P2. Status: chưa làm. Làm song song phase 01–03.
- Giữ cue tổng hợp làm phương án dự phòng; thêm mẫu âm thanh thật cho các khoảnh khắc chính và nền riêng từng phòng. **Không làm nhạc nền (BGM)** — người dùng đã chốt.

## Key Insights
- Đề tài chiến tranh, đối tượng học sinh/sinh viên → âm chiến trường phải xa, nén, tiết chế; không tiếng kêu đau, không bạo lực chi tiết.
- Nguồn trong `F:\AI-auto-generate-video\scripts\download-sfx.ts` lấy từ myinstants.com (bản quyền không rõ) → **không dùng** cho game phát hành. Dùng nguồn CC0/giấy phép rõ: Kenney (CC0), Freesound lọc CC0, Pixabay Sound (Pixabay Content License), hoặc tự tổng hợp Web Audio.
- Mỗi file ghi nguồn + giấy phép trong `public/audio/sfx/credits.json`.

## Danh sách SFX
| Nhóm | Cue | Dùng ở |
| --- | --- | --- |
| Hệ Thống | `system-chime` (ting số ngắn), `system-glitch` (nhiễu 150 ms khi xuất hiện lần đầu) | trước mỗi lượt Hệ Thống, khung mở đầu |
| Giao diện | `ui-advance`, `ui-open`, `ui-close`, `hint`, `notebook` | panel, nút Tiếp lời, gợi ý, sổ tay |
| Tương tác | `paper` (thay), `drawer-open`, `chest-unlock`, `chest-open`, `door-open`, `card-place`, `map-unfold`, `typewriter`, `morse-beep`, `radio-static` | hồ sơ, ngăn kéo 2413, rương, cửa, thẻ, bản đồ gấp, điện báo/điện đài |
| Kết quả | `success` (thay), `error` (thay), `fragment-get` (hợp âm lấp lánh), `painting-complete`, `door-final-swell` | giải đúng/sai, nhận mảnh I–IV, Phòng 5 |
| Chuyển cảnh | `time-warp` (whoosh + sáng), `room-transition` | chạm tranh ở bảo tàng, qua cửa |
| Bước chân | `step-earth`, `step-wood`, `step-stone` (3 biến thể ngẫu nhiên mỗi loại) | theo mặt sàn từng phòng |

## Nền môi trường (loop 30–60 s, crossfade)
| Nơi | Chất liệu |
| --- | --- |
| Bảo tàng | tiếng phòng trưng bày yên, điều hòa xa |
| Hầm Đờ Cát (mở đầu) | rung đất trầm, vọng xa bị nén |
| Phòng 1 | hầm, đèn dầu lách tách, gió khe |
| Phòng 2 | phòng tham mưu, đồng hồ tích tắc, điện đài rè nhẹ |
| Phòng 3 | rừng đêm, côn trùng, bánh xe đạp thồ/cuốc xẻng xa |
| Phòng 4 | mưa, pháo rất xa và thưa (tiết chế), gió đồi |
| Phòng 5 | tĩnh, gió nhẹ, tiếng “ngân” rất thấp (không giai điệu) |

## Requirements
- OGG/MP3 mono (nền: stereo 96 kbps), mỗi SFX ≤ 50 KB, mỗi nền ≤ 600 KB; tổng SFX + nền ≤ 6 MB.
- Chuẩn hóa: SFX đỉnh -6 dBFS; nền -30 LUFS (nằm dưới giọng nói).

## Related Code Files
- Tạo: `public/audio/sfx/*.mp3`, `public/audio/ambience/*.mp3`, `public/audio/sfx/credits.json`, `scripts/master-sfx.mjs`.
- Sửa (phase 05): `src/audio/synth-voices.js` giữ làm dự phòng.

## Implementation Steps
1. Chốt danh sách trên với người dùng (bỏ bớt nếu YAGNI).
2. Tìm/chọn file CC0, ghi credits; cái nào không có thì tổng hợp (chime, morse, glitch dễ tự tạo bằng Web Audio/FFmpeg `sine`/`anoisesrc`).
3. Cắt, fade, chuẩn hóa bằng `scripts/master-sfx.mjs`.
4. Nghe thử từng phòng với giọng nói đặt lên trên.

## Todo List
- [x] Chốt danh sách SFX/nền (giữ nguyên bảng trên; không BGM — người dùng đã chốt)
- [x] Thu thập + credits (Kenney CC0: Interface Sounds, Impact Sounds, RPG Audio, UI Audio; phần còn lại tự tổng hợp bằng FFmpeg → `public/audio/sfx/credits.json`)
- [x] Master + kiểm tra dung lượng (`npm run audio:sfx` = `scripts/build-sfx.mjs` + `scripts/sfx/`; 33 SFX + 7 nền, tổng 3,81 MB; bảng đo `reports/sfx-qa.md`; chỉ mục `public/audio/sfx/manifest.json`)
- [ ] Nghe thử từng phòng với giọng nói đặt lên trên (bước 4 — cần tai người, làm cùng phase 06)

## Success Criteria
- Mỗi cue trong bảng có file + credit hợp lệ; tổng dung lượng trong ngân sách; người dùng duyệt không khí từng phòng.

## Risk Assessment
- Giấy phép không rõ → loại, thay bằng tổng hợp.
- Âm chiến trường gây khó chịu → giữ mức rất thấp, có thanh “Môi trường” riêng để tắt.

## Security Considerations
- Không tải SFX từ nguồn chạy script lạ; tải tay, quét tên/định dạng, chỉ giữ audio.

## Next Steps
- Phase 05 nối cue mới vào `playCue` và mixer.
