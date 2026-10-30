const palette={hair:'#292f24',skin:'#d0ad77',shirt:'#d6c796',light:'#eee0b7',sleeve:'#b7ad81',
  trousers:'#3e5140',boot:'#26362b',scarf:'#a34b38',bag:'#876842',strap:'#685036'};
export const CHARACTER_FRAME=Object.freeze({width:64,height:96,originX:.5,originY:2/3,bodyOffsetX:20,bodyOffsetY:56});
const directions=['down','left','right','up'];
function drawPose(ctx,x,facing,pose,reduced){
  const walking=pose>=0,stride=walking?[-3,-1,3,1][pose]:0,lift=walking?[0,2,0,1][pose]:0;
  const bob=walking&&!reduced?[0,-1,0,0][pose]:0;
  const rect=(px,py,w,h,c)=>{ctx.fillStyle=palette[c]||c;ctx.fillRect(px,py,w,h);};
  ctx.save();ctx.translate(x+32,48);ctx.scale(2,2);rect(-10,5,20,4,'#1c2c2466');ctx.translate(0,bob);
  if(facing==='left'||facing==='right'){
    ctx.save();if(facing==='left')ctx.scale(-1,1);
    rect(-4+stride,1,5,8-lift,'trousers');rect(-4+stride,8-lift,7,3,'boot');
    rect(1-stride,1,5,8,'trousers');rect(1-stride,8,8,3,'boot');
    rect(-6,-11,11,13,'shirt');rect(-5,-10,9,3,'light');
    rect(-4+stride,-8,3,7-lift,'sleeve');rect(-4+stride,-2-lift,3,3,'skin');
    rect(-5,-19,10,9,'skin');rect(-6,-23,10,7,'hair');rect(-6,-19,3,8,'hair');
    rect(4,-17,3,3,'skin');rect(3,-18,1,2,'hair');rect(2,-11,3,6,'scarf');rect(4,-8,3,2,'scarf');
    rect(-5,-10,2,12,'strap');rect(-8,-1,7,7,'bag');rect(-7,0,5,1,'#ac8b58');ctx.restore();
  }else{
    rect(-5,1,5,8-stride,'trousers');rect(-6,8-stride,6,3,'boot');
    rect(2,1,5,8+stride,'trousers');rect(2,8+stride,7,3,'boot');
    rect(-9,-9+stride,3,8,'sleeve');rect(-9,-2+stride,3,3,'skin');
    rect(8,-9-stride,3,8,'sleeve');rect(8,-2-stride,3,3,'skin');
    rect(-7,-12,15,14,'shirt');rect(-5,-11,11,3,'light');rect(-5,-23,11,9,'hair');
    if(facing==='up'){
      rect(-5,-20,11,9,'hair');rect(-4,-11,9,2,'scarf');rect(2,-11,2,14,'strap');rect(-9,-2,7,7,'bag');
    }else{
      rect(-4,-18,9,7,'skin');rect(-5,-20,10,3,'hair');rect(-3,-16,1,2,'hair');rect(3,-16,1,2,'hair');
      rect(-4,-11,3,7,'scarf');rect(-1,-8,5,2,'scarf');rect(-5,-11,2,13,'strap');rect(-9,-2,7,7,'bag');
    }
    rect(-8,-1,5,1,'#ac8b58');
  }
  ctx.restore();
}
export function characterAnimationKey(facing,walking,reduced=false){return `quang-${reduced?'steady':'normal'}-${facing}-${walking?'walk':'idle'}`;}
export function registerCharacterAnimations(scene){
  for(const reduced of [false,true]){
    const texture=`quang-${reduced?'steady':'normal'}`;
    if(!scene.textures.exists(texture)){
      const canvas=document.createElement('canvas');canvas.width=64*20;canvas.height=96;
      const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
      directions.forEach((direction,row)=>{for(let pose=-1;pose<4;pose++)drawPose(ctx,(row*5+pose+1)*64,direction,pose,reduced);});
      scene.textures.addSpriteSheet(texture,canvas,{frameWidth:64,frameHeight:96});
    }
    directions.forEach((direction,row)=>{
      for(const walking of [false,true]){
        const key=characterAnimationKey(direction,walking,reduced);if(scene.anims.exists(key))continue;
        scene.anims.create({key,frames:walking?scene.anims.generateFrameNumbers(texture,{start:row*5+1,end:row*5+4}):[{key:texture,frame:row*5}],
          frameRate:9,repeat:walking?-1:0});
      }
    });
  }
}
