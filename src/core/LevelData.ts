import { HiddenObjectConfig } from '@objects/HiddenObject';

/**
 * Level data structure
 */
export interface LevelData {
  id: number;
  name: string;
  background?: string;
  objects: HiddenObjectConfig[];
  timeLimit?: number; // in seconds
  requiredObjects?: number; // number of objects needed to complete
}

/**
 * Example level configurations
 * In a real game, this would be loaded from JSON files
 */
export const LEVELS: LevelData[] = [
  {
    id: 1,
    name: 'The Living Room',
    objects: [
      { key: 'book', name: 'Book', x: 300, y: 400, scale: 0.5 },
      { key: 'cup', name: 'Cup', x: 800, y: 500, scale: 0.5 },
      { key: 'key', name: 'Key', x: 1200, y: 300, scale: 0.5 },
      { key: 'phone', name: 'Phone', x: 600, y: 700, scale: 0.5 },
      { key: 'watch', name: 'Watch', x: 1400, y: 600, scale: 0.5 },
    ],
    timeLimit: 120,
  },
  {
    id: 2,
    name: 'The Garden',
    objects: [
      { key: 'flower', name: 'Flower', x: 400, y: 600, scale: 0.5 },
      { key: 'shovel', name: 'Shovel', x: 1000, y: 400, scale: 0.5 },
      { key: 'butterfly', name: 'Butterfly', x: 700, y: 200, scale: 0.5 },
      { key: 'watering-can', name: 'Watering Can', x: 1300, y: 700, scale: 0.5 },
      { key: 'gnome', name: 'Garden Gnome', x: 500, y: 800, scale: 0.5 },
      { key: 'bird', name: 'Bird', x: 1100, y: 300, scale: 0.5 },
    ],
    timeLimit: 150,
  },
];

/**
 * Get level data by ID
 */
export function getLevelData(levelId: number): LevelData | undefined {
  return LEVELS.find((level) => level.id === levelId);
}

/**
 * Get total number of levels
 */
export function getTotalLevels(): number {
  return LEVELS.length;
}
