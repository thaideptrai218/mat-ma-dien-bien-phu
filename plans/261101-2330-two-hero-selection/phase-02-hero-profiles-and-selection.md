---
phase: 2
title: "Hồ sơ nhân vật + màn chọn + sprite/giọng theo hồ sơ"
status: completed
priority: P1
effort: "10h"
dependencies: [1]
---

# Phase 2: Hồ sơ nhân vật và màn chọn

## Overview
Thêm lớp `hero-profiles` làm nguồn duy nhất cho tên, sprite, chân dung, avatar Hệ Thống, bộ giọng và ghi đè câu thoại; thêm màn chọn trước phần mở đầu, khóa suốt lượt chơi.

## Requirements
- Functional: 2 hồ sơ `long`, `quang`; chọn một lần khi chơi mới, lưu vào save chiến dịch, đổi = chơi mới; mặc định an toàn (`long`) cho save cũ.
- Non-functional: khóa nội bộ giữ `quang` cho giọng nhân vật chính (key/speakerId/donor story-data không đổi); Phòng 2 chỉ qua wrap; file ≤200 dòng.

## Architecture
- `src/heroes/hero-profiles.js`: `{id, name, upperName, texture, portrait, systemAvatar, voices:{system,hero,narrator}, copy overrides}` + `getHero()/setHero()` + lưu vào `src/campaign/store`.
- `src/heroes/hero-select-screen.js` (+ css): 2 thẻ (Long / Quang), ảnh, mô tả ngắn, phím mũi tên/Enter, a11y.
- `src/audio/voice-id.js`: `VOICES` hiện cố định `'Long' → 'quang'`; đổi thành tra theo hồ sơ → khóa giọng như `system`, `system-v2`, `quang`, `narrator`, `narrator-lecture`. Mã clip = hash(giọng+nội dung) nên hai giọng Hệ Thống tự có mã khác.
- `src/game/character-atlas.js` + `character-animation.js`: `CHARACTER_TEXTURE` hằng số → theo hồ sơ; Quang dùng sprite cũ khôi phục từ git (trước `6ac4a35`), Long giữ sprite 16 cột + idle.
- `src/ui/visual-novel-speakers.js`: bảng người nói tra theo hồ sơ (tên, chân dung, avatar Hệ Thống = TL-36 cho Long, `game-emblem.png` cho Quang).
- `src/room-two/hero-name.js`: đọc tên từ hồ sơ thay vì cố định "Long".
- `src/campaign/framing.js`: đọc đoạn mở đầu từ hồ sơ.

## Related Code Files
- Create: `src/heroes/hero-profiles.js`, `hero-select-screen.js`, `hero-select.css`, `tests/hero-profiles.test.js`
- Modify: `src/audio/voice-id.js`, `src/audio/voice-line-player.js`, `src/game/character-atlas.js`, `src/game/character-animation.js`, `src/ui/visual-novel-speakers.js`, `src/campaign/framing.js`, `src/campaign/runtime.js`, `src/room-two/hero-name.js`, `src/room-two/narrative-voice.js`, `scripts/voice/tts-engines.mjs`, `scripts/build-voice-script.mjs`
- Restore (git): `assets/characters/quang*`, `assets/images/quang-portrait.png` từ commit trước `6ac4a35`

## Implementation Steps
1. Test trước: hồ sơ hợp lệ, chọn khóa, save cũ → mặc định, mã clip khác nhau giữa `system` và `system-v2`.
2. Khôi phục asset Quang từ git; xác nhận atlas Quang tải được (layout cũ ≠ 16 cột).
3. Viết `hero-profiles`, gắn vào `voice-id`, speakers, atlas, framing, `hero-name`.
4. Viết màn chọn; chèn vào luồng khởi động trước intro; lưu lựa chọn.
5. `tts-engines.mjs`: `VOICE_CONFIG` cho các khóa mới (mục phase 5).
6. `npm test`, `npm run build`, chạy thử trình duyệt: cả hai hồ sơ vào được Phòng 1.

## Success Criteria
- [x] Chọn Quang → sprite/chân dung Quang; chọn Long → sprite/chân dung Long.
- [x] Lựa chọn lưu, khóa, mở lại vẫn đúng; save cũ không hỏng.
- [x] Donor hash test (`room-two` bao) vẫn xanh.

## Risk Assessment
Sprite Quang cũ khác layout atlas → cần tách layout theo hồ sơ. `voice-id` dùng chung node/browser nên không import DOM. Rủi ro lệch hash donor: chỉ sửa import dòng bằng node, giữ CRLF.
