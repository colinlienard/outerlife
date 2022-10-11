import { EntityState } from '~~/game/utils';

export type AnimationData = {
  frameStart: number;
  frameNumber: number;
  framesPerSecond: number;
  once?: 'despawn' | (() => void);
};

export type Animations = Partial<Record<EntityState, AnimationData>> &
  Pick<Record<EntityState, AnimationData>, 'idle' | 'run'>;

export type AnimationAction = {
  action: () => void;
  frame: number;
  on?: EntityState;
};
