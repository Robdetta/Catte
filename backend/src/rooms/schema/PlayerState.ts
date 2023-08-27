import { Schema, Context, type } from '@colyseus/schema';

class Player extends Schema {
  @type('string') sessionId: string;
}

export class PlayerState extends Schema {
  @type('string') mySynchronizedProperty: string = 'Hello world';
  @type({ map: Player }) players = new Map<string, Player>();
}
