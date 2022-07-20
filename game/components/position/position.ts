import { Settings } from '~~/game/settings';
import { Component } from '~~/game/utils';

export class Position implements Component {
  x: number;

  y: number;

  oldX = 0;

  oldY = 0;

  constructor(x: number, y: number, width?: number, height?: number) {
    if (width && height) {
      this.x = x - width / 2 + Settings.tileSize / 2;
      this.y = y - height + Settings.tileSize / 2;
    } else {
      this.x = x;
      this.y = y;
    }
  }
}
