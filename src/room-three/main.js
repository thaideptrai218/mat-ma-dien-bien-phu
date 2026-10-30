import '../ui/font-styles.css';
import '../room-one/styles.css';
import '../room-one/letter-styles.css';
import './styles.css';
import {loadGameFonts} from '../ui/game-fonts.js';
import {addRoomLink} from '../ui/room-links.js';
import {RoomThreeSession} from './session.js';

await loadGameFonts(document.fonts);
const session=new RoomThreeSession(document.getElementById('app'));
addRoomLink('./index.html','Hành trình 5 phòng');addRoomLink('./room-one.html','Phòng 1');addRoomLink('./room-four.html','Phòng 4 · Trâm');
window.getRoomThreeSnapshot=()=>structuredClone({state:session.state,...session.scene.getSnapshot(),view:session.active?.kind||null,audio:session.audio.getSnapshot()});
