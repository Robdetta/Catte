import Phaser from 'phaser';
import { getDeck } from '../../services/deckService';
import PlayerManager from './helpers/PlayerManager';
import { getRoom, getCurrentPlayerSessionId } from './helpers/roomStore';

interface Player {
  id: string;
  color: number;
  x?: number;
  y?: number;
  hand?: Phaser.GameObjects.Image[]; // ... other properties
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

    room.onStateChange(this.updateUI.bind(this));

    this.displayPlayers(totalPlayers);

    getDeck()
      .then((deck) => {
        const shuffledDeck = this.shuffleDeck(deck);
        const hands = this.dealCards(shuffledDeck, numPlayers, 5);
        this.displayCards(hands);
      })
      .catch((error) => {
        console.error('Fetch error:', error.message);
      });

    this.initWelcomeText();
    this.updateLayout();
    this.scale.on('resize', this.handleResize, this);
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
    if (currentPlayerId && state.players.get(currentPlayerId)?.hand) {
      this.displayCards(state.players.get(currentPlayerId).hand);
    }
  }

  private addPlayerToUI(player: Player, x: number, y: number) {
    //... (existing logic to add player sprite to UI)
    const sprite = this.add.sprite(x, y, 'playerSprite').setTint(player.color);
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

    const player = room.state.players.get(currentPlayerId);
    if (!player || !player.avatar) {
      console.error('Current player not found in room state');
      return;
    }

    // Assuming that your player avatar has x and y properties to determine where on the screen their hand should be displayed. Adjust as necessary.
    const baseX = player.avatar.x ?? 0;
    const baseY = player.avatar.y ?? 0;

    // Clear previous hand if exists
    if (player.hand) {
      player.hand.forEach((cardImage) => cardImage.destroy());
      player.hand = [];
    } else {
      player.hand = [];
    }

    // Loop over the cards in the hand and create an image for each one, then add it to the player's hand array
    hand.forEach((card, index) => {
      const xOffset = 30; // Adjust as necessary to get the right spacing between cards

      // Create a new image for the card and set its position
      const cardImage = this.add.image(
        baseX + index * xOffset,
        baseY + player.avatar.height / 2 + 10 + index * 20, // Adjust the offset to place cards below the avatar, considering the height of the avatar and giving some spacing between cards
        'cards',
        card,
      );

      // Add the image to the player's hand array so it can be accessed and modified later
      player.hand.push(cardImage);
    });
  }

  private calculatePlayerPosition(
    index: number,
    totalPlayers: number,
  ): { x: number; y: number } {
    const { centerX, centerY } = this.cameras.main;
    const radius = 300;

    const currentPlayerId = this.getCurrentPlayerId();
    const playersArray = Array.from(
      getRoom()?.state.players.values(),
    ) as Player[];
    const currentPlayerIndex = playersArray.findIndex(
      (player) => player.id === currentPlayerId,
    );

    const adjustedIndex = (index - currentPlayerIndex) % totalPlayers;
    const angle = Math.PI / 2 + (adjustedIndex / totalPlayers) * 2 * Math.PI;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

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
