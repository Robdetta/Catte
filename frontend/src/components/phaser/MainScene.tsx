import Phaser from 'phaser';
import { PlayerManager } from './helpers/PlayerManager';
import Player from './helpers/Player';
// import { getRoom, getCurrentPlayerSessionId } from './helpers/roomStore';

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

  create() {
    this.playerManager.displayPlayers();

    this.scale.on('resize', this.handleResize, this);
  }

  private displayDeck() {
    const x = this.cameras.main.centerX;
    const y = this.cameras.main.centerY - 100;
    for (let i = 0; i < 52; i++) {
      this.add.image(x, y - i * 0.5, 'cards', 'back').setDepth(i);
    }
  }

  private updateUI(state: State) {
    const currentPlayerIds = [...state.players.keys()];
    const existingPlayerIds = Object.keys(this.playerSprites);

    // Handling players who left
    existingPlayerIds
      .filter((id) => !currentPlayerIds.includes(id))
      .forEach((id) => {
        this.playerManager.removePlayerFromUI(id);
        this.clearPlayerCards(id);
      });

    // Handling current players (both existing and new)
    currentPlayerIds.forEach((id, index) => {
      const playerData = state.players.get(id);
      if (!playerData) {
        console.error('Player data not found for ID:', id);
        return;
      }

      const { x, y } = this.playerManager.calculatePlayerPosition(
        index,
        state.players.size,
      );

      // Create a new Player instance from playerData before calling updatePlayer
      const player = new Player(
        this.scene,
        x,
        y,
        playerData.id,
        playerData.color,
      );
      player.hand = playerData.hand;
      player.avatar = playerData.avatar;

      this.playerManager.updatePlayer(player, x, y);

      if (id !== this.getCurrentPlayerId()) {
        this.displayCardBacksForPlayer(id, playerData, x, y);
      }
    });

    // Handling the current player's cards
    const currentPlayerId = this.getCurrentPlayerId();
    if (currentPlayerId) {
      const currentPlayer = state.players.get(currentPlayerId);
      if (currentPlayer?.hand) {
        this.displayCards(currentPlayer.hand, currentPlayerId);
      }
    }
  }

  test;

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

  private handleResize(gameSize: Phaser.Structs.Size) {
    if (this.welcomeText) {
      this.welcomeText.setPosition(gameSize.width / 2, gameSize.height / 2);
    }
  }

  update() {
    // Game loop logic here
  }
}
