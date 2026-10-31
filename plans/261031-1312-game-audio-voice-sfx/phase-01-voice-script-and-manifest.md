# Phase 01 — Kịch bản lồng tiếng + manifest có hash

## Context Links
- Lời thoại nguồn: `src/room-{one,three,four,five}/content.js` (`INTRO`, `CAMPAIGN_INTRO`, `GUIDE`, `ENDING`, `CAMPAIGN_ENDING`, `REACTIONS`, `REFLECTION_SCRIPT`), `src/room-two/system-guidance.js` (beats + `PUZZLE_GUIDE`), `src/campaign/framing.js` (khung bảo tàng), `src/room-five/content.js` (`MUSEUM_RETURN`, `CLOSING_LINE`, `DOOR_MESSAGE`).
- Quy ước xưng hô: `docs/codebase-summary.md` mục “Hợp đồng cần giữ”.

## Overview
- Priority: P1 (mọi phase sau dùng manifest này). Status: chưa làm.
- Trích tự động mọi câu cần lồng tiếng từ code thành một manifest duy nhất; không chép tay kịch bản.

## Key Insights
- Câu thoại nằm rải trong nhiều module và có biến thể campaign/standalone trùng chữ → khử trùng theo `(speaker, text)`.
- Text có thể đổi sau này → id phải gắn với nội dung: `voiceId = sha1(speaker + "\u0000" + text.normalize("NFC")).slice(0, 12)`. Đổi chữ = id mới = biết ngay câu nào phải sinh lại.
- Khung bảo tàng (`framing.js`) đang là chuỗi `"Hệ Thống: …"`/`"Quang: …"` → parser tách tiền tố người nói; đoạn không tiền tố = Lời kể.

## Requirements
- Functional: manifest JSON gồm `{id, room, group, speaker, voice, text, ttsText, file}`; nhóm `REACTIONS` đánh dấu `wave: 2`.
- Non-functional: chạy bằng `node`, không cần mạng; deterministic (cùng code → cùng manifest).

## Architecture
`scripts/build-voice-script.mjs` → import các module nội dung → chuẩn hóa → `public/audio/voice/manifest.json` + `plans/.../reports/voice-script.csv` (để người dùng đọc duyệt).
Runtime chỉ cần map `voiceId → file`; hàm `voiceIdFor(speaker, text)` dùng chung giữa script và game (`src/audio/voice-id.js`, Web Crypto/hash đồng bộ nhỏ như FNV-1a 64-bit nếu muốn tránh async — chọn FNV-1a để chạy cả Node lẫn trình duyệt không cần `await`).

## Related Code Files
- Tạo: `scripts/build-voice-script.mjs`, `src/audio/voice-id.js`, `tests/voice-manifest.test.js`.
- Đọc: các file nội dung ở trên. Không sửa nội dung.

## Implementation Steps
1. Viết `voice-id.js` (FNV-1a 64-bit hex, NFC) + test cố định vài giá trị.
2. Viết script trích câu: duyệt export dạng mảng `{speaker,text}`, `GUIDE`, beats Phòng 2 (`speakerId` → tên), REACTIONS (speaker `Quang`, `wave: 2`), framing (tách tiền tố).
3. Gán `voice`: `system` / `quang` / `narrator` theo speaker (`Lời kể` → narrator).
4. Sinh `ttsText` qua bảng phát âm (phase 02) — ở phase này để `ttsText = text`.
5. Xuất manifest + CSV; thêm `npm run voice:script`.
6. Test: mọi câu thoại trong content có id trong manifest (test “giọng cũ/thiếu” — chạy cả trong `npm test`, cho phép file audio chưa tồn tại nhưng báo danh sách).

## Todo List
- [ ] `src/audio/voice-id.js` + test
- [ ] `scripts/build-voice-script.mjs`
- [ ] Manifest + CSV duyệt
- [ ] `tests/voice-manifest.test.js`

## Success Criteria
- Manifest liệt kê đủ ~119 câu đợt 1 + 123 câu đợt 2, không trùng id; sửa một chữ trong content làm test chỉ ra đúng câu đó.

## Risk Assessment
- Bỏ sót câu ghép động (vd. `successText` của donor Phòng 2 được nối vào dialogue) → quyết định: `successText` là lời kể giao diện, không lồng tiếng; chỉ lồng `PUZZLE_GUIDE`.
- Chuỗi trong session (vd. câu khi bấm đèn/túi ở Phòng 5) không nằm trong content → gom vào REACTIONS-like nhóm `inline` đợt 2 hoặc chuyển vào content.js trước.

## Security Considerations
- Không có dữ liệu cá nhân; ô suy nghĩ riêng Phòng 5 không bao giờ vào manifest.

## Next Steps
- Phase 02 dùng manifest để sinh giọng.
