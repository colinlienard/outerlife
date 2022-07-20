import { Entity } from '~~/game/utils';
import { Collision, Position, Shadow, Sprite } from '~~/game/components';

export class Crystal002 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new Collision('environment', 4, 22, 26, 10));
    this.add(new Position(x, y, 32, 32));
    this.add(new Shadow(48, 144, 32, 16, 0, 22));
    this.add(new Sprite('/sprites/environments-001.png', 48, 112, 32, 32));
  }
}
