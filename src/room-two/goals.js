import {CHAPTER, PUZZLE_IDS, puzzles, clues, currentPuzzleId} from './content.js';
import {rendererState} from './rules.js';
import {EXIT} from './world.js';
import {goalDoorFor} from './area-gates.js';

export function goalFor(state) {
  const current = currentPuzzleId(rendererState(state)), puzzle = puzzles[current];
  const missing = puzzle.requiredClueIds.find(id => !state.collectedClueIds.includes(id));
  const target = state.fragmentCollected ? EXIT.id : missing || `${current}-station`, door = goalDoorFor(state, target);
  return {id: door || target,
    step: state.fragmentCollected ? PUZZLE_IDS.length - 1 : state.completedPuzzleIds.length,
    label: state.fragmentCollected ? 'Cánh cửa phía đông đã mở' : puzzle.title,
    detail: state.fragmentCollected ? 'Mảnh ghép thứ hai đã được cất. Đi tới cửa để sang phòng kế tiếp.'
      : door ? 'Cánh cửa phía trước có khóa. Nhấn E ở cửa để mở khóa bằng một câu đố nhỏ.' : missing ? clues[missing].direction : puzzle.goal,
    count: `${state.collectedClueIds.length} / ${CHAPTER.clueIds.length} manh mối đã ghi`,
    steps: PUZZLE_IDS.map(id => ({title: puzzles[id].title, done: state.completedPuzzleIds.includes(id)}))};
}
