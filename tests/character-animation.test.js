import test from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {CHARACTER_TEXTURE, preloadCharacter, registerCharacterAnimations,
  releaseCharacterLoader, characterSnapshot} from '../src/game/character-animation.js';

function sceneFixture(loaded=false) {
  const load=new EventEmitter(), queued=[], clips=new Map();
  load.image=(...args)=>queued.push(['image',...args]);
  load.json=(...args)=>queued.push(['json',...args]);
  return {load, queued, clips, textures:{exists:key=>loaded && key===CHARACTER_TEXTURE},
    cache:{json:{exists:()=>false}}, anims:{exists:key=>clips.has(key),create:clip=>clips.set(clip.key,clip)}};
}

test('preload queues local image and measured manifest once before scene creation', () => {
  const scene=sceneFixture(); preloadCharacter(scene);
  assert.equal(scene.queued.length,2);
  assert.match(scene.queued[0][2],/assets\/characters\/long\/motion-sheet\.png$/);
  assert.match(scene.queued[1][2],/assets\/characters\/long\/manifest\.json$/);
  scene.load.emit('loaderror',{key:'unrelated'}); assert.equal(scene.characterError,undefined);
  scene.load.emit('loaderror',{key:scene.queued[0][1]});
  assert.throws(()=>registerCharacterAnimations(scene),/Không tải được/);
  releaseCharacterLoader(scene); assert.equal(scene.load.listenerCount('loaderror'),0);
});

test('each Game owns its clips while repeat registration reuses existing textures and keys', () => {
  const first=sceneFixture(true), second=sceneFixture(true);
  for (const scene of [first,second]) {
    preloadCharacter(scene); assert.equal(scene.queued.length,0);
    const otherListener=()=>{}; scene.load.on('loaderror',otherListener);
    releaseCharacterLoader(scene); assert.equal(scene.load.listenerCount('loaderror'),1);
    assert.equal(registerCharacterAnimations(scene),true);
    assert.equal(registerCharacterAnimations(scene),true);
    assert.equal(scene.clips.size,12);
    assert.deepEqual(scene.clips.get('long-hero-left-run').frames,
      [24,25,26,27,28,29,30,31].map(frame=>({key:CHARACTER_TEXTURE,frame})));
  }
  assert.notEqual(first.clips,second.clips);
});

test('dispose guards late loader errors and prevents any late animation registration', () => {
  const scene=sceneFixture(); preloadCharacter(scene); scene.tornDown=true;
  scene.load.emit('loaderror',{key:scene.queued[0][1]});
  assert.equal(scene.characterError,undefined); assert.equal(registerCharacterAnimations(scene),false);
  releaseCharacterLoader(scene); assert.equal(scene.load.listenerCount('loaderror'),0);
  assert.equal(scene.clips.size,0);
});

test('missing image fails explicitly without creating a placeholder or empty atlas', () => {
  const scene=sceneFixture();
  assert.throws(()=>registerCharacterAnimations(scene),/image is missing/);
  assert.equal(scene.clips.size,0);
});

test('character diagnostic contains detached primitive data only', () => {
  assert.equal(characterSnapshot({}),null);
  const scene={motion:'run',reducedMotion:{matches:false}, player:{texture:{key:CHARACTER_TEXTURE},
    frame:{name:6},anims:{currentAnim:{key:'long-hero-down-run'}},scaleX:.5,scaleY:.5,
    originX:.5,originY:176/192,body:{width:24,height:16,x:88,y:92}}};
  const snapshot=structuredClone(characterSnapshot(scene));
  assert.equal(snapshot.frame,6); assert.equal(snapshot.motion,'run');
  snapshot.body.width=900; assert.equal(scene.player.body.width,24);
});
