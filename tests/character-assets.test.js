import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {inflateSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {characterAtlasLayout} from '../src/game/character-atlas.js';

const base=new URL('../assets/characters/long/',import.meta.url);
const manifest=JSON.parse(fs.readFileSync(new URL('manifest.json',base)));
// Decode the committed RGBA PNG directly; no platform image package or browser fixture.
function decodePng(bytes) {
  assert.equal(bytes.subarray(1,4).toString(),'PNG');
  const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20),chunks=[];
  assert.equal(bytes[24],8);assert.equal(bytes[25],6);assert.equal(bytes[28],0);
  for(let offset=8;offset<bytes.length;){
    const length=bytes.readUInt32BE(offset),type=bytes.toString('ascii',offset+4,offset+8);
    if(type==='IDAT')chunks.push(bytes.subarray(offset+8,offset+8+length));
    offset+=length+12;
  }
  const encoded=inflateSync(Buffer.concat(chunks)),rgba=Buffer.alloc(width*height*4),stride=width*4;
  const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
  for(let y=0;y<height;y++){
    const filter=encoded[y*(stride+1)];assert.ok(filter<=4);
    for(let x=0;x<stride;x++){
      const index=y*stride+x,left=x>=4?rgba[index-4]:0,up=y?rgba[index-stride]:0,corner=y&&x>=4?rgba[index-stride-4]:0;
      const predictor=[0,left,up,Math.floor((left+up)/2),paeth(left,up,corner)][filter];
      rgba[index]=(encoded[y*(stride+1)+x+1]+predictor)&255;
    }
  }
  return {width,height,rgba};
}
const image=decodePng(fs.readFileSync(new URL('motion-sheet.png',base)));
function tile(index){
  const w=image.width/16,h=image.height/4,x0=(index%16)*w,y0=Math.floor(index/16)*h;
  let left=w,right=0,top=h,bottom=0,count=0;
  const pixels=Buffer.alloc(w*h*4);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const offset=((y0+y)*image.width+x0+x)*4,alpha=image.rgba[offset+3];
    image.rgba.copy(pixels,(y*w+x)*4,offset,offset+4);
    if(!alpha)continue;
    assert.ok(alpha>=32,'export residue removed');
    assert.ok(x>=4&&x<w-4&&y>=4&&y<h-4,'transparent tile gutter');
    const crop=manifest.crop;
    assert.ok(x>=crop.x&&x<crop.x+crop.width&&y>=crop.y&&y<crop.y+crop.height,'shared crop contains the full pose');
    left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);count++;
  }
  return {left,right,top,bottom,count,width:right-left+1,hash:createHash('sha256').update(pixels).digest('hex')};
}
const COLUMNS=16;
const tiles=Array.from({length:COLUMNS*4},(_,index)=>tile(index));
const anchorY=manifest.anchor.y;

test('committed transparent sheet holds 64 populated isolated poses (8 walk + 8 run per direction) with a valid common anchor',()=>{
  assert.equal(manifest.columns,COLUMNS);assert.equal(image.width%COLUMNS,0);assert.equal(image.height,1024);
  assert.ok(tiles.every(t=>t.count>7000));assert.equal(new Set(tiles.map(t=>t.hash)).size,COLUMNS*4);
  const layout=characterAtlasLayout(manifest,image.width,image.height);
  assert.equal(layout.width,160*COLUMNS);assert.equal(layout.height,768);
  assert.ok(layout.scale>.65&&layout.scale<.8);
});
test('every pose stands on its row ground line and keeps the same body height',()=>{
  for(let row=0;row<4;row++){
    const poses=tiles.slice(row*COLUMNS,(row+1)*COLUMNS);
    assert.ok(poses.some(t=>t.bottom===anchorY-1),'feet touch the anchor baseline');
    assert.ok(poses.every(t=>anchorY-1-t.bottom<=12),'no pose floats above the ground');
    const heights=poses.map(t=>t.bottom-t.top);
    assert.ok(Math.max(...heights)-Math.min(...heights)<24,'body scale retained across walk and run');
  }
});
