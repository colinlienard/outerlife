type Animation = {
  frameStart: number;
  frameNumber: number;
  framesPerSecond: number;
  once?: boolean;
};

type Collision = {
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

type InteractionAction = {
  sceneSwitch?: {
    map: string;
    playerX: number;
    playerY: number;
  };
};

type Interaction = {
  x: number;
  y: number;
  width: number;
  height: number;
  entered?: boolean;
  enter: () => void;
};

type Keys = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

type Terrain = {
  source: string;
  sourceX: number;
  sourceY: number;
  x: number;
  y: number;
};

type Tilemap = {
  rows: number;
  columns: number;
  terrains: string[];
  environments: string[];
  interactions: Interaction[];
};

export {
  Animation,
  Collision,
  Direction,
  EntityLayer,
  Keys,
  Interaction,
  InteractionAction,
  Terrain,
  Tilemap,
};
