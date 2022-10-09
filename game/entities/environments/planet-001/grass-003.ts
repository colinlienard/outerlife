import { Entity } from '~~/game/utils';
import { PositionComponent, SpriteComponent } from '~~/game/components';

export class Grass003 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new PositionComponent(x, y, 16, 16));
    this.add(
      new SpriteComponent('/sprites/environments-001.png', 32, 160, 16, 16)
    );
  }
}
