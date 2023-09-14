import Player from './Player';
import { getRoom, getCurrentPlayerSessionId } from './roomStore';
import Phaser from 'phaser';

export class PlayerManager {
  private scene: Phaser.Scene;
  private players: Player[] = [];
  private playerSprites: { [key: string]: Phaser.GameObjects.Sprite } = {};

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  createPlayer(x: number, y: number): Phaser.GameObjects.Image {
    const player = new Player(this.scene, x, y);
    this.players.push(player);
    return player.avatar; // Return the avatar from the Player instance
  }

  // ... other player related methods ...
}
