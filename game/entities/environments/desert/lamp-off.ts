import { PositionComponent, SpriteComponent } from '~~/game/components';
import { Entity } from '~~/game/utils';

export class LampOff extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new PositionComponent(x, y));
    this.add(
      new SpriteComponent('/sprites/desert-environments.png', 51, 97, 12, 18)
    );
  }
}
