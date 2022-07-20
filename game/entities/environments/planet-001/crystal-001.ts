import { Entity } from '~~/game/utils';
import { Collision, Position, Shadow, Sprite } from '~~/game/components';

export class Crystal001 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new Collision('environment', 8, 35, 28, 12));
    this.add(new Position(x, y, 48, 48));
    this.add(new Shadow(0, 144, 48, 10, 0, 40));
    this.add(new Sprite('/sprites/environments-001.png', 0, 96, 48, 48));
  }
}
