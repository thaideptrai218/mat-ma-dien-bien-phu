---
phase: 4
title: "Nội dung Quang / Long + avatar TL-36"
status: completed
priority: P1
effort: "10h"
dependencies: [3]
---

# Phase 4: Nội dung hai nhân vật

## Overview
Viết lại phần giới thiệu và các câu phản ứng theo hồ sơ; thêm avatar TL-36 cho Hệ Thống route Long.

## Requirements
- **Quang** (văn bản user cung cấp, trong brainstorm): sinh viên trẻ năng động, yêu công nghệ/giải đố/bí ẩn, lịch sử mới chỉ là mốc để nhớ. Phần còn lại của route Quang giữ nội dung cũ (nay đã tôi).
- **Long**: học sinh hư, thờ ơ với học; vài câu phản ứng ngắn sau mỗi phòng (1-2 câu/phòng) cho thấy dần đổi thái độ; kết Phòng 5 ngộ ra ý nghĩa của việc cố gắng học. Giọng điệu không giáo điều, đúng sự kiện lịch sử.
- Avatar Hệ Thống route Long = ảnh TL-36; credit "Wrxdie" trong README và màn giới thiệu/chọn nhân vật.

## Architecture
Nội dung dùng chung ở `content.js` mỗi phòng; phần khác biệt đặt trong `hero-profiles` dưới dạng `copy` ghi đè theo khóa (`intro`, `afterRoom1..4`, `ending`), thay vì hai bản file phòng. Câu giống nhau giữa 2 route dùng chung clip (mã theo nội dung).

## Related Code Files
- Create: `src/heroes/hero-copy-long.js`, `src/heroes/hero-copy-quang.js`, `assets/images/system-avatar-tl36.png` (ảnh user, nén lại), `tests/hero-copy.test.js`
- Modify: `src/campaign/framing.js`, `src/room-*/content.js` (điểm gắn câu phản ứng), `src/room-five/content.js` (kết), `src/ui/visual-novel-speakers.js`, `README.md`, intro/select screen

## Implementation Steps
1. Soạn bản nháp Long (intro, 4 câu phản ứng, kết) → **user duyệt bản nháp** trước khi thu âm.
2. Gắn `copy` theo hồ sơ vào khung và từng phòng; Phòng 2 qua wrap.
3. Thêm avatar TL-36 vào asset (nén ≤ ~300 KB, cần xác nhận không lộ thông tin riêng ngoài chữ ký tác giả); credit trong README và UI.
4. Test: mỗi hồ sơ trả đủ khóa copy, không câu nào rỗng, không còn tên sai (Long trong route Quang và ngược lại), TTS text không còn chữ số/gạch/chữ hoa liền (quy tắc có sẵn).

## Success Criteria
- [ ] User duyệt văn bản Long (bản nháp do Claude viết, đã thu âm; sửa lời → `npm run voice:script` + thu lại câu đổi).
- [x] Hai route đọc đúng tên/giới thiệu; không lẫn tên.
- [x] Credit Wrxdie hiển thị; ảnh avatar hiển thị đúng ở khung Hệ Thống route Long.

## Risk Assessment
Văn phong giáo huấn quá tay → giữ ngắn, để hành động thể hiện. Ảnh avatar lớn (2.6 MB gốc) → nén. Gộp với plan gated-rooms nếu cùng chạm `content.js`.
