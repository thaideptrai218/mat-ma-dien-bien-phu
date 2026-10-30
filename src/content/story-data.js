// Quang, his dialogue and the room layouts are fictional learning devices.
export const chapterOrder = ['museum', 'him-lam', 'navarre-plan', 'command-post', 'peace', 'ending'];
export const roomOrder = ['him-lam', 'navarre-plan', 'command-post', 'peace'];

const source = (id, title, url) => ({ id, title, url });
export const sources = {
  'museum-him-lam': source('museum-him-lam', 'Bảo tàng Lịch sử quốc gia — Trận mở màn Him Lam', 'https://baotanglichsu.vn/vi/Articles/2002/68138/ky-niem-60-nam-chien-thang-lich-su-djien-bien-phu-1954-2014tran-mo-man-tieu-diet-trung-tam-dje-khang-him-lam-13-3-1954.html'),
  'nhandan-campaign': source('nhandan-campaign', 'Báo Nhân Dân — Chuyên trang Chiến thắng Điện Biên Phủ', 'https://dienbienphu.nhandan.vn/'),
  'nhandan-navarre-plan': source('nhandan-navarre-plan', 'Báo Nhân Dân — Từ Điện Biên Phủ đến Geneva: Một “ngoại lệ” của lịch sử', 'https://special.nhandan.vn/mot_ngoaile_cua_lichsu/index.html'),
  'loigiaihay-navarre': source('loigiaihay-navarre', 'Lời giải hay (SGK Lịch sử 12) — Âm mưu mới của Pháp - Mĩ ở Đông Dương: Kế hoạch Nava', 'https://loigiaihay.com/am-muu-moi-cua-phap-mi-o-dong-duong-ke-hoach-nava-c87a7945.html'),
  'loigiaihay-dong-xuan': source('loigiaihay-dong-xuan', 'Lời giải hay (SGK Lịch sử 12) — Cuộc tiến công chiến lược Đông - Xuân 1953 - 1954 và chiến dịch Điện Biên Phủ', 'https://loigiaihay.com/cuoc-tien-cong-chien-luoc-dong-xuan-1953-1954-va-chien-dich-dien-bien-phu-nam-1954-c87a7946.html'),
  'loigiaihay-five-places': source('loigiaihay-five-places', 'Lời giải hay — Trong Đông - Xuân 1953 - 1954, Pháp phải phân tán lực lượng ra những vùng nào?', 'https://loigiaihay.com/cau-hoi-110635.html'),
  'wikipedia-dong-xuan': source('wikipedia-dong-xuan', 'Wikipedia tiếng Việt — Chiến cục Đông Xuân 1953–1954', 'https://vi.wikipedia.org/wiki/Chi%E1%BA%BFn_c%E1%BB%A5c_%C4%90%C3%B4ng_Xu%C3%A2n_1953%E2%80%931954'),
  'nhandan-dong-xuan': source('nhandan-dong-xuan', 'Báo Nhân Dân — Phương châm chỉ đạo chiến lược của Đảng trong Đông Xuân 1953-1954 và Chiến dịch Điện Biên Phủ', 'https://nhandan.vn/post-803638.html'),
  'baolaocai-dong-xuan': source('baolaocai-dong-xuan', 'Báo Lào Cai — Chiến thắng Điện Biên Phủ: Bài học đối với sự nghiệp xây dựng nền quốc phòng toàn dân vững mạnh', 'https://baolaocai.vn/chien-thang-dien-bien-phu-bai-hoc-doi-voi-su-nghiep-xay-dung-nen-quoc-phong-toan-dan-vung-manh-post382636.html'),
  'baolaocai-decision': source('baolaocai-decision', 'Báo Lào Cai — Những quyết định cân não làm nên chiến thắng Điện Biên Phủ', 'https://baolaocai.vn/nhung-quyet-dinh-can-nao-lam-nen-chien-thang-dien-bien-phu-post382327.html'),
  'daibieu-decision': source('daibieu-decision', 'Báo Đại biểu Nhân dân — Chọn Điện Biên Phủ - Quyết định lịch sử', 'https://daibieunhandan.vn/chon-dien-bien-phu-quyet-dinh-lich-su-10335081.html'),
  'vnexpress-dien-bien': source('vnexpress-dien-bien', 'VnExpress — Chiến địa Điện Biên Phủ sau 70 năm', 'https://vnexpress.net/chien-dia-dien-bien-phu-sau-70-nam-4736615.html'),
  'dienbien-southern-sector': source('dienbien-southern-sector', 'Sở VHTTDL Điện Biên — Phân khu phía Nam của Tập đoàn cứ điểm Điện Biên Phủ', 'https://svhttdl.dienbien.gov.vn/portal/pages/2020-6-22/Phan-khu-phia-Nam-cua-Tap-doan-cu-diem-Dien-Bien-Pq3vk99p081mt.aspx'),
};

