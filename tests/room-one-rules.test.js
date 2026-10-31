import test from 'node:test';
import assert from 'node:assert/strict';
import {createState, reduce, NOTE_IDS, goalFor} from '../src/room-one/rules.js';
import {sanitizeSave, loadSave, persistSave, SAVE_KEY} from '../src/room-one/save.js';

const correct = {troopVN:252000,troopFrance:445000,equipmentVN:'limited',equipmentFrance:'modern',positionVN:'initiative',positionFrance:'dispersed',pressureVN:'supply',pressureFrance:'costs'};
function collectedState() {
  let s = reduce(createState(), 'letter', {documentId:'restored-letter'});
  s = reduce(s,'map',{cell:'A-03'});
  for (const id of NOTE_IDS) {s=reduce(s,'read',{id});s=reduce(s,'collect',{id});}
  return s;
}
test('correct guessed answers cannot bypass any predecessor', () => {
  const s = createState();
  for (const [action,p] of [['map',{cell:'A-03'}],['read',{id:'v1'}],['collect',{id:'v1'}],['comparison',correct],['drawer',{code:'2413'}],['identity',{name:'Henri Navarre'}],['chest',{keyword:'NAVA'}],['exit',{}]]) assert.equal(reduce(s,action,p),s,action);
});
test('four read and separately confirmed documents are required', () => {
  let s = reduce(reduce(createState(),'letter',{documentId:'restored-letter'}),'map',{cell:'A-03'});
  assert.equal(reduce(s,'collect',{id:'v1'}),s);
  for (const id of NOTE_IDS) s=reduce(s,'read',{id});
  assert.equal(reduce(s,'comparison',correct),s);
  for (const id of NOTE_IDS.slice(0,3)) s=reduce(s,'collect',{id});
  assert.equal(reduce(s,'comparison',correct),s);
  s=reduce(s,'collect',{id:'p2'}); assert.equal(reduce(s,'comparison',correct).comparisonSolved,true);
});
test('entire room has strict ordered completion and exactly first fragment', () => {
  let s=collectedState();
  assert.equal(goalFor(s).id,'comparison');
  assert.equal(reduce(s,'comparison',{...correct,troopVN:445000}),s);
  s=reduce(s,'comparison',correct); s=reduce(s,'drawer',{code:'2413'});
  assert.equal(reduce(s,'chest',{keyword:'NAVA'}),s);
  s=reduce(s,'identity',{name:'Henri Navarre'}); s=reduce(s,'chest',{keyword:'Nava'});
  assert.equal(s.exitReached,false); assert.equal(goalFor(s).id,'gate:exit-hall:0');
  assert.equal(reduce(s,'exit'),s,'exit gate must be unlocked first');
  assert.equal(reduce(s,'door',{id:'exit-hall',code:'12'}),s); s=reduce(s,'door',{id:'exit-hall',code:'07'}); assert.equal(goalFor(s).id,'door');
  s=reduce(s,'exit'); assert.equal(s.exitReached,true); assert.equal(goalFor(s).steps.every(step=>step.done),true);
});
test('save repairs impossible stage prefixes and sanitizes ids and preferences', () => {
  const forged={...createState(),envelopeOpened:true,readNoteIds:['v1'],collectedNoteIds:['v1','unknown'],comparisonSolved:true,drawerOpened:true,identitySolved:true,chestOpened:true,exitReached:true,audioVolume:Infinity};
  assert.deepEqual(sanitizeSave(forged).collectedNoteIds,[]);
  assert.equal(sanitizeSave(forged).exitReached,false);
  assert.equal(sanitizeSave(forged).audioVolume,.5);
  const valid=collectedState(); const clean=sanitizeSave({...valid,readNoteIds:[...valid.readNoteIds,'v1','bad'],audioVolume:4});
  assert.equal(clean.readNoteIds.length,4); assert.equal(clean.audioVolume,1);
});
test('isolated storage key, corrupt and blocked storage remain playable', () => {
  const entries=new Map(); const storage={getItem:k=>entries.get(k)??null,setItem:(k,v)=>entries.set(k,v)};
  assert.equal(persistSave(storage,collectedState()),''); assert.deepEqual([...entries.keys()],[SAVE_KEY]);
  assert.equal(loadSave(storage).state.collectedNoteIds.length,4);
  entries.set(SAVE_KEY,'{bad'); assert.equal(loadSave(storage).state.letterSolved,false);
  assert.ok(loadSave(null).notice); assert.ok(persistSave(null,createState()));
});
