import { GameMapPostProcessing, ParticlesProps } from '../types';

export const getAmbiantParticles = (
  type: GameMapPostProcessing
): ParticlesProps | null => {
  switch (type) {
    case 'desert':
      return {
        color: 2,
        speed: 0.5,
        duration: 400,
        angle: 20,
        timeBetween: 30,
      };
    default:
      return null;
  }
};
