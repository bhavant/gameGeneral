import Phaser from 'phaser';
import { BasePuzzle } from './BasePuzzle';
import { GameConfig } from '@config/GameConfig';

interface MatchPair {
  id: string;
  value: string;
  matched: boolean;
}

/**
 * MatchingPuzzle - Match pairs of items
 */
export class MatchingPuzzle extends BasePuzzle {
  private pairs: MatchPair[] = [];
  private cards: Phaser.GameObjects.Container[] = [];
  private selectedCard?: Phaser.GameObjects.Container;
  private selectedPair?: MatchPair;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    pairData: string[],
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ) {
    super(scene, x, y, difficulty);

    // Create pairs
    pairData.forEach((value, index) => {
      this.pairs.push(
        { id: `${index}-a`, value, matched: false },
        { id: `${index}-b`, value, matched: false }
      );
    });

    // Shuffle pairs
    this.shuffleArray(this.pairs);
    this.initialize();
  }

  initialize(): void {
    const gridCols = 4;
    const cardWidth = 100;
    const cardHeight = 120;
    const spacing = 20;

    this.pairs.forEach((pair, index) => {
      const col = index % gridCols;
      const row = Math.floor(index / gridCols);

      const cardX = col * (cardWidth + spacing);
      const cardY = row * (cardHeight + spacing);

      const card = this.createCard(cardX, cardY, cardWidth, cardHeight, pair);
      this.cards.push(card);
      this.add(card);
    });
  }

  private createCard(
    x: number,
    y: number,
    width: number,
    height: number,
    pair: MatchPair
  ): Phaser.GameObjects.Container {
    const card = this.scene.add.container(x, y);

    // Card background
    const bg = this.scene.add.rectangle(0, 0, width, height, 0x3498db);
    bg.setStrokeStyle(2, 0x2c3e50);

    // Card text (hidden initially)
    const text = this.scene.add.text(0, 0, pair.value, {
      font: '18px Arial',
      color: GameConfig.COLORS.TEXT,
      align: 'center',
      wordWrap: { width: width - 10 },
    });
    text.setOrigin(0.5);
    text.setVisible(false);

    card.add([bg, text]);
    card.setSize(width, height);
    card.setData('pair', pair);
    card.setData('bg', bg);
    card.setData('text', text);
    card.setData('revealed', false);

    // Make interactive
    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerdown', () => this.onCardClick(card));

    return card;
  }

  private onCardClick(card: Phaser.GameObjects.Container): void {
    const pair = card.getData('pair') as MatchPair;

    if (pair.matched || card.getData('revealed')) {
      return;
    }

    // Reveal card
    this.revealCard(card);

    if (!this.selectedCard) {
      // First card selected
      this.selectedCard = card;
      this.selectedPair = pair;
    } else {
      // Second card selected - check for match
      if (this.selectedPair && this.selectedPair.value === pair.value) {
        // Match found!
        this.onMatchFound(this.selectedCard, card);
      } else {
        // No match - hide both cards after delay
        this.scene.time.delayedCall(1000, () => {
          this.hideCard(this.selectedCard!);
          this.hideCard(card);
        });
      }

      this.selectedCard = undefined;
      this.selectedPair = undefined;
    }
  }

  private revealCard(card: Phaser.GameObjects.Container): void {
    const text = card.getData('text') as Phaser.GameObjects.Text;
    text.setVisible(true);
    card.setData('revealed', true);
  }

  private hideCard(card: Phaser.GameObjects.Container): void {
    const text = card.getData('text') as Phaser.GameObjects.Text;
    text.setVisible(false);
    card.setData('revealed', false);
  }

  private onMatchFound(card1: Phaser.GameObjects.Container, card2: Phaser.GameObjects.Container): void {
    const pair1 = card1.getData('pair') as MatchPair;
    const pair2 = card2.getData('pair') as MatchPair;

    pair1.matched = true;
    pair2.matched = true;

    // Visual feedback
    const bg1 = card1.getData('bg') as Phaser.GameObjects.Rectangle;
    const bg2 = card2.getData('bg') as Phaser.GameObjects.Rectangle;

    bg1.setFillStyle(GameConfig.COLORS.SUCCESS);
    bg2.setFillStyle(GameConfig.COLORS.SUCCESS);

    // Check if all matched
    if (this.checkSolution()) {
      this.markComplete();
    }
  }

  checkSolution(): boolean {
    return this.pairs.every((pair) => pair.matched);
  }

  reset(): void {
    this.pairs.forEach((pair) => (pair.matched = false));
    this.cards.forEach((card) => card.destroy());
    this.cards = [];
    this.selectedCard = undefined;
    this.selectedPair = undefined;
    this.completed = false;

    this.shuffleArray(this.pairs);
    this.initialize();
  }

  showHint(): void {
    // Find first unmatched pair
    const unmatchedValue = this.pairs.find((p) => !p.matched)?.value;
    if (!unmatchedValue) return;

    // Highlight both cards with this value briefly
    this.cards.forEach((card) => {
      const pair = card.getData('pair') as MatchPair;
      if (pair.value === unmatchedValue && !pair.matched) {
        const bg = card.getData('bg') as Phaser.GameObjects.Rectangle;
        const originalColor = bg.fillColor;

        bg.setFillStyle(0xffff00);
        this.scene.time.delayedCall(1000, () => {
          bg.setFillStyle(originalColor);
        });
      }
    });
  }

  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
