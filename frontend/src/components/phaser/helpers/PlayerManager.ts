import { Player, PlayerData } from './Player';
import { getRoom } from './roomStore';

export class PlayerManager {
  private scene: Phaser.Scene;
  players: Player[] = [];
  private playerSprites: { [key: string]: Phaser.GameObjects.Sprite } = {};

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  createPlayer(data: PlayerData): Player {
    const player = new Player(this.scene, data);
    this.players.push(player);
    return player;
  }

  addPlayerToUI(player: Player, x: number, y: number) {
    // Logic to add a player to the UI
    const sprite = this.scene.add
      .sprite(x, y, 'playerAvatar')
      .setTint(player.color)
      .setDepth(1);
    this.playerSprites[player.id] = sprite;
  }

  updatePlayerPositionInUI(player: Player, x: number, y: number) {
    // Logic to update the player's position in the UI
    const sprite = this.playerSprites[player.id];
    if (sprite) {
      sprite.setPosition(x, y);
    }
  }

  removePlayerFromUI(playerId: string) {
    // Logic to remove a player from the UI
    if (this.playerSprites[playerId]) {
      this.playerSprites[playerId].destroy();
      delete this.playerSprites[playerId];
    }
    this.players = this.players.filter((player) => player.id !== playerId);
  }

  addPlayers(players: Player[]) {
    this.players = [...this.players, ...players];
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
