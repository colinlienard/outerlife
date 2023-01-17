import {
  CollisionComponent,
  LayersComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class SpaceshipTubes extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(
      new CollisionComponent([
        {
          type: 'environment',
          x: 0,
          y: 0,
          width: 30,
          height: 25,
        },
      ])
    );
    this.add(
      new LayersComponent([
        {
          type: 'glow',
          color: [0.5, 0.5, 1],
          opacity: 0.4,
          render: true,
          size: 64,
          data: {
            x: -16,
            y: -21,
          },
        },
      ])
    );
    this.add(new PositionComponent(x, y));
    this.add(
      new SpriteComponent('/sprites/spaceship-interior.png', 87, 74, 33, 28)
    );
  }
}
