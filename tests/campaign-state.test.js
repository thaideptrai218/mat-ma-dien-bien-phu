import test from 'node:test';
import assert from 'node:assert/strict';
import {sanitizeCampaign,createCampaignState,currentRoom,fragmentsFor,phaseFor,CAMPAIGN_KEY} from '../src/campaign/state.js';
import {CampaignStore} from '../src/campaign/store.js';
import {SAVE_KEY as ONE} from '../src/room-one/save.js';
import {SAVE_KEY as TWO} from '../src/room-two/save.js';
import {CLUE_IDS,PUZZLE_IDS,CHAPTER,clues} from '../src/room-two/content.js';
import {DOCUMENT_ORDER as THREE} from '../src/room-three/rules.js';
import {DOCUMENT_ORDER as FOUR} from '../src/room-four/rules.js';

function completedRooms(){
  return {
    1:{version:1,introSeen:true,letterSolved:true,envelopeOpened:true,readNoteIds:['v1','v2','p1','p2'],collectedNoteIds:['v1','v2','p1','p2'],comparisonSolved:true,drawerOpened:true,identitySolved:true,chestOpened:true,exitReached:true},
    2:{version:1,discoveredClueIds:[...CLUE_IDS],collectedClueIds:[...CLUE_IDS],completedBeatIds:[CHAPTER.introBeatId,...CLUE_IDS.map(id=>clues[id].beatId)],completedPuzzleIds:[...PUZZLE_IDS],exitReached:true},
    3:{version:1,introSeen:true,readNoteIds:[...THREE],collectedNoteIds:[...THREE],completedChallenges:['preparation','cargo','strategy','opening'],chestOpened:true,fragmentCollected:true,exitReached:true},
    4:{version:1,introSeen:true,readNoteIds:[...FOUR],collectedNoteIds:[...FOUR],crosswordSolved:true,columnSolved:true,boardTSolved:true,boardLSolved:true,chestOpened:true,fragmentCollected:true,exitReached:true},
    5:{version:1,introSeen:true,assemblySolved:true,reflectionSeen:true,exitReached:true},
  };
}
test('future-room flags and inventory never skip an unfinished physical exit',()=>{
  const rooms=completedRooms();rooms[1].exitReached=false;
  const s=sanitizeCampaign({version:1,introSeen:true,rooms,currentRoom:5,fragments:[1,2,3,4],endingSeen:true});
  assert.deepEqual(Object.keys(s.rooms),['1']);assert.equal(currentRoom(s),1);assert.deepEqual(fragmentsFor(s),[1]);assert.equal(s.endingSeen,false);
  rooms[1].chestOpened=false;
  assert.deepEqual(fragmentsFor(sanitizeCampaign({version:1,introSeen:true,rooms})),[]);
});
test('five exits and the museum acknowledgment are separate completion steps',()=>{
  const raw={version:1,introSeen:true,rooms:completedRooms()};
  const s=sanitizeCampaign(raw);assert.deepEqual(fragmentsFor(s),[1,2,3,4]);assert.equal(phaseFor(s),'museum-return');
  assert.equal(phaseFor(sanitizeCampaign({...raw,endingSeen:true})),'complete');
  raw.rooms[5].reflectionSeen=false;
  const blocked=sanitizeCampaign({...raw,endingSeen:true});assert.equal(blocked.rooms[5].exitReached,false);assert.equal(phaseFor(blocked),'room');
});
test('room-two award is derived from all original puzzles and their collected clues',()=>{
  const rooms=completedRooms();rooms[2].completedPuzzleIds.pop();rooms[2].fragmentCollected=true;
  const s=sanitizeCampaign({version:1,introSeen:true,rooms});
  assert.deepEqual(Object.keys(s.rooms),['1','2']);assert.deepEqual(fragmentsFor(s),[1]);assert.equal(currentRoom(s),2);
});
test('one envelope owns shared settings; no private room keys are read, written or reset',()=>{
  const map=new Map([[ONE,'PRIVATE ONE'],[TWO,'PRIVATE TWO']]),access=[];
  const storage={getItem:key=>{access.push(['read',key]);return map.get(key)||null;},setItem:(key,value)=>{access.push(['write',key]);map.set(key,value);}};
  const store=new CampaignStore(storage);store.begin();const adapter=store.adapter(1,ONE);
  assert.equal(JSON.parse(adapter.getItem(ONE)).version,1);
  adapter.setItem(ONE,JSON.stringify({...completedRooms()[1],audioEnabled:true,audioVolume:.7}));
  assert.equal(currentRoom(store.state),2);assert.equal(JSON.parse(store.adapter(2,TWO).getItem(TWO)).audioVolume,.7);
  assert.equal(store.state.rooms[1].audioEnabled,true);
  store.reset();assert.deepEqual(store.state,createCampaignState());
  assert.deepEqual([...new Set(access.map(([,key])=>key))],[CAMPAIGN_KEY]);assert.equal(map.get(ONE),'PRIVATE ONE');assert.equal(map.get(TWO),'PRIVATE TWO');
});
test('reset of current room retains earlier rooms while malformed or blocked storage stays playable',()=>{
  const blocked={getItem:()=>'{bad',setItem:()=>{throw Error('blocked');}};
  const store=new CampaignStore(blocked);assert.ok(store.notice);store.begin();
  store.adapter(1,ONE).setItem(ONE,JSON.stringify(completedRooms()[1]));assert.equal(currentRoom(store.state),2);assert.ok(store.notice);
  store.adapter(2,TWO).setItem(TWO,JSON.stringify({version:1,audioEnabled:true,audioVolume:.8}));
  assert.equal(store.state.rooms[1].exitReached,true);assert.equal(store.state.rooms[2].fragmentCollected,false);
  assert.equal(store.state.rooms[1].audioEnabled,true);assert.equal(store.state.rooms[1].audioVolume,.8);
  assert.equal(new CampaignStore(null).state.introSeen,false);
});
test('an unseen opening and a corrupted historical prefix invalidate every later claim',()=>{
  assert.deepEqual(sanitizeCampaign({version:1,rooms:completedRooms(),endingSeen:true}),createCampaignState());
  const rooms=completedRooms();rooms[3].completedChallenges=['preparation','cargo','opening'];
  const s=sanitizeCampaign({version:1,introSeen:true,rooms});assert.equal(currentRoom(s),3);assert.deepEqual(fragmentsFor(s),[1,2]);assert.equal(s.rooms[5],undefined);
});
