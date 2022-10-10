import { Direction } from '../types';

export const getDirectionFromAngle = (
  angle: number
): { direction: Direction; row: number } => {
  if (angle > 90 && angle < 270) {
    return { direction: 'left', row: 2 };
  }

  if (angle > 270 || angle < 90) {
    return { direction: 'right', row: 3 };
  }

  if (angle < 180) {
    return { direction: 'down', row: 1 };
  }

  return { direction: 'up', row: 0 };
};
