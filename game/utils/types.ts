export interface Point {
  x: number;
  y: number;
}

export interface Box extends Point {
  width: number;
  height: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export type ParticlesProps = {
  color: number;
  speed: number;
  duration: number;
  angle: number;
  timeBetween: number;
};

export type ColorCorrection = [number, number, number, number];

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
  playerDirection: Direction;
};

export interface GameMapInteraction extends Box {
  data: InteractionData;
}

export type GameMapEntity = [number, number, number];

export type GameMapTerrain = number | null;

export type GameMapPostProcessing = null | 'desert';

export type GameMapAmbiantAudio = string[];

export type GameMap = {
  rows: number;
  columns: number;
  postProcessing: GameMapPostProcessing;
  terrains: GameMapTerrain[];
  environments: GameMapEntity[];
  organisms: GameMapEntity[];
  interactions: GameMapInteraction[];
  ambiantAudio: GameMapAmbiantAudio;
};

export type GameMapItemType =
  | 'terrain'
  | 'environment'
  | 'organism'
  | 'interaction';

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
