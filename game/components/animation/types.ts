export type AnimationData = {
  frameStart: number;
  frameNumber: number;
  framesPerSecond: number;
  once?: boolean;
};

export type AnimationType = 'idle' | 'run';

export type Animations = Record<AnimationType, AnimationData>;
