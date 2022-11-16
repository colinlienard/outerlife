export interface Point {
  x: number;
  y: number;
}

export interface Box extends Point {
  width: number;
  height: number;
}

export interface Interaction extends Box {
  entered?: boolean;
  enter: () => void;
}

export type Terrain = {
  source: string;
  sourceX: number;
  sourceY: number;
  x: number;
  y: number;
};

export type Tilemap = {
  rows: number;
  columns: number;
  terrains: string[];
  environments: string[];
  interactions: Interaction[];
};

export type MapEnvironment = {
  x: number;
  y: number;
  constructorId: number;
};

export type MapTerrain = number | null;

export type Map = {
  rows: number;
  columns: number;
  terrains: MapTerrain[];
  environments: MapEnvironment[];
};

export type Horizontal = 'left' | 'right';

export type Vertical = 'up' | 'down';

export type Direction = Horizontal | Vertical;

export type EntityState =
  | 'idle'
  | 'run'
  | 'chase'
  | 'melee-attack-anticipation'
  | 'melee-attack'
  | 'dash'
  | 'dash-recovery'
  | 'hit'
  | 'dead';
