import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,reduce,DOCUMENT_ORDER,nextDocumentId,recoveredTokens} from '../src/room-three/rules.js';
import {preparationCorrect,cargoCorrect,strategyCorrect,openingCorrect,finalCorrect,telegramCorrect} from '../src/room-three/answers.js';
import {CHALLENGES,PREPARATION_CARDS,CARGO_ITEMS,TELEGRAMS,OPENING_EVENTS} from '../src/room-three/puzzle-data.js';
import {sanitizeSave,loadSave,persistSave,SAVE_KEY} from '../src/room-three/save.js';

const valid={
  preparation:{groups:Object.fromEntries(PREPARATION_CARDS.map(c=>[c.id,c.group])),supplies:['food','weapons','ammunition','medical'],purpose:'sustain'},
  cargo:{matches:Object.fromEntries(CARGO_ITEMS.map(c=>[c.id,c.id])),reason:'terrain-load',contributors:['civilians','youth']},
  strategy:{initial:TELEGRAMS.initial.map(w=>w.id),final:TELEGRAMS.final.map(w=>w.id),reason:'sure-victory',insights:['assess-reality','careful-command','victory-first']},
  opening:{order:OPENING_EVENTS.map(e=>e.id),dates:Object.fromEntries(OPENING_EVENTS.map(e=>[e.id,e.date])),target:'him-lam',surrender:'ban-keo',implications:['break-north','expand-control','next-offensives']},
};
function read(s,ch){for(const id of ch.documentIds){s=reduce(s,'read',{id});s=reduce(s,'collect',{id});}return s;}
function through(count){let s=createState();for(const ch of CHALLENGES.slice(0,count)){s=read(s,ch);s=reduce(s,'challenge',{id:ch.id,answers:valid[ch.id]});}return s;}
test('paper and activity interleave, so knowing every answer cannot skip the learning route',()=>{
  let s=createState();assert.equal(nextDocumentId(s),'preparation-record');
  for(const ch of CHALLENGES)assert.equal(reduce(s,'challenge',{id:ch.id,answers:valid[ch.id]}),s);
  assert.equal(reduce(s,'read',{id:'supply-journal'}),s);assert.equal(reduce(s,'collect',{id:'preparation-record'}),s);
  s=read(s,CHALLENGES[0]);assert.equal(nextDocumentId(s),null);assert.equal(reduce(s,'read',{id:'supply-journal'}),s);
  s=reduce(s,'challenge',{id:'preparation',answers:valid.preparation});assert.equal(nextDocumentId(s),'supply-journal');
});
test('parallel preparation tasks have no artificial internal date order and still need logistical understanding',()=>{
  const p={...valid.preparation,groups:Object.fromEntries(Object.entries(valid.preparation.groups).reverse())};assert.equal(preparationCorrect(p),true);
  assert.equal(preparationCorrect({...p,groups:{...p.groups,b:'decision'}}),false);
  assert.equal(preparationCorrect({...p,supplies:['food','weapons','ammunition']}),false);
  assert.equal(preparationCorrect({...p,purpose:'ceremony'}),false);
});
test('six cargo matches require both terrain/load meaning and civilian participation',()=>{
  assert.equal(cargoCorrect(valid.cargo),true);assert.equal(cargoCorrect({...valid.cargo,matches:{...valid.cargo.matches,porters:'bicycle'}}),false);
  assert.equal(cargoCorrect({...valid.cargo,reason:'airlift'}),false);assert.equal(cargoCorrect({...valid.cargo,contributors:['civilians']}),false);
});
test('identical word cards may swap, while unknown/duplicate IDs and wrong strategic reasoning fail',()=>{
  for(const words of [TELEGRAMS.initial,TELEGRAMS.final]){
    const order=words.map(w=>w.id);[order[1],order[3]]=[order[3],order[1]];assert.equal(telegramCorrect(order,words),true);
    assert.equal(telegramCorrect([order[0],order[1],order[2],order[1]],words),false);
    assert.equal(telegramCorrect(['unknown',...order.slice(1)],words),false);
    [order[0],order[1]]=[order[1],order[0]];assert.equal(telegramCorrect(order,words),false);
  }
  assert.equal(strategyCorrect(valid.strategy),true);assert.equal(strategyCorrect({...valid.strategy,reason:'lack-food'}),false);
  assert.equal(strategyCorrect({...valid.strategy,insights:['assess-reality','victory-first']}),false);
});
test('opening telegram needs dates, order, targets and the limited meaning of the first offensive',()=>{
  assert.equal(openingCorrect(valid.opening),true);
  assert.equal(openingCorrect({...valid.opening,order:['doc-lap','him-lam','ban-keo']}),false);
  assert.equal(openingCorrect({...valid.opening,dates:{...valid.opening.dates,'ban-keo':'15/03/1954'}}),false);
  assert.equal(openingCorrect({...valid.opening,surrender:'doc-lap'}),false);
  assert.equal(openingCorrect({...valid.opening,implications:['break-north','expand-control','campaign-complete']}),false);
});
test('all four rewards are required; doctrine remains separate from the final day/month/year',()=>{
  assert.equal(finalCorrect('13/3/1954'),true);assert.equal(finalCorrect('1954-03-13'),true);assert.equal(finalCorrect('13/03/1953'),false);
  assert.equal(finalCorrect('13/03/1954 Đánh chắc tiến chắc'),false);
  let s=through(3);assert.equal(reduce(s,'final',{date:'13/03/1954'}),s);s=through(4);
  assert.deepEqual(recoveredTokens(s).map(t=>t.label),['THÁNG 3','NĂM 1954','ĐÁNH CHẮC, TIẾN CHẮC','NGÀY 13']);
  s=reduce(s,'final',{date:'13/03/1954'});assert.equal(s.chestOpened,true);assert.equal(s.fragmentCollected,false);assert.equal(reduce(s,'exit'),s);
  s=reduce(s,'fragment');assert.equal(s.exitReached,false);s=reduce(s,'exit');assert.equal(s.exitReached,true);
});
test('save validates the joint graph rather than accepting independent paper and challenge prefixes',()=>{
  const forged={...createState(),readNoteIds:[...DOCUMENT_ORDER],collectedNoteIds:[...DOCUMENT_ORDER],chestOpened:true,fragmentCollected:true,exitReached:true};
  const s=sanitizeSave(forged);assert.deepEqual(s.collectedNoteIds,['preparation-record']);assert.deepEqual(s.completedChallenges,[]);assert.equal(s.chestOpened,false);
  const partial={...through(2),readNoteIds:[...DOCUMENT_ORDER],collectedNoteIds:[...DOCUMENT_ORDER]};
  assert.deepEqual(sanitizeSave(partial).collectedNoteIds,['preparation-record','supply-journal','command-telegrams']);
  assert.deepEqual(sanitizeSave(through(4)),through(4));
});
test('room-three key is isolated and malformed or blocked storage stays playable',()=>{
  const entries=new Map(),storage={getItem:k=>entries.get(k)??null,setItem:(k,v)=>entries.set(k,v)};
  assert.equal(persistSave(storage,through(4)),'');assert.deepEqual([...entries.keys()],[SAVE_KEY]);assert.equal(loadSave(storage).state.completedChallenges.length,4);
  assert.notEqual(SAVE_KEY,'mat-ma-dien-bien-phu:room-four:v1');entries.set(SAVE_KEY,'broken');assert.deepEqual(loadSave(storage).state.completedChallenges,[]);
  assert.ok(loadSave(null).notice);assert.ok(persistSave(null,createState()));
});
test('unknown null facts and malformed answers cannot create progress or throw at completed boundaries',()=>{
  const waiting=read(createState(),CHALLENGES[0]);assert.equal(reduce(waiting,'read',{id:null}),waiting);
  assert.equal(reduce(waiting,'challenge',{id:'preparation',answers:null}),waiting);
  for(const check of[preparationCorrect,cargoCorrect,strategyCorrect,openingCorrect])assert.equal(check(null),false);
  const complete=through(4);assert.equal(reduce(complete,'challenge',{}),complete);assert.equal(reduce(complete,'read',{id:null}),complete);
});
