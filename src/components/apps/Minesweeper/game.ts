import type {
  MinesweeperCell,
  MinesweeperBoard,
  MinesweeperSettings,
} from './types';
import { FlagStatus } from './types';

export const difficultyPresets = {
  beginner: { name: 'beginner', width: 8, height: 8, mines: 10 },
  intermediate: { name: 'intermediate', width: 16, height: 16, mines: 40 },
  expert: { name: 'expert', width: 30, height: 16, mines: 99 },
} as const;

export function emptyCell(): MinesweeperCell {
  return {
    hasMine: false,
    nearMines: 0,
    flag: FlagStatus.NONE,
    revealed: false,
    exploded: false,
  };
}

export function emptyBoard(w: number, h: number): MinesweeperBoard {
  return {
    cells: Array.from(Array(w * h), emptyCell),
    width: w,
    height: h,
  };
}

export function neighbors(x0: number, y0: number, board: MinesweeperBoard) {
  const n: MinesweeperCell[] = [];
  for (let y = y0 - 1; y <= y0 + 1; y++)
    for (let x = x0 - 1; x <= x0 + 1; x++)
      if (x >= 0 && x < board.width && y >= 0 && y < board.height)
        n.push(board.cells[x + board.width * y]);

  return n;
}

export function newBoard(settings: MinesweeperSettings) {
  const { width, height, mines } = settings;
  const board = emptyBoard(width, height);
  const size = width * height;

  // Place mines
  let placed = 0;
  while (placed < mines) {
    const index = Math.floor(Math.random() * size);
    const cell = board.cells[index];
    if (!cell.hasMine) {
      cell.hasMine = true;
      placed++;
    }
  }

  // Calculate # of nearby mines for each cell
  for (let y = 0; y < board.height; y++)
    for (let x = 0; x < board.width; x++) {
      const cell = board.cells[x + board.width * y];

      cell.nearMines = neighbors(x, y, board).filter((nb) => nb.hasMine).length;
    }

  return board;
}

export function reveal(board: MinesweeperBoard, i: number) {
  const cell = board.cells[i];
  if (cell.revealed) return;

  cell.revealed = true;

  if (cell.nearMines === 0 && !cell.hasMine) {
    const x = i % board.width;
    const y = ~~(i / board.width);

    neighbors(x, y, board).forEach((nb) => {
      if (!nb.revealed && !nb.hasMine && nb.flag !== FlagStatus.FLAGGED) {
        const nbi = board.cells.indexOf(nb);
        reveal(board, nbi);
      }
    });
  }
};