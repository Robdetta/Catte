import { Schema, MapSchema, type } from '@colyseus/schema';
import { Player } from '../player';

export class MyRoomState extends Schema {
  @type('number')
  playerCount: number = 0;

  players = new MapSchema<Player>();
  bots = new MapSchema<Player>(); // You can create a separate Bot class if bots have different behaviors or properties
  @type('string') mySynchronizedProperty: string = 'Hello world';
}
