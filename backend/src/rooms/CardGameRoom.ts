import { Room, Client } from '@colyseus/core';
import { MyRoomState } from './schema/MyRoomState';
import { generateGameKey } from './gameKeyGenerator';
import { gameKeyToRoomId } from './roomData';
import { Player, players, nextTurn } from './player';
import { dealCards, drawCardFromPile } from './deckMechanics';
import axios from 'axios';

export class CardGameRoom extends Room<MyRoomState> {
  maxClients = 6;
  gameKey: string;

  sendNotification(text: string) {
    this.broadcast('notification', { text: text });
  }

  onCreate(options: any) {
    this.maxClients = options.numPlayers + options.numBots; // Dynamically set maxClients based on options

    // Ensure there's at least one player (bot or human)
    if (options.numPlayers + options.numBots < 1) {
      throw new Error('Must have at least one player or bot.');
    }

    // Ensure the total player count doesn't exceed the maximum limit
    if (options.numPlayers + options.numBots > 6) {
      throw new Error('Total number of players and bots should not exceed 6.');
    }

    this.setState(new MyRoomState());
    this.state.gameState = 'waiting';
    this.gameKey = generateGameKey();
    gameKeyToRoomId[this.gameKey] = this.roomId;

    //this.state.numPlayers = options.numPlayers;
    this.state.numBots = options.numBots;

    this.broadcast('notification', { text: 'Starting game with bot!' });
    //notification
    this.sendNotification('Game created. Waiting for players to join...');

    const totalPlayers = options.numPlayers + options.numBots;

    this.onMessage('playerReady', (client) => {
      const player = this.state.players.get(client.sessionId);
      //Notify all clients that this player is ready
      this.broadcast('notification', { text: `${player.name} is ready!` });
      if (player) {
        player.isReady = true;
        this.checkIfAllPlayersReady();
      }
    });

    // Create bot players
    for (let i = 0; i < options.numBots; i++) {
      const uniqueBotID = `BOT_${Date.now()}_${i}`;
      const botPlayer = new Player(uniqueBotID, 'BotName', true);
      this.state.bots.set(uniqueBotID, botPlayer);
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
    // Calculate the total number of clients (players + bots) currently in the room
    const totalClients = this.state.numPlayers + this.state.numBots;

    // Check if room is full based on numPlayers and numBots values
    if (totalClients >= this.maxClients) {
      console.log('Room is full!');
      throw new Error('Room is full!'); // This will inform the client that the room is full
    }

    console.log(client.sessionId, 'joined!');
    const newPlayer = new Player();
    newPlayer.id = client.sessionId;
    newPlayer.name = 'PlayerName'; // Name can come from options or another mechanism, as you've mentioned

    this.state.players.set(client.sessionId, newPlayer); // Use `set` method to add to MapSchema
    this.state.numPlayers++;
    this.sendNotification(`Player ${client.sessionId} joined the game.`);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, 'left!');
    const leavingPlayer = this.state.players.get(client.sessionId);
    if (leavingPlayer) {
      if (leavingPlayer.isBot) {
        this.state.numBots--;
      } else {
        this.state.numPlayers--;
      }
      this.state.players.delete(client.sessionId); // Use `delete` method to remove from MapSchema      nextTurn();
      this.sendNotification(`Player ${client.sessionId} left the game.`);
    }
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }

  async startGame() {
    //Ensure that the game is currently in the 'waiting' state before starting
    if (this.state.gameState !== 'waiting') {
      console.log('Cannot start the game; game is not in the waiting state.');
      return;
    }

    //Set the game to 'playing' state
    this.state.gameState = 'playing';

    //reset all player status (for future rounds)
    Array.from(this.state.players.values()).forEach(
      (player) => (player.isReady = false),
    );

    let deck;
    try {
      const response = await axios.get('http://localhost:2567/deck');
      deck = response.data;
    } catch (error) {
      console.log('Error fetching the deck', error);
      return;
    }

    //deals cards to players
    const players = Array.from(this.state.players.values());
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < players.length; j++) {
        if (!players[j].hand) {
          players[j].hand = [];
        }
        players[j].hand.push(deck.pop());
      }
    }

    //set the first player's turn
    this.handleTurnLogic();

    // Notify clients that the game has started and send them their initial hands
    this.broadcast('gameStart', {
      message: 'The game has started!',
      hands: Object.fromEntries(
        players.map((player) => [player.id, player.hand]),
      ),
    });
  }

  private checkIfAllPlayersReady() {
    let allPlayersReady = [
      ...this.state.players.values(),
      ...this.state.bots.values(),
    ].every((player) => player.isReady);
    if (allPlayersReady) {
      this.sendNotification('All players are ready. Starting the game...');
      this.startGame();
    }
  }

  handleTurnLogic() {
    //... existing logic
    this.broadcast('turnChange', {
      newTturnPlayerId: this.state.currentTurnPlayerId,
    });
  }

  getNextPlayerId(): string {
    //Implement logic to get the next player's ID. for now its random
    const playerIds = Array.from(this.state.players.keys());
    return playerIds[Math.floor(Math.random() * playerIds.length)];
  }
}
