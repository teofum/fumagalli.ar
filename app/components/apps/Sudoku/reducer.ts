import type { SudokuPuzzle } from '~/routes/api.sudoku';
import type { SudokuBoard } from './types';

interface GameState {
  board: SudokuBoard | null;
  difficulty: SudokuPuzzle['difficulty'];
  puzzleNumber: number;
  selected: number;
  won: boolean;
}

interface NewGameAction {
  type: 'newGame';
  puzzle: SudokuPuzzle;
}

interface SelectCellAction {
  type: 'select';
  index: number;
}

interface SetCellAction {
  type: 'set';
  value: number;
}

interface SetAnnotationAction {
  type: 'setAnnotation';
  value: number;
}

interface ResetAnnotationAction {
  type: 'resetAnnotation';
  value: number;
}

interface ClearAnnotationAction {
  type: 'clearAnnotation';
}

type Action =
  | NewGameAction
  | SelectCellAction
  | SetCellAction
  | SetAnnotationAction
  | ResetAnnotationAction
  | ClearAnnotationAction;

export default function sudokuReducer(
  state: GameState,
  action: Action,
): GameState {
  switch (action.type) {
    case 'newGame': {
      return {
        ...state,
        board: action.puzzle.data.map((value) => ({
          value,
          fixed: value !== 0,
          annotations: new Set(),
        })),
        difficulty: action.puzzle.difficulty,
        puzzleNumber: action.puzzle.number,
        won: false,
      };
    }
    case 'select': {
      if (state.won) return state;

      const i = action.index;
      if (i >= 0 && i < 81) return { ...state, selected: i };

      return state;
    }
    case 'set': {
      if (state.won || !state.board) return state;

      const board = [...state.board];
      if (state.selected >= 0 && !state.board[state.selected].fixed)
        board[state.selected].value = action.value;

      return checkBoard({ ...state, board });
    }
    case 'setAnnotation': {
      if (state.won || !state.board) return state;

      const board = [...state.board];
      if (state.selected >= 0 && !state.board[state.selected].fixed) {
        board[state.selected].annotations.add(action.value);
      }

      return checkBoard({ ...state, board });
    }
    case 'resetAnnotation': {
      if (state.won || !state.board) return state;

      const board = [...state.board];
      if (state.selected >= 0 && !state.board[state.selected].fixed) {
        board[state.selected].annotations.delete(action.value);
      }

      return checkBoard({ ...state, board });
    }
    case 'clearAnnotation': {
      if (state.won || !state.board) return state;

      const board = [...state.board];
      if (state.selected >= 0 && !state.board[state.selected].fixed) {
        board[state.selected].annotations.clear();
      }

      return checkBoard({ ...state, board });
    }
    default:
      return state;
  }
}

function getNeighborValues(board: SudokuBoard, cellIndex: number) {
  const x = cellIndex % 9;
  const y = Math.floor(cellIndex / 9);
  const bx = Math.floor(x / 3) * 3;
  const by = Math.floor(y / 3) * 3;

  const column = Array.from(Array(9), (v, k) => 9 * k + x);
  const row = Array.from(Array(9), (v, k) => 9 * y + k);
  const block = Array.from(Array(9), (v, k) => {
    const nx = bx + (k % 3);
    const ny = by + ~~(k / 3);
    return 9 * ny + nx;
  });

  const neigborIndices = [...column, ...row, ...block];
  return new Set(
    neigborIndices.filter((i) => i !== cellIndex).map((i) => board[i].value),
  );
}

function checkBoard(state: GameState): GameState {
  // Can't win if there are any empty cells...
  if (!state.board || state.board.some((cell) => cell.value === 0))
    return state;

  const win = state.board.every(
    (cell, i) =>
      state.board && !getNeighborValues(state.board, i).has(cell.value),
  );

  if (win) return { ...state, won: true, selected: -1 };
  else return state;
}
