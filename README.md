# Game General Engine

A reusable, TypeScript-based game engine for creating hidden object games with puzzles for mobile platforms (iOS & Android).

Built with **Phaser 3** + **TypeScript** + **Capacitor**

## Features

- **Hidden Object Game System**: Complete framework for creating hidden object levels
- **Puzzle Framework**: Extensible puzzle system with multiple puzzle types
- **Mobile-Ready**: Deploy to iOS and Android via Capacitor
- **TypeScript**: Fully typed for better developer experience
- **Reusable Architecture**: Easy to extend and create new games
- **Asset Management**: Organized structure for game assets
- **Game State Management**: Built-in score, level, and hint systems

## Tech Stack

- **Phaser 3**: HTML5 game framework
- **TypeScript**: Type-safe JavaScript
- **Webpack**: Module bundler
- **Capacitor**: Native mobile deployment
- **Node.js**: Development environment

## Project Structure

```
game-general-engine/
├── src/
│   ├── index.ts              # Entry point
│   ├── index.html            # HTML template
│   ├── config/
│   │   └── GameConfig.ts     # Global configuration
│   ├── core/
│   │   ├── GameManager.ts    # Game state management
│   │   ├── AudioManager.ts   # Audio handling
│   │   └── LevelData.ts      # Level definitions
│   ├── scenes/
│   │   ├── BootScene.ts      # Loading screen
│   │   ├── MenuScene.ts      # Main menu
│   │   ├── HiddenObjectScene.ts  # Hidden object gameplay
│   │   └── PuzzleScene.ts    # Puzzle demos
│   ├── objects/
│   │   └── HiddenObject.ts   # Hidden object class
│   ├── puzzles/
│   │   ├── BasePuzzle.ts     # Base puzzle class
│   │   ├── MatchingPuzzle.ts # Match pairs puzzle
│   │   └── SequencePuzzle.ts # Order sequence puzzle
│   ├── utils/
│   │   └── StorageManager.ts # Local storage utilities
│   └── assets/               # Game assets (images, audio, etc.)
├── package.json
├── tsconfig.json
├── webpack.config.js
└── capacitor.config.ts
```

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

1. Clone the repository:
```bash
git clone git@github.com:bhavant/gameGeneral.git
cd gameGeneral
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the development server:
```bash
npm run dev
```

Open your browser to `http://localhost:8080`

### Build for Production

Build the web version:
```bash
npm run build
```

## Mobile Deployment

### Android

1. Build the web app:
```bash
npm run build
```

2. Initialize Capacitor (first time only):
```bash
npx cap add android
```

3. Sync and open Android Studio:
```bash
npm run android
```

4. Build and run from Android Studio

### iOS

1. Build the web app:
```bash
npm run build
```

2. Initialize Capacitor (first time only):
```bash
npx cap add ios
```

3. Sync and open Xcode:
```bash
npm run ios
```

4. Build and run from Xcode (requires macOS)

## Creating Your First Game

### 1. Add Levels

Edit `src/core/LevelData.ts`:

```typescript
export const LEVELS: LevelData[] = [
  {
    id: 1,
    name: 'My First Level',
    background: 'level1-bg', // Optional background image key
    objects: [
      { key: 'obj1', name: 'Book', x: 300, y: 400, scale: 0.5 },
      { key: 'obj2', name: 'Key', x: 800, y: 500, scale: 0.5 },
      // Add more objects...
    ],
    timeLimit: 120, // seconds
  },
  // Add more levels...
];
```

### 2. Add Assets

Place your assets in `src/assets/`:
- `src/assets/images/` - Images and sprites
- `src/assets/audio/` - Sound effects and music
- `src/assets/fonts/` - Custom fonts

Load them in `BootScene.ts`:
```typescript
preload(): void {
  this.load.image('background', 'assets/images/background.png');
  this.load.audio('bgMusic', 'assets/audio/music.mp3');
}
```

### 3. Create Custom Puzzles

Extend the `BasePuzzle` class:

```typescript
import { BasePuzzle } from '@puzzles/BasePuzzle';

export class MyCustomPuzzle extends BasePuzzle {
  initialize(): void {
    // Setup your puzzle
  }

  checkSolution(): boolean {
    // Check if solved
    return true;
  }

  reset(): void {
    // Reset puzzle state
  }

  showHint(): void {
    // Provide hint to player
  }
}
```

## Core Classes

### GameManager

Singleton for managing game state:
```typescript
const gameManager = GameManager.getInstance();
gameManager.addScore(100);
gameManager.nextLevel();
gameManager.useHint();
```

### AudioManager

Handle game audio:
```typescript
const audioManager = new AudioManager(this);
audioManager.playMusic('bgMusic');
audioManager.playSFX('click');
```

### HiddenObject

Interactive objects to find:
```typescript
const obj = new HiddenObject(this, {
  key: 'book',
  name: 'Book',
  x: 300,
  y: 400,
  scale: 0.5,
  texture: 'book-sprite',
});

obj.onFound(() => {
  console.log('Object found!');
});
```

## Customization

### Game Configuration

Edit `src/config/GameConfig.ts`:
```typescript
export class GameConfig {
  static readonly WIDTH = 1920;
  static readonly HEIGHT = 1080;
  static readonly HINT_COOLDOWN = 30000;
  static readonly MAX_HINTS = 3;
  // ... more settings
}
```

### Scenes

The engine uses these scenes:
- **BootScene**: Initial loading
- **MenuScene**: Main menu
- **HiddenObjectScene**: Hidden object gameplay
- **PuzzleScene**: Puzzle demonstrations

Add your own scenes by extending `Phaser.Scene`.

## Puzzle Types Included

1. **Matching Puzzle**: Match pairs of items
2. **Sequence Puzzle**: Arrange items in correct order

Create your own by extending `BasePuzzle`!

## Integration with Audio Services

The engine supports external audio services like [Melodie](https://melod.ie/). Add your audio files to `src/assets/audio/` and load them in the BootScene.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run type-check` - Check TypeScript types
- `npm run android` - Build and open Android project
- `npm run ios` - Build and open iOS project

## Contributing

This is a personal project by Bhavan T Channira. Feel free to fork and adapt for your own games!

## License

MIT License - feel free to use this engine for your own projects.

## Contact

- **Email**: bhavant@gmail.com
- **GitHub**: [@bhavant](https://github.com/bhavant)
- **LinkedIn**: [bhavanthimmaiah](https://www.linkedin.com/in/bhavanthimmaiah/)

## Roadmap

- [ ] More puzzle types (Jigsaw, Sliding, etc.)
- [ ] Achievement system
- [ ] Leaderboard integration
- [ ] Save/Load game progress
- [ ] More example levels
- [ ] Asset templates and guidelines
- [ ] Level editor

---

**Built with ❤️ using TypeScript, Phaser, and Capacitor**
