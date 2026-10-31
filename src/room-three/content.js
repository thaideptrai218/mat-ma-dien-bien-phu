// Authored dialogue for the supplied logistics activity; no historical witness claim.
// Hệ Thống calls Quang "Ký Chủ"; Quang calls it "Hệ Thống" and says "tao" to it.
const introLines = (fragmentNote, progressNote) => [
  {speaker: 'Hệ Thống', text: 'Phòng 3 — Mật mã hậu phương: Giải cứu tuyến tiếp vận. Bối cảnh từ quyết định tháng 12/1953 đến những trận mở đầu tháng 3/1954.'},
  {speaker: 'Quang', text: 'Kho hàng, con đường, lều chỉ huy, trạm điện đài… Hệ Thống, nhiệm vụ lần này là gì?'},
  {speaker: 'Hệ Thống', text: 'Kế hoạch tiếp vận đã bị mã hóa. Ký Chủ phải vượt bốn thử thách để khôi phục bốn dữ kiện: hồ sơ chuẩn bị, những chuyến hàng, mật lệnh của Bộ Chỉ huy và mật điện chiến thắng.'},
  {speaker: 'Hệ Thống', text: `Trước mỗi trạm, Ký Chủ đọc trọn tờ giấy liên quan rồi suy nghĩ và xác nhận. Tờ đầu tiên nằm gần kho hàng. ${fragmentNote}`},
  {speaker: 'Quang', text: 'Đọc trước, giải sau. Tao nhớ rồi.'},
  {speaker: 'Hệ Thống', text: 'Thư, người viết và chuyện riêng là hư cấu; sáu tranh vận chuyển là minh họa sáng tác, không phải ảnh tư liệu. Nguồn lịch sử ghi bên ngoài lời văn.'},
  {speaker: 'Hệ Thống', text: `WASD hoặc mũi tên để đi, Shift để chạy, E để xem vật gần. M mở sơ đồ, N mở sổ tay, Q thu/mở nhiệm vụ. ${progressNote}`},
];
export const INTRO = introLines('Chỉ mảnh III được trao ở phòng độc lập này.', 'Các phòng giữ tiến độ riêng.');
export const CAMPAIGN_INTRO = introLines('Mảnh III thuộc chặng tiếp vận này.', 'Tiến độ được giữ chung trong hành trình.');

// Guidance appended to the reward dialogue of each challenge, keyed by challenge id.
export const GUIDE = {
  preparation: [
    {speaker: 'Hệ Thống', text: 'Mật mã 1 đã được ghi nhận. Thử thách tiếp theo: Bí mật những chuyến hàng. Ký Chủ đọc nhật ký tiếp vận, rồi tới bãi hàng để ghép sáu bức tranh với chú thích.'},
    {speaker: 'Quang', text: 'Sáu bức tranh bị mất chú thích. Để tao xem ai đã đưa gạo, đạn ra mặt trận.'},
  ],
  cargo: [
    {speaker: 'Hệ Thống', text: 'Mật mã 2 đã được ghi nhận. Thử thách tiếp theo: Mật lệnh của Bộ Chỉ huy. Hai bức điện đang chờ Ký Chủ đọc; bàn điện nằm trong lều chỉ huy.'},
    {speaker: 'Quang', text: 'Hai bức điện, hai phương châm. Tao sẽ đọc thật chậm.'},
  ],
  strategy: [
    {speaker: 'Hệ Thống', text: 'Mật mã 3 đã được ghi nhận. Thử thách cuối: Giải mã mật điện chiến thắng. Ký Chủ đọc thư sau trận Độc Lập và báo cáo phía bắc, rồi tới trạm điện đài.'},
    {speaker: 'Quang', text: 'Những ngày đầu của chiến dịch. Lần này tao phải nhớ cả ngày tháng.'},
  ],
  opening: [
    {speaker: 'Hệ Thống', text: 'Đủ bốn dữ kiện. Nhiệm vụ cuối: ghép ngày, tháng và năm thành ngày mở màn chiến dịch, rồi nhập vào khóa rương.'},
    {speaker: 'Quang', text: 'Các dữ kiện ấy đều nằm trong sổ tay. Hệ Thống chờ tao một chút.'},
  ],
  final: [
    {speaker: 'Hệ Thống', text: 'Hồ sơ tiếp vận đã được khôi phục. Ký Chủ đến gần rương và nhấn E để nhận mảnh tranh số III.'},
  ],
};

