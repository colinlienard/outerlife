import { Horizontal, Vertical } from '~~/game/utils';
import { AnimationType } from '../animation';

type SpriteModifier = {
  x?: number;
  y?: number;
  rotation?: number;
  depth?: number;
};

type SpriteAnimation = SpriteModifier | SpriteModifier[];

export type SpriteAnimations = Record<Horizontal | Vertical, SpriteAnimation>;

export type SpriteLayer = {
  readonly source: string;
  readonly sourceX: number;
  readonly sourceY: number;
  readonly width: number;
  readonly height: number;
  readonly animation?: Partial<Record<AnimationType, SpriteAnimations>> &
    Pick<Record<AnimationType, SpriteAnimations>, 'idle' | 'run'>;
  x: number;
  y: number;
  rotation: number;
  depth: number;
};
