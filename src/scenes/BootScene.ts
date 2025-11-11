import Phaser from 'phaser';
import { GameConfig } from '@config/GameConfig';

/**
 * Boot scene - handles initial loading and asset loading
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: GameConfig.SCENES.BOOT });
  }

  preload(): void {
    this.createLoadingScreen();

    // TODO: Load global assets here
    // this.load.image('logo', 'assets/logo.png');
    // this.load.audio('bgMusic', 'assets/audio/background.mp3');

    // Update loading progress
    this.load.on('progress', (value: number) => {
      this.updateLoadingBar(value);
    });
  }

  create(): void {
    // Once loading is complete, go to menu
    this.scene.start(GameConfig.SCENES.MENU);
  }

  private createLoadingScreen(): void {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000);

    // Loading text
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      font: '32px Arial',
      color: GameConfig.COLORS.TEXT,
    });
    loadingText.setOrigin(0.5);

    // Progress bar background
    const progressBarBg = this.add.rectangle(
      width / 2,
      height / 2 + 50,
      400,
      30,
      0x222222
    );

    // Progress bar
    const progressBar = this.add.rectangle(
      width / 2 - 200,
      height / 2 + 50,
      0,
      30,
      GameConfig.COLORS.PRIMARY
    );
    progressBar.setOrigin(0, 0.5);

    this.registry.set('progressBar', progressBar);
  }

  private updateLoadingBar(value: number): void {
    const progressBar = this.registry.get('progressBar') as Phaser.GameObjects.Rectangle;
    if (progressBar) {
      progressBar.width = 400 * value;
    }
  }
}
