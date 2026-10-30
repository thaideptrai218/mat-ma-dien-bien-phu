export {chapters, clues, beats, puzzles, sources} from './bao/content/story-data.js';
export {currentPuzzleId, evaluatePuzzle, checkFistMove, normalizeAnswer} from './bao/core/game-rules.js';
import {chapters} from './bao/content/story-data.js';
export const CHAPTER = chapters['navarre-plan'];
export const PUZZLE_IDS = Object.freeze([...CHAPTER.puzzleIds]);
export const CLUE_IDS = Object.freeze([...CHAPTER.clueIds]);
