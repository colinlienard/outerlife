import { Component } from '~~/game/utils';

export class Shadow implements Component {
  readonly sourceX: number;

  readonly sourceY: number;

  readonly width: number;

  readonly height: number;

  readonly x: number;

  readonly y: number;

  constructor(
    sourceX: number,
    sourceY: number,
    width: number,
    height: number,
    x: number,
    y: number
  ) {
    this.sourceX = sourceX;
    this.sourceY = sourceY;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }
}
