import { Direction } from '../types';

export const getDirectionFromRow = (row: number): Direction => {
  switch (row) {
    case 0:
      return 'up';
    case 1:
      return 'down';
    case 2:
      return 'left';
    case 3:
      return 'right';
    default:
      return 'down';
  }
};
