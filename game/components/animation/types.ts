export type AnimationData = {
  frameStart: number;
  frameNumber: number;
  framesPerSecond: number;
  once?: 'despawn' | (() => void);
};

export type AnimationType =
  | 'idle'
  | 'run'
  | 'melee-attack'
  | 'dash'
  | 'recovery';

export type Animations = Partial<Record<AnimationType, AnimationData>>;

export type AnimationAction = {
  action: () => void;
  frame: number;
  onType?: AnimationType;
};
