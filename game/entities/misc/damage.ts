import { Collision, Position, Sprite } from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Damage extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super();
    this.add(new Collision('damage', 0, 0, width, height));
    this.add(new Position(x, y));
    this.add(new Sprite('/sprites/player.png', 0, 0, 0, 0)); // Fake sprite so that its collision can be rendered
  }
}
