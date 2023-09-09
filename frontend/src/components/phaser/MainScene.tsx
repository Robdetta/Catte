import Phaser from 'phaser';
import PlayerManager from './helpers/PlayerManager';
import { getRoom, getCurrentPlayerSessionId } from './helpers/roomStore';

interface Player {
  id: string;
  color: number;
  x?: number;
  y?: number;
  hand?: string[]; // ... other properties
}

interface State {
  players: Map<string, Player>;
  // ... other properties
}

export default class Main extends Phaser.Scene {
  private playerManager: PlayerManager;
  private welcomeText: Phaser.GameObjects.Text | null = null;
  private playerSprites: { [key: string]: Phaser.GameObjects.Sprite } = {};

  constructor() {
    super({ key: 'MainScene' });
    this.playerManager = new PlayerManager(this);
  }

  private playerCardImages: { [playerId: string]: Phaser.GameObjects.Image[] } =
    {};

  init(data: { numPlayers: number; numBots: number }) {
    this.data.set('numPlayers', data.numPlayers);
    this.data.set('numBots', data.numBots);
  }

  preload() {
    this.load.atlas('cards', '/src/assets/cards.png', '/src/assets/cards.json');
    this.load.image('playerAvatar', 'path_to_player_avatar_image.png');
  }

  private getCurrentPlayerId(): string | null {
    return getCurrentPlayerSessionId();
  }

  create() {
    const room = getRoom();
    console.log('Fetched Room:', room);
    if (!room) {
      console.error('No room data available');
      return;
    }

    if (
      !room.state ||
      room.state.numPlayers === undefined ||
      room.state.numBots === undefined
    ) {
      console.error('State properties missing.');
      return;
    }

    const { numPlayers, numBots } = room.state;
    const totalPlayers = numPlayers + numBots;
    console.log(room.state);

    console.log('Room State:', room.state);
    console.log('Number of Players:', room.state.numPlayers);
    console.log('Number of Bots:', room.state.numBots);
    console.log('Players:', room.state.players);

    this.displayDeck();
    room.onStateChange(this.updateUI.bind(this));

    this.displayPlayers(totalPlayers);

    this.initWelcomeText();
    this.updateLayout();
    this.scale.on('resize', this.handleResize, this);
  }

  private displayDeck() {
    const x = this.cameras.main.centerX;
    const y = this.cameras.main.centerY - 100;
    for (let i = 0; i < 52; i++) {
      this.add.image(x, y - i * 0.5, 'cards', 'back').setDepth(i);
    }
  }

  private displayPlayers() {
    const room = getRoom();
    if (!room || !room.state || !room.state.players) {
      console.error('No room, room state, or players available');
      return;
    }
    const playersArray = Array.from(room.state.players.values());
    playersArray.forEach((player, index) => {
      const { x, y } = this.calculatePlayerPosition(index, playersArray.length);
      this.addPlayerToUI(player as Player, x, y);
    });
  }

  private updateUI(state: State) {
    const currentPlayerIds = [...state.players.keys()];
    const exisingPlayerIds = Object.keys(this.playerSprites);

    //find IDs of players who left the game
    const playersWhoLeft = exisingPlayerIds.filter(
      (id) => !currentPlayerIds.includes(id),
    );

    //handle players who left
    playersWhoLeft.forEach((id) => this.removePlayerFromUI(id));

    //handle current players (both existing and new)
    currentPlayerIds.forEach((id, index) => {
      const playerData = state.players.get(id);
      if (playerData) {
        const { x, y } = this.calculatePlayerPosition(
          index,
          state.players.size,
        );
        if (exisingPlayerIds.includes(id)) {
          this.updatePlayerPositionInUI(playerData, x, y);
        } else {
          this.addPlayerToUI(playerData, x, y);
        }
      } else {
        console.error('Player data not found for ID:', id);
      }
    });
    const currentPlayerId = this.getCurrentPlayerId();
    if (currentPlayerId) {
      const currentPlayer = state.players.get(currentPlayerId);
      if (currentPlayer?.hand) {
        this.displayCards(currentPlayer.hand); // here hand is an array of strings representing frame names
      }
    }
  }

  private addPlayerToUI(player: Player, x: number, y: number) {
    //... (existing logic to add player sprite to UI)
    const sprite = this.add
      .sprite(x, y, 'playerSprite')
      .setTint(player.color)
      .setDepth(1);
    this.playerSprites[player.id] = sprite;
  }

