import { difficultyPresets } from './game';

export enum MinesweeperState {
  NEW = 'new',
  PLAYING = 'playing',
  WON = 'won',
  LOST = 'lost',
}

export enum FlagStatus {
  NONE,
  FLAGGED,
  QUESTION_MARK,
}

export interface MinesweeperCell {
  hasMine: boolean;
  nearMines: number;
  flag: FlagStatus;
  revealed: boolean;
  exploded: boolean;
}

export interface MinesweeperBoard {
  cells: MinesweeperCell[];
  width: number;
  height: number;
}

export interface MinesweeperSettings {
  name: keyof typeof difficultyPresets;
  width: number;
  height: number;
  mines: number;
}

export const defaultMinesweeperSettings = difficultyPresets.beginner;
