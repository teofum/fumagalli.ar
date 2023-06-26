import { reveal, newBoard } from './game';
import {
  FlagStatus,
  MinesweeperState,
  type MinesweeperBoard,
  type MinesweeperSettings,
} from './types';

interface GameState {
  board: MinesweeperBoard;
  state: MinesweeperState;
  settings: MinesweeperSettings;
}

interface NewGameAction {
  type: 'newGame';
  settings: MinesweeperSettings;
}

interface RevealAction {
  type: 'reveal';
  cellIndex: number;
}

interface CycleFlagAction {
  type: 'cycleFlag';
  cellIndex: number;
}

type Action = NewGameAction | RevealAction | CycleFlagAction;

export default function minesweeperReducer(
  state: GameState,
  action: Action,
): GameState {
  switch (action.type) {
    case 'newGame': {
      return {
        board: newBoard(action.settings),
        state: MinesweeperState.NEW,
        settings: action.settings,
      };
    }
    case 'reveal': {
      const { board } = state;

      // Copy game state and board
      let newState = state.state;
      const newBoard = {
        ...board,
        cells: board.cells.slice(),
      };

      const cell = newBoard.cells[action.cellIndex];
      if (cell.flag === FlagStatus.FLAGGED) return state;

      // Set playing state, this starts the timer
      if (newState === MinesweeperState.NEW)
        newState = MinesweeperState.PLAYING;

      // Reveal the cell
      reveal(newBoard, action.cellIndex);

      if (cell.hasMine) {
        // Kaboom
        newState = MinesweeperState.LOST;
        cell.exploded = true;

        // Reveal all mines and wrongly flagged cells
        newBoard.cells.forEach((c, ci) => {
          if (
            (c.hasMine && c.flag !== FlagStatus.FLAGGED) ||
            (!c.hasMine && c.flag === FlagStatus.FLAGGED)
          )
            reveal(board, ci);
        });
      } else {
        // Win state #1: all cells without mines revealed
        const win = newBoard.cells
          .filter((cell) => !cell.revealed)
          .every((cell) => cell.hasMine);

        if (win) newState = MinesweeperState.WON;
      }

      return {
        ...state,
        board: newBoard,
        state: newState,
      };
    }
    case 'cycleFlag': {
      const { board, settings } = state;

      // Copy game state and board
      let newState = state.state;
      const newBoard = {
        ...board,
        cells: board.cells.slice(),
      };

      const cell = newBoard.cells[action.cellIndex];
      if (cell.revealed) return state;

      // Set playing state, this starts the timer
      if (newState === MinesweeperState.NEW)
        newState = MinesweeperState.PLAYING;

      cell.flag = (cell.flag + 1) % 3;

      // Win state #2: all mines correctly flagged
      const allMinesFlagged = newBoard.cells
        .filter((cell) => cell.hasMine)
        .every((cell) => cell.flag === FlagStatus.FLAGGED);

      const newFlagCount = newBoard.cells.filter(
        (cell) => cell.flag === FlagStatus.FLAGGED,
      ).length;

      if (allMinesFlagged && newFlagCount === settings.mines)
        newState = MinesweeperState.WON;

      return {
        ...state,
        board: newBoard,
        state: newState,
      };
    }
  }
}
