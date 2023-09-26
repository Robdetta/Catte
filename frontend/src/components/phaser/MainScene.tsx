import Phaser from 'phaser';
import { Player } from '../../models/Player';
import { PlayerManager } from './helpers/PlayerManager';
import { getRoom, getCurrentPlayerSessionId } from '../../stores/roomStore';
import CardUtils from '../../utils/CardUtils';

interface State {
  players: Map<string, Player>;
  // ... other properties
}

export default class Main extends Phaser.Scene {
  private playerManager: PlayerManager;
  private welcomeText: Phaser.GameObjects.Text | null = null;
  private playerSprites: { [key: string]: Phaser.GameObjects.Sprite } = {};
  private cardUtils: CardUtils;
  private playerCardImages: { [playerId: string]: Phaser.GameObjects.Image[] } =
    {};

  constructor() {
    super({ key: 'MainScene' });
    this.playerManager = new PlayerManager(this);
    this.cardUtils = new CardUtils();
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

  private displayPlayers() {
    const room = getRoom(); // Get the current room state
    if (room && room.state.players) {
      this.playerManager.updateUI(room.state);
    }
  }

  private updateUI(state: State) {
    const currentPlayerIds = [...state.players.keys()];

    const currentPlayer = state.players.get(currentPlayerId)!;
    console.log('Current Player in updateUI:', currentPlayer);

    if (!currentPlayerId) {
      console.error('Current player ID is null');
      return;
    }

    console.log('Pre-remove player state:', [
      ...this.playerManager.players.keys(),
    ]);
    // Remove players who left
    this.playerManager.players.forEach((playerObj, id) => {
      if (!currentPlayerIds.includes(id)) {
        console.log('Removing player with ID:', id);
        this.playerManager.removePlayerFromUI(id);
        this.clearPlayerCards(id); // Assuming you have a method to clear player cards from the UI
      }
    });

    console.log('Post-remove player state:', [
      ...this.playerManager.players.keys(),
    ]);

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

      let playerInstance = this.playerManager.getPlayerWithSprite(id)?.player;

      if (!playerInstance) {
        playerInstance = this.playerManager.createPlayer(playerData);
        // Assuming you'll add a sprite later
        this.playerManager.addPlayerWithSprite(playerInstance, null);
      }

      // Update UI
      this.playerManager.updatePlayerPositions(
        state,
        this.getCurrentPlayerId.bind(this),
      );
      // Moved this inside the forEach loop
      if (id === currentPlayerId && currentPlayer && currentPlayer.hand) {
        this.cardUtils.displayCards(
          currentPlayer.hand,
          currentPlayerId,
          this.addImageToScene.bind(this),
          currentPlayer,
        );
      } else {
        // Otherwise, display card backs for this player
        this.cardUtils.displayCardBacksForPlayer(
          id,
          playerData,
          x, // these are the actual x and y coordinates where you want to display
          y, // the card backs for this player.
          this.addImageToScene.bind(this),
        );
      }
    });
  }

  private addImageToScene(
    x: number,
    y: number,
    key: string,
    frame: string | number,
  ) {
    // this.add.image is Phaser's method to add an image to the scene.
    this.add.image(x, y, key, frame);
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

  clearPlayerCards(playerId: string) {
    if (this.playerCardImages[playerId]) {
      this.playerCardImages[playerId].forEach((cardImage) =>
        cardImage.destroy(),
      );
      delete this.playerCardImages[playerId];
    }
  }

  clearPreviousHands() {
    // Loop through all player hands and destroy any existing card images
    Object.values(this.playerCardImages).forEach((cardImages) => {
      cardImages.forEach((cardImage) => cardImage.destroy());
    });

    // Reset the playerCardImages object
    this.playerCardImages = {};
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
