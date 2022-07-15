import { Entity } from '~~/game/utils';
import { Collision, Position, Shadow, Sprite } from '~~/game/components';

export class Tree002 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new Collision('environment', 24, 74, 16, 12));
    this.add(new Position(x, y, 64, 86));
    this.add(new Shadow(64, 96, 64, 16, 0, 74));
    this.add(new Sprite('/sprites/environments-001.png', 64, 0, 64, 86));
  }
}
