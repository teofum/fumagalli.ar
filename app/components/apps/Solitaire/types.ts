export type Suit = 'clubs' | 'diamonds' | 'hearts' | 'spades';

export interface Card {
  suit: Suit;
  number: number; // 11, 12, 13 are J, Q, K
}

export interface SolitaireSettings {
  rules: 'draw-one' | 'draw-three';
  scoring: 'none' | 'standard' | 'vegas';
  back: number;
}
