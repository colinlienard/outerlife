import {
  LayersComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Spaceship extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new PositionComponent(x, y));
    this.add(new SpriteComponent('/sprites/spaceship.png', 0, 0, 320, 103));
    this.add(
      new LayersComponent([
        {
          type: 'sprite',
          source: '/sprites/desert-environments.png',
          sourceX: 0,
          sourceY: 112,
          width: 271,
          height: 46,
          render: true,
          data: {
            x: 60,
            y: 73,
            rotation: 0,
            depth: -1,
          },
        },
      ])
    );
  }
}
