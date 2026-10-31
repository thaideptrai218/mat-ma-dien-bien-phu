export const PAINTING_URL = new URL('../../assets/images/victory-painting.svg', import.meta.url).href;
export const PAINTING_ALT = 'Tranh minh họa sáng tác: lá cờ đỏ sao vàng trên hầm, những người lính và dân công giữa núi đồi Điện Biên.';
export const SOURCE_LABEL = 'Cốt truyện theo PDF bản 4 do người dùng cung cấp, tr. 3–5. Quang, hệ thống và hành trình xuyên thời gian là hư cấu học tập; tranh SVG do dự án sáng tác, không phải ảnh tư liệu hay bản sao tranh bảo tàng.';

// Hệ Thống calls Quang "Ký Chủ"; Quang calls it "Hệ Thống" and says "tao" to it.
export const INTRO = [
  {speaker: 'Lời kể', text: 'Với hy vọng sắp được trở về hiện tại, Quang bước vào căn phòng thứ năm. Trước mắt cậu là cánh cửa lớn với bức tranh còn thiếu những mảnh ghép cuối cùng.'},
  {speaker: 'Quang', text: 'Hệ Thống, tao mang đủ bốn mảnh tới rồi đây.'},
  {speaker: 'Hệ Thống', text: 'Đã xác nhận bốn mảnh ghép. Nhiệm vụ cuối: ghép lại bức tranh trên bàn phục dựng. Chọn hai mảnh để đổi chỗ cho đến khi các đường nét liền nhau.'},
  {speaker: 'Quang', text: 'Ghép xong là về nhà. Tao làm ngay.'},
];
// Guidance after the painting is assembled and after the final answer opens the door.
export const GUIDE = {
  assembly: [
    {speaker: 'Hệ Thống', text: 'Bức tranh đã hoàn thiện. Nhưng nhiệm vụ của Ký Chủ chưa kết thúc. Hãy đến nơi ánh sáng cạnh cửa.'},
    {speaker: 'Quang', text: 'Chưa kết thúc? Hệ Thống còn muốn gì ở tao nữa?'},
  ],
  door: [
    {speaker: 'Hệ Thống', text: 'Câu trả lời đã được ghi nhận. Cánh cửa đã mở. Hành trình của Ký Chủ không kết thúc ở đây; nó chỉ vừa bắt đầu.'},
    {speaker: 'Quang', text: 'Cảm ơn Hệ Thống. Tao sẽ tự bước qua cánh cửa này.'},
  ],
};
export const ASSEMBLY_COMPLETED = 'Cậu cẩn thận lắp từng mảnh vào đúng vị trí, hoàn thiện bức tranh và chờ đợi cánh cửa mở ra.';

export const SYSTEM_QUESTION = 'Ký Chủ đã giải mã được những dấu mốc của lịch sử. Nhưng hiểu được quá khứ có đồng nghĩa với việc Ký Chủ đã hiểu giá trị của nó? Nếu được sinh ra trong hòa bình, Ký Chủ sẽ làm gì để xứng đáng với những hy sinh đã làm nên hòa bình ấy?';
export const QUANG_ANSWER = 'Tôi không thể thay đổi những gì đã xảy ra trong quá khứ, cũng không thể thay thế những người đã hy sinh vì độc lập, tự do của dân tộc. Nhưng tôi có thể sống xứng đáng với những điều họ đã đánh đổi. Tôi sẽ tìm hiểu đúng về lịch sử, trân trọng hòa bình, chia sẻ những giá trị ấy với mọi người, không ngừng học tập, rèn luyện và đóng góp cho cộng đồng bằng chính khả năng của mình.';

