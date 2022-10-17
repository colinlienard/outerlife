import { Component, Settings } from '~~/game/utils';

export class PositionComponent implements Component {
  readonly width?: number;

  readonly height?: number;

  x: number;

  y: number;

  constructor(x: number, y: number, width?: number, height?: number) {
    if (width && height) {
      this.x = x - width / 2 + Settings.tileSize / 2;
      this.y = y - height + Settings.tileSize / 2;
    } else {
      this.x = x;
      this.y = y;
    }
    this.width = width;
    this.height = height;
  }

  getCenter() {
    if (!this.width || !this.height) {
      throw new Error('Width and/or height not provided in PositionComponent.');
    }

    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    };
  }
}
