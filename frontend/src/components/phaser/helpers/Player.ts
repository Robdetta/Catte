import Phaser from 'phaser';

export interface PlayerData {
  id: string;
  color: number;
  x?: number;
  y?: number;
  hand?: string[];
  // ... other properties
}

export class Player {
  public id: string;
  public color: number;
  public avatar: Phaser.GameObjects.Image;
  public hand: Phaser.GameObjects.Image[] = [];
  x: number | undefined;
  y: number | undefined;

  constructor(scene: Phaser.Scene, data: PlayerData) {
    this.id = data.id;
    this.color = data.color;
    this.avatar = scene.add.image(data.x ?? 0, data.y ?? 0, 'playerAvatar');
    // You can also change the avatar's tint to match the player's color
    this.avatar.setTint(this.color);

    // Initialize hand if data.hand is provided
    if (data.hand) {
      this.hand = data.hand.map((cardId) => {
        // Add logic to create card images here
        // For now, returning placeholders
        return scene.add.image(0, 0, cardId);
      });
    }
  }

  // Add a method to update player position
  updatePosition(x: number, y: number) {
    this.avatar.x = x;
    this.avatar.y = y;
  }

  // ... Add other methods to update additional properties like hand
}
