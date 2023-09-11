import { Schema, MapSchema, type, ArraySchema } from '@colyseus/schema';
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

  @type(['string'])
  deck = new ArraySchema<string>();

  @type('string')
  currentTurnPlayerId: string;

  @type('string')
  gameState: string;

  @type('string') mySynchronizedProperty: string = 'Hello world';
}
