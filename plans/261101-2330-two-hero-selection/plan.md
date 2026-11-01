---
title: "Chọn nhân vật Long / Quang"
description: "Màn chọn nhân vật, hồ sơ nhân vật tham số hóa nội dung + giọng + sprite; tao→tôi; Long có hành trình học sinh hư; Hệ Thống v2 + avatar TL-36 cho route Long."
status: completed
priority: P1
effort: 40h
branch: feat/system-voice-only
tags: [gameplay, narrative, voice, campaign]
created: 2026-11-01
blockedBy: []
blocks: []
---

# Chọn nhân vật Long / Quang

Nguồn thiết kế: [brainstorm](../reports/brainstorm-261101-2321-two-hero-selection.md). Không dùng được `ck` CLI (chưa cài) → plan viết tay.

## Phases

| # | Phase | Status |
|---|---|---|
| 1 | [Gộp nhánh sprite-gait](phase-01-merge-gait-branch.md) | completed |
| 2 | [Hồ sơ nhân vật + màn chọn + sprite/giọng theo hồ sơ](phase-02-hero-profiles-and-selection.md) | completed |
| 3 | [tao → tôi](phase-03-tao-to-toi.md) | completed |
| 4 | [Nội dung Quang / Long + avatar TL-36](phase-04-hero-content.md) | completed |
| 5 | [Thu âm: v2, CapCut, mck, narrator](phase-05-voice-render.md) | completed |
| 6 | [Test, duyệt trình duyệt, review](phase-06-verify-and-review.md) | completed |

Thứ tự bắt buộc 1→2→3→4→5→6; mỗi phase commit riêng, chỉ push khi user yêu cầu.

## Quyết định đã chốt
- Phương án A: một bộ nội dung có tham số theo hồ sơ (không nhân đôi file phòng).
- Chọn nhân vật trước phần mở đầu, lưu + khóa suốt lượt chơi.
- Long: vài câu phản ứng giữa các phòng + kết Phòng 5 ngộ ra ý nghĩa học tập. Quang: giới thiệu do user cung cấp (trong brainstorm).
- Avatar TL-36: user có quyền; dùng nguyên ảnh + credit "Wrxdie".
- Hệ Thống route Long = he-thong-v2 (`af29261d`), robot FX mặc định (cờ đổi được).
- Route Quang: CapCut "Cô Gái Hoạt Ngôn" + robot "mạnh"; Quang = mck; narrator "bài giảng" 1.0. Route Long: narrator kiếm lai 1.05x.

## Phụ thuộc / chồng chéo
- Plan `261031-2000-gated-rooms-tactile-puzzles` (pending, cùng nhánh) cũng sửa nội dung 5 phòng → làm tuần tự, gộp trước khi bắt đầu phase 4 nếu nó chạm `content.js`.
- Phòng 2 donor `src/room-two/bao/**` khóa hash CRLF: chỉ đổi qua wrap (`hero-name.js`, `system-guidance.js`, `narrative-voice.js`).

## Rủi ro chính
Thu âm nặng (~152 câu v2 + mọi câu đổi chữ ×2 route); v2 nhân bản từ lời hát; repo PUBLIC (credit ảnh, không commit `.studio/.cache/reference`); các mục chưa kiểm chứng cũ (Phòng 2 trình duyệt, nghe 65 clip, code-reviewer).
