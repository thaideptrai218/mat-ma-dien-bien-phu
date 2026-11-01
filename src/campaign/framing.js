import {element,button,heading} from '../room-one/ui-elements.js';
import {VICTORY_PHOTO_URL,museumReturn,CLOSING_LINE} from '../room-five/content.js';
import {activeHero, heroDialogueText} from '../heroes/hero-profiles.js';
import {heroCopy} from '../heroes/hero-copy.js';
import {framingLine} from '../audio/voice-id.js';
const GAME_TITLE_LOGO = new URL('../../assets/images/game-title-logo.png', import.meta.url).href;

function painting(onSelect,{titleLogo=false}={}) {
  const figure=element('figure',`campaign-painting${titleLogo?' campaign-painting--title':''}`);
  const art=element('span','campaign-painting-art');
  const image=element('img','campaign-painting-photo'); image.src=VICTORY_PHOTO_URL;
  image.alt='Lá cờ đỏ sao vàng tung bay trên nóc hầm Điện Biên Phủ.';
  art.append(image);
  if(titleLogo){
    const logo=element('img','campaign-painting-logo');logo.src=GAME_TITLE_LOGO;logo.alt='';logo.setAttribute('aria-hidden','true');
    art.append(logo);
  }
  if(onSelect){
    const trigger=button('',onSelect,'campaign-painting-trigger');
    trigger.setAttribute('aria-label','Chạm vào bức ảnh để tiếp tục'); trigger.append(art); figure.append(trigger);
  }else figure.append(art);
  return figure;
}
// The first frame (who the hero is) belongs to the chosen hero; the rest is shared and localized by name.
export const openingFrames = (hero = activeHero()) => [
  {eyebrow:'BẢO TÀNG · HIỆN TẠI',title:'Trước một bức ảnh',paragraphs:heroCopy(hero).intro,button:'Chạm vào mặt kính'},
  {eyebrow:'ĐIỆN BIÊN PHỦ · 7/5/1954',title:'Bên kia quầng sáng',paragraphs:[
    'Khi mở mắt, Long thấy một căn hầm chật, những tấm bản đồ trên vách và cánh cửa đóng kín. Âm thanh bên ngoài vọng xuống, khác hẳn sự yên tĩnh trong bảo tàng.',
    'Hệ Thống: Ký Chủ đã bước vào dòng chảy lịch sử. Đây là không gian tái hiện hầm chỉ huy của tướng Đờ Cát, ngày 7 tháng 5 năm 1954. Muốn trở về thời đại của mình, Ký Chủ phải giải mã những dấu mốc đã làm nên chiến thắng Điện Biên Phủ.',
    'Long: Khoan đã… Hệ Thống, tôi chưa hiểu chuyện gì đang xảy ra. Tôi vừa còn đứng trong bảo tàng mà.',
    'Hệ Thống: Hệ Thống là người dẫn đường của Ký Chủ trong hành trình này. Ký Chủ hãy bình tĩnh; mỗi chỉ dẫn sẽ được đưa ra đúng lúc.'
  ],button:'Lắng nghe lời chỉ dẫn'},
  {eyebrow:'NĂM CĂN PHÒNG · BỐN MẢNH TRANH',title:'Lần theo những dấu mốc',paragraphs:[
    'Hệ Thống: Trước mắt Ký Chủ là năm căn phòng liên tiếp: bốn căn phòng thử thách và một căn phòng cuối cùng dẫn đến lối thoát. Hãy vượt qua bốn thử thách, thu thập đủ bốn mảnh ghép và hoàn thiện bức ảnh trên cánh cửa cuối cùng. Chỉ khi ấy, Ký Chủ mới có thể trở về hiện tại.',
    'Long: Bốn mảnh ghép, năm căn phòng. Được, tôi chơi. Nhưng Hệ Thống phải nói rõ tôi bắt đầu từ đâu.',
    'Hệ Thống: Phòng 1 cất giữ chặng đường xây dựng lực lượng từ năm 1950 đến giữa năm 1953. Khi cần, Ký Chủ nhấn Q để xem nhiệm vụ hiện tại; Hệ Thống sẽ lên tiếng sau mỗi bước.',
    'Dùng WASD hoặc phím mũi tên để đi, giữ Shift để chạy nhanh. Đến gần vật và nhấn E. M mở bản đồ, N mở sổ tay trong phòng; Sổ hành trình ở thanh trên giữ toàn văn các giấy đã ghi nhận ở những phòng trước.',
    'Tiến độ hành trình được lưu trên trình duyệt này.'
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
  const section=element('section','campaign-story campaign-story--intro'),OPENING=openingFrames(); let step=0,drawn=0;
  const advance=()=>{
    if(step!==0)return;
    voice?.cue('time-warp');step=1;draw();section.querySelector('.r1-primary')?.focus();
  };
  const draw=()=>{
    const current=OPENING[step],copy=element('div','campaign-story-copy');
    copy.append(heading(current.title,current.eyebrow));
    current.paragraphs.forEach(text=>{
      const line=framingLine(text);
      const shown=line.speaker==='Long'?`${activeHero().name}: ${heroDialogueText(line.text,'Long')}`:text;
      copy.append(element('p','',shown));
    });
    const lines=current.paragraphs.map(framingLine),token=++drawn;
    voice?.scene(step===0?'museum':'bunker'); // bed: museum, then the Đờ Cát bunker once the light has taken Long
    copy.append(button(current.button,()=>{if(step===0){advance();return;}if(step===2){onBegin();return;}step++;draw();section.querySelector('.r1-primary')?.focus();},'r1-primary'));
    const enable=voiceButton(voice,lines,node=>node.isConnected&&token===drawn);if(enable)copy.append(enable);
    section.replaceChildren(painting(step===0?advance:null,{titleLogo:step===0}),copy);
    voice?.speak(lines);
  };
  draw(); return section;
}
export function returnFrame(complete,onFinish,onRestart,voice) {
  const section=element('section','campaign-story'),copy=element('div','campaign-story-copy');
  copy.append(heading(complete?'Câu chuyện còn tiếp':'Trở lại bảo tàng','HÀNH TRÌNH CỦA LONG'));
  const lines=museumReturn();
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
