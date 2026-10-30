import {createPanel as sharedPanel} from '../room-one/ui-panels.js';
import {element, button, heading} from '../room-one/ui-elements.js';
import {CHAPTER, CLUE_IDS, clues} from './content.js';

export function createPanel(view, data, emit, snapshot, world) {
  if (view === 'bao-content') {
    const node = element('section', 'r2-original-content');
    node.append(heading(data.title, data.kicker || CHAPTER.kicker), data.content);
    return {node, afterOpen: () => { if (data.focus?.isConnected) data.focus.focus({preventScroll: true}); }};
  }
  if (view === 'notebook') {
    const node = element('section', 'r2-notebook');
    node.append(heading('Sổ tay Bàn cờ Đông Dương', CHAPTER.kicker));
    const list = element('div', 'r1-notebook-list');
    for (const id of CLUE_IDS) {
      const seen = data.state.discoveredClueIds.includes(id), collected = data.state.collectedClueIds.includes(id);
      const row = button('', () => emit('read-clue', {clueId: id}), 'r2-notebook-entry');
      row.disabled = !seen;
      row.append(element('strong', '', clues[id].title), element('span', 'r1-muted', collected ? '✓ ĐÃ GHI · Đọc lại' : seen ? 'ĐÃ THẤY · CHƯA GHI' : clues[id].direction));
      list.append(row);
    }
    node.append(list);
    return {node};
  }
  if (view === 'completed') {
    const node = element('section', 'r1-completed');
    node.append(heading('Bàn cờ Đông Dương đã nối lại', 'HOÀN THÀNH PHÒNG 2'),
      element('div', 'r1-fragment-badge', 'II'),
      element('p', 'r1-lead', 'Bạn đã tìm được riêng mảnh ghép thứ hai và đi qua cánh cửa phía đông.'));
    return {node};
  }
  return sharedPanel(view, data, emit, snapshot, world);
}
