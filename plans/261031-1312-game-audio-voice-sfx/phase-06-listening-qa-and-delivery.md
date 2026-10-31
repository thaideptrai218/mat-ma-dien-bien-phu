# Phase 06 — QA nghe duyệt + phát hành

## Context Links
- QA campaign hiện có: `plans/261031-campaign-link/reports/campaign-qa.md`.
- Manifest + CSV kịch bản (phase 01), log sinh giọng (phase 02), `credits.json` (phase 04).

## Overview
- Priority: P1. Status: chưa làm.
- Người dùng nghe duyệt từng câu; kiểm tra kỹ thuật; ghi nhận quyền sử dụng; phát hành cùng PR.

## Key Insights
- Lỗi TTS tiếng Việt thường là dấu thanh, số, tên riêng → cần người nghe thật, không chỉ đo kỹ thuật.
- Duyệt theo phòng để sửa nhỏ, sinh lại đúng câu (nhờ `voiceId` theo nội dung).

## Requirements
- Trang duyệt `plans/.../reports/voice-review.html` (tạo bằng script): mỗi dòng = chữ + player + ô đánh dấu Đạt/Sai + ghi chú phát âm.
- Kiểm tra kỹ thuật: `ffmpeg -af ebur128` trên mọi file; tổng dung lượng; không file im lặng/cắt cụt (`silencedetect`).
- Duyệt chơi thật: Chrome, Edge, Firefox (Windows) + một máy Safari/iOS nếu có; tai nghe và loa.

## Related Code Files
- Tạo: `scripts/build-voice-review-page.mjs`, `plans/261031-1312-game-audio-voice-sfx/reports/voice-qa.md`.
- Sửa: `docs/codebase-summary.md`, `docs/system-architecture.md` (mục âm thanh), `README.md` (bỏ câu “chưa có lồng tiếng hoặc TTS”, thêm hướng dẫn `npm run voice:*`), `docs/project-roadmap.md`.

## Implementation Steps
1. Tạo trang duyệt; người dùng đánh dấu câu sai → bổ sung bảng phát âm → sinh lại câu đó.
2. Chạy kiểm tra kỹ thuật, sửa file ngoài ngưỡng.
3. Chơi trọn museum → Phòng 1–5 → museum có tiếng; kiểm tra blur/reload/reset/tắt tiếng.
4. Cập nhật docs + credits; ghi rõ giọng TTS là tổng hợp, không phải người thật.
5. Commit theo nhóm (code / audio / docs), push nhánh, mở PR khi người dùng đồng ý.

## Todo List
- [ ] Trang duyệt + vòng sửa phát âm
- [ ] Kiểm tra loudness/silence/dung lượng
- [ ] Chơi trọn hành trình có tiếng trên ≥ 3 trình duyệt
- [ ] Docs + credits
- [ ] Commit/push/PR

## Success Criteria
- 100 % câu trong manifest được người dùng đánh dấu Đạt; không lỗi console; hành trình đầy đủ có tiếng; docs cập nhật.

## Risk Assessment
- Repo nặng lên ~15–20 MB → chấp nhận; nếu vượt, cân nhắc Git LFS cho `public/audio/`.

## Security Considerations
- Không commit `.cache/voice-raw/`, `.studio/`, mẫu giọng tham chiếu; kiểm tra `git status` trước commit.

## Next Steps
- Duy trì: mỗi lần sửa lời thoại, chạy `npm run voice:script` + sinh lại câu báo “giọng cũ” trước khi merge.
