import '../ui/font-styles.css';
import '../room-one/styles.css';
import '../room-one/letter-styles.css';
import {loadGameFonts} from '../ui/game-fonts.js';
import {addRoomLink} from '../ui/room-links.js';
import {syncHeroDomName} from '../heroes/hero-dom-name.js';
import {RoomFiveSession} from './session.js';

await loadGameFonts(document.fonts);
syncHeroDomName(); // standalone previews follow the hero chosen in the campaign
const session = new RoomFiveSession(document.getElementById('app'), {
  standalonePreview: true,
  saveKey: 'mat-ma-dien-bien-phu:room-five-preview:v1',
});
addRoomLink('./index.html', 'Hành trình 5 phòng');
addRoomLink('./room-one.html', 'Phòng 1');
addRoomLink('./room-four.html', 'Phòng 4 · Những ngày quyết định');
window.getRoomFivePreviewSnapshot = () => structuredClone({
  state: session.state,
  ...session.scene.getSnapshot(),
  view: session.active?.kind || null,
  audio: session.audio.getSnapshot(),
});
window.addEventListener('pagehide', () => session.audio.setMode('inactive'));
