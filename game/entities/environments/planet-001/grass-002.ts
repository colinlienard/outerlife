import { Entity } from '~~/game/utils';
import { Position, Sprite } from '~~/game/components';

export class Grass002 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new Position(x, y, 16, 16));
    this.add(new Sprite('/sprites/environments-001.png', 16, 160, 16, 16));
  }
}
