import {
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class SpaceshipBox extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(
      new CollisionComponent([
        {
          type: 'environment',
          x: 0,
          y: 8,
          width: 16,
          height: 8,
        },
      ])
    );
    this.add(new PositionComponent(x, y));
    this.add(
      new SpriteComponent('/sprites/spaceship-interior.png', 21, 88, 19, 19)
    );
  }
}
