import { Component, Settings } from '~~/game/utils';

export class Position implements Component {
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
    return {
      x: this.x + (this.width as number) / 2,
      y: this.y + (this.height as number) / 2,
    };
  }
}
