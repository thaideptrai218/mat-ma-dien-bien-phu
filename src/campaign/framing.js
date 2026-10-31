import {element,button,heading} from '../room-one/ui-elements.js';
import {PAINTING_URL,MUSEUM_RETURN,CLOSING_LINE} from '../room-five/content.js';
import {framingLine} from '../audio/voice-id.js';

function painting() {
  const figure=element('figure','campaign-painting');
  const image=element('img'); image.src=PAINTING_URL;
  image.alt='Tranh minh họa chiến thắng: lá cờ, những người lính và đoàn người tiếp vận giữa núi rừng.';
  figure.append(image,element('figcaption','','Tranh minh họa sáng tác cho trò chơi · Không phải tranh hoặc ảnh tư liệu tại bảo tàng.'));
  return figure;
}
export const OPENING = [
  {eyebrow:'BẢO TÀNG · HIỆN TẠI',title:'Trước một bức tranh',paragraphs:[
    'Quang thích công nghệ, những trò giải đố và các câu chuyện bí ẩn. Nhưng với cậu, lịch sử thường chỉ còn là những mốc thời gian phải nhớ.',
    'Trong chuyến tham quan Bảo tàng Chiến thắng Điện Biên Phủ, Quang dừng lại trước bức tranh về chiến thắng sau 56 ngày đêm. Cậu nhìn những gương mặt trong tranh, rồi tự hỏi: nếu có thể đến tận nơi, mình sẽ hiểu những điều ấy như thế nào?',
    'Quang đưa tay chạm vào bức tranh. Một quầng sáng bỗng tràn qua đầu ngón tay.'
  ],button:'Chạm vào bức tranh'},
  {eyebrow:'KHÔNG GIAN HƯ CẤU · 7/5/1954',title:'Bên kia quầng sáng',paragraphs:[
    'Khi mở mắt, Quang thấy một căn hầm chật, những tấm bản đồ trên vách và cánh cửa đóng kín. Âm thanh bên ngoài vọng xuống, khác hẳn sự yên tĩnh trong bảo tàng.',
    'Hệ Thống: Ký Chủ đã bước vào dòng chảy lịch sử. Đây là không gian tái hiện hầm chỉ huy của tướng Đờ Cát, ngày 7 tháng 5 năm 1954. Muốn trở về thời đại của mình, Ký Chủ phải giải mã những dấu mốc đã làm nên chiến thắng Điện Biên Phủ.',
    'Quang: Khoan đã… Hệ Thống? Hệ Thống là cái gì vậy? Tao vừa còn đứng trong bảo tàng mà.',
    'Hệ Thống: Hệ Thống là người dẫn đường của Ký Chủ trong hành trình này. Ký Chủ hãy bình tĩnh; mỗi chỉ dẫn sẽ được đưa ra đúng lúc.'
  ],button:'Lắng nghe lời chỉ dẫn'},
  {eyebrow:'NĂM CĂN PHÒNG · BỐN MẢNH TRANH',title:'Lần theo những dấu mốc',paragraphs:[
    'Hệ Thống: Trước mắt Ký Chủ là năm căn phòng liên tiếp: bốn căn phòng thử thách và một căn phòng cuối cùng dẫn đến lối thoát. Hãy vượt qua bốn thử thách, thu thập đủ bốn mảnh ghép và hoàn thiện bức tranh trên cánh cửa cuối cùng. Chỉ khi ấy, Ký Chủ mới có thể trở về hiện tại.',
    'Quang: Bốn mảnh ghép, năm căn phòng. Được, tao chơi. Nhưng Hệ Thống phải nói rõ tao bắt đầu từ đâu.',
    'Hệ Thống: Phòng 1 cất giữ chặng đường xây dựng lực lượng từ năm 1950 đến giữa năm 1953. Khi cần, Ký Chủ nhấn Q để xem nhiệm vụ hiện tại; Hệ Thống sẽ lên tiếng sau mỗi bước.',
    'Dùng WASD hoặc phím mũi tên để đi, giữ Shift để chạy nhanh. Đến gần vật và nhấn E. M mở bản đồ, N mở sổ tay trong phòng; Sổ hành trình ở thanh trên giữ toàn văn các giấy đã ghi nhận ở những phòng trước.',
    'Cốt truyện du hành, thư và nhân vật viết thư là sáng tác. Nguồn lịch sử được ghi ngoài phần kể chuyện. Tiến độ tự lưu trên trình duyệt này.'
  ],button:'Bước vào phòng 1'}
];
// `voice` is optional ({ready, speak, enable, scene, cue} from the runtime): frames are read aloud once sound is on, and until
// then offer "Bật lồng tiếng", a real click that unlocks audio and starts reading the current frame.
// The control is always there: "Bật lồng tiếng" until sound is on, then "Nghe lại" (also after a blur stopped the voice).
// isCurrent(node) stops a slow unlock from narrating a frame that is no longer on screen.
function voiceButton(voice,lines,isCurrent) {
  if(!voice)return null;
  const refresh=()=>{
    const on=voice.ready();node.textContent=on?'Nghe lại':'Bật lồng tiếng';
    node.setAttribute('aria-label',on?'Nghe lại đoạn này':'Bật lồng tiếng để nghe đoạn này');
  };
  const node=button('',async()=>{
    const on=voice.ready()||await voice.enable();
    if(on&&isCurrent(node))voice.speak(lines);
    refresh();
  },'r1-voice-enable');
  refresh();return node;
}
export function introFrame(onBegin,voice) {
  const section=element('section','campaign-story'); let step=0,drawn=0;
  const draw=()=>{
    const current=OPENING[step],copy=element('div','campaign-story-copy');
    copy.append(heading(current.title,current.eyebrow));
    current.paragraphs.forEach(text=>copy.append(element('p','',text)));
    const lines=current.paragraphs.map(framingLine),token=++drawn;
    voice?.scene(step===0?'museum':'bunker'); // bed: museum, then the Đờ Cát bunker once the light has taken Quang
    copy.append(button(current.button,()=>{if(step===0)voice?.cue('time-warp');if(step===2)onBegin();else{step++;draw();section.querySelector('.r1-primary')?.focus();}},'r1-primary'));
    const enable=voiceButton(voice,lines,node=>node.isConnected&&token===drawn);if(enable)copy.append(enable);
    section.replaceChildren(painting(),copy);
    voice?.speak(lines);
  };
  draw(); return section;
}
export function returnFrame(complete,onFinish,onRestart,voice) {
  const section=element('section','campaign-story'),copy=element('div','campaign-story-copy');
  copy.append(heading(complete?'Câu chuyện còn tiếp':'Trở lại bảo tàng','HÀNH TRÌNH CỦA QUANG'));
  const lines=Array.isArray(MUSEUM_RETURN)?MUSEUM_RETURN:[MUSEUM_RETURN];
  for(const line of lines) copy.append(element('p','',typeof line==='string'?line:line.text));
  copy.append(element('blockquote','campaign-closing',CLOSING_LINE));
  copy.append(button(complete?'Bắt đầu một hành trình mới':'Khép lại hành trình',complete?onRestart:onFinish,'r1-primary'));
  const spoken=[...lines,CLOSING_LINE].map(line=>({speaker:'Lời kể',text:typeof line==='string'?line:line.text}));
  const enable=voiceButton(voice,spoken,node=>node.isConnected);if(enable)copy.append(enable);
  voice?.scene('museum');
  section.append(painting(),copy);
  voice?.speak(spoken);
  return section;
}
