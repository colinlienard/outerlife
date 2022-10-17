import { Component } from '~~/game/utils/ecs';
import { CollisionType } from './types';

export class CollisionComponent implements Component {
  readonly type: CollisionType;

  readonly x: number;

  readonly y: number;

  readonly width: number;

  readonly height: number;

  constructor(
    type: CollisionType,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
