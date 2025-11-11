# Architecture Documentation

## Overview

The Game General Engine is built with a modular, extensible architecture that makes it easy to create multiple hidden object games with different puzzle types.

## Core Principles

1. **Separation of Concerns**: Each component has a single, well-defined responsibility
2. **Reusability**: Core systems can be reused across different games
3. **Extensibility**: Easy to add new puzzle types, scenes, and game mechanics
4. **Type Safety**: Full TypeScript support for better developer experience

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                   Entry Point                       │
│                   (index.ts)                        │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              Phaser Game Instance                   │
│              (Game Configuration)                   │
└──────┬──────────────────────────────────────┬───────┘
       │                                      │
       ▼                                      ▼
┌─────────────┐                      ┌──────────────┐
│   Scenes    │                      │   Managers   │
├─────────────┤                      ├──────────────┤
│ BootScene   │◄─────────────────────┤ GameManager  │
│ MenuScene   │                      │ AudioManager │
│ HiddenObject│                      └──────────────┘
│ PuzzleScene │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐        ┌─────────────────┐
│   Game Objects      │        │    Puzzles      │
├─────────────────────┤        ├─────────────────┤
│  HiddenObject       │        │  BasePuzzle     │
│                     │        │  MatchingPuzzle │
│                     │        │  SequencePuzzle │
└─────────────────────┘        └─────────────────┘
```

## Module Breakdown

### 1. Configuration Layer (`/config`)

**Purpose**: Centralized game settings and constants

- `GameConfig.ts`: Global configuration values
  - Display settings (resolution, scaling)
  - Gameplay parameters (hints, timers)
  - Scene keys
  - Color schemes

**Why it matters**: Single source of truth for all configuration, making it easy to adjust game behavior without touching multiple files.

### 2. Core Systems (`/core`)

**Purpose**: Foundation systems that manage game state and behavior

#### GameManager (Singleton)
- **Responsibility**: Central game state management
- **Functions**:
  - Score tracking
  - Level progression
  - Hint management
  - Game state persistence

**Pattern**: Singleton ensures only one instance exists across all scenes

#### AudioManager
- **Responsibility**: All audio playback and control
- **Functions**:
  - Music management (play, pause, stop)
  - Sound effects playback
  - Volume control
  - Resource cleanup

**Pattern**: Instantiated per scene for proper lifecycle management

#### LevelData
- **Responsibility**: Level definitions and data structures
- **Functions**:
  - Level configuration
  - Object placement data
  - Level metadata

**Pattern**: Data-driven design - levels are defined as JSON-like structures

### 3. Scenes (`/scenes`)

**Purpose**: Game screens and gameplay loops

#### Scene Hierarchy

```
Phaser.Scene (base)
    │
    ├── BootScene: Initial loading
    │   └── Loads assets, shows progress
    │
    ├── MenuScene: Main menu
    │   └── Navigation to game modes
    │
    ├── HiddenObjectScene: Core gameplay
    │   ├── Manages hidden objects
    │   ├── Timer and scoring
    │   └── Win/lose conditions
    │
    └── PuzzleScene: Puzzle demonstrations
        └── Showcases puzzle types
```

**Scene Lifecycle**:
1. `preload()`: Load assets
2. `create()`: Setup game objects
3. `update()`: Game loop (60fps)
4. `shutdown()`: Cleanup

### 4. Game Objects (`/objects`)

**Purpose**: Interactive game entities

#### HiddenObject
- **Extends**: `Phaser.GameObjects.Container`
- **Responsibilities**:
  - Visual representation
  - Click detection
  - Found state management
  - Animations

**Key Features**:
- Self-contained logic
- Event-driven (callbacks)
- Reusable across levels

### 5. Puzzle System (`/puzzles`)

**Purpose**: Extensible puzzle framework

#### Class Hierarchy

```
BasePuzzle (abstract)
    │
    ├── MatchingPuzzle
    │   └── Match pairs of items
    │
    └── SequencePuzzle
        └── Arrange in correct order
