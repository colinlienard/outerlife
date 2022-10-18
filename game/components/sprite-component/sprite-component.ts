import { Component } from '~~/game/utils';

export class SpriteComponent implements Component {
  readonly source: string;

  readonly sourceX: number;

  readonly sourceY: number;

  readonly width: number;

  readonly height: number;

  constructor(
    source: string,
    sourceX: number,
    sourceY: number,
    width: number,
    height: number
  ) {
    this.source = source;
    this.sourceX = sourceX;
    this.sourceY = sourceY;
    this.width = width;
    this.height = height;
  }
}
