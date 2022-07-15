import { Collision, Position } from '~~/game/components';
import { Entity } from '~~/game/utils';

export class InvisibleWall extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super();
    this.add(new Collision('environment', x, y, width, height));
    this.add(new Position(x, y));
  }
}
