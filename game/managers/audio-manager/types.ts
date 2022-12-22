import { Point } from '~~/game/utils';

export type SoundEffectOptions = {
  pitchVariance?: number;
  loop?: boolean;
  spatialization?: Point;
};

export type SoundType = 'music' | 'effect';

export type Volumes = {
  general: number;
  soundEffects: number;
  music: number;
};
