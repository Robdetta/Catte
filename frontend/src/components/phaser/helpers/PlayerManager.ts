import { Player, PlayerData } from '../../../models/Player';
import { getRoom, getCurrentPlayerSessionId } from '../../../stores/roomStore';

export class PlayerManager {
  private scene: Phaser.Scene;
  players: Map<string, { player: Player; sprite: Phaser.GameObjects.Sprite }> =
    new Map();

  // Add a new property to keep track of player cards
  playerCardImages: Map<string, Phaser.GameObjects.Image[]> = new Map();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }
}
