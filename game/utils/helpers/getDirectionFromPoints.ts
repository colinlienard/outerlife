import { getAngleFromPoints } from './getAngleFromPoints';
import { getDirectionFromAngle } from './getDirectionFromAngle';

export const getDirectionFromPoints = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => getDirectionFromAngle(getAngleFromPoints(x1, y1, x2, y2));
