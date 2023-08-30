// MainScene.ts
import Phaser from 'phaser';

export default class Main extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Load any assets here
  }

  create() {
    // Draw a rectangle for visualization
    this.add
      .rectangle(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height,
        0xff0000,
        0.2,
      )
      .setOrigin(0);
    this.add
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

  update() {
    // Game loop logic here
  }
}
