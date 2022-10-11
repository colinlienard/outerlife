import { Direction } from '../types';

export const getDirectionFromAngle = (
  angle: number
): { direction: Direction; animationRow: number } => {
  if (angle >= 135 && angle <= 225) {
    return { direction: 'left', animationRow: 2 };
  }

  if (angle >= 315 || angle <= 45) {
    return { direction: 'right', animationRow: 3 };
  }

  if (angle < 180) {
    return { direction: 'down', animationRow: 1 };
  }

  return { direction: 'up', animationRow: 0 };
};
