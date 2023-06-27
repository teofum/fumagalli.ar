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
