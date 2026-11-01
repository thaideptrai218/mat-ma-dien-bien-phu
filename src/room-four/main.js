import '../ui/font-styles.css';
import '../room-one/styles.css';
import '../room-one/letter-styles.css';
import './styles.css';
import {loadGameFonts} from '../ui/game-fonts.js';
import {addRoomLink} from '../ui/room-links.js';
import {syncHeroDomName} from '../heroes/hero-dom-name.js';
import {RoomFourSession} from './session.js';

await loadGameFonts(document.fonts);
syncHeroDomName(); // standalone previews follow the hero chosen in the campaign
const session=new RoomFourSession(document.getElementById('app'));
addRoomLink('./index.html','Hành trình 5 phòng');addRoomLink('./room-one.html','Phòng 1');
addRoomLink('./room-three.html','Phòng 3 · Hậu phương');
addRoomLink('./room-five.html','Phòng 5 · Bản chơi riêng');
window.getRoomFourSnapshot=()=>structuredClone({state:session.state,...session.scene.getSnapshot(),view:session.active?.kind||null,audio:session.audio.getSnapshot()});
