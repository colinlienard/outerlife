import { ColorCorrection, GameMapPostProcessing } from '../types';

export const getColorCorrection = (
  type: GameMapPostProcessing
): ColorCorrection | null => {
  switch (type) {
    case 'desert':
      return [0.2, 0.05, 0, 0.5];
    default:
      return null;
  }
};
