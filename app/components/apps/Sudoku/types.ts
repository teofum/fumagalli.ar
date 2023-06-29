interface SudokuCell {
  value: number;
  fixed: boolean;
}

export type SudokuBoard = SudokuCell[];

export interface SudokuSettings {
  highlightNeighbors: boolean;
  showConflict: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const defaultSudokuSettings: SudokuSettings = {
  highlightNeighbors: false,
  showConflict: true,
  difficulty: 'easy',
};
