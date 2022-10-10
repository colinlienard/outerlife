import { Direction } from '../types';
import { getDirectionFromAngle } from './getDirectionFromAngle';

export const getDirectionFromPoint = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): { direction: Direction; row: number } => {
  const angle = (Math.atan2(x1 - x2, y1 - y2) * 180) / Math.PI;
  return getDirectionFromAngle(angle);
};
