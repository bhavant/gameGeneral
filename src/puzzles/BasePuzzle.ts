import Phaser from 'phaser';

/**
 * BasePuzzle - Abstract base class for all puzzle types
 */
export abstract class BasePuzzle extends Phaser.GameObjects.Container {
  protected completed: boolean = false;
  protected onCompleteCallback?: () => void;
  protected difficulty: 'easy' | 'medium' | 'hard';

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ) {
    super(scene, x, y);
    this.difficulty = difficulty;
    scene.add.existing(this);
  }

  /**
   * Initialize the puzzle - must be implemented by subclasses
   */
  abstract initialize(): void;

  /**
   * Check if the puzzle is solved - must be implemented by subclasses
   */
  abstract checkSolution(): boolean;

  /**
   * Reset the puzzle to initial state
   */
  abstract reset(): void;

  /**
   * Provide a hint to the player
   */
  abstract showHint(): void;

  /**
   * Mark puzzle as complete
   */
  protected markComplete(): void {
    if (this.completed) return;

    this.completed = true;

    if (this.onCompleteCallback) {
      this.onCompleteCallback();
    }
  }

  /**
   * Set callback for when puzzle is completed
   */
  onComplete(callback: () => void): void {
    this.onCompleteCallback = callback;
  }

  /**
   * Check if puzzle is completed
   */
  isCompleted(): boolean {
    return this.completed;
  }

  /**
   * Get puzzle difficulty
   */
  getDifficulty(): string {
    return this.difficulty;
  }
}