```

#### Base Puzzle Interface

```typescript
abstract class BasePuzzle {
  abstract initialize(): void;
  abstract checkSolution(): boolean;
  abstract reset(): void;
  abstract showHint(): void;
  protected markComplete(): void;
}
```

**Pattern**: Template Method - defines skeleton, subclasses fill in details

**Adding New Puzzles**:
1. Extend `BasePuzzle`
2. Implement required methods
3. Add to `PuzzleScene` or game flow

### 6. Utilities (`/utils`)

**Purpose**: Helper functions and utilities

#### StorageManager
- **Responsibility**: Browser localStorage abstraction
- **Functions**:
  - Save/load game data
  - Key namespacing
  - Error handling

## Data Flow

### Hidden Object Game Flow

```
User clicks "Play"
    │
    ▼
MenuScene → HiddenObjectScene
    │
    ├──> Load level data
    │
    ├──> Create hidden objects
    │
    ├──> Setup UI (score, timer, hints)
    │
    └──> Start game loop
         │
         └──> User finds objects
              │
              ├──> Update score (GameManager)
              │
              ├──> Play SFX (AudioManager)
              │
              └──> Check win condition
                   │
                   ├──> All found → Level complete
                   └──> Time up → Game over
```

### Puzzle Flow

```
User selects puzzle
    │
    ▼
Create puzzle instance
    │
    ├──> initialize()
    │
    └──> Setup interactive elements
         │
         └──> User interacts
              │
              ├──> Update puzzle state
              │
              └──> checkSolution()
                   │
                   └──> Complete → markComplete()
                        │
                        └──> Trigger onComplete callback
```

## State Management

### Game State (GameManager)
```typescript
{
  currentLevel: number,
  score: number,
  hintsRemaining: number
}
```

**Persistence**: Can be saved to localStorage via StorageManager

### Scene State
Each scene manages its own local state:
- UI elements
- Active game objects
- Timers and events

## Extension Points

### Adding New Puzzle Types

1. Create new class in `/puzzles`:
```typescript
export class MyPuzzle extends BasePuzzle {
  initialize() { /* Setup */ }
  checkSolution() { /* Logic */ }
  reset() { /* Reset */ }
  showHint() { /* Hint */ }
}
```

2. Use in any scene:
```typescript
const puzzle = new MyPuzzle(this, x, y);
puzzle.onComplete(() => { /* Handler */ });
```

### Adding New Scenes

1. Create scene class:
```typescript
export class MyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MyScene' });
  }

  create() { /* Setup */ }
}
```

2. Register in `index.ts`:
```typescript
scene: [BootScene, MenuScene, MyScene]
```

3. Navigate to it:
```typescript
this.scene.start('MyScene');
```

### Adding New Game Mechanics

Create new managers similar to `GameManager`:
```typescript
export class AchievementManager {
  private static instance: AchievementManager;

  static getInstance(): AchievementManager {
    // Singleton pattern
  }

  // Achievement logic
}
```

## Performance Considerations

1. **Object Pooling**: For frequently created/destroyed objects
2. **Asset Loading**: Preload in BootScene to avoid runtime delays
3. **Event Cleanup**: Always remove listeners in `shutdown()`
4. **Memory Management**: Destroy unused objects

## Best Practices

1. **Type Everything**: Use TypeScript types for all data structures
2. **Composition Over Inheritance**: Prefer small, focused components
3. **Event-Driven**: Use callbacks for loose coupling
4. **Data-Driven**: Define levels/puzzles as data, not code
5. **Scene Isolation**: Each scene should be self-contained

## Mobile Considerations

1. **Touch Events**: All interactions support touch
2. **Responsive Design**: Uses Phaser's scaling manager
3. **Performance**: Optimized for mobile GPUs
4. **Asset Size**: Compress images and audio for mobile

## Future Architecture Improvements

- [ ] Entity-Component-System (ECS) pattern
- [ ] State machine for game flow
- [ ] Dependency injection container
- [ ] Event bus for global events
- [ ] Asset loading manager with progress
- [ ] Localization system