const ENDING_STORY = [
  {speaker: 'Quang', text: 'Tháng 3, năm 1954, ngày 13: các mốc ghép lại thành ngày mở màn. Dữ kiện Đánh chắc, tiến chắc nhắc mình nhớ cách những người chỉ huy đã cân nhắc.'},
  {speaker: 'Quang', text: 'Sau những bản tin là người làm đường, dân công, thanh niên xung phong, người kéo pháo và những chuyến gạo, đạn, thuốc. Mặt trận cần họ tiếp tục góp sức.'},
];
export const ENDING = [
  ...ENDING_STORY,
  {speaker: 'Hệ Thống', text: 'Ký Chủ đã khôi phục bốn dữ kiện và nhận riêng mảnh tranh III. Tới cửa để hoàn thành Phòng 3; không có mảnh của các phòng khác được cấp ở đây.'},
  {speaker: 'Hệ Thống', text: 'Chiến dịch còn tiếp tục sau ngày 17/3. Phòng 4 của Trâm và Phòng 5 ghép tranh có trong hành trình năm phòng ở trang chính. Các bản chơi riêng không tự chuyển tiến độ.'},
];
export const CAMPAIGN_ENDING = [
  ...ENDING_STORY,
  {speaker: 'Hệ Thống', text: 'Ký Chủ đã khôi phục bốn dữ kiện và nhận mảnh tranh số III. Tới cửa để đi tiếp.'},
  {speaker: 'Hệ Thống', text: 'Chiến dịch còn tiếp tục sau ngày 17/3. Phía sau cánh cửa là Phòng 4: những ngày tiến công quyết định.'},
  {speaker: 'Quang', text: 'Ba mảnh rồi. Chặng cuối là gì thì tao cũng đi tới cùng, Hệ Thống.'},
];

export const REACTIONS = {
  'preparation-record': {
    first: ['Một bản tổng hợp từ quyết định mở chiến dịch đến ngày Him Lam.'],
    repeat: ['Nhiều việc chuẩn bị phải cùng tiến hành; có thứ này rồi vẫn còn phải lo thứ khác.'],
    locked: ['Mình bắt đầu từ tờ tổng hợp gần kho hàng.'],
  },
  'supply-journal': {
    first: ['Duyên đang ghi lại một ngày đi cùng chuyến hàng.'],
    repeat: ['Bao gạo và khẩu pháo tới được nơi cần đến nhờ nhiều bàn tay.'],
    locked: ['Mình khôi phục phần hồ sơ chuẩn bị ở tủ trước, rồi theo chuyến hàng này.'],
  },
  'command-telegrams': {
    first: ['Người chép lệnh đặt hai phương châm cạnh nhau trong sổ.'],
    repeat: ['Đặt chắc thắng lên đầu cũng có nghĩa phải cân nhắc tình hình cho thật kỹ.'],
    locked: ['Mình còn việc ở bãi hàng trước khi đến lều chỉ huy.'],
  },
  'opening-letter': {
    first: ['Sơn vừa trải qua những trận mở đầu, vẫn viết về hỏi chuyện nhà.'],
    repeat: ['Him Lam ngày 13, Độc Lập ngày 15; lá thư dừng ở ngày 16/3.'],
    locked: ['Mình khôi phục hai phương châm ở lều chỉ huy trước khi đọc tin mở màn.'],
  },
  'north-report': {
    first: ['Bản tổng hợp này nối tiếp lá thư bằng tin ngày 17/3.'],
    repeat: ['Bản Kéo đầu hàng, còn các đợt chiến đấu tiếp theo vẫn ở phía trước.'],
    locked: ['Mình đọc lá thư sau những trận đầu rồi mới nối tới bản tổng hợp này.'],
  },
  'archive-cabinet': {
    first: ['Năm thẻ nằm lẫn nhau. Có hai mốc ngày, còn những việc chuẩn bị không phải chờ nhau.'],
    repeat: ['Phần hồ sơ chuẩn bị đã khôi phục, dữ kiện THÁNG 3 ở trong sổ tay.'],
    locked: ['Mình cần đọc hết bản tổng hợp cạnh tủ trước.'],
  },
  'cargo-yard': {
    first: ['Sáu bức minh họa những phần việc khác nhau trên tuyến tiếp vận.'],
    repeat: ['Các cặp đã khớp. Dữ kiện NĂM 1954 nối với công sức người vận chuyển.'],
    locked: ['Mình cần đọc sổ của Duyên để hiểu người và hàng trong những tranh này.'],
  },
  'command-tent': {
    first: ['Hai nhóm thẻ chữ. Mình ghép lại phương châm trước và sau khi thay đổi.'],
    repeat: ['ĐÁNH CHẮC, TIẾN CHẮC đã rõ. Phải hiểu cả lý do của sự thay đổi ấy.'],
    locked: ['Mình cần đọc trang sổ người chép lệnh trước.'],
  },
  'radio-station': {
    first: ['Ba nơi, ba mốc ngày. Tin nào mở màn, tin nào nói quân Pháp đầu hàng?'],
    repeat: ['13, 15, 17 tháng ba. Dữ kiện NGÀY 13 nhắc đến Him Lam mở màn.'],
    locked: ['Cần đọc cả thư của Sơn và bản tổng hợp sau ngày 17/3.'],
  },
  chest: {
    first: ['Khóa rương có chỗ điền một ngày tháng năm.'],
    repeat: ['Mảnh III đã được cất đi. Còn cửa ra ở phía đông nam.'],
    locked: ['Mình còn dữ kiện phải khôi phục ở bốn trạm trước khi mở khóa ngày.'],
  },
  door: {
    first: ['Đã có mảnh III, mình có thể bước qua cửa này.'],
    repeat: ['Phần việc trong phòng đã xong.'],
    locked: ['Mình cần đến rương và nhận mảnh III trước.'],
  },
  'supply-crates': {
    first: ['Những kiện hàng chờ được chuyển đi. Người nhận ở phía trước vẫn đang cần chúng.'],
    repeat: ['Gạo, đạn và thuốc đều có phần việc riêng trong một chuyến tiếp tế.'],
    locked: ['Mình xem bản tổng hợp cạnh kho để biết những thứ cần chuẩn bị.'],
  },
  'road-tools': {
    first: ['Đường thông thì người và hàng mới đi tiếp được.'],
    repeat: ['Công binh làm đường; dân công và thanh niên xung phong cũng góp sức mở, sửa tuyến đi.'],
    locked: ['Cuốn sổ chuyến hàng sẽ kể thêm về những người làm đường.'],
  },
  'field-lamp': {
    first: ['Dưới ánh đèn này, những dòng tin ngắn cũng cần được đọc thật kỹ.'],
    repeat: ['Một ngày ghi sai có thể làm lẫn cả trình tự những bản tin.'],
    locked: ['Mình bắt đầu ở kho và đi theo những giấy tờ dọc tuyến.'],
  },
};

