import Phaser from 'phaser';

export default class Player {
  public avatar: Phaser.GameObjects.Image;
  public hand: Phaser.GameObjects.Image[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.avatar = scene.add.image(x, y, 'playerAvatar');
  }
}
