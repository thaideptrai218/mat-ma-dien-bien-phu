import test from 'node:test';
import assert from 'node:assert/strict';
import {SessionHost} from '../src/campaign/session-host.js';
const tick=()=>new Promise(resolve=>setImmediate(resolve));
test('a new room mounts only after old asynchronous Phaser disposal completes',async()=>{
  const host=new SessionHost(),events=[];let release;
  host.active={destroy:()=>new Promise(resolve=>{release=()=>{events.push('destroyed');resolve();};})};
  const transition=host.replace({prepare:async()=>()=>{events.push('mounted');return{destroy:async()=>{}};}});
  await tick();assert.deepEqual(events,[]);release();await transition;assert.deepEqual(events,['destroyed','mounted']);
});
test('restart during a pending room import cannot resurrect a stale room',async()=>{
  const host=new SessionHost(),events=[];let finishImport;
  const old=host.replace({prepare:()=>new Promise(resolve=>{finishImport=()=>resolve(()=>{events.push('stale');});})});
  await tick();const restart=host.replace({prepare:async()=>()=>{events.push('opening');return null;}});
  finishImport();await Promise.all([old,restart]);assert.deepEqual(events,['opening']);assert.equal(host.active,null);
});
test('rapid transitions dispose once and only the latest request mounts',async()=>{
  const host=new SessionHost(),events=[];let release;
  host.active={destroy:()=>new Promise(resolve=>{events.push('dispose');release=resolve;})};
  const first=host.replace({prepare:async()=>()=>events.push('first')});await tick();
  const second=host.replace({prepare:async()=>()=>events.push('second')});
  const latest=host.replace({prepare:async()=>()=>{events.push('latest');return null;}});
  release();await Promise.all([first,second,latest]);assert.deepEqual(events,['dispose','latest']);
});
