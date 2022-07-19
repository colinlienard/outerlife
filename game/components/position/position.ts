import { TILE_SIZE } from '~~/game/globals';
import { Component } from '~~/game/utils';

export class Position implements Component {
  x: number;

  y: number;

  oldX = 0;

  oldY = 0;

  constructor(x: number, y: number, width?: number, height?: number) {
    if (width && height) {
      this.x = x - width / 2 + TILE_SIZE / 2;
      this.y = y - height + TILE_SIZE / 2;
    } else {
      this.x = x;
      this.y = y;
    }
  }
}
