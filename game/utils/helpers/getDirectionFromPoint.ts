import { Horizontal, Vertical } from '../types';

export const getDirectionFromPoint = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): { direction: Horizontal | Vertical; row: number } => {
  const angle = (Math.atan2(x1 - x2, y1 - y2) * 180) / Math.PI;

  if (angle > -45 && angle < 45) {
    return { direction: 'down', row: 1 };
  }
  if (angle > 45 && angle < 135) {
    return { direction: 'right', row: 3 };
  }
  if (angle > 135 || angle < -135) {
    return { direction: 'up', row: 0 };
  }
  return { direction: 'left', row: 2 };
};
