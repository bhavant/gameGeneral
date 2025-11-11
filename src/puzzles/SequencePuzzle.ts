import Phaser from 'phaser';
import { BasePuzzle } from './BasePuzzle';
import { GameConfig } from '@config/GameConfig';

/**
 * SequencePuzzle - Arrange items in correct order
 */
export class SequencePuzzle extends BasePuzzle {
  private sequence: string[];
  private currentOrder: string[];
  private items: Phaser.GameObjects.Container[] = [];
  private draggedItem?: Phaser.GameObjects.Container;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    correctSequence: string[],
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ) {
    super(scene, x, y, difficulty);

    this.sequence = [...correctSequence];
    this.currentOrder = [...correctSequence];
    this.shuffleArray(this.currentOrder);
    this.initialize();
  }

  initialize(): void {
    const itemWidth = 120;
    const itemHeight = 80;
    const spacing = 20;

    this.currentOrder.forEach((value, index) => {
      const itemX = index * (itemWidth + spacing);
      const item = this.createItem(itemX, 0, itemWidth, itemHeight, value, index);
      this.items.push(item);
      this.add(item);
    });
  }

  private createItem(
    x: number,
    y: number,
    width: number,
    height: number,
    value: string,
    index: number
  ): Phaser.GameObjects.Container {
    const item = this.scene.add.container(x, y);

    // Item background
    const bg = this.scene.add.rectangle(0, 0, width, height, 0x9b59b6);
    bg.setStrokeStyle(2, 0x8e44ad);

    // Item text
    const text = this.scene.add.text(0, 0, value, {
      font: 'bold 20px Arial',
      color: GameConfig.COLORS.TEXT,
      align: 'center',
      wordWrap: { width: width - 10 },
    });
    text.setOrigin(0.5);

    item.add([bg, text]);
    item.setSize(width, height);
    item.setData('value', value);
    item.setData('index', index);
    item.setData('bg', bg);
    item.setData('originalX', x);

    // Make draggable
    bg.setInteractive({ useHandCursor: true });
    this.scene.input.setDraggable(bg);

    bg.on('dragstart', () => {
      this.draggedItem = item;
      item.setScale(1.1);
      (bg as Phaser.GameObjects.Rectangle).setStrokeStyle(3, 0xffffff);
    });

    bg.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
      item.x = dragX;
      item.y = dragY;
    });

    bg.on('dragend', () => {
      item.setScale(1);
      (bg as Phaser.GameObjects.Rectangle).setStrokeStyle(2, 0x8e44ad);
      this.onDragEnd(item);
    });

    return item;
  }

  private onDragEnd(item: Phaser.GameObjects.Container): void {
    // Find closest position
    const itemWidth = 120;
    const spacing = 20;
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < this.items.length; i++) {
      const targetX = i * (itemWidth + spacing);
      const distance = Math.abs(item.x - targetX);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    // Swap items
    const currentIndex = item.getData('index');
    if (currentIndex !== closestIndex) {
      this.swapItems(currentIndex, closestIndex);
    } else {
      // Return to original position
      this.scene.tweens.add({
        targets: item,
        x: item.getData('originalX'),
        y: 0,
        duration: 200,
        ease: 'Power2',
      });
    }

    // Check solution
    if (this.checkSolution()) {
      this.markComplete();
      this.showSuccessAnimation();
    }
  }

  private swapItems(index1: number, index2: number): void {
    const item1 = this.items[index1];
    const item2 = this.items[index2];

    // Swap in array
    [this.items[index1], this.items[index2]] = [this.items[index2], this.items[index1]];
    [this.currentOrder[index1], this.currentOrder[index2]] = [
      this.currentOrder[index2],
      this.currentOrder[index1],
    ];

    // Update indices
    item1.setData('index', index2);
    item2.setData('index', index1);

    // Animate to new positions
    const itemWidth = 120;
    const spacing = 20;

    this.scene.tweens.add({
      targets: item1,
      x: index2 * (itemWidth + spacing),
      y: 0,
      duration: 200,
      ease: 'Power2',
    });

    this.scene.tweens.add({
      targets: item2,
      x: index1 * (itemWidth + spacing),
      y: 0,
      duration: 200,
      ease: 'Power2',
    });

    // Update original X positions
    item1.setData('originalX', index2 * (itemWidth + spacing));
    item2.setData('originalX', index1 * (itemWidth + spacing));
  }

  checkSolution(): boolean {
    return this.currentOrder.every((value, index) => value === this.sequence[index]);
  }

  reset(): void {
    this.items.forEach((item) => item.destroy());
    this.items = [];
    this.currentOrder = [...this.sequence];
    this.shuffleArray(this.currentOrder);
    this.completed = false;
    this.initialize();
  }

  showHint(): void {
    // Highlight first incorrectly placed item
    for (let i = 0; i < this.currentOrder.length; i++) {
      if (this.currentOrder[i] !== this.sequence[i]) {
        const item = this.items[i];
        const bg = item.getData('bg') as Phaser.GameObjects.Rectangle;

        bg.setFillStyle(0xff6b6b);
        this.scene.time.delayedCall(1000, () => {
          bg.setFillStyle(0x9b59b6);
        });
        break;
      }
    }
  }

  private showSuccessAnimation(): void {
    this.items.forEach((item) => {
      const bg = item.getData('bg') as Phaser.GameObjects.Rectangle;
      bg.setFillStyle(GameConfig.COLORS.SUCCESS);
    });
  }

  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
