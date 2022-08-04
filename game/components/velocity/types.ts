type Horizontal = 'left' | 'right' | null;

type Vertical = 'up' | 'down' | null;

export type Direction = {
  x: Horizontal;
  y: Vertical;
  current: Vertical | Horizontal;
};
