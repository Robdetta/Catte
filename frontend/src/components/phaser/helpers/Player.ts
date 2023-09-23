import Phaser from 'phaser';

export interface PlayerData {
  id: string;
  color: number;
  x?: number;
  y?: number;
  hand?: string[];
  // ... other properties
}

export class Player implements PlayerData {
  public id: string;
  public color: number;
  public avatar: Phaser.GameObjects.Image;
  public hand?: string[]; // Server representation
  public handImages: Phaser.GameObjects.Image[] = [];
  x: number | undefined;
  y: number | undefined;

  constructor(scene: Phaser.Scene, data: PlayerData) {
    this.id = data.id;
    this.color = data.color;
    this.avatar = scene.add.image(data.x ?? 0, data.y ?? 0, 'playerAvatar');
    this.avatar.setTint(this.color);

    if (data.hand) {
      this.updateHand(data.hand, scene);
    }
  }

  // Add a method to update player position
  updatePosition(x: number, y: number) {
    this.avatar.x = x;
    this.avatar.y = y;
  }

  updateHand(newHand: string[], scene: Phaser.Scene) {
    this.hand = newHand;

    // Remove old hand images from the scene
    this.handImages.forEach((image) => image.destroy());

    // Create new hand images
    this.handImages = this.hand.map((cardId, index) => {
      const x = this.avatar.x + index * 30; // Adjust x and y as needed
      const y = this.avatar.y + 50; // Position below the avatar
      return scene.add.image(x, y, 'cardSprites', cardId);
    });
  }

  renderHand(scene: Phaser.Scene) {
    // ... UI logic to display the hand
  }
}
