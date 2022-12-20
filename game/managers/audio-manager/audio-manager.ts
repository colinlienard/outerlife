import { getRandomNumber } from '~~/game/utils';
import { SoundEffectOptions, SoundType } from './types';

export abstract class AudioManager {
  private static context: AudioContext;

  private static buffers = new Map<string, AudioBuffer>();

  private static gains: Record<SoundType, GainNode>;

  private static soundEffects = new Map<string, AudioBufferSourceNode>();

  private static music:
    | {
        source: string;
        track: AudioBufferSourceNode;
      }
    | undefined;

  static init() {
    this.context = new AudioContext();
    this.gains = {
      effect: this.context.createGain(),
      music: this.context.createGain(),
    };
  }

  static async load(source: string) {
    if (this.buffers.has(source)) {
      return;
    }

    const response = await fetch(source);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
    this.buffers.set(source, audioBuffer);
  }

  private static play(
    source: string,
    type: SoundType,
    options?: SoundEffectOptions
  ) {
    const buffer = this.buffers.get(source);
    if (!buffer) {
      throw new Error(`Sound '${source}' is not loaded.`);
    }

    // Setup the track
    const track = this.context.createBufferSource();
    track.buffer = buffer;

    // Handle options
    if (options) {
      const { pitchVariance, loop } = options;

      if (pitchVariance) {
        track.detune.value = getRandomNumber(-pitchVariance, pitchVariance);
      }

      if (loop) {
        track.loop = true;
      }
    }

    // Connect to the correct gain
    track.connect(this.gains[type]);
    this.gains[type].connect(this.context.destination);

    // Play the sound
    track.start();

    return track;
  }

  static playSoundEffect(source: string, options?: SoundEffectOptions) {
    if (this.soundEffects.has(source)) {
      return;
    }

    const track = this.play(source, 'effect', options);

    // Keep track of soundEffects sounds
    this.soundEffects.set(source, track);
    track.onended = () => {
      track.stop();
      this.soundEffects.delete(source);
    };
  }

  static clearSoundEffects() {
    this.soundEffects.forEach((soundEffect) => {
      soundEffect.stop();
    });
    this.soundEffects.clear();
  }

  static async playMusic(source: string) {
    // Do not restart music if it is already playing
    if (this.music?.source === source) {
      return;
    }

    // Fade out and stop old music
    if (this.music) {
      await this.clearMusic();
      // Play and store new music
      this.gains.music.gain.value = 1;
      const track = this.play(source, 'music', {
        loop: true,
      });
      this.music = { source, track };
      return;
    }

    // Play and store new music
    this.gains.music.gain.value = 1;
    const track = this.play(source, 'music', {
      loop: true,
    });
    this.music = { source, track };
  }

  static async clearMusic() {
    await this.fade('out', 'music', 2000);
    this.music?.track.stop();
    this.music = undefined;
  }

  static fade(fade: 'in' | 'out', type: SoundType, duration: number) {
    return new Promise((resolve) => {
      const { gain } = this.gains[type];

      if (fade === 'in') {
        gain.value = 0;
      }

      gain.linearRampToValueAtTime(
        fade === 'in' ? 1 : 0,
        this.context.currentTime + duration / 1000
      );

      setTimeout(resolve, duration);
    });
  }

  static pauseAll() {
    this.context.suspend();
  }

  static resumeAll() {
    this.context.resume();
  }

  static updateGain(type: SoundType, value: number) {
    this.gains[type].gain.value = value;
  }
}
