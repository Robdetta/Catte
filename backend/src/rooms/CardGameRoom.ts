import { Room, Client } from '@colyseus/core';
import { MyRoomState } from './schema/MyRoomState';
import { generateGameKey } from './gameKeyGenerator';
export class CardGameRoom extends Room<MyRoomState> {
  maxClients = 6;
  gameKey: string;

  onCreate(options: any) {
    this.setState(new MyRoomState());
    this.gameKey = generateGameKey();
    this.onMessage('type', (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, 'joined!');
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, 'left!');
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}
