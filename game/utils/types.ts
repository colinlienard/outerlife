export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Interaction = {
  x: number;
  y: number;
  width: number;
  height: number;
  entered?: boolean;
  enter: () => void;
};

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
