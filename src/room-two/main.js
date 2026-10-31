import '../ui/font-styles.css';
import '../room-one/styles.css';
import './styles.css';
import {loadGameFonts} from '../ui/game-fonts.js';
import {addRoomLink} from '../ui/room-links.js';
import {RoomTwoSession} from './session.js';

await loadGameFonts(document.fonts);
const session = new RoomTwoSession(document.getElementById('app'));
addRoomLink('./index.html', 'Hành trình');
addRoomLink('./room-one.html', 'Phòng 1');
addRoomLink('./room-three.html', 'Phòng 3 · Hậu phương');
window.getRoomTwoSnapshot = () => structuredClone({state: session.state, ...session.scene.getSnapshot(),
  view: session.active?.kind || null, audio: session.audio.getSnapshot()});
