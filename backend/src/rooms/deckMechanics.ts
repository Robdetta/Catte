import { Player } from './player';

function dealCards(
  deck: string[],
  players: Player[],
  cardsPerPlayer: number,
): void {
  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let player of players) {
      player.drawCard(deck.pop()!);
    }
  }
}

let drawPile: string[] = [...deck];
let discardPile: string[] = [];

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
