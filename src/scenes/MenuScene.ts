import Phaser from 'phaser';
import { GameConfig } from '@config/GameConfig';

/**
 * Main menu scene
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: GameConfig.SCENES.MENU });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a1a);

    // Title
    const title = this.add.text(width / 2, height / 3, 'GAME ENGINE', {
      font: 'bold 72px Arial',
      color: GameConfig.COLORS.TEXT,
    });
    title.setOrigin(0.5);

    // Play button
    this.createButton(
      width / 2,
      height / 2,
      'Play Hidden Object Game',
      () => this.startGame()
    );

    // Settings button
    this.createButton(
      width / 2,
      height / 2 + 100,
      'Settings',
      () => this.openSettings()
    );
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    callback: () => void
  ): void {
    const button = this.add.rectangle(x, y, 400, 80, GameConfig.COLORS.PRIMARY);
    button.setInteractive({ useHandCursor: true });

    const buttonText = this.add.text(x, y, text, {
      font: '28px Arial',
      color: GameConfig.COLORS.TEXT,
    });
    buttonText.setOrigin(0.5);

    // Hover effects
    button.on('pointerover', () => {
      button.setFillStyle(0x5fa3f5);
    });

    button.on('pointerout', () => {
      button.setFillStyle(GameConfig.COLORS.PRIMARY);
    });

    button.on('pointerdown', callback);
  }

  private startGame(): void {
    this.scene.start(GameConfig.SCENES.HIDDEN_OBJECT);
  }

  private openSettings(): void {
    console.log('Settings clicked - to be implemented');
  }
}
