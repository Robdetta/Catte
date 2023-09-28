import { Player } from '../../../models/Player';
import { getPlayerArray } from '../../../services/roomService';
import { getCurrentPlayerSessionId } from '../../../stores/roomStore';
export class PlayerManager {
  private scene: Phaser.Scene;
  players: Map<string, { player: Player; sprite: Phaser.GameObjects.Sprite }> =
    new Map();

  playerSessionIds: string[] = []; // Add this line to keep track of session IDs

  // Add a new property to keep track of player cards
  playerCardImages: Map<string, Phaser.GameObjects.Image[]> = new Map();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  clearAllPlayerSprites() {
    this.players.forEach(({ sprite }) => sprite.destroy());
    this.players.clear();
  }

  updatePlayersToUI() {
    this.clearAllPlayerSprites(); // Clear all existing sprites

    const playerArray = getPlayerArray(); // Get the players from the RoomService
    console.log('Updating Players:', playerArray); // Debug log
    this.playerSessionIds = playerArray.map((player) => player.id); // Update session IDs

    playerArray.forEach((player, index) => {
      const { x, y } = this.calculatePlayerPosition(
        index,
        this.scene.cameras.main,
      );
      this.updateOrAddPlayerToUI(player, x, y);
    });
  }

  updateOrAddPlayerToUI(player: Player, x: number, y: number) {
    let sprite = this.players.get(player.id)?.sprite;

    if (!sprite) {
      sprite = this.scene.add
        .sprite(x, y, 'playerAvatar')
        .setTint(player.color)
        .setDepth(1);
      this.players.set(player.id, { player, sprite });
    } else {
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

  calculatePlayerPosition(
    index: number,
    camera: Phaser.Cameras.Scene2D.Camera,
  ): { x: number; y: number } {
    const { width, height } = camera;
    const currentPlayerId = getCurrentPlayerSessionId();
    const totalPlayers = this.playerSessionIds.length;

    if (!currentPlayerId) {
      console.error('currentPlayerId is null');
      return { x: 0, y: 0 };
    }

    const currentPlayerIndex = this.playerSessionIds.indexOf(currentPlayerId);
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

    return { x, y };
  }
}
