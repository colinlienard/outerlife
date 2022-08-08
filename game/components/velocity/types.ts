import { Horizontal, Vertical } from '~~/game/utils';

export type Direction = {
  x: Horizontal | null;
  y: Vertical | null;
  current: Vertical | Horizontal;
};
