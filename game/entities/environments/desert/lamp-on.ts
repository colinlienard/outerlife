import {
  LayersComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class LampOn extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new PositionComponent(x, y));
    this.add(
      new SpriteComponent('/sprites/desert-environments.png', 35, 97, 12, 18)
    );
    this.add(
      new LayersComponent([
        {
          type: 'glow',
          color: [0, 0.4, 1],
          opacity: 0.5,
          size: 128,
          render: true,
          data: {
            x: -64,
            y: -64,
          },
        },
      ])
    );
  }
}
