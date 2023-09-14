import Player from './Player';
import { getRoom, getCurrentPlayerSessionId } from './roomStore';
export class PlayerManager {
  private scene: Phaser.Scene;
  private players: Player[] = [];
  private playerSprites: { [key: string]: Phaser.GameObjects.Sprite } = {};

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  private getCurrentPlayerId(): string | null {
    return getCurrentPlayerSessionId();
  }

  public displayPlayers(): void {
    const room = getRoom();
    if (!room || !room.state || !room.state.players) {
      console.error('No room, room state, or players available');
      return;
    }
    const playersArray = Array.from(room.state.players.values()) as Player[];
    playersArray.forEach((player, index) => {
      const { x, y } = this.calculatePlayerPosition(index, playersArray.length);
      this.addPlayerToUI(player, x, y);
    });
  }

  public calculatePlayerPosition(
    index: number,
    totalPlayers: number,
  ): { x: number; y: number } {
    const { width, height } = this.scene.cameras.main;
    const currentPlayerId = this.getCurrentPlayerId();
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

    return { x, y };
  }

  public updatePlayer(player: Player, x: number, y: number): void {
    if (!this.playerSprites[player.id]) {
      this.addPlayerToUI(player, x, y);
    } else {
      this.updatePlayerPositionInUI(player, x, y);
    }
  }

  public addPlayerToUI(player: Player, x: number, y: number): void {
    //... (existing logic to add player sprite to UI)
    const sprite = this.scene.add
      .sprite(x, y, 'playerAvatar')
      .setTint(player.color)
      .setDepth(1);
    this.playerSprites[player.id] = sprite;
  }

  public removePlayerFromUI(playerId: string) {
    if (this.playerSprites[playerId]) {
      this.playerSprites[playerId].destroy();
      delete this.playerSprites[playerId];
    }
  }

  private updatePlayerPositionInUI(player: Player, x: number, y: number) {
    const sprite = this.playerSprites[player.id];
    if (sprite) {
      sprite.setPosition(x, y);
    }
  }

  // ... other player related methods ...
}
