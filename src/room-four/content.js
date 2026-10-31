// Quang and the system dialogue are authored for this learning room.
// Hệ Thống calls Quang "Ký Chủ"; Quang calls it "Hệ Thống" and says "tao" to it.
const introLines = scopeNote => [
  { speaker: 'Hệ Thống', text: 'Phòng 4 — Những ngày quyết định. Từ 30/3 đến chiến thắng 7/5/1954, rồi nhìn lại kết quả và ý nghĩa.' },
  { speaker: 'Quang', text: 'Bảy tờ giấy quanh phòng, từ những đường hào đến những điều đổi thay sau chiến thắng. Hệ Thống, tao bắt đầu ở cuối tháng ba nhé?' },
  { speaker: 'Hệ Thống', text: 'Chính xác. Nhiệm vụ: đọc bảy tư liệu theo dòng thời gian, giải bảng ô chữ lịch sử, tìm cột chữ có nghĩa, rồi lần theo lời chỉ dẫn để mở rương mảnh tranh thứ tư.' },
  { speaker: 'Hệ Thống', text: `${scopeNote} Thư, người viết và chuyện riêng là hư cấu; sự kiện lịch sử dựa trên phần của Trâm trong tài liệu được cung cấp, với nguồn ghi ngoài lời văn.` },
  { speaker: 'Hệ Thống', text: 'Đi bằng WASD hoặc phím mũi tên, giữ Shift để chạy. Đến gần vật và nhấn E. Đọc hết giấy, cùng suy nghĩ rồi xác nhận. N mở sổ tay, M mở sơ đồ, Q xem nhiệm vụ.' },
];
export const INTRO = introLines('Đây là bản chơi độc lập. Chỉ mảnh tranh IV có trong phòng này.');
export const CAMPAIGN_INTRO = introLines('Chặng này giữ mảnh tranh IV của hành trình.');

// Guidance appended to the success dialogue of each Room 4 step.
export const GUIDE = {
  documents: [
    { speaker: 'Hệ Thống', text: 'Bảy tư liệu đã được ghi nhận. Nhiệm vụ tiếp theo: bảng ô chữ lịch sử ở phía bắc. Mỗi câu hỏi gắn với một tờ giấy Ký Chủ đã đọc.' },
    { speaker: 'Quang', text: 'Bảy câu hỏi, bảy tờ giấy. Có sổ tay N bên cạnh, tao không sợ.' },
  ],
  column: [
    { speaker: 'Hệ Thống', text: 'Lời chỉ dẫn đã hiện. Bàn mật mã T ở bên trái, bàn mật mã L ở bên phải, cả hai nằm phía sau rương. Ký Chủ chọn các ô tạo thành đúng hình cần tìm.' },
    { speaker: 'Quang', text: 'Hình T trước, hình L sau. Hệ Thống cứ xem tao làm.' },
  ],
  final: [
    { speaker: 'Hệ Thống', text: 'Khẩu hiệu đã được xác nhận. Ký Chủ đến gần rương và nhấn E để nhận mảnh tranh số IV.' },
  ],
};

const ENDING_STORY = [
  { speaker: 'Quang', text: 'Mảnh IV đã ở đây. Bảy tờ giấy đi từ cuộc chiến giành từng đoạn hào đến những đổi thay vượt xa Điện Biên Phủ.' },
  { speaker: 'Quang', text: 'Bình vẫn mong về với mẹ, Hạnh muốn gửi tin cho em. Đọc đến kết quả rồi, mình vẫn nhớ những lời ấy.' },
];
export const ENDING = [
  ...ENDING_STORY,
  { speaker: 'Hệ Thống', text: 'Ký Chủ đã nhận mảnh tranh IV. Tới cửa phía bắc để hoàn thành Phòng 4 độc lập.' },
  { speaker: 'Hệ Thống', text: 'Phòng 5 ghép tranh và suy ngẫm nằm trong hành trình năm phòng ở trang chính. Bản chơi riêng này giữ tiến độ riêng, không tự chuyển mảnh tranh vào hành trình.' },
];
export const CAMPAIGN_ENDING = [
  ...ENDING_STORY,
  { speaker: 'Hệ Thống', text: 'Ký Chủ đã nhận mảnh tranh IV. Tới cửa phía bắc để tiếp tục hành trình.' },
  { speaker: 'Hệ Thống', text: 'Qua cửa là Phòng 5: ghép bốn mảnh tranh trên cánh cửa cuối cùng.' },
  { speaker: 'Quang', text: 'Đủ bốn mảnh rồi, Hệ Thống. Lần này thì tao về được chứ?' },
  { speaker: 'Hệ Thống', text: 'Câu trả lời nằm sau cánh cửa, thưa Ký Chủ.' },
];

