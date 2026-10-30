import '../ui/font-styles.css';
import './styles.css';
import './letter-styles.css';
import {loadGameFonts} from '../ui/game-fonts.js';
import {RoomOneSession} from './session.js';
import {addRoomLink} from '../ui/room-links.js';

await loadGameFonts(document.fonts);
const session = new RoomOneSession(document.getElementById('app'));
addRoomLink('./index.html','Hành trình 5 phòng');
addRoomLink('./room-two.html','Phòng 2 · Bảo');
addRoomLink('./room-four.html','Phòng 4 · Trâm');
addRoomLink('./room-three.html','Phòng 3 · Hậu phương');
// Read-only diagnostics let QA measure real motion without exposing progress or teleport setters.
window.getRoomOneSnapshot = () => structuredClone({state:session.state, ...session.scene.getSnapshot(),
  view:session.active?.kind || null, audio:session.audio.getSnapshot()});
window.addEventListener('pagehide', () => session.audio.setMode('inactive'));
