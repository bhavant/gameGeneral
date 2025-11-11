import Phaser from 'phaser';
import { GameConfig } from '@config/GameConfig';
import { GameManager } from '@core/GameManager';
import { AudioManager } from '@core/AudioManager';
import { HiddenObject } from '@objects/HiddenObject';
import { getLevelData, LevelData } from '@core/LevelData';

/**
 * HiddenObjectScene - Main gameplay scene for hidden object levels
 */
export class HiddenObjectScene extends Phaser.Scene {
  private gameManager!: GameManager;
  private audioManager!: AudioManager;
  private levelData!: LevelData;
  private hiddenObjects: HiddenObject[] = [];
  private objectsFound: number = 0;
  private timer?: Phaser.Time.TimerEvent;
  private timeRemaining: number = 0;

  // UI Elements
  private scoreText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private objectListText!: Phaser.GameObjects.Text;
  private hintButton!: Phaser.GameObjects.Rectangle;
  private hintText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: GameConfig.SCENES.HIDDEN_OBJECT });
  }

  create(): void {
    this.gameManager = GameManager.getInstance();
    this.audioManager = new AudioManager(this);

    // Load level data
    const levelId = this.gameManager.getCurrentLevel();
    const data = getLevelData(levelId);

    if (!data) {
      console.error(`Level ${levelId} not found!`);
      this.scene.start(GameConfig.SCENES.MENU);
      return;
    }

    this.levelData = data;
    this.objectsFound = 0;
    this.timeRemaining = data.timeLimit || 0;

    this.createBackground();
    this.createHiddenObjects();
    this.createUI();

    if (data.timeLimit) {
      this.startTimer();
    }
  }

  private createBackground(): void {
    const { width, height } = this.cameras.main;

    // Background color or image
    if (this.levelData.background && this.textures.exists(this.levelData.background)) {
      this.add.image(width / 2, height / 2, this.levelData.background);
    } else {
      // Placeholder background
      this.add.rectangle(width / 2, height / 2, width, height, 0x2c3e50);
    }
  }

  private createHiddenObjects(): void {
    this.levelData.objects.forEach((objConfig) => {
      const hiddenObj = new HiddenObject(this, objConfig);
      hiddenObj.onFound(() => this.onObjectFound(hiddenObj));
      this.hiddenObjects.push(hiddenObj);
    });
  }

  private createUI(): void {
    const { width } = this.cameras.main;

    // Level title
    const levelTitle = this.add.text(width / 2, 30, this.levelData.name, {
      font: 'bold 36px Arial',
      color: GameConfig.COLORS.TEXT,
    });
    levelTitle.setOrigin(0.5);
    levelTitle.setScrollFactor(0);

    // Score
    this.scoreText = this.add.text(
      20,
      20,
      `Score: ${this.gameManager.getScore()}`,
      {
        font: '24px Arial',
        color: GameConfig.COLORS.TEXT,
      }
    );
    this.scoreText.setScrollFactor(0);

    // Timer
    if (this.levelData.timeLimit) {
      this.timerText = this.add.text(width - 20, 20, `Time: ${this.timeRemaining}`, {
        font: '24px Arial',
        color: GameConfig.COLORS.TEXT,
      });
      this.timerText.setOrigin(1, 0);
      this.timerText.setScrollFactor(0);
    }

    // Object list
    const objectList = this.levelData.objects.map((obj) => obj.name).join(', ');
    this.objectListText = this.add.text(
      width / 2,
      80,
      `Find: ${objectList}`,
      {
        font: '20px Arial',
        color: GameConfig.COLORS.TEXT,
        backgroundColor: '#00000088',
        padding: { x: 10, y: 5 },
      }
    );
    this.objectListText.setOrigin(0.5, 0);
    this.objectListText.setScrollFactor(0);

    // Hint button
    this.createHintButton();
  }

  private createHintButton(): void {
    const { width, height } = this.cameras.main;

    this.hintButton = this.add.rectangle(
      width - 120,
      height - 60,
      200,
      60,
      GameConfig.COLORS.PRIMARY
    );
    this.hintButton.setInteractive({ useHandCursor: true });
    this.hintButton.setScrollFactor(0);

    this.hintText = this.add.text(
      width - 120,
      height - 60,
      `Hints: ${this.gameManager.getHintsRemaining()}`,
      {
        font: '20px Arial',
        color: GameConfig.COLORS.TEXT,
      }
    );
    this.hintText.setOrigin(0.5);
    this.hintText.setScrollFactor(0);

    this.hintButton.on('pointerdown', () => this.useHint());
  }

  private startTimer(): void {
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

  private updateTimer(): void {
    this.timeRemaining--;
    if (this.timerText) {
      this.timerText.setText(`Time: ${this.timeRemaining}`);
    }

    if (this.timeRemaining <= 0) {
      this.gameOver(false);
    }
  }

  private onObjectFound(object: HiddenObject): void {
    this.objectsFound++;
    this.gameManager.addScore(100);

    // Update UI
    this.scoreText.setText(`Score: ${this.gameManager.getScore()}`);

    // Strike through found object in list
    this.updateObjectList(object);

    // Check if level complete
    const requiredObjects = this.levelData.requiredObjects || this.levelData.objects.length;
    if (this.objectsFound >= requiredObjects) {
      this.levelComplete();
    }
  }

  private updateObjectList(foundObject: HiddenObject): void {
    const objectNames = this.levelData.objects.map((obj) => {
      const objInstance = this.hiddenObjects.find((ho) => ho.getKey() === obj.key);
      return objInstance?.isFound() ? `~~${obj.name}~~` : obj.name;
    });

    this.objectListText.setText(`Find: ${objectNames.join(', ')}`);
  }

  private useHint(): void {
    if (this.gameManager.useHint()) {
      // Find first unfound object
      const unfoundObject = this.hiddenObjects.find((obj) => !obj.isFound());
      if (unfoundObject) {
        unfoundObject.showHint();
      }

      this.hintText.setText(`Hints: ${this.gameManager.getHintsRemaining()}`);
    } else {
      // Show "no hints" message
      const noHintsText = this.add.text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        'No hints remaining!',
        {
          font: '32px Arial',
          color: '#ff0000',
        }
      );
      noHintsText.setOrigin(0.5);
      noHintsText.setScrollFactor(0);

      this.time.delayedCall(2000, () => noHintsText.destroy());
    }
  }

  private levelComplete(): void {
    if (this.timer) {
      this.timer.remove();
    }

    // Bonus for remaining time
    if (this.timeRemaining > 0) {
      const timeBonus = this.timeRemaining * 10;
      this.gameManager.addScore(timeBonus);
    }

    this.showCompletionScreen(true);
  }

  private gameOver(success: boolean): void {
    if (this.timer) {
      this.timer.remove();
    }

    this.showCompletionScreen(success);
  }

  private showCompletionScreen(success: boolean): void {
    const { width, height } = this.cameras.main;

    // Overlay
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    overlay.setScrollFactor(0);

    // Result text
    const resultText = this.add.text(
      width / 2,
      height / 2 - 100,
      success ? 'Level Complete!' : 'Time Up!',
      {
        font: 'bold 64px Arial',
        color: success ? '#7ed321' : '#d0021b',
      }
    );
    resultText.setOrigin(0.5);
    resultText.setScrollFactor(0);

    // Score
    const scoreText = this.add.text(
      width / 2,
      height / 2,
      `Final Score: ${this.gameManager.getScore()}`,
      {
        font: '32px Arial',
        color: GameConfig.COLORS.TEXT,
      }
    );
    scoreText.setOrigin(0.5);
    scoreText.setScrollFactor(0);

    // Buttons
    if (success) {
      this.createEndButton(width / 2, height / 2 + 100, 'Next Level', () => {
        this.gameManager.nextLevel();
        this.scene.restart();
      });
    }

    this.createEndButton(
      width / 2,
      height / 2 + (success ? 180 : 100),
      'Main Menu',
      () => {
        this.scene.start(GameConfig.SCENES.MENU);
      }
    );
  }

  private createEndButton(x: number, y: number, text: string, callback: () => void): void {
    const button = this.add.rectangle(x, y, 300, 60, GameConfig.COLORS.PRIMARY);
    button.setInteractive({ useHandCursor: true });
    button.setScrollFactor(0);

    const buttonText = this.add.text(x, y, text, {
      font: '24px Arial',
      color: GameConfig.COLORS.TEXT,
    });
    buttonText.setOrigin(0.5);
    buttonText.setScrollFactor(0);

    button.on('pointerdown', callback);
  }

  shutdown(): void {
    if (this.audioManager) {
      this.audioManager.destroy();
    }
  }
}
