import { Schema, type } from '@colyseus/schema';

export class Player extends Schema {
  @type('string') id: string;
  @type('string') name: string;
  @type(['string']) hand: string[] = [];
  @type('boolean') isTurn: boolean = false;
  @type('boolean') isBot: boolean = false;
  @type('boolean')
  isReady: boolean = false;

  @type('number') x: number = 0;
  @type('number') y: number = 0;
  @type('number') color: number = 0xffffff; // This is white in hex

  drawCard(card: string): void {
    this.hand.push(card);
  }

  playCard(index: number): string {
    return this.hand.splice(index, 1)[0];
  }
}

// you can keep the players array and nextTurn function if they're needed elsewhere
let players: Player[] = [];
let currentPlayerIndex: number = 0;

function nextTurn(): void {
  players[currentPlayerIndex].isTurn = false;
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  players[currentPlayerIndex].isTurn = true;
}

export { players, nextTurn };
