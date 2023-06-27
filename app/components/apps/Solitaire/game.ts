import type { GameState } from './reducer';
import type { Card, Suit } from './types';

/**
 * Shuffles an array in place
 * Uses Fisher-Yates shuffle
 */
function shuffle(array: unknown[]) {
  let currentIndex = array.length;

  while (currentIndex !== 0) {
    // Pick a random remaining element
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Swap with the current element
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const SUITS: Suit[] = ['clubs', 'diamonds', 'hearts', 'spades'];

export function newDeck() {
  const deck: Card[] = Array.from(Array(52), (_, k) => ({
    suit: SUITS[Math.floor(k / 13)],
    number: (k % 13) + 1,
  }));

  shuffle(deck);
  return deck;
}

export function deal() {
  const deck = newDeck(); // Shuffled deck

  // Distribute row-stack cards
  const rows: GameState['rows'] = [];
  let start = 0;
  for (let i = 0; i < 7; i++) {
    const end = start + i + 1; // i+1 cards in row i
    rows.push({
      unturned: deck.slice(start, end - 1),
      turned: deck.slice(end - 1, end),
    });
    start = end;
  }

  return {
    deck: deck.slice(28), // Rest of the cards go to the deck
    drawn: [],

    stacks: [[], [], [], []], // Four empty stacks
    rows, // Seven filled rows
  };
}

export function canMoveToSuitStack(targetStack: Card[], card: Card) {
  // An empty stack will take any ace (and only an ace)
  if (targetStack.length === 0) return card.number === 1;

  // Otherwise,
  const last = targetStack.at(-1) as Card; // We know it's not empty, assert
  // A stack will take the next (asc) card of the same suit
  return last.suit === card.suit && last.number === card.number - 1;
}

function color(card: Card) {
  if (card.suit === 'diamonds' || card.suit === 'hearts') return 'red';
  return 'black';
}

export function canMoveToRowStack(
  { turned, unturned }: GameState['rows'][0],
  card: Card,
) {
  if (turned.length === 0) {
    // An empty stack will take any king (and only a king)
    // A stack with only unturned cards will take no cards
    return unturned.length === 0 && card.number === 13;
  }

  // Otherwise,
  const last = turned.at(-1) as Card; // We know it's not empty, assert
  // A row stack will only take the next (desc) card of a different color
  return color(last) !== color(card) && last.number === card.number + 1;
}

/**
 * Returns `stack`, excluding any cards included in `cards`
 */
export function removeCardsFromStack(stack: Card[], cards: Card[]) {
  return stack.filter(
    (card) =>
      !cards.some(
        ({ number, suit }) => card.number === number && card.suit === suit,
      ),
  );
}
