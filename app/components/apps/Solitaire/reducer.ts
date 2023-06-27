import { deal } from './game';
import type { Card } from './types';

export interface GameState {
  deck: Card[];
  drawn: Card[];

  stacks: Card[][]; // 4 stacks
  rows: { turned: Card[]; unturned: Card[] }[]; // 7 row-stacks
  // "Rows" are actually columns, but the Windows 98 help calls them "row stacks"
  // and I can't come up with a better name so I'm sticking with that
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

interface RevealAction {
  type: 'reveal';
  rowIndex: number;
}

interface StackAction {
  type: 'sendToStack';
  card: Card;
}

interface MoveAction {
  type: 'move';
  card: Card;
  to: { type: 'stack' | 'row'; index: number };
}

type Action =
  | DealAction
  | DrawAction
  | UndrawAction
  | RevealAction
  | StackAction
  | MoveAction;

export default function solitaireReducer(
  state: GameState,
  action: Action,
): GameState {
  switch (action.type) {
    case 'deal': {
      return deal();
    }
    case 'draw': {
      // TODO: Support draw-three ruleset
      const drawn = state.deck.at(-1);
      if (!drawn) return state;

      return {
        ...state,
        deck: state.deck.slice(0, -1),
        drawn: [...state.drawn, drawn],
      };
    }
    case 'undraw': {
      // TODO: Support draw-three ruleset
      return {
        ...state,
        deck: state.drawn.slice().reverse(),
        drawn: [],
      };
    }
    case 'reveal': {
      const row = state.rows[action.rowIndex];
      // Can't reveal a card if there's anything on top of it
      if (row.turned.length > 0) return state;

      return {
        ...state,
        rows: state.rows.map((row, i) =>
          i === action.rowIndex
            ? {
                // Remove the last unturned card from row and turn it
                turned: [...row.unturned.slice(-1)],
                unturned: [...row.unturned.slice(0, -1)],
              }
            : row,
        ),
      };
    }
    case 'sendToStack': {
      const { suit, number } = action.card;

      // First, look for a stack that will take the card
      const target = state.stacks.findIndex((stack) => {
        // An empty stack will take any ace (and only an ace)
        if (stack.length === 0) return number === 1;

        // Otherwise,
        const last = stack.at(-1) as Card; // We know it's not empty, assert
        // A stack will take the next card of the same suit
        return last.suit === suit && last.number === number - 1;
      });

      // If no stack will take the card, then do nothing
      if (target === -1) return state;

      // If we found a stack...
      return {
        ...state,
        // We push the card to it...
        stacks: state.stacks.map((stack, i) =>
          i === target ? [...stack, action.card] : stack,
        ),
        // And remove it from wherever it was. Cards are unique, so the easiest
        // way to find it is just to remove it from everywhere it could possibly
        // come from (drawn cards or a row's turned cards).
        drawn: state.drawn.filter(
          (card) => card.number !== number || card.suit !== suit,
        ),
        rows: state.rows.map(({ turned, unturned }) => ({
          unturned,
          turned: turned.filter(
            (card) => card.number !== number || card.suit !== suit,
          ),
        })),
      };
    }
    case 'move': {
      return state;
    }
  }
}
