import Phaser from 'phaser';

export interface IPlayer {
  id: string;
  color: number;
  x?: number;
  y?: number;
  hand?: string[];
  avatar?: Phaser.GameObjects.Image;
}

export default class Player implements IPlayer {
  public id: string;
  public color: number;
  public x?: number;
  public y?: number;
  public hand?: string[];
  public avatar: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: string,
    color: number,
  ) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.color = color;
    this.avatar = scene.add.image(x, y, 'playerAvatar').setTint(color);
  }

  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.avatar.setPosition(x, y);
  }
}
