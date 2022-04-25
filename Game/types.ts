type Animation = {
  frameStart: number;
  frameNumber: number;
  framesPerSecond: number;
  once?: boolean;
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

export { Animation, Direction, Keys, SceneLayerElement };