export const REFLECTION_SCRIPT = [
  {speaker: 'Lời kể', text: 'Thế nhưng, ngay khi mảnh ghép cuối cùng khớp vào vị trí, cánh cửa vẫn bất động. Giọng nói của hệ thống lại vang lên, lần này đưa ra một nhiệm vụ hoàn toàn khác.'},
  {speaker: 'Hệ Thống', text: SYSTEM_QUESTION},
  {speaker: 'Lời kể', text: 'Quang lặng người. Không còn bản đồ để phân tích, không còn mật mã để suy luận, cũng chẳng có tài liệu nào cung cấp sẵn đáp án. Từ khi bị đưa về quá khứ, cậu chỉ tập trung tìm cách thoát khỏi nơi này để trở về cuộc sống quen thuộc. Nhưng sau khi lần theo từng dấu mốc của chiến dịch, Quang dần nhận ra rằng những gì mình vừa khám phá không đơn thuần là các sự kiện cần ghi nhớ. Đằng sau chiến thắng ấy là sự hy sinh của những người lính, những tháng ngày gian khổ của lực lượng dân công và sự đóng góp của biết bao con người đã đặt độc lập, tự do của dân tộc lên trên lợi ích cá nhân. Chính những hy sinh ấy đã góp phần tạo nên nền hòa bình để các thế hệ sau được học tập, làm việc và tự do xây dựng tương lai.'},
  {speaker: 'Lời kể', text: 'Quang hiểu rằng mình không thể quay lại để thay đổi quá khứ, nhưng hoàn toàn có thể lựa chọn cách sống trong hiện tại. Cậu nhận ra rằng lòng biết ơn không chỉ thể hiện qua những lời nói, mà còn phải được chứng minh bằng hành động. Sau một hồi suy nghĩ, Quang dõng dạc trả lời.'},
  {speaker: 'Quang', text: QUANG_ANSWER},
  {speaker: 'Lời kể', text: 'Ngay khi Quang dứt lời, căn phòng chìm vào im lặng trong giây lát. Một luồng sáng dịu dàng dần lan tỏa, cánh cửa từ từ mở ra.'},
];

export const DOOR_MESSAGE = 'Lịch sử đã được viết bằng sự hy sinh của thế hệ trước. Phần tiếp theo sẽ được viết bằng hành động của thế hệ hôm nay.';
export const MUSEUM_RETURN = [
  'Một luồng sáng bao trùm lấy Quang, cuốn theo những hình ảnh về chiến trường, căn hầm và hành trình giải mã bốn căn phòng. Khi tỉnh lại, cậu đã trở về Bảo tàng Chiến thắng Điện Biên Phủ, vẫn đứng trước bức tranh như thể chưa từng rời đi.',
  'Mọi thứ xung quanh vẫn bình thường, nhưng trong tâm trí Quang, chuyến hành trình vừa qua đã mở ra một góc nhìn hoàn toàn khác về lịch sử. Cậu hiểu rằng lịch sử không chỉ nằm lại trong những trang sách, hiện vật hay bức tranh được lưu giữ trong bảo tàng, mà còn hiện diện trong nền hòa bình hôm nay và trách nhiệm của mỗi người đối với tương lai đất nước. Rời bảo tàng, Quang không còn nhìn những sự kiện lịch sử như những mốc thời gian cần ghi nhớ, mà xem đó là những câu chuyện về lòng dũng cảm, tinh thần đoàn kết và sự hy sinh, nhắc nhở mỗi thế hệ về giá trị của độc lập, tự do.',
  'Quang nhận ra rằng mỗi thế hệ đều có một hành trình lịch sử của riêng mình. Nếu thế hệ cha ông đã chiến đấu để giành độc lập, tự do, thì thế hệ hôm nay cần học tập, rèn luyện, sống có trách nhiệm và biến lòng biết ơn thành những hành động thiết thực để xây dựng đất nước ngày càng tốt đẹp hơn. Bởi hành trình của Quang chưa thực sự kết thúc khi cậu trở về từ quá khứ. Nó chỉ vừa bắt đầu, trong cách cậu lựa chọn sống, cống hiến và viết tiếp câu chuyện của dân tộc bằng chính những hành động của mình.',
];
export const CLOSING_LINE = 'Mật mã cuối cùng đã được giải, nhưng câu chuyện hòa bình vẫn đang chờ thế hệ hôm nay viết tiếp.';

