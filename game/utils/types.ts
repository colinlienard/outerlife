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

export interface GameMapInteraction extends Box {
  data: InteractionData;
}

export type Tilemap = {
  rows: number;
  columns: number;
  terrains: string[];
  environments: string[];
  interactions: GameMapInteraction[];
};

export type GameMapEntity = [number, number, number];

export type GameMapTerrain = number | null;

export type GameMap = {
  rows: number;
  columns: number;
  terrains: GameMapTerrain[];
  environments: GameMapEntity[];
  organisms: GameMapEntity[];
  interactions: GameMapInteraction[];
};

export type GameMapItemType =
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
