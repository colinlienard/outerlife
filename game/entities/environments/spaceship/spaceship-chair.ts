import {
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class SpaceshipChair extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(
      new CollisionComponent([
        {
          type: 'environment',
          x: 6,
          y: 32,
          width: 36,
          height: 18,
        },
      ])
    );
    this.add(new PositionComponent(x, y));
    this.add(
      new SpriteComponent('/sprites/spaceship-interior.png', 0, 32, 50, 55)
    );
  }
}
