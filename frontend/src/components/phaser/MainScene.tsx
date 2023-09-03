// MainScene.ts
import Phaser from 'phaser';
import { getDeck } from '../../services/deckService';
import PlayerManager from './helpers/PlayerManager';

export default class Main extends Phaser.Scene {
  playerManager: PlayerManager;
  welcomeText: Phaser.GameObjects.Text | null = null;
  constructor() {
    super({ key: 'MainScene' });
    this.playerManager = new PlayerManager(this);
  }

  init() {
    // Set default data values here
    this.data.set('numPlayers', 6);
    this.data.set('numBots', 0);
    this.data.set('room', null);
  }

  preload() {
    // Load any assets here
    // Assuming card.json references images like "card_1.png", "card_2.png", etc.
    this.load.atlas('cards', '/src/assets/cards.png', '/src/assets/cards.json');

    // place to load player avatar assets
    this.load.image('playerAvatar', 'path_to_player_avatar_image.png');
  }

  create() {
    // Use the manager to create players
    // Access the data
    // Retrieve the data from the game's registry
    const numPlayers = this.registry.get('numPlayers'); // Retrieve from this.data
    //const numPlayers = 6; // We'll hardcode this for now

    const numBots = this.registry.get('numBots');
    const room = this.registry.get('room');

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    const radius = 300; // Defines the circle's size.

    for (let i = 0; i < numPlayers; i++) {
      const angle = (i / numPlayers) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const playerAvatar = this.playerManager.createPlayer(x, y);

      playerAvatar.setScale(0.5); // scale it to 50% of its size
      playerAvatar.setInteractive();

      console.log(`Player ${i + 1} position: x=${x}, y=${y}`);

      this.input.on('gameobjectup', (pointer, gameObject) => {
        if (gameObject === playerAvatar) {
          // Player avatar was clicked, do something!
        }
      });
    }

    getDeck()
      .then((deck) => {
        // Shuffle and deal the deck
        const shuffledDeck = this.shuffleDeck(deck);
        const hands = this.dealCards(shuffledDeck, numPlayers, 5); // Assuming 5 cards each for now.
        // Display the cards for each player
        hands.forEach((hand, playerIndex) => {
          const player = players[playerIndex];
          hand.forEach((card, cardIndex) => {
            const xOffset = 30; // Horizontal gap between cards.
            const cardImage = this.add.image(
              player.avatar.x + cardIndex * xOffset,
              player.avatar.y + 100,
              'cards',
              card,
            );
            player.hand.push(cardImage);
          });
        });
      })
      .catch((error) => {
        console.error('Fetch error: ' + error.message);
      });
    // Adjust properties if needed, such as setting scale or interactive properties.
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

    // Add a listener for the resize event
    this.scale.on('resize', this.handleResize, this);
  }

  shuffleDeck(deck: string[]): string[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap elements
    }
    return deck;
  }

  dealCards(
    deck: string[],
    numPlayers: number,
    cardsPerPlayer: number,
  ): string[][] {
    const hands: string[][] = Array.from({ length: numPlayers }, () => []);

    for (let i = 0; i < cardsPerPlayer; i++) {
      for (let j = 0; j < numPlayers; j++) {
        const dealtCard = deck.pop(); // Take the top card
        if (dealtCard) hands[j].push(dealtCard);
      }
    }
    return hands; // Returns an array of hands, where each hand is an array of card filenames
  }

  handleResize(gameSize: Phaser.Structs.Size) {
    if (this.welcomeText) {
      this.welcomeText.setPosition(gameSize.width / 2, gameSize.height / 2);
    }
  }

  update() {
    // Game loop logic here
  }
}
