import { Entity } from '~~/game/utils';
import { Collision, Position, Shadow, Sprite } from '~~/game/components';

export class Tree001 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new Collision('environment', 20, 68, 14, 12));
    this.add(new Position(x, y, 64, 80));
    this.add(new Shadow(0, 80, 64, 16, 0, 68));
    this.add(new Sprite('/sprites/environments-001.png', 0, 0, 64, 80));
  }
}