  private updatePlayerPositionInUI(player: Player, x: number, y: number) {
    const sprite = this.playerSprites[player.id];
    if (sprite) {
      sprite.setPosition(x, y);
    }
  }

  private removePlayerFromUI(playerId: string) {
    if (this.playerSprites[playerId]) {
      this.playerSprites[playerId].destroy();
      delete this.playerSprites[playerId];
    }
  }

  private displayCards(hand: string[]) {
    const currentPlayerId = this.getCurrentPlayerId();
    if (!currentPlayerId) {
      console.error('No current player ID found');
      return;
    }

    const room = getRoom();
    if (!room || !room.state || !room.state.players) {
      console.error('No room, room state, or players available');
      return;
    }

    // Clear previous hand if exists
    this.clearPreviousHands();

    // Get the current player and display their cards
    const currentPlayer = room.state.players.get(currentPlayerId);
    if (!currentPlayer) {
      console.error('Current player not found in room state');
      return;
    }

    // Define the offset values to position the cards in a row below the player's avatar
    const xOffset = 30; // horizontal space between cards
    const yOffset = -100; // vertical space from the player avatar to the cards

    // Calculate the total width occupied by the cards and find the starting X position to center the cards with respect to the avatar
    const totalWidthOfCards = (hand.length - 1) * xOffset;
    const baseX = (currentPlayer.x ?? 0) - totalWidthOfCards / 2;
    const baseY = currentPlayer.y ?? 0 - yOffset;

    // Loop over the cards in the hand and create an image for each one
    hand.forEach((card, index) => {
      // Create a new image for the card and set its position
      const cardImage = this.add.image(
        baseX + index * xOffset,
        baseY + yOffset,
        'cards',
        card,
      );

      // Add the image to the player's hand array so it can be accessed and modified later
      if (!this.playerCardImages[currentPlayerId]) {
        this.playerCardImages[currentPlayerId] = [];
      }
      this.playerCardImages[currentPlayerId].push(cardImage);
    });
  }

  private clearPreviousHands() {
    // Loop through all player hands and destroy any existing card images
    Object.values(this.playerCardImages).forEach((cardImages) => {
      cardImages.forEach((cardImage) => cardImage.destroy());
    });

    // Reset the playerCardImages object
    this.playerCardImages = {};
  }

  private calculatePlayerPosition(
    index: number,
    totalPlayers: number,
  ): { x: number; y: number } {
    const { width, height } = this.cameras.main;
    const currentPlayerId = this.getCurrentPlayerId();
    const playersArray = Array.from(
      getRoom()?.state.players.values(),
    ) as Player[];
    const currentPlayerIndex = playersArray.findIndex(
      (player) => player.id === currentPlayerId,
    );

    const adjustedIndex =
      (index - currentPlayerIndex + totalPlayers) % totalPlayers;
    const isCurrentPlayer = adjustedIndex === 0;

    let x = 0;
    let y = 0;

    if (isCurrentPlayer) {
      x = width / 2;
      y = height - 150;
    } else {
      const radius = 300;
      const angle = Math.PI / 2 + (adjustedIndex / totalPlayers) * 2 * Math.PI;

      x = width / 2 + radius * Math.cos(angle);
      y = height / 2 + radius * Math.sin(angle);
    }

    // Update the player's x and y in the state
    const player = playersArray[index];
    player.x = x;
    player.y = y;

    return { x, y };
  }

  private initWelcomeText() {
    this.welcomeText = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        'Welcome to Phaser!',
        {
          fontSize: '32px',
          color: '#fff',
        },
      )
      .setOrigin(0.5);
  }

  private updateLayout() {
    const { width, height } = this.cameras.main;
    if (height > width) this.setupPortraitLayout();
    else this.setupLandscapeLayout();
  }

  private setupPortraitLayout() {
    // Position for Portrait
  }

  private setupLandscapeLayout() {
    // Position for Landscape
  }

  private shuffleDeck(deck: string[]): string[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  private dealCards(
    deck: string[],
    numPlayers: number,
    cardsPerPlayer: number,
  ): string[][] {
    const hands: string[][] = Array.from({ length: numPlayers }, () => []);
    for (let i = 0; i < cardsPerPlayer; i++) {
      for (let j = 0; j < numPlayers; j++) {
        const dealtCard = deck.pop();
        if (dealtCard) hands[j].push(dealtCard);
      }
    }
    return hands;
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    if (this.welcomeText) {
      this.welcomeText.setPosition(gameSize.width / 2, gameSize.height / 2);
    }
  }

  update() {
    // Game loop logic here
  }
}
