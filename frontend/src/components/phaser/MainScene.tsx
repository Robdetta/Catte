// MainScene.ts
import Phaser from 'phaser';
import { getDeck } from '../../services/deckService';

export default class Main extends Phaser.Scene {
  welcomeText: Phaser.GameObjects.Text | null = null;
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Load any assets here
    // Assuming card.json references images like "card_1.png", "card_2.png", etc.
    this.load.atlas('cards', '/src/assets/cards.png', '/src/assets/cards.json');
  }

  create() {
    function isStringArray(array: any): array is string[] {
      return (
        Array.isArray(array) && array.every((item) => typeof item === 'string')
      );
    }

    getDeck()
      .then((deck) => {
        console.log(deck); // <--- Add this
        //Convert backend card naming to atlas frame naming

        const atlasFrames = deck; // <--- Add this
        //const frames = this.textures.get('cards').getFrameNames();

        let x = 500;
        let y = 500;
        const gap = 30;

        atlasFrames.forEach((frame, index) => {
          if (!this.textures.get('cards').has(frame)) {
            console.warn(`Frame not found: ${frame}`);
            return;
          }
          this.add.image(x + index * gap, y, 'cards', frame);
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
