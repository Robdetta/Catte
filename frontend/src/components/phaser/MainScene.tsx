import Phaser from 'phaser';
import { PlayerManager } from './helpers/PlayerManager';
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

    const playersArray = Array.from(room.state.players.values());
    this.playerManager.addPlayers(playersArray);

    const { numPlayers, numBots } = room.state;
    const totalPlayers = numPlayers + numBots;

    // this.displayDeck();
    room.onStateChange(this.updateUI.bind(this));

    this.displayPlayers(totalPlayers);

    this.initWelcomeText();
    this.updateLayout();
    this.scale.on('resize', this.handleResize, this);
  }

  private displayPlayers(totalPlayers: number) {
    const playersArray = this.playerManager.players;
    playersArray.forEach((player, index) => {
      const { x, y } = this.playerManager.calculatePlayerPosition(
        index,
        totalPlayers,
        this.cameras.main,
        this.getCurrentPlayerId.bind(this),
      );
      this.playerManager.addPlayerToUI(player, x, y);
    });
  }

  private updateUI(state: State) {
    // Debug log
    console.log('Updating UI');

    // 1. Collect all the current player IDs in the new state
    const currentPlayerIds = Array.from(state.players.keys());

    // 2. Remove players that have left the game
    const playersToRemove = this.playerManager.players.filter(
      (player) => !currentPlayerIds.includes(player.id),
    );
    playersToRemove.forEach((player) => {
      this.playerManager.removePlayerFromUI(player.id);
    });

    // 3. Add new players to the game
    const existingPlayerIds = this.playerManager.players.map(
      (player) => player.id,
    );
    const newPlayerIds = currentPlayerIds.filter(
      (id) => !existingPlayerIds.includes(id),
    );
    newPlayerIds.forEach((id) => {
      const newPlayer = state.players.get(id);
      if (newPlayer) {
        const createdPlayer = this.playerManager.createPlayer(newPlayer);
        const { x, y } = this.playerManager.calculatePlayerPosition(
          currentPlayerIds.indexOf(id), // You might want to adjust this index calculation
          currentPlayerIds.length,
          this.cameras.main,
          this.getCurrentPlayerId.bind(this),
        );
        this.playerManager.addPlayerToUI(createdPlayer, x, y);
      }
    });

    // 4. Update existing players
    currentPlayerIds.forEach((id, index) => {
      const playerData = state.players.get(id);
      if (!playerData) {
        console.error('Player data not found for ID:', id);
        return;
      }
      const { x, y } = this.playerManager.calculatePlayerPosition(
        index,
        state.players.size,
        this.cameras.main,
        this.getCurrentPlayerId.bind(this),
      );
      const existingPlayer = this.playerManager.players.find(
        (player) => player.id === id,
      );
      if (existingPlayer) {
        Object.assign(existingPlayer, playerData);
        this.playerManager.updatePlayerPositionInUI(existingPlayer, x, y);
      }
    });
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

  private handleResize(gameSize: Phaser.Structs.Size) {
    if (this.welcomeText) {
      this.welcomeText.setPosition(gameSize.width / 2, gameSize.height / 2);
    }
  }

  update() {
    // Game loop logic here
  }
}
