---
phase: 5
title: "Thu âm: he-thong-v2, CapCut, mck, narrator"
status: completed
priority: P1
effort: "10h"
dependencies: [4]
---

# Phase 5: Thu âm

## Overview
Tạo audio cho mọi câu mới/đổi chữ ở cả hai route; chọn đúng bộ giọng theo hồ sơ.

## Requirements
- Route Long: Hệ Thống = OmniVoice profile `he-thong-v2` (`af29261d`), robot FX mặc định (cờ để đổi sang thô); Long = mck; narrator = kiếm lai (`628a71fc`) 1.05x.
- Route Quang: Hệ Thống = CapCut `Cô Gái Hoạt Ngôn` + robot "mạnh" (khôi phục từ `dd10dfb` nếu câu không đổi); Quang = mck; narrator = "bài giảng" (`131af5c2`) 1.0.
- Không commit hồ sơ giọng / reference / `.studio` / `.cache`.

## Related Code Files
- Modify: `scripts/voice/tts-engines.mjs` (`VOICE_CONFIG` nhiều khóa), `scripts/generate-voice-lines.mjs`, `scripts/master-voice-lines.mjs`, `scripts/build-voice-script.mjs`
- Output: `public/audio/voice/*.mp3`, `manifest.json`

## Implementation Steps
1. **Nghe thử v2** (5-8 câu Hệ Thống thật) ở cả bản thô và robot; user chọn, chốt cờ mặc định. Nếu v2 không ổn định, báo user trước khi thu hàng loạt.
2. Bật OmniVoice (`services/omnivoice_server.py`, cổng 8123); bật CapCut bridge cho route Quang.
3. `build-voice-script` → danh sách đầy đủ; `generate-voice-lines --voice=<khóa>` theo từng giọng; `master-voice-lines`.
4. Kiểm tra: đủ clip (`still missing 0`), thời lượng hợp lý, clip trùng giữa route dùng chung.
5. Dọn clip cũ không còn dùng (ids mồ côi); xác nhận kích thước repo.

## Success Criteria
- [x] `voice:master` báo thiếu 0 cho cả hai route.
- [ ] User nghe lại mẫu mỗi giọng (v2, CapCut, narrator hai bản) và chấp nhận (Claude chỉ kiểm tra kỹ thuật: thiếu 0, tốc độ đọc, không clip rỗng; chưa ai nghe).
- [x] Test manifest khớp lời thoại xanh.

## Risk Assessment
v2 nhân bản từ lời hát → dễ lệch cao độ/nhịp, kiểm tra từng đợt nhỏ. CapCut bridge có thể không bật lại được → câu Hệ Thống route Quang chưa đổi dùng lại clip cũ, câu đổi chữ chờ bridge. Dung lượng mp3 tăng gần gấp đôi.
