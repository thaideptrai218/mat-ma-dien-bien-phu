import test from 'node:test';
import assert from 'node:assert/strict';
import {handleAction} from '../src/room-four/actions.js';
import {createState,reduce} from '../src/room-four/rules.js';
import {DOCUMENTS} from '../src/room-four/documents.js';

function session(state=createState()){
  return{state,active:null,audio:{playCue(){}},
    commit(action,p){const next=reduce(this.state,action,p);if(next===this.state)return false;this.state=next;return true;},
    dialogue(title,lines,buttonLabel,action,payload){this.active={kind:'dialogue',title,lines,action,payload,token:22};},
    show(kind,data){this.active={kind,...data};},close(){this.active=null;},error(message){this.notice=message;}};
}
test('paper requires matching editable reader, then own current token before collecting',()=>{
  const s=session(),id=DOCUMENTS[0].id;
  handleAction(s,'document-finish',{id});assert.deepEqual(s.state.readNoteIds,[]);
  s.active={kind:'document',document:DOCUMENTS[0],readOnly:false};
  handleAction(s,'document-finish',{id:'a1'});assert.deepEqual(s.state.readNoteIds,[]);
  handleAction(s,'document-finish',{id});assert.deepEqual(s.state.readNoteIds,[id]);assert.deepEqual(s.state.collectedNoteIds,[]);
  handleAction(s,'document-collect',{id,token:21});assert.deepEqual(s.state.collectedNoteIds,[]);
  handleAction(s,'document-collect',{id:'a1',token:22});assert.deepEqual(s.state.collectedNoteIds,[]);
  handleAction(s,'document-collect',{id,token:22});assert.deepEqual(s.state.collectedNoteIds,[id]);
});
test('close, read-only and stale completion do not grant facts or fourth fragment',()=>{
  const s=session(),id=DOCUMENTS[0].id;
  s.active={kind:'document',document:DOCUMENTS[0],readOnly:true};handleAction(s,'document-finish',{id});assert.deepEqual(s.state.readNoteIds,[]);
  s.active={kind:'document',document:DOCUMENTS[0],readOnly:false};handleAction(s,'document-finish',{id});handleAction(s,'close');handleAction(s,'document-collect',{id,token:22});assert.deepEqual(s.state.collectedNoteIds,[]);
  s.state={...s.state,chestOpened:true};handleAction(s,'fragment-collect',{id:'chest',token:22});assert.equal(s.state.fragmentCollected,false);
});
test('puzzle submissions from a different view and another board are rejected',()=>{
  const s=session({...createState(),columnSolved:true});s.active={kind:'document',document:DOCUMENTS[0]};
  handleAction(s,'column-submit',{column:8});assert.equal(s.state.columnSolved,true);assert.equal(s.active.kind,'document');
  s.active={kind:'board',board:'t'};handleAction(s,'shape-submit',{board:'l',selected:[]});assert.equal(s.state.boardLSolved,false);
});
