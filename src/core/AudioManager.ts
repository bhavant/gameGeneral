import Phaser from 'phaser';
import { GameConfig } from '@config/GameConfig';

/**
 * AudioManager - Manages all game audio
 */
export class AudioManager {
  private scene: Phaser.Scene;
  private music: Map<string, Phaser.Sound.BaseSound> = new Map();
  private sfx: Map<string, Phaser.Sound.BaseSound> = new Map();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  // Music methods
  playMusic(key: string, loop: boolean = true): void {
    if (this.music.has(key)) {
      const music = this.music.get(key);
      if (music && !music.isPlaying) {
        music.play({ loop, volume: GameConfig.AUDIO.MUSIC_VOLUME });
      }
    } else {
      const music = this.scene.sound.add(key, {
        loop,
        volume: GameConfig.AUDIO.MUSIC_VOLUME,
      });
      this.music.set(key, music);
      music.play();
    }
  }

  stopMusic(key?: string): void {
    if (key) {
      const music = this.music.get(key);
      music?.stop();
    } else {
      this.music.forEach((music) => music.stop());
    }
  }

  pauseMusic(key?: string): void {
    if (key) {
      const music = this.music.get(key);
      if (music && 'pause' in music) {
        (music as Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound).pause();
      }
    } else {
      this.music.forEach((music) => {
        if ('pause' in music) {
          (music as Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound).pause();
        }
      });
    }
  }

  // SFX methods
  playSFX(key: string, volume?: number): void {
    const sfx = this.scene.sound.add(key, {
      volume: volume || GameConfig.AUDIO.SFX_VOLUME,
    });
    sfx.play();
    sfx.once('complete', () => sfx.destroy());
  }

  // Volume control
  setMusicVolume(volume: number): void {
    this.music.forEach((music) => {
      if ('setVolume' in music) {
        (music as Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound).setVolume(volume);
      }
    });
  }

  setSFXVolume(volume: number): void {
    GameConfig.AUDIO.SFX_VOLUME = volume;
  }

  // Cleanup
  destroy(): void {
    this.music.forEach((music) => music.destroy());
    this.sfx.forEach((sfx) => sfx.destroy());
    this.music.clear();
    this.sfx.clear();
  }
}
