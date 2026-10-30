import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,reduce,DOCUMENT_ORDER,normalizeAnswer,columnText,shapeCorrect,goalFor} from '../src/room-four/rules.js';
import {CROSSWORD_ROWS,BOARDS} from '../src/room-four/puzzle-data.js';
import {sanitizeSave,loadSave,persistSave,SAVE_KEY} from '../src/room-four/save.js';

const answers=Object.fromEntries(CROSSWORD_ROWS.map(row=>[row.id,row.answer]));
function readAll(){let s=createState();for(const id of DOCUMENT_ORDER){s=reduce(s,'read',{id});s=reduce(s,'collect',{id});}return s;}
test('papers enforce historical order and a separate read and confirmation',()=>{
  let s=createState();assert.equal(reduce(s,'read',{id:'a1'}),s);assert.equal(reduce(s,'collect',{id:DOCUMENT_ORDER[0]}),s);
  s=reduce(s,'read',{id:DOCUMENT_ORDER[0]});assert.deepEqual(s.collectedNoteIds,[]);
  assert.equal(reduce(s,'read',{id:DOCUMENT_ORDER[1]}),s);
  s=reduce(s,'collect',{id:DOCUMENT_ORDER[0]});assert.deepEqual(s.collectedNoteIds,[DOCUMENT_ORDER[0]]);
  assert.equal(reduce(s,'collect',{id:DOCUMENT_ORDER[0]}),s);
});
test('correct guesses cannot bypass paper, crossword, column and shape prerequisites',()=>{
  const s=createState();
  for(const [action,payload]of[['crossword',{answers}],['column',{column:8}],['shape',{board:'t',selected:BOARDS.t.cells}],['final',{phrase:'QUYET CHIEN QUYET THANG'}],['fragment',{}],['exit',{}]])assert.equal(reduce(s,action,payload),s,action);
  assert.equal(reduce(readAll(),'crossword',{answers:null}).crosswordSolved,false);
});
test('accents including Đ normalize and exact Trâm column and shapes are verified',()=>{
  assert.equal(normalizeAnswer('Độc lập dân tộc'),'DOCLAPDANTOC');assert.equal(normalizeAnswer('Bị động'),'BIDONG');
  assert.equal(columnText(8),'TIMTVAL');assert.notEqual(columnText(7),'TIMTVAL');
  for(const board of ['t','l']){
    assert.equal(shapeCorrect(board,[...BOARDS[board].cells].reverse()),true);
    assert.equal(shapeCorrect(board,[...BOARDS[board].cells,29]),false);
    assert.equal(shapeCorrect(board,BOARDS[board].cells.map(()=>0)),false);
  }
  assert.equal(shapeCorrect('x',[]),false);
});
test('full chain opens chest automatically but requires separate fourth-fragment pickup and door',()=>{
  let s=readAll();s=reduce(s,'crossword',{answers});
  assert.equal(reduce(s,'column',{column:7}),s);s=reduce(s,'column',{column:8});
  s=reduce(s,'shape',{board:'l',selected:BOARDS.l.cells});assert.equal(reduce(s,'final',{phrase:'Quyết chiến, Quyết thắng'}),s);
  s=reduce(s,'shape',{board:'t',selected:BOARDS.t.cells});s=reduce(s,'final',{phrase:'Quyết chiến, Quyết thắng'});
  assert.equal(s.chestOpened,true);assert.equal(s.fragmentCollected,false);assert.equal(reduce(s,'exit'),s);assert.equal(goalFor(s).id,'chest');
  s=reduce(s,'fragment');assert.equal(s.exitReached,false);assert.equal(goalFor(s).id,'door');
  s=reduce(s,'exit');assert.equal(s.exitReached,true);assert.equal(goalFor(s).steps.every(step=>step.done),true);
});
test('save accepts only contiguous read/collected history and consistent cipher prerequisites',()=>{
  const raw={...createState(),readNoteIds:['east-offensive','a1','results'],collectedNoteIds:['east-offensive','a1','results'],crosswordSolved:true,columnSolved:true,boardTSolved:true,boardLSolved:true,chestOpened:true,fragmentCollected:true,exitReached:true};
  const s=sanitizeSave(raw);assert.deepEqual(s.collectedNoteIds,['east-offensive']);assert.equal(s.chestOpened,false);assert.equal(s.exitReached,false);
  const valid=readAll();assert.deepEqual(sanitizeSave({...valid,readNoteIds:[...valid.readNoteIds,'a1','unknown']}),valid);
  assert.equal(sanitizeSave({...valid,audioVolume:Infinity}).audioVolume,.5);
});
test('room-four storage is isolated and corrupt/blocked storage remains playable',()=>{
  const stored=new Map(),storage={getItem:key=>stored.get(key)??null,setItem:(key,value)=>stored.set(key,value)};
  assert.equal(persistSave(storage,readAll()),'');assert.deepEqual([...stored.keys()],[SAVE_KEY]);assert.notEqual(SAVE_KEY,'mat-ma-dien-bien-phu:room-one:v1');
  assert.equal(loadSave(storage).state.collectedNoteIds.length,7);stored.set(SAVE_KEY,'{broken');assert.equal(loadSave(storage).state.collectedNoteIds.length,0);
  assert.ok(loadSave(null).notice);assert.ok(persistSave(null,createState()));
});
