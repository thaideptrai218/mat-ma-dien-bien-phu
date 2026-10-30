import {element,button,heading} from '../room-one/ui-elements.js';
import {PAINTING_URL,MUSEUM_RETURN,CLOSING_LINE} from '../room-five/content.js';

function painting() {
  const figure=element('figure','campaign-painting');
  const image=element('img'); image.src=PAINTING_URL;
  image.alt='Tranh minh họa chiến thắng: lá cờ, những người lính và đoàn người tiếp vận giữa núi rừng.';
  figure.append(image,element('figcaption','','Tranh minh họa sáng tác cho trò chơi · Không phải tranh hoặc ảnh tư liệu tại bảo tàng.'));
  return figure;
}
const opening = [
  {eyebrow:'BẢO TÀNG · HIỆN TẠI',title:'Trước một bức tranh',paragraphs:[
    'Quang thích công nghệ, những trò giải đố và các câu chuyện bí ẩn. Nhưng với cậu, lịch sử thường chỉ còn là những mốc thời gian phải nhớ.',
    'Trong chuyến tham quan Bảo tàng Chiến thắng Điện Biên Phủ, Quang dừng lại trước bức tranh về chiến thắng sau 56 ngày đêm. Cậu nhìn những gương mặt trong tranh, rồi tự hỏi: nếu có thể đến tận nơi, mình sẽ hiểu những điều ấy như thế nào?',
    'Quang đưa tay chạm vào bức tranh. Một quầng sáng bỗng tràn qua đầu ngón tay.'
  ],button:'Chạm vào bức tranh'},
  {eyebrow:'KHÔNG GIAN HƯ CẤU · 7/5/1954',title:'Bên kia quầng sáng',paragraphs:[
    'Khi mở mắt, Quang thấy một căn hầm chật, những tấm bản đồ trên vách và cánh cửa đóng kín. Âm thanh bên ngoài vọng xuống, khác hẳn sự yên tĩnh trong bảo tàng.',
    'Hệ thống: Ngươi đang ở trong không gian tái hiện hầm chỉ huy của Đờ Cát, ngày 7 tháng 5 năm 1954. Muốn trở về, hãy lần theo câu chuyện đã dẫn tới ngày này.',
    'Quang: Mình vừa ở bảo tàng… Bình tĩnh đã. Những tờ giấy và bản đồ này có lẽ sẽ cho mình biết phải bắt đầu từ đâu.'
  ],button:'Lắng nghe lời chỉ dẫn'},
  {eyebrow:'NĂM CĂN PHÒNG · BỐN MẢNH TRANH',title:'Lần theo những dấu mốc',paragraphs:[
    'Hệ thống: Bốn căn phòng đầu cất giữ bốn mảnh tranh. Đọc những giấy tờ, quan sát đồ vật và nối các dữ kiện. Ở căn phòng thứ năm, ngươi sẽ ghép lại bức tranh để tìm đường trở về.',
    'Quang: Nếu muốn hiểu ngày chiến thắng, mình phải quay lại những việc đã xảy ra trước đó. Mình sẽ bắt đầu từ quá trình xây dựng lực lượng và hoàn cảnh của hai phía.',
    'Dùng WASD hoặc phím mũi tên để đi, giữ Shift để chạy nhanh. Đến gần vật và nhấn E. M mở bản đồ, N mở sổ tay trong phòng; Sổ hành trình ở thanh trên giữ toàn văn các giấy đã ghi nhận ở những phòng trước.',
    'Cốt truyện du hành, thư và nhân vật viết thư là sáng tác. Nguồn lịch sử được ghi ngoài phần kể chuyện. Tiến độ tự lưu trên trình duyệt này.'
  ],button:'Bước vào phòng 1'}
];
export function introFrame(onBegin) {
  const section=element('section','campaign-story'); let step=0;
  const draw=()=>{
    const current=opening[step],copy=element('div','campaign-story-copy');
    copy.append(heading(current.title,current.eyebrow));
    current.paragraphs.forEach(text=>copy.append(element('p','',text)));
    copy.append(button(current.button,()=>{if(step===2)onBegin();else{step++;draw();section.querySelector('button')?.focus();}},'r1-primary'));
    section.replaceChildren(painting(),copy);
  };
  draw(); return section;
}
export function returnFrame(complete,onFinish,onRestart) {
  const section=element('section','campaign-story'),copy=element('div','campaign-story-copy');
  copy.append(heading(complete?'Câu chuyện còn tiếp':'Trở lại bảo tàng','HÀNH TRÌNH CỦA QUANG'));
  const lines=Array.isArray(MUSEUM_RETURN)?MUSEUM_RETURN:[MUSEUM_RETURN];
  for(const line of lines) copy.append(element('p','',typeof line==='string'?line:line.text));
  copy.append(element('blockquote','campaign-closing',CLOSING_LINE));
  copy.append(button(complete?'Bắt đầu một hành trình mới':'Khép lại hành trình',complete?onRestart:onFinish,'r1-primary'));
  section.append(painting(),copy); return section;
}
