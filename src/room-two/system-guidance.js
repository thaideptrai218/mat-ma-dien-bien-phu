import {beats as donorBeats} from './bao/content/story-data.js';

// Campaign voice for Room 2. Donor registries stay byte-identical; this overlay only re-addresses
// Hệ Thống's lines (it calls Long "Ký Chủ"; Long calls it "Hệ Thống" and says "tao" to it)
// and adds Long ↔ Hệ Thống guidance lines that point the player to the next station.
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
    {speaker: 'Long', text: 'Nava muốn dồn quân thành một nắm đấm. Để tao nghe xem bên kia đáp lại thế nào.'},
  ],
  'nava-radio': [
    {speaker: 'Hệ Thống', text: 'Hai giọng đã tách. Bốn thẻ mũi tên đã ở trong tay Ký Chủ. Trước khi tới sa bàn giữa hành lang, hãy ghi đủ bốn mẩu tin: nhật ký chiến sĩ, trang báo cũ, điện liên quân Việt – Lào và tờ lịch tháng 2/1954.'},
    {speaker: 'Long', text: 'Bốn mẩu tin, bốn ngón tay sắt. Tao sẽ xếp từ nơi tập trung quân thứ hai tới thứ năm.'},
  ],
  'nava-fist': [
    {speaker: 'Hệ Thống', text: 'Nắm đấm thép đã xòe. Tấm bản đồ gấp đang ở trong tay Ký Chủ. Đọc Hồ sơ Điện Biên Phủ trên nắp hòm sắt, rồi gấp bản đồ tới nơi quyết chiến.'},
    {speaker: 'Long', text: 'Hòm sắt ở phía đông hành lang. Tao đi ngay.'},
  ],
};
// Hệ Thống's side card while a station is open: a short reminder, then a gentle nudge (level 1, first wrong try)
// and a slightly clearer one (level 2, second wrong try on). Hints point to where to look, never to the answer.
export const SYSTEM_HINTS = {
  'nava-balance': {
    open: 'Ký Chủ, đặt các quả cân lên hai đĩa theo lề Sổ kế hoạch của Nava.',
    hints: ['Ký Chủ thử đọc lại Sổ kế hoạch: mỗi việc thuộc bước nào, vào lúc nào?', 'Ký Chủ để ý lề của Sổ kế hoạch. Lề sổ ghi gì về các chiến trường ngoài Bắc Bộ?'],
  },
  'nava-radio': {
    open: 'Ký Chủ, xoay núm chọn tai nghe rồi nhặt chữ từ cuộn băng điện báo.',
    hints: ['Ký Chủ thử đọc cuộn băng theo một cách khác, không đọc liền một mạch.', 'Ký Chủ nhớ lại ghi chú ở điện đài: bên nào muốn dồn quân, bên nào muốn chia nhỏ lực lượng đối phương?'],
  },
  'nava-fist': {
    open: 'Ký Chủ, kéo từng thẻ mũi tên vào đúng vùng theo bốn mẩu tin.',
    hints: ['Ký Chủ thử đọc lại từng mẩu tin: mỗi mẩu nhắc một nơi, và nơi ấy thuộc vùng nào?', 'Ký Chủ để ý ngày tháng trên mỗi mẩu tin, rồi nghĩ nơi nào xảy ra trước, nơi nào sau.'],
  },
  // Door puzzles (keys are door- plus the gate id in area-gates.js): quick, answered from clues just read.
  'door-south-west': {
    open: 'Ký Chủ, ổ khóa đòi huy hiệu của bên đang dồn quân về một chỗ.',
    hints: ['Ký Chủ thử đọc lại ghi chú trên điện đài: tai nghe nào ghi bên dồn quân?', 'Ký Chủ nhớ lại cuốn sổ của Nava: bên nào muốn nắm chặt lực lượng thành một nắm đấm?'],
  },
  'door-south-east': {
    open: 'Ký Chủ, thước này đo ngày trong tháng. Ngày ấy nằm trên trang báo cũ.',
    hints: ['Ký Chủ thử mở sổ tay đọc lại trang báo cũ: bài viết kể về cuộc tiến công ở hướng nào?', 'Ký Chủ để ý bài báo kể từ ngày nào liên quân tiến công hướng Trung Lào.'],
  },
  'door-north-room': {
    open: 'Ký Chủ, hai bánh số này chỉ một tháng ghi trên bức điện liên quân.',
    hints: ['Ký Chủ thử đọc lại bức điện liên quân Việt – Lào, chỗ đề thời gian ở đầu bức điện.', 'Bức điện đề cuối tháng đầu tiên của năm. Ký Chủ nhớ bánh số hiển thị hai chữ số.'],
  },
  'nava-fold': {
    open: 'Ký Chủ, hồ sơ trên nắp hòm sắt chỉ ra nơi cần gấp tới.',
    hints: ['Ký Chủ thử đọc lại Hồ sơ Điện Biên Phủ: nơi ấy khác các căn cứ còn lại ở điểm nào?', 'Khi gấp đúng nơi, dòng chữ hiện ra có nhắc một ngày. Ký Chủ thử đọc kỹ dòng chữ ấy.'],
  },
};

