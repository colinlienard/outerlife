export type AnimationData = {
  frameStart: number;
  frameNumber: number;
  framesPerSecond: number;
  once?: 'despawn' | (() => void);
};

export type AnimationType = 'idle' | 'run' | 'melee-attack';

export type Animations = Record<AnimationType, AnimationData>;

export type AnimationAction = {
  action: () => void;
  frame: number;
  onType?: AnimationType;
};
