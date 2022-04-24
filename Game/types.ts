type Animation = {
  frameStart: number;
  frameNumber: number;
  framesPerSecond: number;
};

type Animations = {
  idle?: Animation;
  run?: Animation;
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

type SceneLayerElement = {
  x: number;
  y: number;
  width: number;
  height: number;
  sourceX: number;
  sourceY: number;
};

export { Animation, Animations, Direction, Keys, SceneLayerElement };
