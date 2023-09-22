import Phaser from 'phaser';
import { Player } from './helpers/Player';
import { PlayerManager } from './helpers/PlayerManager';
import { getRoom, getCurrentPlayerSessionId } from './helpers/roomStore';

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

    const playersArray = Array.from(room.state.players.values()) as Player[];
    this.playerManager.addPlayers(playersArray);

    const { numPlayers, numBots } = room.state;
    const totalPlayers = numPlayers + numBots;
    console.log(room.state);

    console.log('Room State:', room.state);
    console.log('Number of Players:', room.state.numPlayers);
    console.log('Number of Bots:', room.state.numBots);
    console.log('Players:', room.state.players);

    //this.displayDeck();
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
    const currentPlayerIds = [...state.players.keys()];

    // Existing player IDs in the player manager
    const existingPlayerIds = this.playerManager.players.map(
      (player) => player.id,
    );

    // Handling players who left
    existingPlayerIds
      .filter((id) => !currentPlayerIds.includes(id))
      .forEach((id) => {
        this.playerManager.removePlayerFromUI(id);
        //this.clearPlayerCards(id); // Assuming you still have a function to clear cards from the UI
      });

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

      let playerInstance = this.playerManager.players.find(
        (player) => player.id === id,
      );

      if (!playerInstance) {
        playerInstance = this.playerManager.createPlayer(playerData);
      }
      if (existingPlayerIds.includes(id)) {
        this.playerManager.updatePlayerPositionInUI(playerInstance, x, y);
      } else {
        this.playerManager.addPlayerToUI(playerInstance, x, y);
        //  this.displayCards(playerData.hand ?? [], id);
      }

      if (id !== this.getCurrentPlayerId()) {
        // this.displayCardBacksForPlayer(id, playerData, x, y);
      }
    });

    // Handling the current player's cards
    const currentPlayerId = this.getCurrentPlayerId();
    if (currentPlayerId) {
      const currentPlayer = state.players.get(currentPlayerId);
      if (currentPlayer?.hand) {
        const playerInstance = this.playerManager.players.find(
          (player) => player.id === currentPlayerId,
        );
        if (playerInstance) {
          playerInstance.updateHand(currentPlayer.hand, this);
        }
      }
    }
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
    // Debugging: List all objects in the scene
  }
}
