# Phase 01 — Kịch bản lồng tiếng + manifest có hash

## Context Links
- Lời thoại nguồn: `src/room-{one,three,four,five}/content.js` (`INTRO`, `CAMPAIGN_INTRO`, `GUIDE`, `ENDING`, `CAMPAIGN_ENDING`, `REACTIONS`, `REFLECTION_SCRIPT`), `src/room-two/system-guidance.js` (beats + `PUZZLE_GUIDE`), `src/campaign/framing.js` (khung bảo tàng), `src/room-five/content.js` (`MUSEUM_RETURN`, `CLOSING_LINE`, `DOOR_MESSAGE`).
- Quy ước xưng hô: `docs/codebase-summary.md` mục “Hợp đồng cần giữ”.

## Overview
- Priority: P1 (mọi phase sau dùng manifest này). Status: **xong 2026-10-31** — 332 câu, `npm run voice:script`.
- Trích tự động mọi câu cần lồng tiếng từ code thành một manifest duy nhất; không chép tay kịch bản.

## Key Insights
- Câu thoại nằm rải trong nhiều module và có biến thể campaign/standalone trùng chữ → khử trùng theo `(speaker, text)`.
- Text có thể đổi sau này → id phải gắn với nội dung: `voiceId = FNV-1a 64-bit(voice + "\u0000" + NFC text)` (16 hex, `src/audio/voice-id.js`). Đổi chữ = id mới = biết ngay câu nào phải sinh lại.
- Khung bảo tàng (`framing.js`) đang là chuỗi `"Hệ Thống: …"`/`"Quang: …"` → parser tách tiền tố người nói; đoạn không tiền tố = Lời kể.

## Requirements
- Functional: manifest JSON gồm `{id, room, group, speaker, voice, text, ttsText, file}`; mọi nhóm thuộc một đợt duy nhất (gồm `REACTIONS`, `reflection` của tư liệu và câu inline).
- Chuyển các câu Quang đang viết thẳng trong `session.js`/`actions.js` (vd. “Rương đã mở…”, “Bốn giấy tờ được xếp chung…”, câu đèn/túi ở Phòng 5) vào `content.js` của phòng (`LINES`), để extractor thấy và chữ chỉ có một nơi.
- Non-functional: chạy bằng `node`, không cần mạng; deterministic (cùng code → cùng manifest).

## Architecture
`scripts/build-voice-script.mjs` → import các module nội dung → chuẩn hóa → `public/audio/voice/manifest.json` + `plans/.../reports/voice-script.csv` (để người dùng đọc duyệt).
Runtime chỉ cần map `voiceId → file`; hàm `voiceIdFor(speaker, text)` dùng chung giữa script và game (`src/audio/voice-id.js`, Web Crypto/hash đồng bộ nhỏ như FNV-1a 64-bit nếu muốn tránh async — chọn FNV-1a để chạy cả Node lẫn trình duyệt không cần `await`).

## Related Code Files
- Tạo: `scripts/build-voice-script.mjs`, `src/audio/voice-id.js`, `tests/voice-manifest.test.js`.
- Sửa: `src/room-*/content.js` (thêm `LINES`) và `session.js`/`actions.js` tương ứng — chỉ chuyển chỗ câu inline, không đổi chữ.
- Đọc: các file nội dung ở trên.

## Implementation Steps
1. Viết `voice-id.js` (FNV-1a 64-bit hex, NFC) + test cố định vài giá trị.
2. Chuyển câu inline của Quang vào `LINES` trong content từng phòng (không đổi chữ; test hiện có phải xanh).
3. Viết script trích câu: duyệt export dạng mảng `{speaker,text}`, `GUIDE`, `LINES`, beats Phòng 2 (`speakerId` → tên), `REACTIONS`, `reflection` trong `documents.js`/`letter-document.js`/`nava-context.js`, framing (tách tiền tố).
4. Gán `voice`: `system` / `quang` / `narrator` theo speaker (`Lời kể` → narrator).
5. Sinh `ttsText` qua bảng phát âm (phase 02) — ở phase này để `ttsText = text`.
6. Xuất manifest + CSV; thêm `npm run voice:script`.
7. Test: mọi câu thoại trong content có id trong manifest (test “giọng cũ/thiếu” — chạy cả trong `npm test`, cho phép file audio chưa tồn tại nhưng báo danh sách).

## Todo List
- [x] `src/audio/voice-id.js` + test
- [x] Chuyển câu inline vào `LINES` (Phòng 1/3/4/5; câu thông báo Phòng 5 vào `NOTICES`, không lồng tiếng)
- [x] `scripts/build-voice-script.mjs` + `scripts/voice/{collect-voice-lines,voice-manifest,tts-pronunciation}.mjs`
- [x] `public/audio/voice/manifest.json` + `reports/voice-script.csv` (có cột Câu đọc TTS, Đạt?, Ghi chú)
- [x] `tests/voice-manifest.test.js` (manifest khớp nội dung, TTS không còn số/ký hiệu, không còn chuỗi inline trong `dialogue()`)

## Success Criteria
- Manifest liệt kê đủ ~320 câu, không trùng id; sửa một chữ trong content làm test chỉ ra đúng câu đó.

## Risk Assessment
- Bỏ sót câu ghép động (vd. `successText` của donor Phòng 2 được nối vào dialogue) → quyết định: `successText` là lời kể giao diện, không lồng tiếng; chỉ lồng `PUZZLE_GUIDE`.
- Chuỗi inline sót lại trong session → test so khớp: mọi chuỗi truyền vào `dialogue()` phải có id trong manifest (trừ thông báo lỗi giao diện).

## Security Considerations
- Không có dữ liệu cá nhân; ô suy nghĩ riêng Phòng 5 không bao giờ vào manifest.

## Next Steps
- Phase 02 dùng manifest để sinh giọng.
