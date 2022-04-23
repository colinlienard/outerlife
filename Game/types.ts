type Animation = {
  frameStart: number;
  frameNumber: number;
  framesPerSecond: number;
};

type Animations = {
  idle: Animation;
  run: Animation;
};

type Direction = {
  x: null | 'left' | 'right';
  y: null | 'up' | 'down';
};

type Keys = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

export { Animation, Animations, Direction, Keys };
