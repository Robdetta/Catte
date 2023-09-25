import { Player, PlayerData } from '../../../models/Player';
import { getRoom } from '../../../stores/roomStore';

export class PlayerManager {
  private scene: Phaser.Scene;
  players: Map<string, { player: Player; sprite: Phaser.GameObjects.Sprite }> =
    new Map();

  // Add a new property to keep track of player cards
  playerCardImages: Map<string, Phaser.GameObjects.Image[]> = new Map();

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
    let sprite = this.players.get(player.id)?.sprite;
    if (!sprite) {
      sprite = this.scene.add
        .sprite(x, y, 'playerAvatar')
        .setTint(player.color)
        .setDepth(1);
      this.addPlayerWithSprite(player, sprite);
    } else {
      sprite.setPosition(x, y);
    }
  }

  updatePlayerPositionInUI(player: Player, x: number, y: number) {
    const sprite = this.players.get(player.id)?.sprite;
    if (sprite) {
      sprite.setPosition(x, y);
    }
  }

  removePlayerFromUI(playerId: string) {
    console.log('Attempting to remove player with ID:', playerId);
    const sprite = this.players.get(playerId)?.sprite;
    if (sprite) {
      console.log('Sprite found. Destroying sprite.');
      sprite.destroy();
    } else {
      console.log('No sprite found for this player.');
    }
    this.players.delete(playerId);

    // Also clear cards for this player
    this.clearPlayerCards(playerId);
  }

  // New method to clear player cards
  clearPlayerCards(playerId: string) {
    const cardImages = this.playerCardImages.get(playerId);
    if (cardImages) {
      cardImages.forEach((cardImage) => cardImage.destroy());
      this.playerCardImages.delete(playerId);
    }
  }

  addPlayers(players: Player[]) {
    for (const player of players) {
      this.players.set(player.id, { player, sprite: null });
    }
  }

  // Update the layout of all players in the UI
  updatePlayerPositions(state: any) {
    const currentPlayerIds = [...state.players.keys()];
    currentPlayerIds.forEach((id, index) => {
      const playerData = state.players.get(id);
      if (!playerData) {
        console.error('Player data not found for ID:', id);
        return;
      }

      const { x, y } = this.calculatePlayerPosition(
        index,
        state.players.size,
        this.scene.cameras.main,
        // Replace this with however you get the current player ID
        () => 'currentPlayerID',
      );

      let playerInstance = this.getPlayerWithSprite(id)?.player;

      if (!playerInstance) {
        playerInstance = this.createPlayer(playerData);
        this.addPlayerWithSprite(playerInstance, null);
      }

      // Update UI
      this.updatePlayerPositionInUI(playerInstance, x, y);
    });
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

    console.log('Is current player:', isCurrentPlayer);

    let x = 0;
    let y = 0;

    if (isCurrentPlayer) {
      x = width / 2;
      y = height - 150;
    } else {
      const radius = 300;
      const angle = Math.PI / 2 + (adjustedIndex / totalPlayers) * 2 * Math.PI;

      console.log('Calculated angle:', angle);

      x = width / 2 + radius * Math.cos(angle);
      y = height / 2 + radius * Math.sin(angle);
    }

    // Log the final x, y coordinates
    console.log('Final x:', x);
    console.log('Final y:', y);

    // Update the player's x and y in the state
    const player = playersArray[index];
    player.x = x;
    player.y = y;

    console.log('---- End calculatePlayerPosition ----');

    return { x, y };
  }

  // ... other player related methods ...
}
