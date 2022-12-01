import {
  CollisionComponent,
  LayersComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Spaceship extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(
      new CollisionComponent([
        {
          type: 'environment',
          x: 49,
          y: 36,
          width: 240,
          height: 68,
        },
      ])
    );
    this.add(new PositionComponent(x, y));
    this.add(new SpriteComponent('/sprites/spaceship.png', 0, 0, 306, 104));
    this.add(
      new LayersComponent([
        {
          type: 'sprite',
          source: '/sprites/spaceship.png',
          sourceX: 0,
          sourceY: 112,
          width: 272,
          height: 50,
          render: true,
          data: {
            x: 60,
            y: 75,
            rotation: 0,
            depth: -1,
          },
        },
      ])
    );
  }
}
