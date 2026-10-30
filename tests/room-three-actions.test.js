import test from 'node:test';
import assert from 'node:assert/strict';
import {handleAction} from '../src/room-three/actions.js';
import {createState,reduce} from '../src/room-three/rules.js';
import {DOCUMENTS} from '../src/room-three/documents.js';
import {PREPARATION_CARDS} from '../src/room-three/puzzle-data.js';
function session(){return{state:createState(),active:null,audio:{playCue(){}},commit(a,p){const n=reduce(this.state,a,p);if(n===this.state)return false;this.state=n;return true;},dialogue(title,lines,buttonLabel,action,payload){this.active={kind:'dialogue',action,payload,token:9};},show(kind,data){this.active={kind,...data};},close(){this.active=null;},error(message){this.notice=message;}};}
test('reader and final thought token guard each fact; stale callbacks do not collect',()=>{
  const s=session(),id=DOCUMENTS[0].id;handleAction(s,'document-finish',{id});assert.deepEqual(s.state.readNoteIds,[]);
  s.active={kind:'document',document:DOCUMENTS[0],readOnly:false};handleAction(s,'document-finish',{id});assert.deepEqual(s.state.collectedNoteIds,[]);
  handleAction(s,'document-collect',{id,token:8});assert.deepEqual(s.state.collectedNoteIds,[]);
  handleAction(s,'close');handleAction(s,'document-collect',{id,token:9});assert.deepEqual(s.state.collectedNoteIds,[]);
  s.active={kind:'document',document:DOCUMENTS[0],readOnly:false};handleAction(s,'document-finish',{id});handleAction(s,'document-collect',{id,token:9});assert.deepEqual(s.state.collectedNoteIds,[id]);
});
test('correct activity submission requires its active unsolved view',()=>{
  const s=session(),id=DOCUMENTS[0].id;s.state=reduce(reduce(s.state,'read',{id}),'collect',{id});
  const answer={groups:Object.fromEntries(PREPARATION_CARDS.map(c=>[c.id,c.group])),supplies:['food','weapons','ammunition','medical'],purpose:'sustain'};
  handleAction(s,'preparation-submit',answer);assert.deepEqual(s.state.completedChallenges,[]);
  s.active={kind:'preparation',solved:true};handleAction(s,'preparation-submit',answer);assert.deepEqual(s.state.completedChallenges,[]);
  s.active={kind:'preparation',solved:false};handleAction(s,'preparation-submit',answer);assert.deepEqual(s.state.completedChallenges,['preparation']);
});
