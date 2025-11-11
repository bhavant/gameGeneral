# Your Asset Workflow with Premium Resources

## Resources Available
- **Music:** Audiio.com + Melodie
- **Images:** ChatGPT (DALL-E 3)

---

## Step-by-Step Asset Creation

### Phase 1: Generate Hidden Objects (15-30 minutes)

#### Using ChatGPT/DALL-E:

**Prompt Template:**
```
"A [object name], game asset icon, clean white background,
top-down view, flat illustration style, simple and clear,
suitable for hidden object game, centered composition"
```

**Objects for Level 1 (Living Room):**
1. "A red book, game asset icon..." → Save as `book.png`
2. "A golden key, game asset icon..." → Save as `key.png`
3. "A white coffee cup, game asset icon..." → Save as `cup.png`
4. "A smartphone, game asset icon..." → Save as `phone.png`
5. "A wristwatch, game asset icon..." → Save as `watch.png`

**Objects for Level 2 (Garden):**
1. "A red flower, game asset icon..." → Save as `flower.png`
2. "A garden shovel, game asset icon..." → Save as `shovel.png`
3. "A butterfly, game asset icon..." → Save as `butterfly.png`
4. "A watering can, game asset icon..." → Save as `watering-can.png`
5. "A garden gnome, game asset icon..." → Save as `gnome.png`
6. "A small bird, game asset icon..." → Save as `bird.png`

**After generating each:**
1. Download from ChatGPT
2. Open in browser or image editor
3. If needed, use remove.bg to clean up background
4. Save to: `src/assets/images/objects/[name].png`

---

### Phase 2: Create Backgrounds (10-15 minutes)

#### Using ChatGPT/DALL-E:

**Prompt Template:**
```
"[Location description], hidden object game background,
detailed scene, wide angle view, game art style,
warm lighting, no characters, 1920x1080 aspect ratio"
```

**For Level 1:**
```
"A cozy living room interior, hidden object game background,
detailed scene with sofa, bookshelf, coffee table, window,
warm lighting, game art style, 1920x1080 aspect ratio"
```
→ Save as `room1-bg.png`

**For Level 2:**
```
"A beautiful garden scene, hidden object game background,
detailed scene with flowers, trees, garden path, fence,
sunny day, game art style, 1920x1080 aspect ratio"
```
→ Save as `garden-bg.png`

**After generating:**
1. Download full resolution
2. Compress using TinyPNG.com (keep under 1MB)
3. Save to: `src/assets/images/backgrounds/[name].png`

---

### Phase 3: Get Music (10-20 minutes)

#### From Audiio.com:

**What to search for:**

1. **Main Menu Music:**
   - Search: "casual game menu", "relaxing menu"
   - Style: Light, welcoming, loopable
   - Duration: 1-2 minutes
   - Download as MP3
   - Save as: `src/assets/audio/music/menu-theme.mp3`

2. **Gameplay Music:**
   - Search: "puzzle game", "hidden object", "mystery ambient"
   - Style: Calm, non-intrusive, loopable
   - Duration: 2-3 minutes
   - Save as: `src/assets/audio/music/gameplay-ambient.mp3`

3. **Success Theme:**
   - Search: "victory", "level complete", "success jingle"
   - Style: Upbeat, short
   - Duration: 5-10 seconds
   - Save as: `src/assets/audio/music/level-complete.mp3`

#### From Melodie:

Alternative source if Audiio doesn't have what you need. Same search terms apply.

**Compression:**
- Use Audacity or online MP3 compressor
- Target: 128kbps for music
- Keep files under 2MB each

---

### Phase 4: Get Sound Effects (10 minutes)

#### From Audiio or Freesound.org:

**Essential SFX:**

1. **Button Click**
   - Search: "UI click", "button press"
   - Save as: `src/assets/audio/sfx/click.mp3`

2. **Object Found**
   - Search: "success", "pickup", "positive"
   - Save as: `src/assets/audio/sfx/object-found.mp3`

3. **Hint Used**
   - Search: "hint", "reveal", "magic chime"
   - Save as: `src/assets/audio/sfx/hint.mp3`

4. **Timer Tick** (optional)
   - Search: "clock tick", "timer"
   - Save as: `src/assets/audio/sfx/timer-tick.mp3`

5. **Level Complete**
   - Search: "achievement", "fanfare"
   - Save as: `src/assets/audio/sfx/level-complete.mp3`

6. **Game Over**
   - Search: "fail", "game over", "negative"
   - Save as: `src/assets/audio/sfx/game-over.mp3`

**Compression:**
- Target: 64kbps for SFX
- Keep under 100KB each

---

## Phase 5: Integration Code

### Update BootScene.ts:

