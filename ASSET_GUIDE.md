# Asset Creation & Integration Guide

## Quick Start: Get Your First Assets

### Option 1: Use Free Assets (Fastest)

1. **Visit Kenney.nl** (best free assets)
   - Go to https://kenney.nl/assets
   - Download "Hidden Objects Pack" or similar
   - Extract to `src/assets/images/`

2. **For Audio:**
   - Visit https://freesound.org
   - Search for: "click", "success", "background music"
   - Download as MP3
   - Place in `src/assets/audio/`

### Option 2: Create Your Own Assets

#### Creating Hidden Object Sprites

1. **Using GIMP (Free):**
   ```
   1. Download GIMP: https://www.gimp.org
   2. Create new image: 300x300px
   3. Draw your object
   4. Layer → Transparency → Add Alpha Channel
   5. Select background → Delete (makes transparent)
   6. Export as PNG
   7. Save to: src/assets/images/objects/book.png
   ```

2. **Using AI (Fastest):**
   ```
   1. Use ChatGPT/DALL-E or Midjourney
   2. Prompt: "simple book icon, transparent background, game asset, top-down view"
   3. Download image
   4. Use remove.bg to remove background if needed
   5. Save to: src/assets/images/objects/book.png
   ```

#### Creating Backgrounds

1. **Simple Solid Colors:**
   - Just use hex colors in code (already working)

2. **Image Backgrounds:**
   ```
   1. Find/create 1920x1080 image
   2. Save as: src/assets/images/backgrounds/room1.png
   3. Compress using TinyPNG.com
   ```

#### Creating UI Elements

1. **Buttons:**
   - Size: 400x80px (as per your current code)
   - Can be simple rectangles with gradients
   - Use Figma (free) or Photopea for design

## Asset Organization

```
src/assets/
├── images/
│   ├── objects/          # Hidden objects
│   │   ├── book.png
│   │   ├── key.png
│   │   └── cup.png
│   ├── backgrounds/      # Scene backgrounds
│   │   ├── room1.png
│   │   └── garden.png
│   ├── characters/       # Character portraits
│   │   └── detective.png
│   └── ui/              # UI elements
│       ├── button.png
│       └── hint-icon.png
├── audio/
│   ├── music/
│   │   └── background.mp3
│   └── sfx/
│       ├── click.mp3
│       ├── found.mp3
│       └── success.mp3
└── fonts/               # Custom fonts (optional)
    └── game-font.ttf
```

## Loading Assets in Code

### 1. Add to BootScene.ts:

```typescript
preload(): void {
  this.createLoadingScreen();

  // Load hidden object sprites
  this.load.image('book', 'assets/images/objects/book.png');
  this.load.image('key', 'assets/images/objects/key.png');
  this.load.image('cup', 'assets/images/objects/cup.png');

  // Load backgrounds
  this.load.image('room1-bg', 'assets/images/backgrounds/room1.png');
  this.load.image('garden-bg', 'assets/images/backgrounds/garden.png');

  // Load audio
  this.load.audio('bgMusic', 'assets/audio/music/background.mp3');
  this.load.audio('clickSfx', 'assets/audio/sfx/click.mp3');
  this.load.audio('foundSfx', 'assets/audio/sfx/found.mp3');
}
```

### 2. Update LevelData.ts:

```typescript
export const LEVELS: LevelData[] = [
  {
    id: 1,
    name: 'The Living Room',
    background: 'room1-bg', // Now it will show the image!
    objects: [
      { key: 'book', name: 'Book', x: 300, y: 400, scale: 0.5, texture: 'book' },
      { key: 'key', name: 'Key', x: 800, y: 500, scale: 0.5, texture: 'key' },
    ],
    timeLimit: 120,
  },
];
```

## Asset Specifications

### Images
- **Format:** PNG (supports transparency)
- **Color Mode:** RGBA (RGB + Alpha channel)
- **Resolution:**
  - Hidden Objects: 200-400px square
  - Backgrounds: 1920x1080
  - UI Elements: Variable, but keep under 512px
- **File Size:** Compress! Keep under 500KB per image

### Audio
- **Format:** MP3 or OGG
- **Sample Rate:** 44.1kHz
- **Bitrate:** 128kbps (music), 64kbps (SFX)
- **Length:**
  - Background Music: 1-3 minutes (loopable)
  - SFX: 0.5-2 seconds

### Sprite Sheets (for animations)
- Use TexturePacker or similar tools
- Export as JSON + PNG
- Phaser can load these directly

## Asset Optimization

### Before Using Assets:

1. **Compress Images:**
   - Use TinyPNG.com (online, free)
   - Or use ImageOptim (Mac) / FileOptimizer (Windows)

2. **Compress Audio:**
   - Use Audacity to export at lower bitrates
   - Use online MP3 compressors

3. **Test on Mobile:**
   - Make sure assets load quickly
   - Test on slower connections

## AI-Generated Asset Workflow

### Using ChatGPT/DALL-E:

```
Prompts that work well:
- "game asset, simple [object], top-down view, white background, flat design"
- "2D game sprite, [object], cartoon style, transparent background"
- "hidden object game item, [object], detailed, isolated"
```

### Post-Processing AI Images:
1. Download from AI tool
2. Go to remove.bg → remove background
3. Open in GIMP/Photopea → adjust size/colors
4. Export as PNG
5. Compress with TinyPNG

## Style Consistency Tips

1. **Pick a style and stick to it:**
   - Pixel art
   - Hand-drawn
   - Realistic
   - Cartoon/flat design

2. **Color palette:**
   - Use Adobe Color or Coolors.co
   - Keep 3-5 main colors
   - Use consistent shading

3. **Size/scale:**
   - Keep all objects roughly same detail level
   - Scale in code, not by creating different sizes

## Recommended Workflow

**For beginners:**
1. Start with free assets from Kenney.nl
2. Replace with AI-generated assets
3. Eventually commission an artist or learn to create your own

**For quick prototyping:**
1. Use colored rectangles/circles (already working!)
2. Replace with real assets later
3. Focus on gameplay first

## Resources

### Learning:
- **YouTube:** Pixel art tutorials by Mort Mort
- **YouTube:** Game art tutorials by Thomas Brush
- **Course:** Udemy - "Learn to Create Pixel Art for Games"

### Communities:
- r/gamedev
- r/PixelArt
- Itch.io forums

### Tools Collection:
- https://www.gamedev.net/resources/ - Mega list of tools
- https://github.com/ellisonleao/magictools - Curated list

---

## Next Steps

1. Download 5-10 free assets from Kenney.nl
2. Place them in proper folders
3. Update BootScene to load them
4. Update LevelData with texture names
5. Test in your game!

Need help with any specific asset type? Just ask!
