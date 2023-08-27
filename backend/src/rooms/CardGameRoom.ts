import { Room, Client } from 'colyseus';

export class CardGameRoom extends Room {
  // State definition
  state: {
    players: {
      [id: string]: {
        name: string;
        hand: any[];
      };
    };
  };

  // This is called when the room is initialized.
  onCreate(options: any) {
    this.setState({
      players: {},
    });
  }

  // When a client joins the room
  onJoin(client: Client, options: any) {
    this.state.players[client.sessionId] = {
      name: options.name || 'Anonymous',
      hand: [], // Initially empty hand, can be filled as per game logic
    };
  }

  // When a client sends a message
  onMessage(client: Client, message: any) {
    // Handle game-related messages here, like moving a card, playing a card, etc.
  }

  // When a client leaves the room
  onLeave(client: Client, consented: boolean) {
    delete this.state.players[client.sessionId];
  }

  // Cleanup callback for the room. Can be used for custom logic.
  onDispose() {
    // Cleanup logic, if needed
  }
}
