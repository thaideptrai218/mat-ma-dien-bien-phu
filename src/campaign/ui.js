import {element,button,heading} from '../room-one/ui-elements.js';
import {documentPanel} from '../room-one/document-reader.js';
import {currentRoom,fragmentsFor,phaseFor} from './state.js';
import {archiveEntries} from './archive.js';

const ROOM_NAMES=['Trước bản kế hoạch','Kế hoạch Nava · Bảo','Mật mã hậu phương','Những ngày quyết định · Trâm','Bức tranh hoàn chỉnh'];
const ROMAN=['I','II','III','IV'];
export class CampaignUI {
  constructor(root,{onArchive,onRestart,onOverlayChange}={}) {
    this.root=root; this.onOverlayChange=onOverlayChange;
    root.className='campaign-app';
    const header=element('header','campaign-header');
    const brand=element('a','campaign-brand','Mật mã Điện Biên Phủ');brand.href='./index.html';
    this.progress=element('ol','campaign-progress');this.progress.setAttribute('aria-label','Tiến độ năm phòng');
    const tools=element('nav','campaign-tools');tools.setAttribute('aria-label','Hành trình');
    tools.append(button('Sổ hành trình',onArchive),button('Chơi mới',onRestart),button('Bản chơi riêng',()=>this.showPreviews()));
    this.inventory=element('p','campaign-inventory');this.notice=element('p','campaign-save-notice');this.notice.setAttribute('role','status');
    header.append(brand,this.progress,this.inventory,tools);
    this.stage=element('div','campaign-stage');
    root.replaceChildren(header,this.notice,this.stage);
  }
  get isOpen(){return Boolean(this.dialog?.open);}
  render(state,notice='') {
    this.state=state;
    const current=currentRoom(state),phase=phaseFor(state);
    this.progress.replaceChildren(...ROOM_NAMES.map((name,index)=>{
      const room=index+1,done=state.rooms[room]?.exitReached;
      const item=element('li',done?'is-done':phase==='room'&&room===current?'is-current':'',done?'✓':String(room));
      item.title=`Phòng ${room} · ${name}`;item.setAttribute('aria-label',`${item.title}${done?' · Đã hoàn thành':''}`);
      if(phase==='room'&&room===current)item.setAttribute('aria-current','step');return item;
    }));
    const fragments=fragmentsFor(state);
    this.inventory.textContent=`Mảnh tranh ${ROMAN.map((label,index)=>fragments.includes(index+1)?label:'·').join('  ')} / 4`;
    this.notice.textContent=notice;this.notice.hidden=!notice;
  }
  show(content) {
    this.close(false);
    const dialog=element('dialog','r1-modal campaign-modal');this.dialog=dialog;
    dialog.setAttribute('aria-label','Sổ hành trình và tùy chọn');
    dialog.append(button('Đóng · Esc',()=>this.close(),'r1-modal-close'),content);
    dialog.addEventListener('cancel',event=>{event.preventDefault();this.close();});
    this.root.append(dialog);dialog.showModal();this.onOverlayChange?.(true);
  }
  close(notify=true) {
    this.panel?.cleanup?.();this.panel=null;
    if(this.dialog){this.dialog.close();this.dialog.remove();this.dialog=null;}
    if(notify)this.onOverlayChange?.(false);
  }
  showArchive(state) {
    const section=element('section');section.append(heading('Sổ hành trình','NHỮNG GIẤY TỜ QUANG ĐÃ GHI NHẬN'),element('p','r1-lead','Đọc lại toàn văn để đối chiếu những việc đã đi qua.'));
    const docs=archiveEntries(state),list=element('div','r1-notebook-list');
    let previous=0;
    for(const doc of docs){
      if(previous!==doc.room){list.append(element('h3','',`Phòng ${doc.room} · ${ROOM_NAMES[doc.room-1]}`));previous=doc.room;}
      list.append(button(doc.title,()=>this.showDocument(doc,state),'r1-notebook-row'));
    }
    if(!docs.length)list.append(element('p','r1-empty','Chưa có giấy tờ nào được ghi nhận. Đọc và xác nhận cùng Quang trong mỗi phòng.'));
    section.append(list);this.show(section);
  }
  showDocument(doc,state) {
    const panel=documentPanel({document:doc,readOnly:true},()=>this.showArchive(state));
    const container=element('div');container.append(button('← Về sổ hành trình',()=>this.showArchive(state)),panel.node);
    this.show(container);this.panel=panel;
    requestAnimationFrame(()=>{if(this.panel===panel&&this.isOpen)panel.afterOpen?.();});
  }
  confirmRestart(onConfirm) {
    const section=element('section');section.append(heading('Bắt đầu một hành trình mới'),element('p','r1-lead','Xóa tiến độ năm phòng trong hành trình này và trở về phần mở đầu ở bảo tàng.'));
    const label=element('label','r1-reset-confirm'),input=element('input');input.type='checkbox';
    label.append(input,document.createTextNode('Tôi muốn bắt đầu lại toàn bộ hành trình.'));
    const confirm=button('Xóa hành trình và bắt đầu lại',()=>{if(input.checked){this.close(false);onConfirm();}},'r1-danger');confirm.disabled=true;
    input.addEventListener('change',()=>{confirm.disabled=!input.checked;});section.append(label,confirm);this.show(section);
  }
  showPreviews() {
    const section=element('section');section.append(heading('Các bản chơi riêng'),element('p','r1-lead','Các đường dẫn này có tiến độ riêng, dùng để xem lại từng phòng. Hành trình năm phòng được lưu riêng tại trang chính.'));
    for(const [path,label] of [['room-one.html','Phòng 1'],['room-two.html','Phòng 2 · Bảo'],['room-three.html','Phòng 3 · Hậu phương'],['room-four.html','Phòng 4 · Trâm']]){
      const link=element('a','r1-button',label);link.href=`./${path}`;link.target='_blank';link.rel='noopener';section.append(link);
    }
    this.show(section);
  }
  loading(){this.stage.replaceChildren(element('p','campaign-loading','Đang mở căn phòng tiếp theo…'));}
  failure(retry) {
    const section=element('section','campaign-error');section.append(heading('Chưa mở được căn phòng'),element('p','','Tiến độ đã có vẫn được giữ. Hãy thử mở lại.'),button('Thử lại',retry,'r1-primary'));this.stage.replaceChildren(section);
  }
}