```typescript
preload(): void {
  this.createLoadingScreen();

  // Load hidden object sprites
  this.load.image('book', 'assets/images/objects/book.png');
  this.load.image('key', 'assets/images/objects/key.png');
  this.load.image('cup', 'assets/images/objects/cup.png');
  this.load.image('phone', 'assets/images/objects/phone.png');
  this.load.image('watch', 'assets/images/objects/watch.png');
  this.load.image('flower', 'assets/images/objects/flower.png');
  this.load.image('shovel', 'assets/images/objects/shovel.png');
  this.load.image('butterfly', 'assets/images/objects/butterfly.png');
  this.load.image('watering-can', 'assets/images/objects/watering-can.png');
  this.load.image('gnome', 'assets/images/objects/gnome.png');
  this.load.image('bird', 'assets/images/objects/bird.png');

  // Load backgrounds
  this.load.image('room1-bg', 'assets/images/backgrounds/room1-bg.png');
  this.load.image('garden-bg', 'assets/images/backgrounds/garden-bg.png');

  // Load music
  this.load.audio('menuMusic', 'assets/audio/music/menu-theme.mp3');
  this.load.audio('gameplayMusic', 'assets/audio/music/gameplay-ambient.mp3');
  this.load.audio('levelCompleteMusic', 'assets/audio/music/level-complete.mp3');

  // Load SFX
  this.load.audio('clickSfx', 'assets/audio/sfx/click.mp3');
  this.load.audio('foundSfx', 'assets/audio/sfx/object-found.mp3');
  this.load.audio('hintSfx', 'assets/audio/sfx/hint.mp3');
  this.load.audio('levelCompleteSfx', 'assets/audio/sfx/level-complete.mp3');
  this.load.audio('gameOverSfx', 'assets/audio/sfx/game-over.mp3');

  // Update loading progress
  this.load.on('progress', (value: number) => {
    this.updateLoadingBar(value);
  });
}
```

### Update LevelData.ts:

```typescript
export const LEVELS: LevelData[] = [
  {
    id: 1,
    name: 'The Living Room',
    background: 'room1-bg', // ✅ Now shows your DALL-E background
    objects: [
      { key: 'book', name: 'Book', x: 300, y: 400, scale: 0.5, texture: 'book' },
      { key: 'cup', name: 'Cup', x: 800, y: 500, scale: 0.5, texture: 'cup' },
      { key: 'key', name: 'Key', x: 1200, y: 300, scale: 0.5, texture: 'key' },
      { key: 'phone', name: 'Phone', x: 600, y: 700, scale: 0.5, texture: 'phone' },
      { key: 'watch', name: 'Watch', x: 1400, y: 600, scale: 0.5, texture: 'watch' },
    ],
    timeLimit: 120,
  },
  {
    id: 2,
    name: 'The Garden',
    background: 'garden-bg', // ✅ Your DALL-E background
    objects: [
      { key: 'flower', name: 'Flower', x: 400, y: 600, scale: 0.5, texture: 'flower' },
      { key: 'shovel', name: 'Shovel', x: 1000, y: 400, scale: 0.5, texture: 'shovel' },
      { key: 'butterfly', name: 'Butterfly', x: 700, y: 200, scale: 0.5, texture: 'butterfly' },
      { key: 'watering-can', name: 'Watering Can', x: 1300, y: 700, scale: 0.5, texture: 'watering-can' },
      { key: 'gnome', name: 'Garden Gnome', x: 500, y: 800, scale: 0.5, texture: 'gnome' },
      { key: 'bird', name: 'Bird', x: 1100, y: 300, scale: 0.5, texture: 'bird' },
    ],
    timeLimit: 150,
  },
];
```

---

## Pro Tips for DALL-E Asset Generation

### Consistent Art Style:

**Option 1: Cartoon Style**
Add to all prompts: "...cartoon style, vibrant colors, smooth shading"

**Option 2: Realistic Style**
Add to all prompts: "...photorealistic style, detailed textures"

**Option 3: Hand-Drawn Style**
Add to all prompts: "...hand-drawn illustration style, watercolor effect"

### Maintaining Consistency:

1. **Use the same style descriptor** in every prompt
2. **Generate all objects in one session** when possible
3. **Reference previous images**: "Similar style to the previous image"

### If Background is Not Transparent:

1. Download image from ChatGPT
2. Go to **remove.bg**
3. Upload image
4. Download result with transparent background
5. Done!

---

## Time Estimate

- **Total time to create all assets:** 1-2 hours
- **Hidden Objects (11 items):** 30 minutes
- **Backgrounds (2 scenes):** 20 minutes
- **Music (3 tracks):** 20 minutes
- **SFX (6 sounds):** 15 minutes
- **Integration/Testing:** 15 minutes

---

## Quality Checklist

Before using assets:

### Images:
- [ ] All PNGs have transparent backgrounds
- [ ] All images are compressed (use TinyPNG.com)
- [ ] File sizes under 500KB each
- [ ] Consistent art style across all objects

### Audio:
- [ ] Music tracks are loopable (no awkward endings)
- [ ] All audio files are MP3 format
- [ ] Music at 128kbps, SFX at 64kbps
- [ ] Volume levels are consistent across tracks

### Integration:
- [ ] All files named correctly (lowercase, no spaces)
- [ ] Files in correct folders
- [ ] BootScene loads all assets
- [ ] LevelData references correct texture names

---

## Troubleshooting

### "Asset not loading":
1. Check file name matches exactly (case-sensitive)
2. Check file is in correct folder
3. Check BootScene.ts has load statement
4. Check browser console for errors

### "Image has white background instead of transparent":
1. Use remove.bg
2. Or regenerate with better prompt
3. Or edit in GIMP/Photopea

### "Music doesn't loop properly":
1. Find tracks specifically marked "seamless loop"
2. Or use Audacity to fade in/out and trim

---

## Next Steps After Assets Are Ready

1. Test in game: `npm run dev`
2. Adjust object positions in LevelData.ts
3. Adjust scale values for proper size
4. Fine-tune gameplay timing
5. Add more levels!

---

## Ready to Start?

**Recommended order:**
1. Generate 5 objects for Level 1 (15 min)
2. Update code and test (10 min)
3. Generate background for Level 1 (5 min)
4. Test again
5. Continue with rest of assets

This way you can see results quickly and adjust your workflow!
