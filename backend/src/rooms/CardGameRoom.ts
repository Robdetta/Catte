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
    // If only 1 human player is selected and no bots, adjust numBots to 1
    if (options.numPlayers === 1 && options.numBots === 0) {
      options.numBots = 1;
    }

    if (
      options.numPlayers < 1 ||
      options.numBots < 1 ||
      options.numPlayers + options.numBots > 6
    ) {
      throw new Error('Invalid number of players or bots.');
    }
    this.setState(new MyRoomState());
    this.gameKey = generateGameKey();
    gameKeyToRoomId[this.gameKey] = this.roomId;

    const totalPlayers = options.numPlayers + options.numBots;

    // Create bot players
    for (let i = 0; i < options.numBots; i++) {
      // For bots, you can generate a unique ID using a combination of the current time, iteration, and a bot prefix
      const uniqueBotID = `BOT_${Date.now()}_${i}`;
      players.push(new Player(uniqueBotID, 'BotName', true));
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
    const newPlayer = new Player(client.sessionId, 'PlayerName'); // Name can come from options or another mechanism
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
