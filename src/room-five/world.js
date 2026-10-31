// A fictional reconstruction room; the layout does not reproduce a historical bunker.
export const WORLD = Object.freeze({
  id: 'room-five', width: 2000, height: 1400,
  walls: [[0, 0, 2000, 48], [0, 1352, 2000, 48], [0, 48, 48, 1304], [1952, 48, 48, 1304],
    [460, 360, 300, 32], [1240, 360, 300, 32]],
  props: [
    {x: 890, y: 48, w: 220, h: 62, kind: 'door'},
    {x: 840, y: 695, w: 320, h: 150, kind: 'assembly'},
    {x: 1360, y: 240, w: 190, h: 94, kind: 'reflection'},
    {x: 482, y: 916, w: 46, h: 50, kind: 'lamp'},
    {x: 1440, y: 1020, w: 130, h: 78, kind: 'satchel'},
    {x: 120, y: 470, w: 90, h: 340, kind: 'shelf'},
    {x: 1790, y: 470, w: 90, h: 340, kind: 'shelf'},
    {x: 330, y: 1170, w: 240, h: 70, kind: 'shelf'},
  ],
  exits: [], checkpoints: [{id: 'entry', x: 1000, y: 1220}],
  objects: [
    {id: 'assembly', label: 'Bàn phục dựng bức tranh', x: 1000, y: 770, type: 'assembly'},
    {id: 'reflection', label: 'Nơi ánh sáng bên cửa', x: 1455, y: 287, type: 'reflection'},
    {id: 'door', label: 'Cánh cửa trở về', x: 1000, y: 108, type: 'door'},
    {id: 'lamp', label: 'Ngọn đèn cuối hành trình', x: 505, y: 941, type: 'prop'},
    {id: 'satchel', label: 'Chiếc túi đã đi cùng Long', x: 1505, y: 1059, type: 'prop'},
  ].map(object => Object.freeze({...object, radius: 110})),
});
export const OBJECTS = WORLD.objects;
