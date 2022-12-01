import { Direction } from '../types';

export const getAngleFromDirection = (direction: Direction) => {
  switch (direction) {
    case 'up':
      return 270;
    case 'down':
      return 90;
    case 'left':
      return 180;
    case 'right':
      return 0;
    default:
      return 0;
  }
};
