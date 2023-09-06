import Phaser from 'phaser';
import { getDeck } from '../../services/deckService';
import PlayerManager from './helpers/PlayerManager';
import { getRoom } from './helpers/roomStore';

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

    const { centerX, centerY } = this.cameras.main;
    const radius = 300;

    playersArray.forEach((player, index) => {
      const angle = (index / playersArray.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const playerAvatar = this.playerManager.createPlayer(x, y);
      playerAvatar.setScale(0.5);

      // You may want to set a unique identifier to the playerAvatar
      // so you can easily update or delete it later
      playerAvatar.setData('id', player.id);

      console.log(`Player ${player.name} position: x=${x}, y=${y}`);
    });
  }

  private updateUI(state) {
    const existingPlayerIds = Object.keys(this.playerSprites);
    const currentPlayerIds = Object.keys(state.players);

    // Remove players that left the game
    existingPlayerIds.forEach((id) => {
      if (!currentPlayerIds.includes(id)) {
        this.playerSprites[id].destroy();
        delete this.playerSprites[id];
      }
    });

    // Add new players
    currentPlayerIds.forEach((id) => {
      if (!existingPlayerIds.includes(id)) {
        this.addPlayerToUI(state.players[id]);
      }
    });
  }

  private addPlayerToUI(player) {
    let sprite = this.add.sprite(player.x, player.y, 'playerSprite');
    sprite.setTint(player.color);
    this.playerSprites[player.id] = sprite;
  }

  private clearPlayersUI() {
    for (let playerId in this.playerSprites) {
      this.playerSprites[playerId].destroy();
    }
    this.playerSprites = {};
  }

  private displayCards(hands: string[][]) {
    const room = getRoom();
    if (!room || !room.state || !room.state.players) {
      console.error('No room, room state, or players available');
      return;
    }

    // Convert players map to an array
    const playersArray = [...room.state.players.values()];

    // Check if there are the same number of hands as players
    if (hands.length !== playersArray.length) {
      console.error('Mismatch between number of hands and players');
      return;
    }

    // Loop over each hand
    hands.forEach((hand, handIndex) => {
      const player = playersArray[handIndex];
      if (!player || !player.avatar) {
        console.error('Missing player or player avatar');
        return; // Skip this iteration
      }

      // Display cards for this player
      hand.forEach((card, cardIndex) => {
        const xOffset = 30;
        const cardImage = this.add.image(
          player.avatar.x + cardIndex * xOffset,
          player.avatar.y + 100,
          'cards',
          card,
        );
        if (!player.hand) {
          player.hand = [];
        }
        player.hand.push(cardImage);
      });
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
