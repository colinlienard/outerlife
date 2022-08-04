export type AnimationData = {
  frameStart: number;
  frameNumber: number;
  framesPerSecond: number;
  once?: 'despawn' | (() => void);
};

export type AnimationType = 'idle' | 'run' | 'slash';

export type Animations = Record<AnimationType, AnimationData>;
