import '../ui/font-styles.css';
import '../room-one/styles.css';
import '../room-one/letter-styles.css';
import '../room-two/styles.css';
import '../room-three/styles.css';
import '../room-four/styles.css';
import '../room-five/room-five.css';
import './styles.css';
import {loadGameFonts} from '../ui/game-fonts.js';
import {CampaignRuntime} from './runtime.js';

await loadGameFonts(document.fonts);
const campaign=new CampaignRuntime(document.getElementById('app'));
// Read-only diagnostics: no progress, input or position mutation is exposed.
window.getCampaignSnapshot=()=>campaign.snapshot();
