import {
  canMoveToRowStack,
  canMoveToSuitStack,
  deal,
  isWin,
  removeCardsFromStack,
  score,
} from './game';
import type { Card, SolitaireSettings } from './types';

export interface GameState {
  state: 'playing' | 'win_anim' | 'won';
  score: number;

  deck: Card[];
  drawn: Card[];
  drawnOffset: number; // Display state used for draw-three rules

  stacks: Card[][]; // 4 stacks
  rows: { turned: Card[]; unturned: Card[] }[]; // 7 row-stacks

  settings: SolitaireSettings;
}

interface DealAction {
  type: 'deal';
  settings?: SolitaireSettings;
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
  cards: Card[];
  to: { type: 'suit' | 'row'; index: number };
}

interface ChangeDeckAction {
  type: 'changeDeck';
  back: number;
}

interface EndWinAnimationAction {
  type: 'endWinAnimation';
}

type Action =
  | DealAction
  | DrawAction
  | UndrawAction
  | RevealAction
  | StackAction
  | MoveAction
  | ChangeDeckAction
  | EndWinAnimationAction;

export default function solitaireReducer(
  state: GameState,
  action: Action,
): GameState {
  switch (action.type) {
    case 'deal': {
      return deal(action.settings);
    }
    case 'draw': {
      switch (state.settings.rules) {
        case 'draw-one': {
          const drawn = state.deck.at(-1);
          if (!drawn) return state;

          return {
            ...state,
            deck: state.deck.slice(0, -1),
            drawn: [...state.drawn, drawn],
          };
        }
        case 'draw-three': {
          const drawn = state.deck.slice(-3).reverse();
          if (!drawn) return state;

          return {
            ...state,
            deck: state.deck.slice(0, -3),
            drawn: [...state.drawn, ...drawn],
            drawnOffset: Math.min(2, drawn.length),
          };
        }
      }
    }
    case 'undraw': {
      return {
        ...state,
        deck: state.drawn.slice().reverse(),
        drawn: [],
        drawnOffset: 0,
        score: score(
          state,
          'standard',
          state.settings.rules === 'draw-one' ? -100 : -25,
        ),
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
        score: score(state, 'standard', 5), // 5 points for turning card
      };
    }
    case 'sendToStack': {
      const { suit, number } = action.card;

      // First, look for a stack that will take the card
      const target = state.stacks.findIndex((stack) =>
        canMoveToSuitStack(stack, action.card),
      );

      // If no stack will take the card, then do nothing
      if (target === -1) return state;

      let newScore = state.score;
      if (state.settings.scoring === 'standard') newScore += 10;
      if (state.settings.scoring === 'vegas') newScore -= 5;

      // If we found a stack...
      const newState = {
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
        score: newScore,
      };

      const fromDrawn = newState.drawn.length < state.drawn.length;

      return {
        ...newState,
        // Check for win condition
        state: isWin(newState) ? 'win_anim' : 'playing',
        // Remove an offset card if a card was removed from the drawn pile
        // Kinda hacky, but it works
        drawnOffset: fromDrawn ? state.drawnOffset - 1 : state.drawnOffset,
      };
    }
    case 'move': {
      const { cards, to } = action;
      switch (to.type) {
        case 'suit': {
          // It's impossible to move multiple cards to a suit stack
          if (cards.length > 1) return state;

          const target = state.stacks[to.index];
          if (!canMoveToSuitStack(target, cards[0])) return state;

          // If the stack will take the card...
          const { number, suit } = cards[0];
          const newState = {
            ...state,
            // We push the card to it...
            stacks: state.stacks.map(
              (stack, i) =>
                i === to.index
                  ? [...stack, ...cards] // Push the card to target stack
                  : removeCardsFromStack(stack, cards), // Remove from others
            ),
            // And remove it from wherever it was
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

          const fromDrawn = newState.drawn.length < state.drawn.length;
          const fromStack = newState.stacks.some(
            (stack, i) => stack.length < state.stacks[i].length,
          );
          const points = fromStack ? 0 : 10; // 10 points for move to stack

          return {
            ...newState,
            // Check for win condition
            state: isWin(newState) ? 'win_anim' : 'playing',
            drawnOffset: fromDrawn ? state.drawnOffset - 1 : state.drawnOffset,
            score: score(state, 'standard', points),
          };
        }
        case 'row': {
          // We'll assume the stack is valid, and only check the first card
          const target = state.rows[to.index];
          if (!canMoveToRowStack(target, cards[0])) return state;

          // If the row stack will take the cards...
          const newState = {
            ...state,
            // Push the cards to it, and remove them from wherever they may be
            // This time around cards can actually come from anywhere: drawn
            // pile, suit stacks, or another row stack
            rows: state.rows.map(({ turned, unturned }, i) => ({
              unturned,
              turned:
                i === to.index
                  ? [...turned, ...cards] // Push cards to target stack
                  : removeCardsFromStack(turned, cards),
            })),
            drawn: removeCardsFromStack(state.drawn, cards),
            stacks: state.stacks.map((stack) =>
              removeCardsFromStack(stack, cards),
            ),
          };

          const fromDrawn = newState.drawn.length < state.drawn.length;
          const fromStack = newState.stacks.some(
            (stack, i) => stack.length < state.stacks[i].length,
          );

          const points = fromDrawn ? 5 : fromStack ? -15 : 0;

          return {
            ...newState,
            drawnOffset: fromDrawn ? state.drawnOffset - 1 : state.drawnOffset,
            // 5 points for drawn -> rows, -15 for suit -> rows
            score: score(state, 'standard', points),
          };
        }
      }
    }
    case 'changeDeck': {
      return { ...state, settings: { ...state.settings, back: action.back } };
    }
    case 'endWinAnimation': {
      return { ...state, state: 'won' };
    }
  }
}
