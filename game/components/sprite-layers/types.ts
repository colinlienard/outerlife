import { AnimationType } from '../animation';

type SpriteModifier = {
  x?: number;
  y?: number;
  rotation?: number;
  depth?: number;
};

type SpriteAnimation = SpriteModifier | SpriteModifier[];

type SpriteAnimations = {
  up: SpriteAnimation;
  down: SpriteAnimation;
  left: SpriteAnimation;
  right: SpriteAnimation;
};

export type SpriteLayer = {
  readonly source: string;
  readonly sourceX: number;
  readonly sourceY: number;
  readonly width: number;
  readonly height: number;
  readonly animation?: Record<AnimationType, SpriteAnimations>;
  x: number;
  y: number;
  rotation: number;
  depth: number;
};
