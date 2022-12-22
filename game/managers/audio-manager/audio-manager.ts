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

  private static getPanner(x: number, y: number) {
    return new PannerNode(this.context, {
      distanceModel: 'exponential',
      panningModel: 'HRTF',
      positionX: x,
      positionY: y,
      refDistance: 50,
      rolloffFactor: 1.25,
    });
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

    // Connect audio nodes
    if (options && options.spatialization) {
      const { x, y } = options.spatialization;
      const panner = this.getPanner(x, y);
      track
        .connect(panner)
        .connect(this.gains[type])
        .connect(this.context.destination);
    } else {
      track.connect(this.gains[type]).connect(this.context.destination);
    }

    // Play the sound
    track.start();

    return track;
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

  static playSoundEffect(source: string, options?: SoundEffectOptions) {
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

    const startMusic = () => {
      this.gains.music.gain.value = 1;
      const track = this.play(source, 'music', {
        loop: true,
      });
      this.music = { source, track };
    };

    if (!this.music) {
      startMusic();
      return;
    }

    // Fade out and stop old music
    await this.clearMusic();
    startMusic();
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

  static updateListenerPosition(x: number, y: number) {
    const { listener } = this.context;
    listener.positionX.value = x;
    listener.positionY.value = y;
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
