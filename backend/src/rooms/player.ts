// player.ts

class Player {
  id: string;
  name: string;
  hand: string[];
  isTurn: boolean;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.hand = [];
    this.isTurn = false;
  }

  drawCard(card: string): void {
    this.hand.push(card);
  }

  playCard(index: number): string {
    return this.hand.splice(index, 1)[0];
  }
}

let players: Player[] = [];
let currentPlayerIndex: number = 0;

function nextTurn(): void {
  players[currentPlayerIndex].isTurn = false;
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  players[currentPlayerIndex].isTurn = true;
}

export { Player, players, nextTurn };
