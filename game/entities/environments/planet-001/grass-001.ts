import { Entity } from '~~/game/utils';
import { Collision, Life, Position, Sprite } from '~~/game/components';

export class Grass001 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new Collision('alive', 0, 0, 16, 16));
    this.add(new Life());
    this.add(new Position(x, y, 16, 16));
    this.add(new Sprite('/sprites/environments-001.png', 0, 160, 16, 16));
  }
}
