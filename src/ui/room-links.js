import './room-links.css';

export function addRoomLink(href,label) {
  const link=document.createElement('a');link.href=href;link.className='r1-header-button r1-room-link';link.textContent=label;
  document.querySelector('.r1-header-tools')?.append(link);
}
