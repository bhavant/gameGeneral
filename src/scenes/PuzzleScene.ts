import Phaser from 'phaser';
import { GameConfig } from '@config/GameConfig';
import { MatchingPuzzle } from '@puzzles/MatchingPuzzle';
import { SequencePuzzle } from '@puzzles/SequencePuzzle';
import { BasePuzzle } from '@puzzles/BasePuzzle';

/**
 * PuzzleScene - Demo scene showing different puzzle types
 */
export class PuzzleScene extends Phaser.Scene {
  private currentPuzzle?: BasePuzzle;

  constructor() {
    super({ key: GameConfig.SCENES.PUZZLE });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x2c3e50);

    // Title
    const title = this.add.text(width / 2, 50, 'Puzzle Demo', {
      font: 'bold 48px Arial',
      color: GameConfig.COLORS.TEXT,
    });
    title.setOrigin(0.5);

    // Instructions
    const instructions = this.add.text(
      width / 2,
      120,
      'Select a puzzle type to try:',
      {
        font: '24px Arial',
        color: GameConfig.COLORS.TEXT,
      }
    );
    instructions.setOrigin(0.5);

    // Puzzle type buttons
    this.createButton(
      width / 2 - 250,
      200,
      'Matching Puzzle',
      () => this.loadMatchingPuzzle()
    );

    this.createButton(
      width / 2 + 250,
      200,
      'Sequence Puzzle',
      () => this.loadSequencePuzzle()
    );

    // Back to menu button
    this.createButton(50, height - 50, 'Menu', () => {
      this.scene.start(GameConfig.SCENES.MENU);
    });
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    callback: () => void
  ): void {
    const button = this.add.rectangle(x, y, 200, 60, GameConfig.COLORS.PRIMARY);
    button.setInteractive({ useHandCursor: true });

    const buttonText = this.add.text(x, y, text, {
      font: '20px Arial',
      color: GameConfig.COLORS.TEXT,
    });
    buttonText.setOrigin(0.5);

    button.on('pointerover', () => {
      button.setFillStyle(0x5fa3f5);
    });

    button.on('pointerout', () => {
      button.setFillStyle(GameConfig.COLORS.PRIMARY);
    });

    button.on('pointerdown', callback);
  }

  private loadMatchingPuzzle(): void {
    this.clearCurrentPuzzle();

    const pairs = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig'];

    this.currentPuzzle = new MatchingPuzzle(
      this,
      this.cameras.main.width / 2 - 250,
      300,
      pairs,
      'medium'
    );

    this.currentPuzzle.onComplete(() => {
      this.showCompletionMessage('Matching Puzzle Complete!');
    });
  }

  private loadSequencePuzzle(): void {
    this.clearCurrentPuzzle();

    const sequence = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];

    this.currentPuzzle = new SequencePuzzle(
      this,
      this.cameras.main.width / 2 - 350,
      300,
      sequence,
      'medium'
    );

    this.currentPuzzle.onComplete(() => {
      this.showCompletionMessage('Sequence Puzzle Complete!');
    });
  }

  private clearCurrentPuzzle(): void {
    if (this.currentPuzzle) {
      this.currentPuzzle.destroy();
      this.currentPuzzle = undefined;
    }
  }

  private showCompletionMessage(message: string): void {
    const { width, height } = this.cameras.main;

    const completionText = this.add.text(width / 2, height - 150, message, {
      font: 'bold 32px Arial',
      color: '#7ed321',
    });
    completionText.setOrigin(0.5);

    this.time.delayedCall(3000, () => {
      completionText.destroy();
    });
  }
}
