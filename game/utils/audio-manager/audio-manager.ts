import { getRandomNumber } from '../helpers';

export abstract class AudioManager {
  private static context: AudioContext;

  private static buffers = new Map<string, AudioBuffer>();

  static init() {
    this.context = new AudioContext();
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
    beforePlay: (track: AudioBufferSourceNode) => void
  ) {
    const buffer = this.buffers.get(source);
    if (!buffer) {
      throw new Error(`Sound '${source}' is not loaded.`);
    }

    const track = this.context.createBufferSource();
    track.buffer = buffer;
    track.connect(this.context.destination);

    beforePlay(track);

    track.start();
  }

  static playEffect(source: string, pitchVariance?: number) {
    this.play(source, (track) => {
      if (pitchVariance) {
        track.detune.value = getRandomNumber(-pitchVariance, pitchVariance);
      }
    });
  }

  static playAmbiant(source: string) {
    this.play(source, (track) => {
      track.loop = true;
    });
  }
}
