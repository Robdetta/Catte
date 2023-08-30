// MainScene.ts
import Phaser from 'phaser';

export default class Main extends Phaser.Scene {
  welcomeText: Phaser.GameObjects.Text | null = null;
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Load any assets here
  }

  create() {
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
  handleResize(gameSize: Phaser.Structs.Size) {
    if (this.welcomeText) {
      this.welcomeText.setPosition(gameSize.width / 2, gameSize.height / 2);
    }
  }

  update() {
    // Game loop logic here
  }
}
