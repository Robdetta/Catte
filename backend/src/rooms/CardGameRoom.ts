import { Room, Client } from '@colyseus/core';
import { MyRoomState } from './schema/MyRoomState';
import { generateGameKey } from './gameKeyGenerator';
import { gameKeyToRoomId } from './roomData';
import { Player, players, nextTurn } from './player';
import { dealCards, drawCardFromPile } from './deckMechanics';

export class CardGameRoom extends Room<MyRoomState> {
  maxClients = 6;
  gameKey: string;

  sendNotification(text: string) {
    this.broadcast('notification', { text: text });
  }

  onCreate(options: any) {
    // If only 1 human player is selected and no bots, adjust numBots to 1
    // if (options.numPlayers === 1 && options.numBots === 0) {
    //   options.numBots = 1;
    // }

    // if (
    //   options.numPlayers < 1 ||
    //   options.numBots < 1 ||
    //   options.numPlayers + options.numBots > 6
    // ) {
    //   throw new Error('Invalid number of players or bots.');
    // }

    // Ensure there's at least one player (bot or human)
    if (options.numPlayers + options.numBots < 1) {
      throw new Error('Must have at least one player or bot.');
    }

    // Ensure the total player count doesn't exceed the maximum limit
    if (options.numPlayers + options.numBots > 6) {
      throw new Error('Total number of players and bots should not exceed 6.');
    }

    this.setState(new MyRoomState());
    this.gameKey = generateGameKey();
    gameKeyToRoomId[this.gameKey] = this.roomId;

    this.state.numPlayers = options.numPlayers;
    this.state.numBots = options.numBots;

    this.broadcast('notification', { text: 'Starting game with bot!' });
    //notification
    this.sendNotification('Game created. Waiting for players to join...');

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
          this.sendNotification(`Player ${client.sessionId} drew a card.`);
        }
      }
      // Handle other game actions similarly
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, 'joined!');
    const newPlayer = new Player(client.sessionId, 'PlayerName'); // Name can come from options or another mechanism
    players.push(newPlayer);
    this.sendNotification(`Player ${client.sessionId} joined the game.`);
    // Deal initial cards to the new player if needed
    this.state.playerCount++;
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, 'left!');
    const playerIndex = players.findIndex((p) => p.id === client.sessionId);
    if (playerIndex !== -1) {
      players.splice(playerIndex, 1);
      nextTurn();
      this.sendNotification(`Player ${client.sessionId} left the game.`);
    }
    this.state.playerCount--;
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}
