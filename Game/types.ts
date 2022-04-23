type Animation = {
  frameStart: number;
  frameNumber: number;
  framePerSecond: number;
};

type Animations = {
  idle: Animation;
  run: Animation;
};

type Keys = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

export { Animation, Animations, Keys };
