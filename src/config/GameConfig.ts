/**
 * Global game configuration
 */
export class GameConfig {
  // Display settings
  static readonly WIDTH = 1920;
  static readonly HEIGHT = 1080;

  // Game settings
  static readonly HINT_COOLDOWN = 30000; // 30 seconds
  static readonly MAX_HINTS = 3;

  // Scene keys
  static readonly SCENES = {
    BOOT: 'BootScene',
    MENU: 'MenuScene',
    HIDDEN_OBJECT: 'HiddenObjectScene',
    PUZZLE: 'PuzzleScene',
  };

  // Audio settings
  static readonly AUDIO = {
    MUSIC_VOLUME: 0.5,
    SFX_VOLUME: 0.7,
  };

  // Colors
  static readonly COLORS = {
    PRIMARY: 0x4a90e2,
    SUCCESS: 0x7ed321,
    ERROR: 0xd0021b,
    TEXT: '#FFFFFF',
    BACKGROUND: '#1a1a1a',
  };
}
