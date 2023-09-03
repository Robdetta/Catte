import { Schema, type, ArraySchema } from '@colyseus/schema';

class Player {
  id: string;
  name: string;
  hand: string[];
  isTurn: boolean;
  isBot: boolean; // Add this line

  constructor(id: string, name: string, isBot: boolean = false) {
    this.id = id;
    this.name = name;
    this.hand = [];
    this.isTurn = false;
    this.isBot = isBot; // And this line
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
