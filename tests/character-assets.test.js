import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {inflateSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {characterAtlasLayout} from '../src/game/character-atlas.js';

const base=new URL('../assets/characters/quang-reference/',import.meta.url);
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
  const w=image.width/8,h=image.height/4,x0=(index%8)*w,y0=Math.floor(index/8)*h;
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
const tiles=Array.from({length:32},(_,index)=>tile(index));

test('committed transparent sheet contains32 populated isolated poses with a valid common anchor',()=>{
  assert.equal(image.width,2048);assert.equal(image.height,1280);
  assert.ok(tiles.every(t=>t.count>7000));assert.equal(new Set(tiles.map(t=>t.hash)).size,32);
  const layout=characterAtlasLayout(manifest,image.width,image.height);
  assert.equal(layout.width,1280);assert.equal(layout.height,768);
  assert.ok(layout.scale>.65&&layout.scale<.75);
});
test('both side walk cycles alternate wide contacts with narrow passing silhouettes',()=>{
  for(const row of[1,2]){
    const [contact,passing,opposite,otherPass]=tiles.slice(row*8+1,row*8+5);
    assert.ok(contact.width>passing.width*1.5);
    assert.ok(opposite.width>otherPass.width*1.5);
    assert.ok(Math.abs(contact.bottom-opposite.bottom)<=4,'ground contacts aligned');
  }
});
test('run airborne pose keeps its lifted shoes rather than being bottom-aligned independently',()=>{
  for(let row=0;row<4;row++){
    const contact=tiles[row*8+5],flight=tiles[row*8+6];
    assert.ok(contact.bottom-flight.bottom>20);
    assert.ok(flight.top>contact.top-8&&flight.top<contact.top+22,'body scale retained');
  }
});