export const REACTIONS = {
  'east-offensive': {
    first: ['Bình đang viết về cho mẹ vào cuối tháng tư.'],
    repeat: ['C1, A1 và những đường hào khiến vòng vây ngày càng chặt.'],
    locked: ['Lá thư cuối tháng tư là chỗ bắt đầu của chuỗi giấy này.'],
  },
  'final-assault': {
    first: ['Sang tháng năm rồi. Một bản tổng hợp về đợt tiến công thứ ba.'],
    repeat: ['Tiêu diệt những cứ điểm còn lại để chuẩn bị tổng công kích.'],
    locked: ['Mình đọc lá thư cuối tháng tư trước để biết vòng vây đã khép đến đâu.'],
  },
  a1: {
    first: ['Người công binh vừa trải qua đêm ở A1.'],
    repeat: ['Khối bộc phá khoảng một tấn, rồi bộ binh tiếp tục tiến công.'],
    locked: ['Bản tổng hợp đầu tháng năm sẽ nối đến đêm A1.'],
  },
  headquarters: {
    first: ['Hạnh gửi em gái một ngày để nhớ: mồng bảy tháng năm.'],
    repeat: ['Khoảng 17 giờ 30, sở chỉ huy bị chiếm và Đờ Cát bị bắt.'],
    locked: ['Mình còn trang sổ về đêm A1 trước buổi chiều này.'],
  },
  results: {
    first: ['Một bản ghi kết quả sau 56 ngày đêm chiến đấu.'],
    repeat: ['16.200 là tổng số bị tiêu diệt và bắt sống, còn có vũ khí và kho tàng thu được.'],
    locked: ['Mình đọc lá thư tối mồng bảy rồi mới nhìn lại kết quả cả chiến dịch.'],
  },
  north: {
    first: ['Cuốn sổ đã sang thời gian sau Hiệp định Genève năm 1954.'],
    repeat: ['Miền Bắc được giải phóng và xây dựng hậu phương cho cuộc đấu tranh thống nhất về sau.'],
    locked: ['Mình xem kết quả chiến dịch trước khi đi đến những đổi thay sau Genève.'],
  },
  independence: {
    first: ['Hai người bạn hỏi nhau vì sao Điện Biên Phủ có ý nghĩa ở cả những nơi xa.'],
    repeat: ['Độc lập dân tộc cũng là mong muốn của những dân tộc thuộc địa khác.'],
    locked: ['Còn cuốn sổ về miền Bắc sau Genève trước lá thư cuối năm này.'],
  },
  crossword: {
    first: ['Bảy câu hỏi, mỗi câu nối với một tờ giấy mình vừa đọc.'],
    repeat: ['Những hàng chữ xếp lệch nhau. Mình tìm một cột đọc được từ trên xuống.'],
    locked: ['Mình cần đọc hết và ghi nhận bảy tờ giấy quanh phòng.'],
  },
  'board-t': {
    first: ['Một bảng sáu hàng, năm cột. Manh mối bảo tìm chữ T.'],
    repeat: ['Theo nét ngang rồi nét dọc của T, các chữ nối thành QUYẾT CHIẾN.'],
    locked: ['Mình cần giải ô chữ và chọn cột dọc trước.'],
  },
  'board-l': {
    first: ['Bảng còn lại có cùng số ô. Mình thử tìm chữ L.'],
    repeat: ['Đi xuống rồi sang phải theo chữ L: QUYẾT THẮNG.'],
    locked: ['Cột dọc của ô chữ sẽ chỉ cách đọc hai bảng này.'],
  },
  chest: {
    first: ['Khóa rương còn đóng. Mình sẽ ghép hai phần lời đã tìm được ở bảng T và bảng L.'],
    repeat: ['Mình đã lấy mảnh IV. Cửa ở phía bắc.'],
    locked: ['Hai bảng phía sau rương sẽ giúp tìm câu mở khóa.'],
  },
  door: {
    first: ['Mảnh tranh IV đã cất rồi. Mình có thể đi qua cánh cửa này.'],
    repeat: ['Mình đã cầm mảnh IV, có thể bước qua cửa rồi.'],
    locked: ['Mình cần lấy mảnh IV trong rương trước.'],
  },
  lamp: {
    first: ['Ánh đèn rọi xuống các nếp gấp. Những lá thư đều có người đang đợi tin.'],
    repeat: ['Còn đủ sáng để đọc thêm một trang.'],
    locked: ['Lá thư cuối tháng tư ở gần bức tường phía tây nam.'],
  },
  radio: {
    first: ['Máy vô tuyến im tiếng. Hạnh đã phải hỏi lại khi nghe tin thắng trận.'],
    repeat: ['Một mốc giờ có thể đi rất xa khi được truyền thành tin.'],
    locked: ['Mình sẽ đi lần lượt từ những tờ giấy cuối tháng ba, tháng tư.'],
  },
};

// Quang's thoughts in step dialogues.
export const LINES = {
  column: [
    'T · I · M · T · V · A · L. Đọc thành “TÌM T VÀ L”.',
    'Phía sau rương có hai bảng chữ. Mình sẽ tìm hình T trên bảng bên trái và hình L trên bảng bên phải.',
  ],
  final: [
    '“Quyết chiến, Quyết thắng.” Khóa rương vừa bật.',
    'Mình sẽ lấy mảnh tranh số IV rồi tới cánh cửa phía bắc.',
  ],
  fragmentReady: ['Mảnh tranh này thuộc chặng cuối của chiến dịch. Mình sẽ giữ lại để ghép với những mảnh ở các phòng trước.'],
  chestEmpty: ['Mình đã cất mảnh tranh. Cánh cửa ở phía bắc.'],
};
