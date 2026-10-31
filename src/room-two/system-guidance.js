import {beats as donorBeats} from './bao/content/story-data.js';

// Campaign voice for Room 2. Donor registries stay byte-identical; this overlay only re-addresses
// Hệ Thống's lines (it calls Quang "Ký Chủ"; Quang calls it "Hệ Thống" and says "tao" to it)
// and adds Quang ↔ Hệ Thống guidance lines that point the player to the next station.
const line = (speakerId, text) => ({speakerId, portraitId: speakerId, text, sourceIds: [], fictional: true});
const system = text => line('system', text);
const quang = text => line('quang', text);

function rewrite(beatId, build) {
  const beat = donorBeats[beatId];
  return {...beat, lines: build(beat.lines)};
}

const intro = rewrite('navarre-plan-intro', ([arrival, , resolve]) => [
  arrival,
  system('Ký Chủ đã biết tên người cầm quân Pháp. Giờ hãy đọc kế hoạch của hắn. Một bên muốn nắm chặt nắm đấm, một bên muốn buộc nắm đấm ấy xòe ra.'),
  system('Phòng 2 gồm bốn bước nối tiếp: cân lại 84 tiểu đoàn, tách hai bức điện, mở nắm đấm thép và gấp bản đồ ở hòm sắt. Mỗi trạm chỉ mở khi Ký Chủ đã ghi đủ manh mối của nó.'),
  resolve,
  system('Bàn làm việc của Nava ở gian tây bắc. Nhấn Q bất cứ lúc nào để xem trạm kế tiếp.'),
  quang('Rõ rồi, Hệ Thống. Tao đi đây.'),
]);

const outro = rewrite('navarre-plan-outro', ([decision, ...reflection]) => [
  {...decision, text: decision.text.replace('thuộc về ngươi', 'thuộc về Ký Chủ')},
  ...reflection,
  system('Cánh cửa phía đông đã mở. Ký Chủ hãy đi tới cửa để sang chặng kế tiếp: công cuộc chuẩn bị cho chiến dịch.'),
  quang('Mảnh ghép thứ hai đây rồi, Hệ Thống. Đi tiếp thôi.'),
]);

export const beats = {...donorBeats, [intro.id]: intro, [outro.id]: outro};

// Shown after each non-final station is solved, before the solved board is reviewed.
export const PUZZLE_GUIDE = {
  'nava-balance': [
    {speaker: 'Hệ Thống', text: 'Cán cân đã khóa. Một cuộn băng điện báo vừa bật ra. Ký Chủ hãy đọc ghi chú trên điện đài ở lán Việt Bắc, gian đông bắc, rồi tách hai bức điện.'},
    {speaker: 'Quang', text: 'Nava muốn dồn quân thành một nắm đấm. Để tao nghe xem bên kia đáp lại thế nào.'},
  ],
  'nava-radio': [
    {speaker: 'Hệ Thống', text: 'Hai giọng đã tách. Bốn thẻ mũi tên đã ở trong tay Ký Chủ. Trước khi tới sa bàn giữa hành lang, hãy ghi đủ bốn mẩu tin: nhật ký chiến sĩ, trang báo cũ, điện liên quân Việt – Lào và tờ lịch tháng 2/1954.'},
    {speaker: 'Quang', text: 'Bốn mẩu tin, bốn ngón tay sắt. Tao sẽ xếp từ nơi tập trung quân thứ hai tới thứ năm.'},
  ],
  'nava-fist': [
    {speaker: 'Hệ Thống', text: 'Nắm đấm thép đã xòe. Tấm bản đồ gấp đang ở trong tay Ký Chủ. Đọc Hồ sơ Điện Biên Phủ trên nắp hòm sắt, rồi gấp bản đồ tới nơi quyết chiến.'},
    {speaker: 'Quang', text: 'Hòm sắt ở phía đông hành lang. Tao đi ngay.'},
  ],
};