export function getArchiveEntries(state) {
  if (!state.reflectionSeen) return [];
  return [{id: 'final-reflection', title: 'Câu hỏi cuối cùng và lời Quang', code: 'V', kind: 'report',
    source: SOURCE_LABEL, paragraphs: [...REFLECTION_SCRIPT.map(line => `${line.speaker} — ${line.text}`), DOOR_MESSAGE]}];
}

// Quang's thoughts and narration in Room 5 dialogues (plain strings are Quang; objects name the speaker).
export const LINES = {
  lamp: ['Ánh đèn vẫn ấm. Mình đã đi qua rất nhiều trang giấy, nhưng câu chuyện chỉ trọn vẹn khi bốn mảnh được đặt cạnh nhau.'],
  satchelFull: ['Bốn mảnh I, II, III, IV vẫn ở trong túi. Mỗi mảnh nhắc mình về một chặng đã tự đi qua.'],
  satchelMissing: ['Túi chưa có đủ bốn mảnh. Mình cần đi qua các phòng của hành trình để tìm chúng.'],
  assemblyMissing: ['Chưa có đủ bốn mảnh I, II, III, IV. Căn phòng không tạo thêm mảnh tranh; cần hoàn thành các chặng trước trong hành trình.'],
  reflectionLocked: ['Nơi này vẫn yên lặng. Trước hết, mình cần hoàn thiện bức tranh ở bàn phục dựng.'],
  doorAssembled: ['Tranh đã khớp, nhưng cửa vẫn đóng. Mình sẽ đến nơi ánh sáng cạnh cửa để nghe câu hỏi cuối.'],
  doorUnassembled: ['Bức tranh trên cửa còn thiếu. Mình sẽ đến bàn phục dựng để ghép lại bốn mảnh.'],
  lookAssembly: ['Bốn phần của cùng một bức tranh đang chờ được đặt đúng vị trí.'],
  lookReflection: ['Từ ánh sáng bên cửa, giọng nói của hệ thống lại vang lên.'],
  lookDoor: ['Ánh sáng đang chờ bên kia cánh cửa. Mình đã sẵn sàng trở về.'],
  assembly: [{speaker: 'Lời kể', text: ASSEMBLY_COMPLETED}, {speaker: 'Lời kể', text: 'Mảnh cuối cùng đã khớp vào vị trí, nhưng cánh cửa vẫn bất động. Một luồng sáng dịu hiện lên cạnh cửa.'}],
  door: [{speaker: 'Lời kể', text: DOOR_MESSAGE}],
};
// Interface notices shown only when the room is opened without its fragments; not voiced.
export const NOTICES = {
  introMissing: 'Căn phòng cuối cần bốn mảnh tranh kiếm được trong bốn phòng của hành trình. Mở riêng căn phòng không tự cấp các mảnh còn thiếu.',
  resetMissing: 'Cần đủ bốn mảnh kiếm được trong hành trình để hoàn thiện bức tranh.',
};

// Hệ Thống's side card while the assembly puzzle is open: a short reminder, then a gentle nudge (level 1, first
// wrong try) and a slightly clearer one (level 2, second wrong try on). Hints never place the pieces.
export const SYSTEM_HINTS = {
  assembly: {
    open: 'Ký Chủ, bốn mảnh cần khớp thành một bức tranh liền nét.',
    hints: ['Ký Chủ thử nhìn các đường nét ở mép từng mảnh. Chỗ nào còn bị đứt?', 'Ký Chủ thử xếp từng hàng một. Hàng trên nối với hàng dưới ở những nét nào?'],
  },
  // Door puzzle (key = door- plus the gate id in area-gates.js): no digits, never names the answer outright.
  'door-reconstruction-hall': {
    open: 'Ký Chủ, mỗi mảnh tranh nhớ về một phòng đã đi qua. Các tấm biển đang đứng lệch thứ tự.',
    hints: ['Ký Chủ thử nhớ lại: mảnh đầu tiên Ký Chủ nhặt được nằm ở phòng nào?', 'Số La Mã của mảnh đi theo thứ tự các phòng Ký Chủ đã đi qua. Ký Chủ chỉ cần đọc kỹ tên từng tấm biển.'],
  },
};
