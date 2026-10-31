# Phase 05 — Tích hợp vào game: phát giọng, mixer, cài đặt

## Context Links
- `src/audio/audio-controller.js` — một AudioContext dùng chung toàn campaign (`session-lifecycle.js` giữ shared audio), unlock chỉ sau thao tác người dùng, `setMode`, tắt khi blur/ẩn tab.
- Hội thoại: panel `dialogue` dùng chung (`src/room-one/ui-panels.js` — hiện mọi dòng cùng lúc) cho Phòng 1/3/4/5; Phòng 2 dùng visual novel từng dòng (`src/room-two/bao/ui/narrative-view.js`, donor — chỉ được đổi import).
- Khung bảo tàng: `src/campaign/framing.js`.

## Overview
- Priority: P1. Status: chưa làm. Cần manifest (phase 01) + vài file thành phẩm (phase 03) để thử.

## Key Insights
- Panel hiện mọi dòng cùng lúc → phát tuần tự từng dòng, tô sáng dòng đang đọc; người chơi vẫn đọc nhanh được và bấm nút như cũ (bấm = dừng giọng).
- Phòng 2 không được sửa thân renderer donor → nghe sự kiện từ adapter (`session.showNarrative`/intent điều hướng) hoặc `MutationObserver` trên `.vn-speaker` trong adapter `src/room-two/ui.js`; không đụng file donor ngoài import.
- Đi qua `AudioController` để kế thừa đúng hợp đồng: chưa unlock thì im, blur thì dừng, volume chung.

## Requirements
- Functional
  - `VoiceLinePlayer`: `playSequence(lines, {onLine})`, `stop()`, bỏ qua câu thiếu file (im lặng, không lỗi).
  - Ducking: khi giọng phát, nền môi trường giảm còn 30 % (ramp 200 ms).
  - Cài đặt: công tắc **Lồng tiếng**; 3 thanh âm lượng **Lời thoại / Hiệu ứng / Môi trường** (giữ thanh tổng hiện có); lưu như tùy chọn hiện tại (`audioEnabled`, `audioVolume`).
  - Nút **Nghe lại** trong panel thoại.
  - `playCue(kind)` ưu tiên mẫu SFX đã tải, rơi về synth nếu chưa có.
  - Nền theo phòng: crossfade 1,5 s khi đổi phòng.
- Non-functional: tải lười theo phòng (`fetch` + `decodeAudioData`, LRU ~40 buffer); không chặn khởi động game; giữ 100 % chơi được bằng chữ.

## Architecture
```
AudioController (sẵn có)
 ├─ master → analyser → destination
 ├─ bus.voice  (GainNode)  ← VoiceLinePlayer (src/audio/voice-line-player.js)
 ├─ bus.sfx    (GainNode)  ← SampleCueBank (src/audio/sample-cue-bank.js) | SynthVoices (fallback)
 └─ bus.ambience (GainNode)← AmbienceLoop (src/audio/ambience-loop.js)
voice-id.js (phase 01) → manifest.json → URL file
```
Session gọi `s.dialogue(...)` như cũ; helper dùng chung `speakDialogue(session, lines)` trong `src/audio/dialogue-voice.js` map dòng `"Người nói — chữ"` → `voiceIdFor` → phát.

## Related Code Files
- Tạo: `src/audio/voice-line-player.js`, `src/audio/sample-cue-bank.js`, `src/audio/ambience-loop.js`, `src/audio/dialogue-voice.js`, tests tương ứng.
- Sửa: `src/audio/audio-controller.js` (bus, snapshot thêm trạng thái voice), `src/room-one/ui-panels.js` (tô sáng dòng, nút Nghe lại, settings 3 thanh), `src/room-*/session.js` (gọi `speakDialogue` trong `dialogue()`, stop trong `close()`), `src/room-two/ui.js` hoặc `session.js` (nối VN), `src/campaign/framing.js` (đọc khung), lưu tùy chọn trong `save.js` từng phòng + `campaign/store.js`.

## Implementation Steps
1. Thêm bus + VoiceLinePlayer với AudioContext giả trong test (mẫu như `tests/audio-controller.test.js`).
2. `speakDialogue` + nối vào `dialogue()`/`close()` của 4 session.
3. Panel: class `is-speaking` trên dòng hiện tại, nút Nghe lại, aria-live tắt khi đang đọc (tránh trùng screen reader).
4. Phòng 2: nối theo dòng VN qua adapter.
5. SampleCueBank + AmbienceLoop + ducking.
6. Cài đặt 3 thanh + công tắc, migrate save cũ (mặc định bật lồng tiếng khi đã bật âm thanh).
7. Kiểm tra campaign: đổi phòng không rò source, `destroy()` dọn sạch.

## Todo List
- [ ] Bus + VoiceLinePlayer + test
- [ ] speakDialogue cho 4 session + framing
- [ ] Phòng 2 adapter
- [ ] SFX bank + ambience + ducking
- [ ] Settings + save migration
- [ ] Test lifecycle (không rò AudioNode)

## Success Criteria
- Mọi dialogue có file thì tự đọc đúng thứ tự, dừng khi đóng panel/blur; thiếu file vẫn chơi bình thường; `npm test` + build đạt; snapshot audio cho thấy `activeSources` về 0 sau khi đóng.

## Risk Assessment
- Autoplay bị chặn → chỉ phát sau `unlockFromGesture` (đã có), hiện gợi ý “Bật âm thanh để nghe lồng tiếng”.
- Giọng chồng nhau khi mở panel liên tiếp → player một kênh, `stop()` trước mỗi chuỗi mới, token như các panel hiện có.
- Đụng donor Phòng 2 → chỉ adapter; test hash donor phải còn xanh.

## Security Considerations
- Chỉ tải audio cùng origin; không eval nội dung manifest; ô suy nghĩ riêng không bao giờ đi vào TTS.

## Next Steps
- Phase 06 QA toàn hành trình có tiếng.
