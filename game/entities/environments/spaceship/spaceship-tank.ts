import {
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class SpaceshipTank extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(
      new CollisionComponent([
        {
          type: 'environment',
          x: 0,
          y: 17,
          width: 32,
          height: 38,
        },
      ])
    );
    this.add(new PositionComponent(x, y));
    this.add(
      new SpriteComponent('/sprites/spaceship-interior.png', 51, 32, 35, 58)
    );
  }
}
