import { Component } from '~~/game/utils/ecs';

type Type = 'organism' | 'environment';

export class Collision implements Component {
  readonly type: Type;

  readonly x: number;

  readonly y: number;

  readonly width: number;

  readonly height: number;

  constructor(type: Type, x: number, y: number, width: number, height: number) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
