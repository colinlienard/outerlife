import { Component, Entity } from '~~/game/utils/ecs';

export class Sprite implements Component {
  entity: Entity;

  readonly source: string;

  readonly sourceX: number;

  readonly sourceY: number;

  readonly width: number;

  readonly height: number;

  constructor(
    entity: Entity,
    source: string,
    sourceX: number,
    sourceY: number,
    width: number,
    height: number
  ) {
    this.entity = entity;
    this.source = source;
    this.sourceX = sourceX;
    this.sourceY = sourceY;
    this.width = width;
    this.height = height;
  }

  update() {
    return this.source;
  }
}
