import Phaser from 'phaser';
import { Player } from '../../models/Player';
import { PlayerManager } from './helpers/PlayerManager';
import { initializeRoomEvents } from '../../services/roomService';
import { getRoom, getCurrentPlayerSessionId } from '../../stores/roomStore';
import CardUtils from '../../utils/CardUtils';

interface MainConfig {
  numPlayers: number;
  numBots: number;
}

interface State {
  // Define properties of the room state here
  numPlayers: number;
  numBots: number;
  players: Map<string, Player>;
}

export default class Main extends Phaser.Scene {
  private playerManager: PlayerManager;
  private cardUtils: CardUtils;
  private welcomeText: Phaser.GameObjects.Text | null = null;
  private playerSprites: { [key: string]: Phaser.GameObjects.Sprite } = {};
  private playerCardImages: { [playerId: string]: Phaser.GameObjects.Image[] } =
    {};

  constructor() {
    super({ key: 'MainScene' });
    this.playerManager = new PlayerManager(this);
    this.cardUtils = new CardUtils();
  }

  init(data: MainConfig) {
    // Initialization logic
  }

  preload() {
    this.load.atlas('cards', '/src/assets/cards.png', '/src/assets/cards.json');
    this.load.image('playerAvatar', 'path_to_player_avatar_image.png');
  }

  private getCurrentPlayerId(): string | null {
    return getCurrentPlayerSessionId();
  }
  create() {
    initializeRoomEvents(getRoom());

    this.validateAndInitializeRoom();
    this.setupEventListeners();
    this.initUIComponents();
    this.displayPlayers();
  }

  private validateAndInitializeRoom() {
    const room = getRoom();
    if (!room || !this.validateRoomState(room.state)) {
      return;
    }
    // Initialization logic based on room state can go here
  }

  private setupEventListeners() {
    const room = getRoom();
    this.scale.on('resize', this.handleResize, this);
  }

  private validateRoomState(state: any): state is State {
    if (
      !state ||
      state.numPlayers === undefined ||
      state.numBots === undefined ||
      !state.players
    ) {
      console.error('State properties missing.');
      return false;
    }
    return true;
  }

  private initUIComponents() {
    // UI component initialization logic
  }

  private displayPlayers() {
    const room = getRoom();
    if (!this.validateRoomState(room?.state)) {
      return;
    }
    const players = Array.from(room.state.players.values());
    const currentPlayerId = this.getCurrentPlayerId();

    // Clear any previous player sprites or images
    Object.values(this.playerSprites).forEach((sprite) => sprite.destroy());
    this.playerSprites = {};

    // Position the current player session at the bottom
    if (currentPlayerId) {
      this.playerSprites[currentPlayerId] = this.add
        .sprite(
          this.cameras.main.centerX,
          this.cameras.main.height - 50,
          'playerAvatar',
        )
        .setOrigin(0.5);
    }

    // Position all other players evenly in a circle
    const otherPlayers = players.filter(
      (player) => player.sessionId !== currentPlayerId,
    );
    const numOtherPlayers = otherPlayers.length;

    otherPlayers.forEach((player, index) => {
      const angle = (2 * Math.PI * index) / numOtherPlayers;
      const x = this.cameras.main.centerX + 200 * Math.cos(angle);
      const y = this.cameras.main.centerY + 200 * Math.sin(angle);

      this.playerSprites[player.sessionId] = this.add
        .sprite(x, y, 'playerAvatar')
        .setOrigin(0.5);
    });
  }

  private updateUI(state: State) {
    if (!this.validateRoomState(state)) {
      return;
    }

    this.handlePlayerUpdates(state);
  }

  // Call this method when the player array state changes
  updatePlayersToUI() {
    this.playerManager.updatePlayersToUI();
    this.displayPlayers();
  }

  private handlePlayerUpdates(state: State) {
    const currentPlayerId = this.getCurrentPlayerId();
    if (!currentPlayerId) {
      console.error('Current player ID is null');
      return;
    }

    this.removeDisconnectedPlayers(state, currentPlayerId);
    this.updateOrAddPlayers(state, currentPlayerId);
    this.displayPlayers(); // Update player positions when state changes
  }

  private removeDisconnectedPlayers(state: State, currentPlayerId: string) {
    // Remove players who left (logic can go here)
  }

  private updateOrAddPlayers(state: State, currentPlayerId: string) {
    // Loop to update or add players (logic can go here)
  }

  private addImageToScene(
    x: number,
    y: number,
    key: string,
    frame: string | number,
  ) {
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
    Object.values(this.playerCardImages).forEach((cardImages) => {
      cardImages.forEach((cardImage) => cardImage.destroy());
    });
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
  }
}
