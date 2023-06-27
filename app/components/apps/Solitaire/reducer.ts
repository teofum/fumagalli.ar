import { deal } from './game';
import type { Card } from './types';

export interface GameState {
  deck: Card[];
  drawn: Card[];

  stacks: Card[][]; // 4 stacks
  rows: { turned: Card[]; unturned: Card[] }[]; // 7 row-stacks
}

interface DealAction {
  type: 'deal';
}

interface DrawAction {
  type: 'draw';
}

interface UndrawAction {
  type: 'undraw';
}

interface MoveAction {
  type: 'move';

  from: { type: 'stack' | 'row'; index: number };
  to: { type: 'stack' | 'row'; index: number };
}

type Action = DealAction | DrawAction | UndrawAction | MoveAction;

export default function solitaireReducer(
  state: GameState,
  action: Action,
): GameState {
  switch (action.type) {
    case 'deal': {
      return deal();
    }
    case 'draw': {
      return state;
    }
    case 'undraw': {
      return state;
    }
    case 'move': {
      return state;
    }
  }
}
