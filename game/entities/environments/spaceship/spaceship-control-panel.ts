import {
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class SpaceshipControlPanel extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(
      new CollisionComponent([
        {
          type: 'environment',
          x: 0,
          y: 15,
          width: 21,
          height: 112,
        },
      ])
    );
    this.add(new PositionComponent(x, y));
    this.add(
      new SpriteComponent('/sprites/spaceship-interior.png', 129, 0, 33, 128)
    );
  }
}
