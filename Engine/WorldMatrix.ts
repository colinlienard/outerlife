import { mat3, vec2 } from 'gl-matrix';
import { Y_PIXELS_NUMBER } from '~~/Game/globals';

class WorldMatrix {
  static matrix: mat3;

  static create() {
    const matrix = mat3.create();

    mat3.translate(matrix, matrix, vec2.fromValues(-1, 1));

    const widthRatio =
      window.innerWidth / (window.innerHeight / Y_PIXELS_NUMBER);
    const heightRatio = -2 / Y_PIXELS_NUMBER;
    mat3.scale(matrix, matrix, vec2.fromValues(2 / widthRatio, heightRatio));

    WorldMatrix.matrix = matrix;
  }

  static get() {
    return WorldMatrix.matrix;
  }
}

export default WorldMatrix;
