export interface Point {
  x: number;
  y: number;
}

export interface Box extends Point {
  width: number;
  height: number;
}

export type Terrain = {
  source: string;
  sourceX: number;
  sourceY: number;
  x: number;
  y: number;
};

export type InteractionData = {
  type: 'switch-map';
  map: string;
  playerX: number;
  playerY: number;
};

export interface MapInteraction extends Box {
  data: InteractionData;
}

export type Tilemap = {
  rows: number;
  columns: number;
  terrains: string[];
  environments: string[];
  interactions: MapInteraction[];
};

export type MapEntity = {
  x: number;
  y: number;
  constructorId: number;
};

export type MapTerrain = number | null;

export type Map = {
  rows: number;
  columns: number;
  terrains: MapTerrain[];
  environments: MapEntity[];
  organisms: MapEntity[];
};

export type MapItemType =
  | 'terrain'
  | 'environment'
  | 'organism'
  | 'interaction';

export type Direction = 'up' | 'down' | 'left' | 'right';

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
