import { getDegreeFromRadian } from './getDegreeFromRadian';

export const getAngleFromPoints = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => getDegreeFromRadian(Math.atan2(y1 - y2, x1 - x2));