// puzzleIds are played in order; a room is complete when its last puzzle is solved.
const chapter = (id, title, kicker, goal, clueIds, puzzleIds, nextChapterId, outroBeatId = null) => ({ id, title, kicker, goal, clueIds, puzzleIds, nextChapterId, introBeatId: `${id}-intro`, outroBeatId });
const NAVA_CLUE_IDS = ['nava-planner', 'nava-radio-note', 'nava-diary', 'nava-newspaper', 'nava-allied-telegram', 'nava-calendar', 'nava-dbp-dossier'];
export const chapters = {
  museum: chapter('museum', 'Ánh sáng từ mô hình', 'Bảo tàng · Hiện tại', 'Theo Quang khám phá mô hình hầm Đờ Cát và cánh cửa ký ức.', [], [], 'him-lam'),
  'him-lam': chapter('him-lam', 'Dấu mở đầu', 'Chương I · Ký ức Him Lam', 'Ghi bốn manh mối và ghép trình tự trận mở màn.', ['him-lam-position', 'him-lam-artillery', 'him-lam-infantry', 'him-lam-victory'], ['him-lam'], 'navarre-plan'),
  'navarre-plan': chapter('navarre-plan', 'Bàn cờ Đông Dương', 'Chương II · Kế hoạch Nava và Đông – Xuân', 'Cân lại kế hoạch của Nava, bắt hai giọng điện, mở nắm đấm thép và chọn nước cờ quyết định.', NAVA_CLUE_IDS, ['nava-balance', 'nava-radio', 'nava-fist', 'nava-fold'], 'command-post', 'navarre-plan-outro'),
  'command-post': chapter('command-post', 'Bức điện cuối hành lang', 'Chương III · Sở chỉ huy', 'Ghép bản tin được biên soạn và chọn ngày chiến thắng.', ['command-report', 'command-advance', 'command-capture'], ['command-post'], 'peace'),
  peace: chapter('peace', 'Điều mang về', 'Chương IV · Cánh cửa hòa bình', 'Có thể đọc thêm ký ức hoặc suy nghĩ, rồi tự chọn bước qua cánh cửa.', ['peace-memory', 'peace-community'], [], 'ending'),
  ending: chapter('ending', 'Trở lại bên mô hình', 'Bảo tàng · Trở về hiện tại', 'Đọc lời kết và giữ lại một điều muốn tìm hiểu thêm.', [], [], null),
};

// A line is Quang's narration unless it names another speaker, e.g. system('…').
const system = text => ({ speakerId: 'system', text });
const beat = (id, chapterId, texts, requiredDiscoveredClueIds = [], sourceIds = [], { requiresRoomCompletion = false } = {}) => ({
  id, chapterId, requiredDiscoveredClueIds, requiresRoomCompletion,
  lines: texts.map(entry => {
    const { speakerId = 'quang', text } = typeof entry === 'string' ? { text: entry } : entry;
    return { speakerId, portraitId: speakerId, text, sourceIds, fictional: true };
  }),
});
export const beats = {
  'museum-intro': beat('museum-intro', 'museum', [
    'Mình là Quang. Hôm nay, ở Bảo tàng Chiến thắng Điện Biên Phủ, mình dừng trước mô hình hầm Đờ Cát. Khi tay mình chạm vào mô hình, một luồng sáng lạ bất chợt phủ kín mọi thứ.',
    'Ánh sáng tan đi. Mình đang đứng trong một căn hầm, trước tờ lịch ngày 7/5/1954. Những trang tư liệu từ tháng 3 và tháng 4 nằm quanh mình, như đang chờ được đọc lại.',
    'Một giọng nói vang lên, nhắc mình giải những cánh cửa lịch sử để tìm đường trở về. Mình hít sâu, mở sổ tay và bước đến dấu vết đầu tiên. Có lẽ mình phải hiểu điều đã xảy ra trước khi tìm được lối ra.',
  ]),
  'him-lam-intro': beat('him-lam-intro', 'him-lam', [
    'Mùi giấy và ánh đèn vàng dẫn mình vào gian đầu tiên. Trên bàn là bốn dấu vết của trận Him Lam, trận mở màn chiến dịch.',
    'Mỗi tờ giấy chỉ giữ một phần câu chuyện. Mình sẽ đọc từng dấu vết trước khi ghép lại thứ tự, bắt đầu từ những công việc đã diễn ra trước tiếng pháo.',
  ]),
  'navarre-plan-intro': beat('navarre-plan-intro', 'navarre-plan', [
    'Cánh cửa sau lưng khép lại. Bên trái là một bàn làm việc kiểu Pháp, bên phải là lán tham mưu vách nứa. Ở giữa là sa bàn Đông Dương với một bàn tay sắt nắm chặt.',
    system('Ngươi đã biết tên người cầm quân Pháp. Giờ hãy đọc kế hoạch của hắn. Một bên muốn nắm chặt nắm đấm, một bên muốn buộc nắm đấm ấy xòe ra.'),
    'Muốn biết ta đánh thế nào, trước hết phải hiểu địch định làm gì. Mình bắt đầu từ bàn của Nava, đọc và ghi từng dấu vết vào sổ tay trước khi động đến câu đố.',
  ]),
  'navarre-plan-outro': beat('navarre-plan-outro', 'navarre-plan', [
    system('Ngày 6/12/1953, Bộ Chính trị do Chủ tịch Hồ Chí Minh chủ trì quyết định mở Chiến dịch Điện Biên Phủ. Hòm sắt đã mở, mảnh ghép thứ hai thuộc về ngươi. Phía sau cánh cửa, cả một dân tộc đang chuẩn bị.'),
    'Điện Biên Phủ mạnh nhất, nhưng nằm giữa núi rừng, xa hậu phương, sống nhờ máy bay. Đánh tan nơi này là đánh vào trái tim kế hoạch của Nava.',
    'Sức mạnh không chỉ nằm ở đối đầu trực diện, mà còn ở việc nắm tình hình, chủ động chọn hướng đánh và buộc đối phương phải phân tán.',
  ], [], ['baolaocai-decision', 'daibieu-decision'], { requiresRoomCompletion: true }),
  'command-post-intro': beat('command-post-intro', 'command-post', [
    'Tiếng giấy khẽ động bên chiếc máy điện đài. Mình tìm thấy ba mẩu bản tin, như ba phần của một câu chưa viết xong.',
    'Mình đặt chúng cạnh nhau, tìm phần mở đầu và kết quả. Có một ngày trên bản tin mà mình đã gặp ở gian bản đồ; lần này, mình muốn hiểu rõ sự kiện gắn với ngày ấy.',
  ]),
  'peace-intro': beat('peace-intro', 'peace', [
    'Căn phòng cuối không có ổ khóa bằng con số. Mình thấy một bức ảnh, một bàn học và khoảng sáng bên ngoài cánh cửa.',
    'Mình muốn mang về điều gì từ chuyến đi này? Có lẽ phải nhìn kỹ những con người và những việc nhỏ trong hiện tại trước khi trả lời.',
  ]),
  'ending-intro': beat('ending-intro', 'ending', [
    'Ánh sáng trở lại, rồi dịu dần. Mình lại đứng bên mô hình hầm Đờ Cát trong bảo tàng. Mọi thứ vẫn như lúc đầu, nhưng lần này những ngày tháng đã gắn với những con người và sự việc mình vừa tìm hiểu.',
    'Chiến thắng Điện Biên Phủ ngày 7/5/1954 là một dấu mốc lớn. Nó không có nghĩa rằng ngay ngày ấy đất nước đã thống nhất hay mọi nơi đều lập tức có hòa bình.',
    'Mình rời mô hình với lòng biết ơn và một câu hỏi để tiếp tục tìm hiểu. Mình muốn góp phần giữ gìn một tương lai hòa bình, bắt đầu từ cách mình học, lắng nghe và đối xử với người khác hôm nay.',
  ], [], ['nhandan-campaign']),
};

