// Room 1 area gates, in progression order. Every gate has exactly ONE unlock method, fixed here in data:
//   type 'auto'   - opens by itself once the previous task is done (predicate over existing save flags);
//   type 'puzzle' - opens when its short door puzzle is solved (E at an anchor) -> state.doorsSolved.
// Legacy saves never get trapped: a puzzle gate also reads as open when later progression already implies it.
// Rect geometry fills the gaps of the x988 / x1376 dividers in world.js plus a few cross barriers (see tests).
const solved = (s, id) => Array.isArray(s.doorsSolved) && s.doorsSolved.includes(id);
const collected = (s, id) => Array.isArray(s.collectedNoteIds) && s.collectedNoteIds.includes(id);

export const AREA_GATES = Object.freeze([
  { // lobby (entry + letter) -> central gallery (A-03 map, comparison desk)
    id: 'lobby-hall', type: 'auto', style: 'rope',
    notice: 'Sợi dây chắn lối vào gian giữa. Hãy đọc xong lá thư trên bàn.',
    rects: [[1024, 1100, 352, 24]],
    unlockedBy: s => s.letterSolved === true,
  },
  { // west archive (V-01, V-02)
    id: 'west-archive', type: 'puzzle', style: 'bars',
    notice: 'Then cài gian V. Nhấn E để mở khóa.',
    rects: [[988, 720, 36, 380], [988, 1290, 36, 262]],
    anchors: [[1040, 910], [1040, 1420]],
    unlockedBy: s => solved(s, 'west-archive') || (s.readNoteIds || []).length > 0,
  },
  { // east archive (P-01, P-02)
    id: 'east-archive', type: 'auto', style: 'curtain',
    notice: 'Gian P còn khóa. Hãy ghi xong hai hồ sơ V-01 và V-02.',
    rects: [[1376, 720, 36, 380], [1376, 1290, 36, 262]],
    unlockedBy: s => (collected(s, 'v1') && collected(s, 'v2')) || collected(s, 'p1') || collected(s, 'p2'),
  },
  { // north-east alcove (drawer)
    id: 'drawer-alcove', type: 'puzzle', style: 'barrier',
    notice: 'Góc ngăn kéo bị chặn. Nhấn E để mở khóa.',
    rects: [[1376, 374, 36, 146], [1412, 520, 940, 24]],
    anchors: [[1340, 447], [1700, 580]],
    unlockedBy: s => solved(s, 'drawer-alcove') || s.drawerOpened === true,
  },
  { // north-west alcove (chest)
    id: 'chest-alcove', type: 'auto', style: 'rope',
    notice: 'Góc rương còn khóa. Hãy giải xong điện mật ở ngăn kéo.',
    rects: [[988, 374, 36, 146], [48, 520, 940, 24]],
    unlockedBy: s => s.identitySolved === true,
  },
  { // exit hall (door) incl. the two top openings that would bypass it
    id: 'exit-hall', type: 'puzzle', style: 'door',
    notice: 'Cổng ra còn khóa. Nhấn E để mở khóa.',
    rects: [[1024, 144, 352, 30], [988, 48, 36, 96], [1376, 48, 36, 96]],
    anchors: [[1340, 205]],
    unlockedBy: s => solved(s, 'exit-hall') || s.exitReached === true,
  },
]);

export const gateIsOpen = (id, state) => {
  const gate = AREA_GATES.find(g => g.id === id);
  try { return gate?.unlockedBy(state ?? {}) === true; } catch { return false; }
};

// Interaction anchors of puzzle gates that are still locked (E at one opens the door panel).
export function gateAnchors(state) {
  return AREA_GATES.filter(g => g.type === 'puzzle' && !gateIsOpen(g.id, state)).flatMap(g =>
    g.anchors.map(([x, y], i) => Object.freeze({id: `gate:${g.id}:${i}`, gateId: g.id, label: 'Khóa cổng', x, y, radius: 90, type: 'gate'})));
}
export const firstAnchorId = id => `gate:${id}:0`;
export const gateIdOfAnchor = anchorId => /^gate:([^:]+):\d+$/.exec(String(anchorId))?.[1] ?? null;
