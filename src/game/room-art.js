// The same rectangles feed this illustration and Arcade collision bodies.
export function createRoomTexture(scene,map){
  const key=`room-${map.id}`,texture=scene.textures.createCanvas(key,map.width,map.height),ctx=texture.context;
  const rect=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);};
  const line=(points,color,width=2)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();};
  let seed=map.id.length*93;
  const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  function label(text,x,y,size=17,color='#e6d8ac'){
    ctx.font=`${size}px "Segoe UI",Tahoma,sans-serif`;ctx.textAlign='center';
    const width=ctx.measureText(text).width;rect(x-width/2-10,y-size,width+20,size+12,'#1e2b22dd');
    ctx.fillStyle=color;ctx.fillText(text,x,y+2);
  }
  function plank(x,y,w,h){
    rect(x,y,w,h,'#3b3b29');rect(x+4,y+4,w-8,h-8,'#80613a');rect(x+6,y+6,w-12,4,'#ae8b52');
    for(let dy=18;dy<h-4;dy+=18)line([[x+6,y+dy],[x+w-6,y+dy]],'#5b4b31');
  }
  function lamp(x,y){
    const light=ctx.createRadialGradient(x,y,6,x,y,205);
    light.addColorStop(0,'#edc06b55');light.addColorStop(.4,'#e3b6651c');light.addColorStop(1,'#e3b66500');
    ctx.fillStyle=light;ctx.fillRect(x-205,y-205,410,410);
    rect(x-8,y-10,16,26,'#293323');rect(x-5,y-5,10,15,'#f2ce73');rect(x-3,y,6,6,'#fff0ae');
  }
  function furniture(p){
    const {x,y,w,h,type}=p;rect(x+8,y+12,w,h,'#17231b66');
    if(['desk','chair','crate','bench'].includes(type)){
      plank(x,y,w,h);
      if(type==='crate'){rect(x+7,y+4,7,h-8,'#ae8b52');rect(x+w-14,y+4,7,h-8,'#ae8b52');line([[x+14,y+8],[x+w-14,y+h-10]],'#b29456',5);}
      if(type==='desk'){
        rect(x+w*.24,y+12,w*.35,h*.61,'#e5d9b0');
        for(let dy=22;dy<h*.65;dy+=9)rect(x+w*.28,y+dy,w*.25,2,'#929068');
        rect(x+w*.73,y+14,22,32,'#40543e');rect(x+w*.75,y+18,14,3,'#a3ac7c');
      }
    }else if(type==='map'){
      rect(x,y,w,h,'#4e5135');rect(x+6,y+6,w-12,h-12,'#b8ad7b');
      line([[x+14,y+h-16],[x+w*.26,y+18],[x+w*.46,y+h*.55],[x+w*.65,y+16],[x+w-16,y+h*.43]],'#6e7d50',4);
      line([[x+w*.3,y+10],[x+w*.4,y+h*.65],[x+w*.7,y+h-12]],'#91855a',3);
      for(const [px,py] of [[.26,.3],[.65,.2],[.7,.7]])rect(x+w*px,y+h*py,7,7,'#8b4c35');
    }else if(type==='radio'){
      plank(x,y,w,h);rect(x+15,y-8,w-30,h*.68,'#303e31');rect(x+20,y-3,w-40,h*.55,'#4d5d43');
      rect(x+30,y+4,w*.36,22,'#252f28');rect(x+34,y+8,w*.3,6,'#b6a66a');
      rect(x+w-55,y+4,24,24,'#25362a');rect(x+w-47,y+9,7,14,'#b6b887');
      for(let dx=30;dx<w-30;dx+=10)rect(x+dx,y+h*.43,4,7,'#273a2b');
      line([[x+w-23,y-8],[x+w-23,y-58],[x+w-8,y-68]],'#7f8d60',3);
    }else if(type==='bed'){
      rect(x,y,w,h,'#343f2d');rect(x+6,y+8,w-12,h-16,'#7c8055');rect(x+10,y+16,w-20,34,'#b2ad7b');
      rect(x+8,y+70,w-16,h-80,'#626e47');rect(x+12,y+78,w-24,6,'#8a9260');
    }else if(type==='display'||type==='model'){
      rect(x,y,w,h,'#555e50');rect(x+6,y+6,w-12,h-20,'#9eb3a0');rect(x+12,y+12,w-24,h-32,'#819487');
      rect(x+36,y+26,w*.4,h*.46,'#d8cda7');rect(x+w-54,y+24,24,40,'#555e40');line([[x+20,y+18],[x+w-22,y+h-32]],'#c2d2b777',3);
      rect(x+10,y+h-12,w-20,8,'#4a4f3d');
      if(type==='model'){
        rect(x+26,y+22,w-52,h-56,'#5c6545');rect(x+30,y+26,w-60,7,'#a49765');
        rect(x+30,y+26,7,h-62,'#a49765');rect(x+w*.5,y+26,7,h-74,'#a49765');
        rect(x+w*.68,y+42,35,18,'#9c7c4c');rect(x+46,y+45,30,18,'#c5b888');
      }
    }else if(type==='garden'){
      rect(x+8,y+h*.6,w-16,h*.4,'#8e6b45');rect(x+4,y+h*.55,w-8,12,'#b08a57');
      for(let i=0;i<8;i++){const px=x+8+random()*(w-28),py=y+random()*h*.55;rect(px,py,20,24,['#4c6640','#778552','#5b7849'][i%3]);}
    }else if(type==='scale'){
      // Brass balance, tipped toward the Bắc Bộ pan on the left.
      const cx=x+w/2;rect(cx-20,y+h-12,40,10,'#6e5328');rect(cx-3,y+10,6,h-20,'#b48a3e');rect(cx-5,y+6,10,8,'#e2bd63');
      line([[x+6,y+18],[x+w-6,y+6]],'#e2bd63',4);
      for(const [px,py] of [[x+10,y+18],[x+w-10,y+6]]){line([[px,py],[px-10,py+16]],'#c9a24f',1);line([[px,py],[px+10,py+16]],'#c9a24f',1);rect(px-14,py+16,28,5,'#d9b25a');}
      for(let i=0;i<4;i++)rect(x+3+i*6,y+28,5,5,'#7a6a4a');
    }else if(type==='fist-table'){
      // Sand table of Indochina with the iron fist pressing on the Bắc Bộ delta.
      plank(x,y,w,h);rect(x+10,y+10,w-20,h-20,'#cdbf86');
      line([[x+18,y+h-18],[x+w*.3,y+22],[x+w*.48,y+h*.6],[x+w*.6,y+h-16]],'#8a7b4c',3);
      line([[x+w*.22,y+h*.45],[x+w*.45,y+h*.38],[x+w*.55,y+h*.7]],'#9b6a3f',2);
      for(const [px,py] of [[.25,.3],[.2,.55],[.42,.62],[.6,.78]])rect(x+w*px,y+h*py,6,9,'#a2412f');
      rect(x+w*.64,y+16,w*.26,h*.42,'#5d625f');for(let i=0;i<4;i++)rect(x+w*.64+i*w*.065,y+12,w*.055,10,'#7b827d');
      rect(x+w*.64-8,y+h*.42,12,16,'#7b827d');
    }else if(type==='chest'){
      rect(x,y,w,h,'#2f3431');rect(x+4,y+4,w-8,h-8,'#56605a');rect(x+4,y+4,w-8,6,'#6d7871');
      for(const px of [.2,.75])rect(x+w*px,y,7,h,'#2b302c');rect(x+w/2-8,y+h*.32,16,16,'#c9a24f');rect(x+w/2-2,y+h*.32+6,4,6,'#3b2f1c');
      for(const px of [8,w-12])for(const py of [8,h-12])rect(x+px,y+py,4,4,'#9aa59d');
    }else if(type==='rack'){
      plank(x,y,w,h);
      for(let dy=14;dy<h-24;dy+=36){rect(x+10,y+dy,w-20,26,'#e3d6aa');rect(x+14,y+dy+4,w*.5,4,'#5a5440');for(let ly=12;ly<24;ly+=5)rect(x+14,y+dy+ly,w-28,2,'#a9a07c');}
    }else if(type==='calendar'){
      plank(x,y,w,h);rect(x+w*.34,y+8,w*.32,h*.72,'#efe6c6');rect(x+w*.34,y+8,w*.32,12,'#a2412f');
      for(let gy=26;gy<h*.72;gy+=10)for(let gx=6;gx<w*.32-6;gx+=10)rect(x+w*.34+gx,y+gy,6,6,'#b9ae88');
      rect(x+w*.08,y+12,w*.2,h*.6,'#40543e');rect(x+w*.72,y+12,w*.2,h*.6,'#40543e');
    }
  }
  rect(0,0,map.width,map.height,'#1e2a20');rect(64,64,map.width-128,map.height-128,map.theme.floor);
  for(let y=64;y<map.height-64;y+=34)for(let x=64;x<map.width-64;x+=50){
    rect(x,y,48,32,map.theme.floor);rect(x+3,y+2,42,2,random()>.5?'#e5d8a51b':'#17251e22');
    rect(x+1,y+31,48,2,'#23322655');rect(x+48,y,2,33,'#28372755');
    if(random()>.65)rect(x+10+random()*20,y+14,6,2,'#263a3044');
  }
  if(map.width===2400)for(let y=534;y<828;y+=24)for(let x=64;x<2336;x+=128){
    rect(x,y,126,22,['#726440','#7b6944','#6c613d'][Math.floor(random()*3)]);rect(x+6,y+4,110,2,'#a38b5544');
  }
  for(const [x,y,w,h,color] of map.zones||[])rect(x,y,w,h,color);
  for(const [x,y,w,h] of map.walls){
    rect(x+7,y+10,w,h,'#17231b66');rect(x,y,w,h,'#34412c');
    if(w>h)for(let dy=0;dy<h;dy+=12)for(let dx=0;dx<w;dx+=46){
      rect(x+dx+2,y+dy,Math.min(42,w-dx-2),10,map.theme.wall);rect(x+dx+2,y+dy,Math.min(42,w-dx-2),2,'#c3b78244');
    }else for(let dy=0;dy<h;dy+=28){rect(x+2,y+dy,w-4,24,map.theme.wall);rect(x+2,y+dy,w-4,4,'#bdb37d33');}
  }
  map.props.forEach(furniture);
  const lights=map.width===2400?[[326,94],[696,464],[996,556],[1514,464],[2004,98],[148,792],[1974,790],[680,914],[888,1300],[2188,1276]]:
    [[180,130],[660,120],[1150,130],[180,690],[1120,680]];
  lights.forEach(([x,y])=>lamp(x,y));
  if(map.labels)for(const [text,x,y,size,color] of map.labels)label(text,x,y,size,color);
  else label(map.theme.name,640,110,26,map.theme.accent);
  for(const target of map.interactables){
    rect(target.x-5,target.y-20,10,10,map.theme.accent);label(`${target.type==='puzzle'?'◇':'✧'} ${target.label}`,target.x,target.y-34,16,map.theme.accent);
  }
  texture.refresh();return key;
}
