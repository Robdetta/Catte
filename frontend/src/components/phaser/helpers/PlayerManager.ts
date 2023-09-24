import { Player, PlayerData } from './Player';
import { getRoom } from './roomStore';

export class PlayerManager {
  private scene: Phaser.Scene;
  players: Map<string, { player: Player; sprite: Phaser.GameObjects.Sprite }> =
    new Map();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  createPlayer(data: PlayerData): Player {
    const player = new Player(this.scene, data);
    return player;
  }

  // Method to fetch a player and its sprite using the player ID
  getPlayerWithSprite(id: string) {
    return this.players.get(id);
  }

  addPlayerWithSprite(player: Player, sprite: Phaser.GameObjects.Sprite) {
    this.players.set(player.id, { player, sprite });
  }

  addPlayerToUI(player: Player, x: number, y: number) {
    const sprite = this.scene.add
      .sprite(x, y, 'playerAvatar')
      .setTint(player.color)
      .setDepth(1);
    this.addPlayerWithSprite(player, sprite);
  }

  updatePlayerPositionInUI(player: Player, x: number, y: number) {
    const sprite = this.players.get(player.id)?.sprite;
    if (sprite) {
      sprite.setPosition(x, y);
    }
  }

  removePlayerFromUI(playerId: string) {
    const sprite = this.players.get(playerId)?.sprite;
    if (sprite) {
      sprite.destroy();
    }
    this.players.delete(playerId);
  }

  addPlayers(players: Player[]) {
    for (const player of players) {
      this.players.set(player.id, { player, sprite: null });
    }
  }

  calculatePlayerPosition(
    index: number,
    totalPlayers: number,
    camera: Phaser.Cameras.Scene2D.Camera,
    getCurrentPlayerId: () => string | null,
  ): { x: number; y: number } {
    const { width, height } = camera;
    const currentPlayerId = getCurrentPlayerId();
    const playersArray = Array.from(
      getRoom()?.state.players.values(),
    ) as Player[];
    const currentPlayerIndex = playersArray.findIndex(
      (player) => player.id === currentPlayerId,
    );

    const adjustedIndex =
      (index - currentPlayerIndex + totalPlayers) % totalPlayers;
    const isCurrentPlayer = adjustedIndex === 0;

    let x = 0;
    let y = 0;

    if (isCurrentPlayer) {
      x = width / 2;
      y = height - 150;
    } else {
      const radius = 300;
      const angle = Math.PI / 2 + (adjustedIndex / totalPlayers) * 2 * Math.PI;

      x = width / 2 + radius * Math.cos(angle);
      y = height / 2 + radius * Math.sin(angle);
    }

    // Update the player's x and y in the state
    const player = playersArray[index];
    player.x = x;
    player.y = y;

    return { x, y };
  }

  // ... other player related methods ...
}
