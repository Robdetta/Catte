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
      this.hand = data.hand;
      this.handImages = this.hand.map((cardId) => {
        return scene.add.image(0, 0, cardId);
      });
    }
  }

  // Add a method to update player position
  updatePosition(x: number, y: number) {
    this.avatar.x = x;
    this.avatar.y = y;
  }

  // Method to update hand
  updateHand(newHand: string[], scene: Phaser.Scene) {
    // Remove old hand images
    this.handImages.forEach((image) => image.destroy());

    // Update the hand data
    this.hand = newHand;

    // Create new hand images
    this.handImages = newHand.map((cardId) => {
      return scene.add.image(0, 0, cardId);
    });
  }
}
