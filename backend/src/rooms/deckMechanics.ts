// deckMechanics.ts

import { Player } from './player';

const deck: string[] = []; // Initialize with your full deck of cards

let drawPile: string[] = [...deck];
let discardPile: string[] = [];

function dealCards(players: Player[], cardsPerPlayer: number): void {
  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let player of players) {
      player.drawCard(drawPile.pop()!);
    }
  }
}

function drawCardFromPile(): string {
  if (drawPile.length === 0) {
    reshuffleDiscard();
  }
  return drawPile.pop()!;
}

function reshuffleDiscard(): void {
  discardPile = discardPile.sort(() => Math.random() - 0.5);
  drawPile = discardPile;
  discardPile = [];
}

export { dealCards, drawCardFromPile, reshuffleDiscard };
