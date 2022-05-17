type Animation = {
  frameStart: number;
  frameNumber: number;
  framesPerSecond: number;
  once?: boolean;
};

type Collider = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Direction = {
  x: null | 'left' | 'right';
  y: null | 'up' | 'down';
};

type EntityLayer = {
  x: number;
  y: number;
  width: number;
  height: number;
  sourceX: number;
  sourceY: number;
};

type Keys = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

type Tilemap = {
  rows: number;
  columns: number;
  terrains: string[];
  environments: string[];
};

export { Animation, Collider, Direction, EntityLayer, Keys, Tilemap };
