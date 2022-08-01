import { AnimationType } from '../animation';

type SpriteModifier = {
  x?: number;
  y?: number;
  depth?: number;
};

type SpriteAnimation = {
  up: SpriteModifier;
  down: SpriteModifier;
  left: SpriteModifier;
  right: SpriteModifier;
};

export type SpriteLayer = {
  readonly source: string;
  readonly sourceX: number;
  readonly sourceY: number;
  readonly width: number;
  readonly height: number;
  x: number;
  y: number;
  depth: number;
  animation?: Record<AnimationType, SpriteAnimation>;
};