export const clues = {};
function addClue(id, chapterId, title, body, texts, sourceIds = [], direction = '') {
  const beatId = `${id}-story`;
  clues[id] = { id, chapterId, title, body, beatId, sourceIds, fictional: sourceIds.length === 0, direction };
  beats[beatId] = beat(beatId, chapterId, texts, [id], sourceIds);
}
addClue('him-lam-position', 'him-lam', 'Hồ sơ chuẩn bị', 'Chuẩn bị trận địa: triển khai lực lượng, chuẩn bị cho trận đánh trước khi khai hỏa.', [
  'Mình lật trang hồ sơ. Trước tiếng pháo là công việc chuẩn bị trận địa và triển khai lực lượng; trận đánh không bắt đầu bằng một mệnh lệnh xuất hiện từ hư không.',
  'Mình ghi thẻ “Chuẩn bị trận địa”. Đây phải là bước đứng trước những hoạt động tiến công trong bộ thẻ của mình.',
], ['museum-him-lam'], 'Bàn hồ sơ ở gian phía tây.');
addClue('him-lam-artillery', 'him-lam', 'Dòng ghi bên điện đài', 'Pháo binh khai hỏa chiều 13/3/1954, mở màn trận đánh Him Lam.', [
  'Bên điện đài, mình đọc được mốc chiều 13/3/1954. Pháo binh khai hỏa, mở màn trận đánh vào Him Lam.',
  'Mình không cần đoán một phút cụ thể. Điều quan trọng ở đây là hiểu tiếng pháo đến sau chuẩn bị và trước bước bộ binh tiến công.',
], ['museum-him-lam'], 'Điện đài ở gian phía bắc.');
addClue('him-lam-infantry', 'him-lam', 'Sơ đồ hành lang', 'Sau hỏa lực pháo binh, bộ binh tiến công các vị trí phòng ngự ở Him Lam.', [
  'Những nét bút trên tờ giấy khiến mình nghĩ đến bước chân người lính. Sau phần hỏa lực mở màn là bộ binh tiến công các vị trí phòng ngự.',
  'Mũi tên trong gian này chỉ giúp mình đọc thứ tự, không tái hiện một đường tiến công chính xác. Mình đặt thẻ bộ binh sau thẻ pháo binh.',
], ['museum-him-lam'], 'Sơ đồ ở hành lang phía đông.');
addClue('him-lam-victory', 'him-lam', 'Bản tin Him Lam', 'Quân ta làm chủ Him Lam, giành thắng lợi trận mở màn; chiến dịch chưa kết thúc ở đây.', [
  'Bản tin nói đến việc làm chủ Him Lam. Mình thấy rõ điểm kết của bốn thẻ: thắng lợi của trận mở màn.',
  'Mình gạch dưới chữ “mở màn”. Chiến thắng này không phải ngày kết thúc toàn chiến dịch; gian bản đồ phía sau vẫn còn nhiều điều để đọc.',
], ['museum-him-lam'], 'Bản tin trong gian bản đồ phía nam.');
// Room 2: every fact a step needs is in the body of a clue the player reads and records.
addClue('nava-planner', 'navarre-plan', 'Sổ kế hoạch 18 tháng', 'Kế hoạch Nava được Hội đồng Quốc phòng Pháp thông qua ngày 24/7/1953, định trong 18 tháng giành thắng lợi quân sự quyết định. Bước 1 (thu – đông 1953 và xuân 1954): phòng ngự chiến lược ở miền Bắc, tiến công chiến lược ở miền Nam. Bước 2 (từ thu – đông 1954): chuyển lực lượng ra miền Bắc, tiến công, giành thắng lợi quân sự quyết định. Lề trang: “84 tiểu đoàn cơ động toàn Đông Dương” · “40 tiểu đoàn cho mọi chiến trường còn lại”.', [
  'Cuốn sổ trên bàn Nava có mười tám trang, mỗi trang một tháng. Trang đầu ghi: kế hoạch được Hội đồng Quốc phòng Pháp thông qua ngày 24/7/1953, hẹn trong mười tám tháng sẽ giành thắng lợi quân sự quyết định.',
  'Kế hoạch chia làm hai bước. Bước 1, thu – đông 1953 và xuân 1954: phòng ngự chiến lược ở miền Bắc, tiến công chiến lược ở miền Nam. Bước 2, từ thu – đông 1954: chuyển lực lượng ra miền Bắc, tiến công để giành thắng lợi quyết định.',
  'Ở lề trang có hai dòng bút chì: “84 tiểu đoàn cơ động toàn Đông Dương” và “40 tiểu đoàn cho mọi chiến trường còn lại”. Phần chênh lệch hẳn đang dồn ở đồng bằng Bắc Bộ. Không trang nào nói đến chuyện rút quân.',
], ['nhandan-navarre-plan', 'loigiaihay-navarre'], 'Bàn làm việc của Nava ở gian tây bắc.');
addClue('nava-radio-note', 'navarre-plan', 'Ghi chú trên điện đài', '“Hai bức điện phát cùng lúc trên một sóng, chữ người này chen vào chữ người kia. Hãy nghe từng người một.” Tai nghe trái ghi “Bộ chỉ huy Pháp”: bên đang dồn quân về một chỗ. Tai nghe phải ghi “Việt Bắc”: bên muốn kéo quân địch ra nhiều nơi.', [
  'Một mảnh giấy dán trên máy điện đài: “Hai bức điện phát cùng lúc trên một sóng, chữ người này chen vào chữ người kia. Hãy nghe từng người một.”',
  'Tai nghe trái ghi “Bộ chỉ huy Pháp”, tai phải ghi “Việt Bắc”. Mình nhớ lại cuốn sổ của Nava: bên Pháp đang dồn quân về đồng bằng, còn bên Việt Bắc hẳn muốn kéo quân địch ra nhiều nơi.',
  'Nếu hai người nói xen nhau từng chữ, mình chỉ cần nghe thật chậm từng chữ một, tách ra cho đúng người rồi ghi mỗi từ vào đúng tai nghe.',
], [], 'Điện đài ở lán tham mưu Việt Bắc, gian đông bắc.');
addClue('nava-diary', 'navarre-plan', 'Nhật ký chiến sĩ', 'Từ ngày 10/12/1953, chủ lực ta tiến công hướng Tây Bắc, giải phóng thị xã Lai Châu. Nava phải đưa thêm 6 tiểu đoàn cơ động lên tăng cường Điện Biên Phủ: nơi tập trung quân thứ hai của Pháp (nơi thứ nhất là đồng bằng Bắc Bộ).', [
  'Trang nhật ký đề tháng 12/1953: “Từ ngày 10, đơn vị mình tiến công hướng Tây Bắc, vào thị xã Lai Châu. Đêm nào cũng nghe máy bay địch bay về phía lòng chảo Điện Biên Phủ.”',
  'Dòng cuối viết vội: “Nava phải đưa thêm 6 tiểu đoàn cơ động lên Điện Biên Phủ, nơi tập trung quân thứ hai.” Nơi thứ nhất là đồng bằng Bắc Bộ, vậy Tây Bắc là nước đầu tiên ta buộc Nava phải tách quân.',
], ['loigiaihay-dong-xuan'], 'Góc nhật ký ở gian tây nam.');
addClue('nava-newspaper', 'navarre-plan', 'Trang báo cũ', 'Từ ngày 21/12/1953, liên quân Việt – Lào tiến công hướng Trung Lào, giải phóng Thà Khẹt, uy hiếp Xê-nô. Nava buộc phải tăng quân giữ Xê-nô.', [
  'Tờ báo đã ố vàng, tít lớn in: “Thà Khẹt giải phóng!”. Bài viết kể từ ngày 21/12/1953, liên quân Việt – Lào tiến công hướng Trung Lào.',
  'Đoạn cuối cho biết địch vội tăng quân giữ Xê-nô. Lai Châu bắt đầu từ ngày 10/12, còn Trung Lào từ ngày 21/12, nên Xê-nô phải đứng sau Điện Biên Phủ trong thứ tự của mình.',
], ['loigiaihay-dong-xuan', 'wikipedia-dong-xuan'], 'Giá báo cũ ở gian giữa phía nam.');
addClue('nava-allied-telegram', 'navarre-plan', 'Điện liên quân Việt – Lào', 'Cuối tháng 1/1954, liên quân Việt – Lào tiến công hướng Thượng Lào, giải phóng tỉnh Phông-xa-lì và lưu vực sông Nậm Hu. Nava phải đưa quân tăng cường cho Luông Pha-bang.', [
  'Bức điện liên quân Việt – Lào đề cuối tháng 1/1954: “Ta tiến công hướng Thượng Lào. Phông-xa-lì giải phóng, lưu vực sông Nậm Hu sạch bóng giặc.”',
  'Địch phải co về giữ Luông Pha-bang. Cuối tháng 1/1954 đến sau Trung Lào tháng 12/1953 nhưng trước tờ lịch tháng 2, nên Luông Pha-bang đứng sau Xê-nô.',
], ['loigiaihay-dong-xuan', 'loigiaihay-five-places'], 'Bàn điện báo ở gian đông nam.');
addClue('nava-calendar', 'navarre-plan', 'Tờ lịch tháng 2/1954', 'Đầu tháng 2/1954, ta tiến công hướng Bắc Tây Nguyên, giải phóng Kon Tum, uy hiếp Plây-ku. Pháp phải tăng quân giữ Plây-ku: nơi tập trung quân thứ năm.', [
  'Tờ lịch tháng 2/1954 còn một dòng mực đỏ: “Ta tiến công hướng Bắc Tây Nguyên, Kon Tum giải phóng, địch phải dồn quân giữ Plây-ku.”',
  'Bên lề có người ghi thêm: “nơi tập trung quân thứ năm”. Vậy Plây-ku là nước đi cuối cùng trên sa bàn, sau ba hướng tiến công khác.',
], ['loigiaihay-dong-xuan', 'loigiaihay-five-places'], 'Tủ tư liệu ở gian giữa phía bắc.');
addClue('nava-dbp-dossier', 'navarre-plan', 'Hồ sơ Điện Biên Phủ', 'Ngày 20/11/1953, Pháp nhảy dù chiếm Điện Biên Phủ. Nơi này ban đầu không nằm trong kế hoạch, rồi thành trung tâm của Kế hoạch Nava: tập đoàn cứ điểm mạnh nhất Đông Dương, 49 cứ điểm, 3 phân khu, 16.200 quân; sân bay Mường Thanh (chính) và Hồng Cúm (dự bị). Điểm yếu: nằm giữa núi rừng, xa hậu phương, mọi tiếp tế đều phải dựa vào đường không.', [
  'Tập hồ sơ kẹp trên nắp hòm sắt ghi: ngày 20/11/1953, Pháp nhảy dù chiếm Điện Biên Phủ. Nơi này ban đầu không nằm trong kế hoạch, rồi dần thành trung tâm của Kế hoạch Nava.',
  'Đây là tập đoàn cứ điểm mạnh nhất Đông Dương: 49 cứ điểm, 3 phân khu, 16.200 quân, hai sân bay Mường Thanh và Hồng Cúm. Nhưng nó nằm giữa núi rừng, xa hậu phương, mọi tiếp tế đều phải dựa vào đường không.',
  'Một nơi mạnh như thế mà phải sống nhờ máy bay. Mình ghi lại điều này trước khi gấp tấm bản đồ ở hòm sắt.',
], ['vnexpress-dien-bien', 'loigiaihay-dong-xuan', 'dienbien-southern-sector', 'baolaocai-decision'], 'Nắp hòm sắt ở phía đông hành lang.');
addClue('command-report', 'command-post', 'Mẩu điện: sở chỉ huy', 'Mẩu văn bản hư cấu thứ hai: “tiến vào sở chỉ huy đối phương,”. Ghép sau mẩu tiến quân và trước mẩu kết quả.', [
  'Mình nhặt được một mẩu giữa câu: “tiến vào sở chỉ huy đối phương,”. Nó cần phần mở đầu phía trước và kết quả phía sau.',
  'Mình giữ mẩu giấy ở giữa trang sổ. Phía trước phải là hành động tiến công, còn phía sau sẽ cho mình biết kết quả ở sở chỉ huy ấy.',
], [], 'Bàn điện báo ở phía tây.');
addClue('command-advance', 'command-post', 'Mẩu điện: tiến quân', 'Mẩu văn bản hư cấu mở đầu: “Quân ta tiến công,”. Đây là mẩu đầu tiên của bản tin trong trò chơi.', [
  'Mẩu giấy này mở đầu bằng “Quân ta tiến công,”. Dấu phẩy cho mình biết câu chuyện vẫn còn tiếp.',
  'Mình đặt nó trước mẩu nhắc đến sở chỉ huy. Khi ghép liền những câu ngắn này, mình bắt đầu nhìn ra ý nghĩa của bản tin.',
], [], 'Khay hồ sơ ở phía bắc.');
addClue('command-capture', 'command-post', 'Mẩu điện: kết quả', 'Mẩu văn bản hư cấu cuối: “bắt Đờ Cát cùng bộ chỉ huy.” Sự kiện đối chiếu: ngày 7/5/1954, chiến thắng Điện Biên Phủ.', [
  'Mẩu cuối nói “bắt Đờ Cát cùng bộ chỉ huy.” Mình đối chiếu với tư liệu về ngày 7/5/1954 rồi ghi ngày ấy bên cạnh bản tin.',
  'Mình kiểm tra thêm một lần để không nhầm ngày mở màn với ngày chiến thắng. Mình sẽ ghép tiến công, sở chỉ huy, kết quả; sau đó chọn ngày 7/5/1954.',
], ['nhandan-campaign'], 'Bảng tin trong gian phía đông.');
addClue('peace-memory', 'peace', 'Ký ức trong tấm ảnh', 'Một cảnh hư cấu gợi nhớ những con người phía sau tư liệu. Có thể tìm hiểu thêm lịch sử, lắng nghe ký ức và giữ gìn nơi tưởng niệm.', [
  'Trong bức ảnh tưởng tượng của gian này, mình nhìn thấy những gương mặt bình dị. Những dòng tóm tắt chiến dịch không thể kể hết cuộc đời của từng người.',
  'Mình muốn học thêm từ tư liệu và lắng nghe với lòng tôn trọng. Không cần một lời hứa thật lớn để bắt đầu việc ấy.',
], [], 'Bức ảnh ở góc sáng phía tây.');
addClue('peace-community', 'peace', 'Bàn học hôm nay', 'Suy nghĩ và hành động hiện tại là lựa chọn cá nhân. Có thể để trống phần suy nghĩ; trò chơi không chấm đúng sai quan điểm.', [
  'Chiếc bàn học làm mình nhớ hiện tại. Một việc nhỏ như giúp bạn, chăm sóc không gian chung hay tìm hiểu lịch sử cũng có thể là điều mình mang về.',
  'Mình có thể viết vài chữ, hoặc chỉ yên lặng suy nghĩ. Cánh cửa không đòi chấm điểm cảm xúc của mình; mình tự chọn khi đã sẵn sàng bước tiếp.',
], [], 'Bàn học ở phía đông cánh cửa.');

