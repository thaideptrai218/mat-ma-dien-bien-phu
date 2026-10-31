import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTER_TEXTURE, CHARACTER_FRAME, CHARACTER_DIRECTIONS, characterAnimationKey,
  characterClips, characterAtlasLayout} from '../src/game/character-atlas.js';
import {PLAYER_BODY} from '../src/core/world-geometry.js';

const manifest = {columns:16,rows:4,sourceWidth:4096,sourceHeight:1536,
  crop:{x:40,y:24,width:176,height:330},anchor:{x:128,y:352}};

test('four directional idle, 8-frame walk and 8-frame run clips cover all 64 source poses', () => {
  assert.deepEqual(CHARACTER_DIRECTIONS, ['down','left','right','up']);
  const clips = characterClips();
  assert.equal(clips.length,12);
  for (let row=0;row<4;row++) {
    const [idle,walk,run] = clips.slice(row*3,row*3+3);
    assert.equal(idle.key, `${CHARACTER_TEXTURE}-${CHARACTER_DIRECTIONS[row]}-idle`);
    assert.deepEqual(idle.frames,[row*16]);
    assert.deepEqual(walk.frames,[0,1,2,3,4,5,6,7].map(column=>row*16+column));
    assert.deepEqual(run.frames,[8,9,10,11,12,13,14,15].map(column=>row*16+column));
    assert.ok(run.frameRate>walk.frameRate);
    assert.equal(idle.repeat,0); assert.equal(walk.repeat,-1); assert.equal(run.repeat,-1);
  }
  assert.equal(new Set(clips.flatMap(clip=>clip.frames)).size,64);
});

test('reduced motion holds directional idle without changing movement or clip data', () => {
  for (const direction of CHARACTER_DIRECTIONS) for (const mode of ['idle','walk','run'])
    assert.equal(characterAnimationKey(direction,mode,true),`${CHARACTER_TEXTURE}-${direction}-idle`);
  assert.throws(()=>characterAnimationKey('north','walk'));
  assert.throws(()=>characterAnimationKey('down',true));
});

test('source rectangles use actual decoded grid dimensions and one common ground transform', () => {
  const layout = characterAtlasLayout(manifest,4096,1536);
  assert.equal(layout.width,2560); assert.equal(layout.height,768);
  assert.deepEqual(layout.frames[17].source,{x:296,y:408,width:176,height:330});
  const first = layout.frames[0];
  for (let index=0;index<64;index++) {
    const {source,target} = layout.frames[index];
    assert.equal(target.width,first.target.width); assert.equal(target.height,first.target.height);
    const localX = target.x-(index%16)*CHARACTER_FRAME.width, localY=target.y-Math.floor(index/16)*CHARACTER_FRAME.height;
    assert.ok(Math.abs(localX+(manifest.anchor.x-manifest.crop.x)*layout.scale-80)<1e-9);
    assert.ok(Math.abs(localY+(manifest.anchor.y-manifest.crop.y)*layout.scale-176)<1e-9);
    assert.ok(localX>=2-1e-9 && localX+target.width<=158+1e-9);
    assert.ok(localY>=2-1e-9 && localY+target.height<=190+1e-9);
    assert.equal(source.width/target.width,first.source.width/first.target.width);
  }
  // A flight pose ten source pixels above contact keeps that exact relative lift.
  const contactY=first.target.y+(manifest.anchor.y-manifest.crop.y)*layout.scale;
  const flightY=first.target.y+(manifest.anchor.y-manifest.crop.y-10)*layout.scale;
  assert.ok(Math.abs(contactY-flightY-10*layout.scale)<1e-9);
});

test('a ground reference below every visible pixel is valid and retains the gap', () => {
  const raised={...manifest,crop:{...manifest.crop,height:320}};
  const layout=characterAtlasLayout(raised,4096,1536), target=layout.frames[0].target;
  assert.ok(target.y+target.height<176);
});

test('invalid source dimensions and crop metadata fail before registering frames', () => {
  for (const value of [null,{...manifest,rows:5},{...manifest,sourceWidth:8192},
    {...manifest,crop:{...manifest.crop,width:300}}, {...manifest,anchor:{x:0,y:352}},
    {...manifest,crop:{...manifest.crop,x:40.5}}, {...manifest,anchor:{x:128,y:NaN}}])
    assert.throws(()=>characterAtlasLayout(value,4096,1536));
  assert.throws(()=>characterAtlasLayout({...manifest,sourceWidth:4097},4097,1536));
});

test('source collider transform preserves the centered 24×16 world footprint', () => {
  const f=CHARACTER_FRAME;
  assert.equal(f.bodyWidth*f.scale,PLAYER_BODY.width);
  assert.equal(f.bodyHeight*f.scale,PLAYER_BODY.height);
  assert.equal((f.bodyOffsetX-f.width*f.originX)*f.scale,-PLAYER_BODY.halfWidth);
  assert.equal((f.bodyOffsetY-f.height*f.originY)*f.scale,-PLAYER_BODY.halfHeight);
});
