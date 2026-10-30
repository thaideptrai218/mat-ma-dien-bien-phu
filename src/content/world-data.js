// Fictional rooms for exploration; these plans are not historical military maps.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
const scaled=rect=>rect.map(n=>n*2);
const bunkerWalls=[
  [16,16,1168,16],[16,688,1168,16],[16,32,16,656],[1168,32,16,656],
  [392,32,16,218],[784,32,16,218],[392,430,16,258],[784,430,16,258],
  [32,250,208,16],[330,250,260,16],[680,250,300,16],[1070,250,98,16],
  [32,414,98,16],[220,414,320,16],[630,414,310,16],[1030,414,138,16],
].map(scaled);
const prop=(type,x,y,w,h)=>({type,x:x*2,y:y*2,w:w*2,h:h*2});
function furniture(theme){
  const nava=theme==='navarre-plan';
  const result=[prop('desk',220,110,90,44),prop('chair',251,166,27,17),prop('map',73,55,88,48),
    prop(nava?'calendar':'radio',535,100,90,44),prop('radio',669,175,90,44),prop('map',428,50,76,45),
    prop('map',78,480,130,78),prop('desk',252,589,90,44),prop('desk',1049,514,90,44),
    prop('map',830,458,76,45),prop('map',930,278,90,38),prop('chair',1080,570,27,17)];
  for(const [x,y,w,h] of [[57,191,36,29],[88,205,36,29],[335,65,36,29],[865,184,53,36],[908,185,35,27],
    [61,624,43,30],[707,627,39,30],[360,278,37,26],[760,374,36,28]])result.push(prop('crate',x,y,w,h));
  for(let i=0;i<3;i++){result.push(prop('crate',827+i*43,73,36,34));result.push(prop('crate',1082,132+i*33,43,29));}
  for(const x of [448,545,651])result.push(prop(theme==='peace'?'garden':nava?'rack':'bed',x,485,53,83));
  if(theme==='command-post')result.push(prop('radio',850,585,90,44));
  // Room 2: brass balance by Nava's desk, the Việt Bắc radio, the sand table, the iron chest and the telegraph table.
  if(nava)result.push(prop('scale',150,150,44,30),prop('radio',950,95,90,44),prop('fist-table',700,282,70,35),
    prop('chest',830,385,50,24),prop('radio',850,585,90,44));
  return result;
}
const clue=(id,x,y,label)=>({id,type:'clue',clueId:id,x,y,radius:180,label});
const clueSets={
  'him-lam':[clue('him-lam-position',530,270,'Hồ sơ chuẩn bị'),clue('him-lam-artillery',1160,260,'Dòng ghi điện đài'),
    clue('him-lam-infantry',1950,594,'Sơ đồ hành lang'),clue('him-lam-victory',285,1040,'Bản tin Him Lam')],
  'navarre-plan':[clue('nava-planner',530,270,'Sổ kế hoạch'),clue('nava-calendar',1160,260,'Tờ lịch 2/1954'),
    clue('nava-radio-note',2150,200,'Ghi chú điện đài'),clue('nava-diary',285,1040,'Nhật ký chiến sĩ'),
    clue('nava-newspaper',1250,1060,'Trang báo cũ'),clue('nava-allied-telegram',1950,1080,'Điện liên quân'),
    clue('nava-dbp-dossier',1765,790,'Hồ sơ Điện Biên Phủ')],
  'command-post':[clue('command-report',530,270,'Mẩu điện: sở chỉ huy'),clue('command-advance',1160,260,'Mẩu điện: tiến quân'),
    clue('command-capture',1950,594,'Mẩu điện: kết quả')],
  peace:[clue('peace-memory',530,270,'Ký ức trong tấm ảnh'),clue('peace-community',1950,594,'Bàn học hôm nay')],
};
const station=(puzzleId,x,y,label)=>({id:`${puzzleId}-station`,type:'puzzle',puzzleId,x,y,radius:150,label});
const stationSets={
  'navarre-plan':[station('nava-balance',250,330,'Cán cân 84'),station('nava-radio',1950,300,'Điện đài hai tai nghe'),
    station('nava-fist',1470,690,'Sa bàn · nắm đấm thép'),station('nava-fold',1710,730,'Hòm sắt · bản đồ gấp')],
};
const themes={
  'him-lam':{name:'HỒ SƠ HIM LAM',floor:'#64664b',wall:'#6c694c',accent:'#d9b66c'},
  'navarre-plan':{name:'BÀN LÀM VIỆC CỦA NAVA',floor:'#5f6352',wall:'#666b56',accent:'#e3c27c'},
  'command-post':{name:'SỞ CHỈ HUY',floor:'#53605b',wall:'#5d6d60',accent:'#b5c6a2'},
  peace:{name:'CÁNH CỬA HÒA BÌNH',floor:'#6b7050',wall:'#7d7952',accent:'#efcc83'},
};
// [text,x,y,size?,color?] drawn onto the room texture.
function bunkerLabels(id,theme){
  if(id==='navarre-plan')return [[theme.name,420,156,24,theme.accent],['KHO TƯ LIỆU',1180,132],['LÁN THAM MƯU VIỆT BẮC',1942,108,17,'#e8c493'],
    ['HÀNH LANG · SA BÀN ĐÔNG DƯƠNG  →',760,676,20],['GÓC NHẬT KÝ',424,916],['GIÁ BÁO CŨ',1180,922],['BÀN ĐIỆN BÁO',1960,940],
    ['LỐI ĐI TIẾP  →',2030,810,16,theme.accent]];
  return [[theme.name,420,156,24,theme.accent],['ĐIỆN ĐÀI · TƯ LIỆU',1180,132],['KHO TIẾP TẾ',1942,108],['HÀNH LANG KÝ ỨC  →',1188,676,20],
    ['GIAN BẢN ĐỒ',424,916],[id==='peace'?'GÓC VƯỜN YÊN TĨNH':'GÓC NGHỈ CHÂN',1180,922],['LỐI ĐI TIẾP  →',2030,810,16,theme.accent]];
}
// Translucent floor tints: Nava's grey-blue office (west) and the earth-brown Việt Bắc hut (east).
const zoneSets={'navarre-plan':[[64,64,720,436,'#47607a40'],[1584,64,752,436,'#86603a40']]};
function bunker(id,next){
  const interactables=[...clueSets[id]];
  if(stationSets[id])interactables.push(...stationSets[id]);
  else interactables.push(id==='peace'?{id:'peace-reflection',type:'puzzle',puzzleId:'peace',x:1710,y:730,radius:150,label:'Một điều mang về'}:
    {id:`${id}-puzzle`,type:'puzzle',puzzleId:id,x:1710,y:730,radius:150,label:'Bàn ghép hồ sơ'});
  return {id,width:2400,height:1440,theme:themes[id],walls:bunkerWalls,props:furniture(id),labels:bunkerLabels(id,themes[id]),zones:zoneSets[id]||[],
    checkpoints:[{id:'entry',x:580,y:350,radius:56},{id:'hall',x:1120,y:680,radius:64},
      {id:'archive',x:600,y:1080,radius:60},{id:'east',x:2070,y:720,radius:52}],interactables,
    exits:[{id:`${id}-exit`,type:'exit',x:2290,y:680,radius:150,label:'Cánh cửa ký ức',toChapterId:next,spawnId:'entry',
      requiresRoomId:id,gate:[2208,532,24,296]}]};
}
function museum(id){
  const ending=id==='ending';
  return {id,width:1280,height:800,theme:{name:ending?'TRỞ LẠI BẢO TÀNG':'BẢO TÀNG · HIỆN TẠI',floor:'#777963',wall:'#92917a',accent:'#eed29a'},
    walls:[[32,32,1216,24],[32,744,1216,24],[32,56,24,688],[1224,56,24,688],
      ...(ending?[]:[[1100,360,124,24],[1100,576,124,24]])],
    props:[{type:'model',x:232,y:190,w:200,h:120},{type:'display',x:560,y:190,w:200,h:120},
      {type:'display',x:888,y:190,w:200,h:120},{type:'bench',x:550,y:565,w:190,h:44},
      {type:'garden',x:96,y:640,w:76,h:64},{type:'garden',x:1104,y:640,w:76,h:64}],
    checkpoints:[{id:'entry',x:380,y:470,radius:64}],
    interactables:[{id:`${id}-journal`,type:'story',beatId:`${id}-intro`,x:332,y:300,radius:200,label:ending?'Bên mô hình hầm':'Mô hình hầm chỉ huy'}],
    exits:ending?[]:[{id:'museum-exit',type:'exit',x:1160,y:480,radius:150,label:'Bước vào ký ức',toChapterId:'him-lam',spawnId:'entry',
      requiresBeatId:'museum-intro',gate:[1100,384,24,192]}]};
}
export const maps=freeze({museum:museum('museum'),'him-lam':bunker('him-lam','navarre-plan'),
  'navarre-plan':bunker('navarre-plan','command-post'),'command-post':bunker('command-post','peace'),
  peace:bunker('peace','ending'),ending:museum('ending')});
export function getMap(chapterId){return maps[chapterId]||null;}