// Compiled for the game, not a verbatim document; its four blanks are the words revealed by the fist puzzle.
const PHUONG_CHAM = ['TÍCH CỰC', 'CHỦ ĐỘNG', 'CƠ ĐỘNG', 'LINH HOẠT'];
const VIET_BAC_TELEGRAM = { text: 'Bộ Chính trị, cuối tháng 9/1953: tập trung lực lượng tiến công vào những hướng quan trọng mà địch tương đối yếu, buộc địch phải phân tán lực lượng. Phương châm:', words: PHUONG_CHAM };
export const puzzles = {
  'him-lam': {
    id: 'him-lam', chapterId: 'him-lam', type: 'sequence', title: 'Trình tự trận mở màn', instruction: 'Sắp bốn giai đoạn theo các manh mối đã ghi.', requiredClueIds: chapters['him-lam'].clueIds,
    stages: [{ id: 'position', label: 'Chuẩn bị trận địa' }, { id: 'artillery', label: 'Pháo binh khai hỏa chiều 13/3/1954' }, { id: 'infantry', label: 'Bộ binh tiến công' }, { id: 'victory', label: 'Làm chủ Him Lam — thắng lợi trận mở màn' }],
    hints: ['Bắt đầu bằng việc chuẩn bị, kết thúc bằng kết quả của trận mở màn.', 'Chuẩn bị trận địa → pháo binh → bộ binh → làm chủ Him Lam.'], answerSpec: { orderedStageIds: ['position', 'artillery', 'infantry', 'victory'] },
  },
  'nava-balance': {
    id: 'nava-balance', chapterId: 'navarre-plan', type: 'balance', title: 'Cán cân 84', goal: 'Đọc Sổ kế hoạch trên bàn Nava, rồi cân lại 84 tiểu đoàn cơ động.',
    instruction: 'Xếp mỗi việc vào đúng bước của Kế hoạch Nava, rồi chia 84 quả cân “tiểu đoàn cơ động” cho hai đĩa theo lề Sổ kế hoạch. Cân chỉ khóa khi cả hai phần đều đúng.', requiredClueIds: ['nava-planner'], totalWeights: 84,
    cards: [{ id: 'defend-north', label: 'Phòng ngự chiến lược ở miền Bắc' }, { id: 'attack-south', label: 'Tiến công chiến lược ở miền Nam' }, { id: 'move-north', label: 'Chuyển lực lượng ra miền Bắc' }, { id: 'decisive-win', label: 'Giành thắng lợi quân sự quyết định' }, { id: 'withdraw', label: 'Rút quân khỏi Đông Dương' }],
    steps: [{ id: 'step-1', label: 'Bước 1 · thu – đông 1953, xuân 1954' }, { id: 'step-2', label: 'Bước 2 · từ thu – đông 1954' }, { id: 'none', label: 'Không thuộc kế hoạch' }],
    hints: ['Bước 1 bắt đầu từ thu – đông 1953, Bước 2 từ thu – đông 1954. Số quân nằm ở lề Sổ kế hoạch.', 'Phòng ngự ở Bắc, tiến công ở Nam: Bước 1. Chuyển quân ra Bắc, giành thắng lợi quyết định: Bước 2. Rút quân không thuộc kế hoạch. Đĩa Bắc Bộ: 84 − 40 = 44.'],
    messages: { 'wrong-steps': 'Có việc chưa đúng bước. Đọc lại Sổ kế hoạch: mỗi bước làm gì, vào lúc nào?', 'wrong-weights': 'Cán cân chưa khóa. Nava muốn đĩa Bắc Bộ nặng hơn tất cả phần còn lại cộng lại; lề sổ cho biết các chiến trường khác có bao nhiêu tiểu đoàn.' },
    successText: 'Cán cân nghiêng hẳn về Bắc Bộ: 44 trên 84 tiểu đoàn cơ động. Ngăn bàn bật ra một cuộn băng điện báo. Đi tới điện đài ở lán đông bắc.',
    answerSpec: { cardSteps: { 'defend-north': 'step-1', 'attack-south': 'step-1', 'move-north': 'step-2', 'decisive-win': 'step-2', withdraw: 'none' }, northWeights: 44 },
    sourceIds: ['nhandan-navarre-plan', 'loigiaihay-navarre'],
  },
  'nava-radio': {
    id: 'nava-radio', chapterId: 'navarre-plan', type: 'interleave', title: 'Hai giọng trên một sóng', goal: 'Đến điện đài ở lán Việt Bắc và tách hai bức điện chung một sóng.',
    instruction: 'Cuộn băng chỉ có một dòng chữ, nhưng là hai bức điện phát chen nhau. Tách thành hai từ rồi ghi mỗi từ vào đúng tai nghe. Gõ có dấu hay không dấu đều được.', requiredClueIds: ['nava-radio-note'],
    tape: 'TPAHPATNRTUANNG', channels: [{ id: 'french', label: 'Bộ chỉ huy Pháp', word: 'TẬP TRUNG' }, { id: 'vietbac', label: 'Việt Bắc', word: 'PHÂN TÁN' }],
    hints: ['Thử đọc cách một chữ. Nút “Tô chữ ở vị trí lẻ” đã mở để bạn dễ nhìn hơn.', 'Chữ lẻ: T-A-P-T-R-U-N-G. Ai muốn dồn quân về một chỗ?'],
    messages: { 'swapped-channels': 'Hai từ đã đúng nhưng ngược tai nghe. Người muốn dồn quân thành nắm đấm là Nava, không phải ta.', 'incorrect-answer': 'Hai bức điện chưa tách đúng. Thử đọc cách một chữ: chữ thứ 1, 3, 5… thuộc về một người.' },
    successText: 'Nava TẬP TRUNG, ta buộc địch PHÂN TÁN. Khay điện đài nhả ra bốn thẻ mũi tên. Mang chúng tới sa bàn giữa hành lang.',
    telegram: VIET_BAC_TELEGRAM, answerSpec: { french: 'TAPTRUNG', vietbac: 'PHANTAN' }, sourceIds: ['loigiaihay-dong-xuan', 'baolaocai-dong-xuan', 'nhandan-dong-xuan'],
  },
  'nava-fist': {
    id: 'nava-fist', chapterId: 'navarre-plan', type: 'fist', title: 'Nắm đấm thép', goal: 'Ghi bốn mẩu tin trong phòng, rồi mở từng ngón của nắm đấm thép trên sa bàn.',
    instruction: 'Mỗi lượt, chọn một thẻ mũi tên và vùng tiến công rồi đi nước. Đúng vùng, đúng lượt thì một ngón tay sắt mở ra và một lá cờ Pháp dựng lên. Đi theo thứ tự nơi tập trung quân thứ 2 → 5; sai lượt thì Nava gom quân lại.',
    requiredClueIds: ['nava-diary', 'nava-newspaper', 'nava-allied-telegram', 'nava-calendar'],
    cards: [{ id: 'lai-chau', label: 'Giải phóng thị xã Lai Châu · 12/1953', short: 'Lai Châu' }, { id: 'tha-khet', label: 'Giải phóng Thà Khẹt · 12/1953', short: 'Thà Khẹt' }, { id: 'nam-hu', label: 'Giải phóng Phông-xa-lì, sông Nậm Hu · cuối 1/1954', short: 'Nậm Hu' }, { id: 'kon-tum', label: 'Giải phóng Kon Tum · đầu 2/1954', short: 'Kon Tum' }],
    regions: [{ id: 'tay-bac', label: 'Tây Bắc' }, { id: 'trung-lao', label: 'Trung Lào' }, { id: 'thuong-lao', label: 'Thượng Lào' }, { id: 'tay-nguyen', label: 'Bắc Tây Nguyên' }],
    flags: [{ id: 'dbp', label: 'Điện Biên Phủ', word: PHUONG_CHAM[0] }, { id: 'seno', label: 'Xê-nô', word: PHUONG_CHAM[1] }, { id: 'luang-prabang', label: 'Luông Pha-bang', word: PHUONG_CHAM[2] }, { id: 'pleiku', label: 'Plây-ku', word: PHUONG_CHAM[3] }],
    moveTexts: ['Lai Châu mất, Nava phải đưa quân lên Điện Biên Phủ. Ngón thứ nhất mở: TÍCH CỰC.', 'Thà Khẹt giải phóng, quân Pháp kéo về giữ Xê-nô. Ngón thứ hai mở: CHỦ ĐỘNG.', 'Nậm Hu sạch bóng giặc, địch co về Luông Pha-bang. Ngón thứ ba mở: CƠ ĐỘNG.', 'Kon Tum giải phóng, địch dồn quân giữ Plây-ku. Ngón thứ tư mở: LINH HOẠT.'],
    hints: ['Mẩu tin nào nói “nơi tập trung quân thứ hai”? Bắt đầu từ đó, rồi xếp các mẩu còn lại theo ngày.', 'Lai Châu (Tây Bắc) → Thà Khẹt (Trung Lào) → Nậm Hu (Thượng Lào) → Kon Tum (Bắc Tây Nguyên).'],
    messages: { 'wrong-turn': 'Nava kịp gom quân lại. Đọc lại các mẩu tin: nơi tập trung quân thứ hai là ở đâu?', 'wrong-region': 'Mũi tên bật ra: hướng tiến công này không nằm ở vùng đó. Đọc lại mẩu tin để xem nơi được giải phóng thuộc vùng nào.', 'incorrect-answer': 'Bàn tay sắt chưa xòe hết. Đi đủ bốn nước theo đúng thứ tự.' },
    successText: 'Bàn tay sắt xòe hẳn. Phương châm hiện đủ: tích cực, chủ động, cơ động, linh hoạt. Trong lòng bàn tay là một tấm bản đồ gấp; mang tới hòm sắt.',
    answerSpec: { moves: [{ card: 'lai-chau', region: 'tay-bac', flag: 'dbp' }, { card: 'tha-khet', region: 'trung-lao', flag: 'seno' }, { card: 'nam-hu', region: 'thuong-lao', flag: 'luang-prabang' }, { card: 'kon-tum', region: 'tay-nguyen', flag: 'pleiku' }] },
    telegram: VIET_BAC_TELEGRAM, sourceIds: ['loigiaihay-dong-xuan', 'nhandan-dong-xuan'],
  },
  'nava-fold': {
    id: 'nava-fold', chapterId: 'navarre-plan', type: 'fold', title: 'Bản đồ gấp', goal: 'Đọc Hồ sơ Điện Biên Phủ, rồi gấp bản đồ ở hòm sắt để chọn nơi quyết chiến.',
    instruction: 'Gấp bản đồ để mép nắm đấm của Nava chạm vào nơi trận quyết chiến sẽ diễn ra. Gấp đúng chỗ, các nét chữ đứt đoạn sẽ ghép thành một dòng; ngày và tháng trên dòng ấy là mã hòm sắt.', requiredClueIds: ['nava-dbp-dossier'],
    // Strip order on the paper. The flap shows the even-indexed characters of foldText, each target the odd-indexed ones of its
    // own text, so only a fold onto the right flag rebuilds the line; the other texts are what a wrong fold reads as.
    foldText: ['QUYẾT CHIẾN', '6 · 12 · 1953'],
    targets: [
      { id: 'luang-prabang', label: 'Luông Pha-bang', text: ['QƯYÔTĂCĐIƠN', '64·810 7 3963'], hint: 'Các nét chữ không khớp. Luông Pha-bang là nơi địch co về giữ sau khi mất lưu vực sông Nậm Hu; hồ sơ trận quyết chiến không nói về nơi này.' },
      { id: 'dbp', label: 'Điện Biên Phủ', text: ['QUYẾT CHIẾN', '6 · 12 · 1953'], hint: 'Các nét chữ ghép khít thành một dòng. Đọc ngày và tháng trên đó để mở khóa.' },
      { id: 'pleiku', label: 'Plây-ku', text: ['QỔYẠTỶCỨIỠN', '67·21· 5 0983'], hint: 'Các nét chữ không khớp. Plây-ku là nơi tập trung quân thứ năm sau khi Kon Tum được giải phóng, không phải tập đoàn cứ điểm sống nhờ hai sân bay.' },
      { id: 'seno', label: 'Xê-nô', text: ['QỲYẰTĨCỌIỮN', '60·519 1 8943'], hint: 'Các nét chữ không khớp. Xê-nô là nơi địch tăng quân sau khi mất Thà Khẹt; tập đoàn cứ điểm mạnh nhất Đông Dương nằm ở nơi khác.' },
    ],
    hints: ['Đọc lại Hồ sơ Điện Biên Phủ: nơi nào mạnh nhất nhưng xa hậu phương, sống nhờ máy bay?', 'Gấp tới Điện Biên Phủ, rồi nhập ngày và tháng hiện ra trên dòng chữ.'],
    messages: { 'wrong-target': 'Chọn một lá cờ để gấp bản đồ trước khi mở khóa.', 'wrong-code': 'Ổ khóa chưa mở. Mã gồm 4 số: ngày và tháng trên dòng chữ hiện ra khi gấp đúng chỗ.' },
    successText: 'Ngày 6/12/1953, Bộ Chính trị quyết định mở Chiến dịch Điện Biên Phủ. Hòm sắt mở: mảnh ghép thứ hai. Cửa phía đông đã mở.',
    answerSpec: { target: 'dbp', code: '0612' }, sourceIds: ['baolaocai-decision', 'daibieu-decision'],
  },
  'command-post': {
    id: 'command-post', chapterId: 'command-post', type: 'telegram', title: 'Ghép bản tin', instruction: 'Ghép ba mẩu câu được biên soạn cho trò chơi rồi chọn ngày sự kiện. Đây không phải nguyên văn điện báo lịch sử.', requiredClueIds: chapters['command-post'].clueIds,
    fragments: [{ id: 'advance', label: 'Quân ta tiến công,' }, { id: 'headquarters', label: 'tiến vào sở chỉ huy đối phương,' }, { id: 'capture', label: 'bắt Đờ Cát cùng bộ chỉ huy.' }], dateLabel: 'Ngày chiến thắng Điện Biên Phủ', dateOptions: [{ id: '1954-03-13', label: '13/3/1954' }, { id: '1954-03-30', label: '30/3/1954' }, { id: '1954-05-07', label: '7/5/1954' }],
    hints: ['Tìm phần mở đầu, nơi tiến vào rồi đến kết quả. Đối chiếu ngày trong bản tin cuối.', 'Tiến công → sở chỉ huy → bắt Đờ Cát cùng bộ chỉ huy. Ngày 7/5/1954.'], answerSpec: { orderedFragmentIds: ['advance', 'headquarters', 'capture'], date: '1954-05-07' },
  },
};
for (const { puzzleIds } of Object.values(chapters)) {
  puzzleIds.forEach((id, index) => { puzzles[id].requiresPuzzleId = puzzleIds[index - 1] ?? null; });
}
