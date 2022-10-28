import { Direction, EntityState } from '~~/game/utils';

// type LayerModifier = {
//   x: number;
//   y: number;
//   rotation?: number;
//   depth?: number;
// };

// type LayerAnimation = LayerModifier | LayerModifier[] | null;

// export type LayerAnimations = Partial<
//   Record<EntityState, Record<Direction, LayerAnimation>>
// >;

// interface LayerCommon {
//   x: number;
//   y: number;
//   animation?: LayerAnimations;
//   render: boolean;
// }

type LayerAnimation<T> = Partial<
  Record<EntityState, Partial<Record<Direction, T | T[]>>>
>;

type SpriteLayerModifier = {
  x: number;
  y: number;
  depth: number;
  rotation: number;
};

type GlowLayerModifier = {
  x: number;
  y: number;
};

export type SpriteLayer = {
  readonly type: 'sprite';
  readonly source: string;
  readonly sourceX: number;
  readonly sourceY: number;
  readonly width: number;
  readonly height: number;
  readonly animation?: LayerAnimation<SpriteLayerModifier>;
  render: boolean;
  data: SpriteLayerModifier;
};

export type GlowLayer = {
  readonly type: 'glow';
  readonly color: [number, number, number];
  readonly opacity: number;
  readonly size: number;
  readonly animation?: LayerAnimation<GlowLayerModifier>;
  render: boolean;
  data: GlowLayerModifier;
};

export type Layer = SpriteLayer | GlowLayer;
