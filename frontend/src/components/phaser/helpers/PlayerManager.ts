import Player from './Player';

export default class PlayerManager {
  scene: Phaser.Scene;
  players: Player[] = [];

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
