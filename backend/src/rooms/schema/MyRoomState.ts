import { Schema, MapSchema, type } from '@colyseus/schema';
import { Player } from '../player';

export class MyRoomState extends Schema {
  @type('number')
  numPlayers: number = 0;

  @type('number')
  numBots: number = 0;

  @type({ map: Player })
  players = new MapSchema<Player>();

  @type({ map: Player })
  bots = new MapSchema<Player>(); // You can create a separate Bot class if bots have different behaviors or properties

  @type('string')
  currentTurnPlayerId: string;

  @type('string')
  gameState: string;

  @type('string') mySynchronizedProperty: string = 'Hello world';
}
