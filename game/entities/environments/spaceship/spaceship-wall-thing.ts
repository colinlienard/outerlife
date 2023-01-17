import {
  LayersComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class SpaceshipWallThing extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(
      new LayersComponent([
        {
          type: 'glow',
          color: [1, 0, 0],
          opacity: 0.3,
          render: true,
          size: 32,
          data: {
            x: -6,
            y: -8,
          },
        },
      ])
    );
    this.add(new PositionComponent(x, y));
    this.add(
      new SpriteComponent('/sprites/spaceship-interior.png', 0, 88, 20, 17)
    );
  }
}
