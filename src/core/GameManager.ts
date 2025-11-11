/**
 * GameManager - Singleton class to manage game state
 */
export class GameManager {
  private static instance: GameManager;
  private currentLevel: number = 1;
  private score: number = 0;
  private hintsRemaining: number = 3;

  private constructor() {}

  static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  // Score management
  addScore(points: number): void {
    this.score += points;
  }

  getScore(): number {
    return this.score;
  }

  resetScore(): void {
    this.score = 0;
  }

  // Level management
  getCurrentLevel(): number {
    return this.currentLevel;
  }

  nextLevel(): void {
    this.currentLevel++;
  }

  setLevel(level: number): void {
    this.currentLevel = level;
  }

  // Hints management
  useHint(): boolean {
    if (this.hintsRemaining > 0) {
      this.hintsRemaining--;
      return true;
    }
    return false;
  }

  getHintsRemaining(): number {
    return this.hintsRemaining;
  }

  resetHints(count: number = 3): void {
    this.hintsRemaining = count;
  }

  // Game state
  reset(): void {
    this.currentLevel = 1;
    this.score = 0;
    this.hintsRemaining = 3;
  }
}
