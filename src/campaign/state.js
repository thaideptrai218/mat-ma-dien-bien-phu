import {sanitizeSave as one} from '../room-one/save.js';
import {sanitizeSave as two} from '../room-two/save.js';
import {sanitizeSave as three} from '../room-three/save.js';
import {sanitizeSave as four} from '../room-four/save.js';
import {sanitizeSave as five} from '../room-five/save.js';

const sanitizers = [one, two, three, four, five];
export const CAMPAIGN_KEY = 'mat-ma-dien-bien-phu:campaign:v1';
export function createCampaignState() {
  return {version:1, introSeen:false, rooms:{}, settings:{audioEnabled:false,audioVolume:.5}, endingSeen:false};
}
export function audioSettings(raw = {}) {
  return {audioEnabled:raw.audioEnabled === true,
    audioVolume:Number.isFinite(raw.audioVolume) ? Math.max(0,Math.min(1,raw.audioVolume)) : .5};
}
/** Only a contiguous journey can restore future rooms. Inventory is always derived. */
export function sanitizeCampaign(raw) {
  const s = createCampaignState();
  if (!raw || raw.version !== 1) return s;
  s.settings = audioSettings(raw.settings);
  s.introSeen = raw.introSeen === true;
  if (!s.introSeen) return s;
  for (let room=1; room<=5; room++) {
    const value = raw.rooms?.[room];
    if (!value) break;
    const fragments = fragmentsFor(s);
    // Room5 may never restore an assembly without the four actual earlier fragments.
    if (room === 5 && fragments.length !== 4) break;
    s.rooms[room] = {...sanitizers[room-1](value), ...s.settings};
    if (!s.rooms[room].exitReached) break;
  }
  s.endingSeen = s.rooms[5]?.exitReached === true && raw.endingSeen === true;
  return s;
}
export function fragmentsFor(s) {
  return [1,2,3,4].filter(room => room === 1 ? s.rooms[1]?.chestOpened : s.rooms[room]?.fragmentCollected);
}
export function currentRoom(s) {
  for (let room=1; room<=5; room++) if (!s.rooms[room]?.exitReached) return room;
  return 5;
}
export function phaseFor(s) {
  if (!s.introSeen) return 'museum-intro';
  if (s.endingSeen) return 'complete';
  if (s.rooms[5]?.exitReached) return 'museum-return';
  return 'room';
}
