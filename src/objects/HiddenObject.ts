import Phaser from 'phaser';

/**
 * HiddenObject - Represents an object to find in the scene
 */
export interface HiddenObjectConfig {
  key: string;
  name: string;
  x: number;
  y: number;
  scale?: number;
  texture?: string;
}

export class HiddenObject extends Phaser.GameObjects.Container {
  private objectKey: string;
  private objectName: string;
  private found: boolean = false;
  private sprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Rectangle;
  private onFoundCallback?: () => void;

  constructor(scene: Phaser.Scene, config: HiddenObjectConfig) {
    super(scene, config.x, config.y);

    this.objectKey = config.key;
    this.objectName = config.name;

    // Create visual representation
    if (config.texture && scene.textures.exists(config.texture)) {
      this.sprite = scene.add.sprite(0, 0, config.texture);
    } else {
      // Placeholder if no texture is loaded
      this.sprite = scene.add.rectangle(0, 0, 50, 50, 0xff6b6b);
    }

    if (config.scale) {
      this.sprite.setScale(config.scale);
    }

    this.add(this.sprite);
    this.setSize(this.sprite.width, this.sprite.height);
    this.setInteractive({ useHandCursor: true });

    // Add hover effect
    this.on('pointerover', () => {
      if (!this.found && this.sprite instanceof Phaser.GameObjects.Sprite) {
        this.sprite.setTint(0xffff00);
      }
    });

    this.on('pointerout', () => {
      if (!this.found && this.sprite instanceof Phaser.GameObjects.Sprite) {
        this.sprite.clearTint();
      }
    });

    this.on('pointerdown', () => {
      if (!this.found) {
        this.markAsFound();
      }
    });

    scene.add.existing(this);
  }

  markAsFound(): void {
    if (this.found) return;

    this.found = true;
    this.disableInteractive();

    // Visual feedback
    if (this.sprite instanceof Phaser.GameObjects.Sprite) {
      this.sprite.setTint(0x00ff00);
    }

    // Animate
    this.scene.tweens.add({
      targets: this,
      scale: { from: 1, to: 1.2 },
      alpha: { from: 1, to: 0 },
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        if (this.onFoundCallback) {
          this.onFoundCallback();
        }
      },
    });
  }

  showHint(): void {
    // Subtle pulse effect
    this.scene.tweens.add({
      targets: this.sprite,
      scale: { from: this.sprite.scale, to: this.sprite.scale * 1.1 },
      duration: 300,
      yoyo: true,
      repeat: 2,
    });
  }

  getKey(): string {
    return this.objectKey;
  }

  getName(): string {
    return this.objectName;
  }

  isFound(): boolean {
    return this.found;
  }

  onFound(callback: () => void): void {
    this.onFoundCallback = callback;
  }
}
