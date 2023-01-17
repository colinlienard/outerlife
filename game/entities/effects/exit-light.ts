import {
  LayersComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class ExitLight extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(
      new LayersComponent([
        {
          type: 'glow',
          color: [1, 1, 1],
          opacity: 0.2,
          render: true,
          size: 64,
          data: {
            x: -16,
            y: -16,
          },
        },
      ])
    );
    this.add(new PositionComponent(x, y));
    this.add(
      new SpriteComponent('/sprites/spaceship-interior.png', 48, 96, 32, 32)
    );
  }
}
