import { Room, Client } from '@colyseus/core';
import { PlayerState, Player } from './schema/PlayerState';
import { generateGameKey } from './gameKeyGenerator';

export class CardGameRoom extends Room<PlayerState> {
  maxClients = 6;

  onCreate(options: any) {
    console.log('GameRoom Created', options);

    this.setState(new PlayerState());
    // Generate room key and save it for later
    this.metadata = {
      roomKey: generateGameKey(), // Use the key generation function we discussed earlier
    };
    this.onMessage('type', (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, 'joined!');
    const player = new Player();
    player.sessionId = client.sessionId;
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, 'left!');
    console.log(`${client.sessionId} left!`);
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}
