type Horizontal = 'left' | 'right';

type Vertical = 'up' | 'down';

export type Direction = {
  x: Horizontal | null;
  y: Vertical | null;
  current: Vertical | Horizontal;
};
