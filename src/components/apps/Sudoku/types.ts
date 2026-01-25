export type SudokuCell = {
  value: number;
  fixed: boolean;
  annotations: Set<number>;
};

export type SudokuBoard = SudokuCell[];

export type SudokuDifficulty = 'easy' | 'medium' | 'hard';

export type SudokuPuzzle = {
  data: number[];
  difficulty: SudokuDifficulty;
  number: number;
};

export type SudokuSettings = {
  highlightNeighbors: boolean;
  showConflict: boolean;
  difficulty: SudokuDifficulty;
  toolbarPosition: 'top' | 'bottom';
};

export const defaultSudokuSettings: SudokuSettings = {
  highlightNeighbors: false,
  showConflict: true,
  difficulty: 'easy',
  toolbarPosition: 'top',
};
