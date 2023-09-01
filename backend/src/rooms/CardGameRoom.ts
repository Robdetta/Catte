import { Room, Client } from '@colyseus/core';
import { MyRoomState } from './schema/MyRoomState';
import { generateGameKey } from './gameKeyGenerator';
import { gameKeyToRoomId } from './roomData';
import { Player, players, nextTurn } from './player';
import { dealCards, drawCardFromPile } from './deckMechanics';

export class CardGameRoom extends Room<MyRoomState> {
  maxClients = 6;
  gameKey: string;

  onCreate(options: any) {
    this.setState(new MyRoomState());
    this.gameKey = generateGameKey();
    gameKeyToRoomId[this.gameKey] = this.roomId;

    const totalPlayers = options.numPlayers + options.numBots;
    
        // Create human players
        for(let i = 0; i < options.numPlayers; i++) {
          players.push(new Player(/*uniqueID*/, 'PlayerName'));
      }
  
      // Create bot players
      for(let i = 0; i < options.numBots; i++) {
          players.push(new Player(/*uniqueBotID*/, 'BotName', true));
      }
  

    // For demonstration purposes, let's deal 5 cards to each player upon room creation
    dealCards(players, 5);

    this.onMessage('type', (client, message) => {
      // handle "type" message
      // Example: if a player decides to draw a card, handle that action here
      if (message.type === 'drawCard') {
        const player = players.find((p) => p.id === client.sessionId); // Get the corresponding player using client.sessionId or another unique identifier
        if (player) {
          player.drawCard(drawCardFromPile());
          // Then, broadcast the updated state to all clients
        }
      }
      // Handle other game actions similarly
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, 'joined!');
    const newPlayer = new Player(client.sessionId, 'SomeName'); // Name can come from options or another mechanism
    players.push(newPlayer);
    // Deal initial cards to the new player if needed
    this.state.playerCount++;
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, 'left!');
    const playerIndex = players.findIndex((p) => p.id === client.sessionId);
    if (playerIndex !== -1) {
      players.splice(playerIndex, 1);
      nextTurn();
    }
    this.state.playerCount--;
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}
