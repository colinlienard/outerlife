import { Point } from '~~/game/utils';

export type EffectOptions = {
  pitchVariance?: number;
  loop?: boolean;
  spatialization?: Point;
};

export type SoundType = 'music' | 'effect';

export type Volumes = {
  master: number;
  effects: number;
  music: number;
};
