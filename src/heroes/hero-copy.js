// Story text that differs per hero. Everything else is shared content written with the canonical name "Long".
// Long: a student who skips lessons and slowly learns why studying matters (told through the intro, a short
// reaction after rooms 1, 3 and 4, and the final reflection). Quang: the original, curious engineering student.
import {activeHero} from './hero-profiles.js';

// First museum frame (three paragraphs; the last one is the shared "touch the glass" beat).
const TOUCH_GLASS = 'Long đặt tay lên mặt kính trước bức ảnh. Một quầng sáng bỗng tràn qua đầu ngón tay.';

const COPY = Object.freeze({
  long: Object.freeze({
    intro: [
      'Long là một cậu học sinh nổi tiếng hay trốn tiết, ngại làm bài và luôn có sẵn một lý do cho mọi lần chưa học. Cậu thích game, thích lướt điện thoại; còn với Long, lịch sử chỉ là những mốc thời gian khô khan mà thầy cô bắt phải học thuộc.',
      'Hôm nay lớp được đi tham quan Bảo tàng Chiến thắng Điện Biên Phủ. Long đi theo cho đủ mặt, đứng cuối hàng và mắt vẫn dán vào màn hình. Cho đến khi cậu dừng lại trước bức ảnh ghi khoảnh khắc lá cờ tung bay trên nóc hầm, và chợt tự hỏi: nếu có thể đến tận nơi, mình sẽ hiểu những điều ấy như thế nào?',
      TOUCH_GLASS,
    ],
    // Appended to each room's campaign ending, so the hero's attitude changes room by room.
    afterRoom: {
      1: [
        {speaker: 'Long', text: 'Tôi vừa đọc xong một lá thư mà không hề buồn ngủ. Lạ thật.'},
        {speaker: 'Hệ Thống', text: 'Ký Chủ đã đọc đến hết từng tài liệu. Đó là một khởi đầu tốt.'},
      ],
      3: [
        {speaker: 'Long', text: 'Họ gùi gạo, đẩy xe đạp đi cả tháng trời, vậy mà tôi còn than đi học xa.'},
        {speaker: 'Hệ Thống', text: 'Ký Chủ vừa tự đặt câu hỏi cho chính mình. Hãy giữ lấy thói quen ấy.'},
      ],
      4: [
        {speaker: 'Long', text: 'Mỗi ngày tháng đều là một quyết định của con người. Học thuộc thôi thì chưa phải là hiểu.'},
        {speaker: 'Hệ Thống', text: 'Ký Chủ đã bắt đầu hiểu, không chỉ còn ghi nhớ.'},
      ],
    },
    // Room 5: inserted before the hero's answer, and a closing paragraph back in the museum.
    reflection: [
      {speaker: 'Lời kể', text: 'Long nhớ lại những tiết học cậu bỏ dở, những bài sử cậu chép vội của bạn rồi quên ngay. Giờ cậu mới hiểu: những ngày tháng ấy là tên người, là máu xương, là cái giá của những buổi sáng yên bình mà cậu vẫn thản nhiên bước qua. Cố gắng học không chỉ để qua một bài kiểm tra, mà để xứng đáng với những người đã không có cơ hội được ngồi trong lớp.'},
    ],
    museumReturn: [
      'Tối hôm đó về nhà, lần đầu tiên Long mở sách sử ra trước khi mở máy. Cậu không còn học để đối phó với thầy cô nữa; cậu học để hiểu, để nhớ, và để không phụ những điều đã được đánh đổi. Bức ảnh lá cờ trên nóc hầm vẫn ở trong tâm trí cậu, như lời nhắc rằng mỗi cố gắng hôm nay chính là một cách biết ơn quá khứ.',
    ],
  }),
  quang: Object.freeze({
    intro: [
      'Quang là một sinh viên trẻ năng động, ham học hỏi và yêu thích khám phá những điều mới lạ. Cậu có niềm đam mê với công nghệ, những trò chơi giải đố và các câu chuyện bí ẩn. Tuy nhiên, đối với Quang, lịch sử đôi khi vẫn chỉ là những trang sách với các mốc thời gian và sự kiện cần ghi nhớ, chưa thực sự trở thành những câu chuyện mà cậu có thể cảm nhận bằng chính mình.',
      'Trong chuyến tham quan Bảo tàng Chiến thắng Điện Biên Phủ, Long dừng lại trước bức ảnh ghi khoảnh khắc lá cờ tung bay trên nóc hầm. Cậu tự hỏi: nếu có thể đến tận nơi, mình sẽ hiểu những điều ấy như thế nào?',
      TOUCH_GLASS,
    ],
    afterRoom: {}, reflection: [], museumReturn: [],
  }),
});

export const heroCopy = (hero = activeHero()) => COPY[hero.id];

/** A room's campaign ending followed by the hero's own reaction (if any). */
export const withHeroReaction = (base, room, hero = activeHero()) => [...base, ...(heroCopy(hero).afterRoom[room] ?? [])];