// Quang's thoughts in step dialogues; explanations follow each recovered reward.
export const LINES = {
  explanations: {
    preparation: 'Ba việc chuẩn bị có thể diễn ra đan xen. Điều cần giữ là hậu cần phải sẵn trước lúc nổ súng.',
    cargo: 'Xe thồ, dân công và những con đường đã nối nguồn hàng ở hậu phương với người lính ngoài mặt trận.',
    strategy: 'Bộ Chỉ huy đánh giá tình hình thực tế, đặt yêu cầu chắc thắng lên trước việc giữ nguyên một dự định.',
    opening: 'Him Lam, Độc Lập rồi Bản Kéo: những thắng lợi mở đường tiến xuống lòng chảo, tạo điều kiện cho các đợt sau.',
  },
  final: [
    'Ngày mở màn Chiến dịch Điện Biên Phủ đã được khôi phục. Rương vừa mở.',
    'Mình sẽ cất mảnh tranh số III trước khi đi tiếp.',
  ],
  fragmentReady: ['Bốn dữ kiện đã trở về đúng chỗ. Mảnh tranh số III nằm cạnh hồ sơ.'],
  chestEmpty: ['Mảnh tranh đã cất rồi. Mình đi tới cửa ra.'],
};

// Hệ Thống's side card while a Room 3 puzzle is open: a short reminder, then a gentle nudge (level 1, first wrong
// try) and a slightly clearer one (level 2, second wrong try on). Hints point to where to look, never to the answer.
export const SYSTEM_HINTS = {
  preparation: {
    open: 'Ký Chủ, hồ sơ chuẩn bị cần được phân loại cho đúng.',
    hints: ['Ký Chủ thử tách việc nào gắn với một ngày cụ thể, việc nào diễn ra song song trong thời gian chuẩn bị.', 'Ký Chủ đọc lại hồ sơ chuẩn bị trong sổ tay. Chiến đấu lâu dài cần những gì được bảo đảm trước?'],
  },
  cargo: {
    open: 'Ký Chủ, mỗi bức tranh cần một chú thích đúng với vai trò của nó.',
    hints: ['Ký Chủ thử đọc lại nhật ký tiếp vận. Mỗi phương tiện hay lực lượng được nhắc để làm việc gì?', 'Ký Chủ để ý sự khác nhau giữa người chuyên chở, người mở đường và thứ được chuyên chở.'],
  },
  strategy: {
    open: 'Ký Chủ, hai bức điện mang hai phương châm khác nhau.',
    hints: ['Ký Chủ thử so hai bức điện trong sổ tay. Từ nào đã thay đổi giữa bức trước và bức sau?', 'Ký Chủ thử nghĩ vì sao người chỉ huy đổi cách nói, và điều đó cho thấy họ coi trọng điều gì.'],
  },
  opening: {
    open: 'Ký Chủ, ba trận mở màn cần được xếp đúng ngày.',
    hints: ['Ký Chủ thử đọc lại thư và báo cáo phía bắc. Mỗi cứ điểm được nhắc cùng một mốc thời gian.', 'Ký Chủ thử tìm trận nào mở màn chiến dịch, trận nào đến sau, và nơi nào kết thúc bằng sự đầu hàng.'],
  },
  final: {
    open: 'Ký Chủ, khóa rương cần ngày mở màn của chiến dịch.',
    hints: ['Ký Chủ thử xem lại các dữ kiện đã khôi phục. Dữ kiện nào nhắc đến một mốc thời gian?', 'Không phải dữ kiện nào cũng thuộc về ngày. Ký Chủ thử đọc lại phần thưởng của từng thử thách.'],
  },
};
