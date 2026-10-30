import test from 'node:test';
import assert from 'node:assert/strict';
import {handleAction} from '../src/room-one/actions.js';
import {createState, reduce} from '../src/room-one/rules.js';
import {DOCUMENTS} from '../src/room-one/documents.js';
import {LETTER_DOCUMENT} from '../src/room-one/letter-document.js';

function session(state = createState()) {
  return {state, active:null, ui:{isOpen:false}, audio:{playCue(){}},
    commit(action,p) { const next=reduce(this.state,action,p); if(next===this.state)return false; this.state=next; return true; },
    dialogue(title,lines,buttonLabel,action,payload) {this.active={kind:'dialogue',title,lines,action,payload,token:12};},
    close(){this.active=null;this.closed=true;}, error(message){this.errorMessage=message;},
    show(kind,data){this.active={kind,...data};}};
}
test('paper must be current reader and confirmation belongs to its own deduction', () => {
  const s=session({...createState(),letterSolved:true,envelopeOpened:true});
  handleAction(s,'document-finish',{id:'v1'}); assert.deepEqual(s.state.readNoteIds,[]);
  s.active={kind:'document',document:DOCUMENTS[0],readOnly:false};
  handleAction(s,'document-finish',{id:'p1'}); assert.deepEqual(s.state.readNoteIds,[]);
  handleAction(s,'document-finish',{id:'v1'}); assert.deepEqual(s.state.readNoteIds,['v1']);
  assert.deepEqual(s.state.collectedNoteIds,[]);
  handleAction(s,'document-collect',{id:'v1',token:11}); assert.deepEqual(s.state.collectedNoteIds,[]);
  handleAction(s,'document-collect',{id:'p1',token:12}); assert.deepEqual(s.state.collectedNoteIds,[]);
  handleAction(s,'document-collect',{id:'v1',token:12}); assert.deepEqual(s.state.collectedNoteIds,['v1']);
});
test('closing or resetting invalidates old reading confirmations', () => {
  const s=session({...createState(),letterSolved:true,envelopeOpened:true});
  s.active={kind:'document',document:DOCUMENTS[0],readOnly:false};
  handleAction(s,'document-finish',{id:'v1'}); handleAction(s,'close');
  handleAction(s,'document-collect',{id:'v1',token:12}); assert.deepEqual(s.state.collectedNoteIds,[]);
  s.state=createState(); s.active=null;
  handleAction(s,'document-collect',{id:'v1',token:12}); assert.deepEqual(s.state.collectedNoteIds,[]);
});
test('read-only reader cannot grant progress and puzzle intents need matching view', () => {
  const s=session({...createState(),letterSolved:true,envelopeOpened:true});
  s.active={kind:'document',document:DOCUMENTS[0],readOnly:true};
  handleAction(s,'document-finish',{id:'v1'}); assert.deepEqual(s.state.readNoteIds,[]);
  s.state={...s.state,comparisonSolved:true};
  handleAction(s,'drawer-submit',{code:'2413'}); assert.equal(s.state.drawerOpened,false);
});
test('intact letter needs reading and its own confirmation before A-03 unlocks', () => {
  const s=session(); const proof={documentId:'restored-letter',token:12};
  s.active={kind:'document',document:LETTER_DOCUMENT,readOnly:false};
  assert.equal(s.state.letterSolved,false);
  handleAction(s,'letter-finish',{id:'v1'}); assert.equal(s.active.kind,'document');
  handleAction(s,'letter-finish',{id:'restored-letter'});
  assert.equal(s.state.letterSolved,false); assert.equal(s.active.kind,'dialogue');
  handleAction(s,'close'); handleAction(s,'letter-record',proof); assert.equal(s.state.letterSolved,false);
  s.active={kind:'document',document:LETTER_DOCUMENT,readOnly:false};
  handleAction(s,'letter-finish',{id:'restored-letter'});
  handleAction(s,'letter-record',{...proof,token:11}); assert.equal(s.state.letterSolved,false);
  handleAction(s,'letter-record',proof); assert.equal(s.state.letterSolved,true);
});
test('existing saves can reread the new letter without resetting or granting progress', () => {
  const s=session({...createState(),letterSolved:true});
  handleAction(s,'notebook'); assert.equal(s.active.documents[0].id,'restored-letter');
  handleAction(s,'document-reread',{id:'restored-letter'}); assert.equal(s.active.readOnly,true);
  handleAction(s,'letter-finish',{id:'restored-letter'}); assert.equal(s.active.kind,'document');
});
test('enabled suspended audio resumes in one gesture and running audio can mute', async () => {
  const s=session({...createState(),audioEnabled:true});
  let unlocked=false,resumed=0;
  s.render=()=>{};
  s.audio={getSnapshot:()=>({unlocked,running:unlocked}),setPreferences:()=>{},unlockFromGesture:async()=>{resumed++;unlocked=true;return {ok:true};}};
  handleAction(s,'audio-toggle'); await Promise.resolve();
  assert.equal(resumed,1);assert.equal(s.state.audioEnabled,true);
  handleAction(s,'audio-toggle');assert.equal(s.state.audioEnabled,false);
});
test('July context is available to existing decoded saves without changing their progress',()=>{
  const s=session({...createState(),letterSolved:true,identitySolved:true});
  handleAction(s,'notebook');assert.ok(s.active.documents.some(d=>d.id==='nava-context'));
  const before=structuredClone(s.state);handleAction(s,'document-reread',{id:'nava-context'});assert.equal(s.active.readOnly,true);assert.equal(s.active.document.id,'nava-context');assert.deepEqual(s.state,before);
  const locked=session();handleAction(locked,'notebook');assert.equal(locked.active.documents.some(d=>d.id==='nava-context'),false);
});
