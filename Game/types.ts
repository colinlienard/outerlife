type Animation = {
  frameStart: number;
  frameNumber: number;
  framePerSecond: number;
};

type Animations = {
  idle: Animation;
  run: Animation;
};

export { Animation, Animations };
