import {CHAPTER, CLUE_IDS, PUZZLE_IDS, clues, beats, puzzles, evaluatePuzzle} from './content.js';

export function createState() {
  return {version: 1, introSeen: false, discoveredClueIds: [], collectedClueIds: [],
    completedPuzzleIds: [], completedBeatIds: [], hintLevels: {}, fragmentCollected: false,
    exitReached: false, audioEnabled: false, audioVolume: .5};
}

export function rendererState(state) {
  return {...state, chapterId: CHAPTER.id,
    completedRoomIds: state.fragmentCollected ? [CHAPTER.id] : []};
}

export function reduce(state, action, payload = {}) {
  const id = payload.clueId;
  switch (action) {
    case 'discover-clue':
      return CLUE_IDS.includes(id) && !state.discoveredClueIds.includes(id)
        ? {...state, discoveredClueIds: [...state.discoveredClueIds, id]} : state;
    case 'collect-clue':
      return CLUE_IDS.includes(id) && state.discoveredClueIds.includes(id) && !state.collectedClueIds.includes(id)
        ? {...state, collectedClueIds: [...state.collectedClueIds, id],
          completedBeatIds: [...state.completedBeatIds, clues[id].beatId]} : state;
    case 'complete-beat': {
      const beat = beats[payload.beatId];
      if (![CHAPTER.introBeatId, CHAPTER.outroBeatId].includes(beat?.id) ||
        state.completedBeatIds.includes(beat.id) || (beat.requiresRoomCompletion && !state.fragmentCollected)) return state;
      return {...state, introSeen: state.introSeen || beat.id === CHAPTER.introBeatId,
        completedBeatIds: [...state.completedBeatIds, beat.id]};
    }
    case 'submit-puzzle': {
      const expected = PUZZLE_IDS[state.completedPuzzleIds.length];
      if (state.exitReached || payload.puzzleId !== expected ||
        !evaluatePuzzle(expected, payload.answer, state.collectedClueIds).ok) return state;
      const completedPuzzleIds = [...state.completedPuzzleIds, expected];
      return {...state, completedPuzzleIds, fragmentCollected: completedPuzzleIds.length === PUZZLE_IDS.length};
    }
    case 'use-hint': {
      if (!PUZZLE_IDS.includes(payload.puzzleId)) return state;
      const puzzle = puzzles[payload.puzzleId], level = state.hintLevels[payload.puzzleId] || 0;
      if (!puzzle || level >= puzzle.hints.length) return state;
      return {...state, hintLevels: {...state.hintLevels, [puzzle.id]: level + 1}};
    }
    case 'exit': return state.fragmentCollected && !state.exitReached ? {...state, exitReached: true} : state;
    case 'audio': return {...state, audioEnabled: !state.audioEnabled};
    default: return state;
  }
}
