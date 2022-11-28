import {
  CollisionComponent,
  LayersComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Rock4 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(
      new CollisionComponent([
        {
          type: 'environment',
          x: 8,
          y: 35,
          width: 28,
          height: 12,
        },
      ])
    );
    this.add(new PositionComponent(x, y));
    this.add(
      new SpriteComponent('/sprites/desert-environments.png', 83, 2, 24, 24)
    );
    this.add(
      new LayersComponent([
        {
          type: 'sprite',
          source: '/sprites/desert-environments.png',
          sourceX: 81,
          sourceY: 32,
          width: 30,
          height: 14,
          render: true,
          data: {
            x: 0,
            y: 14,
            rotation: 0,
            depth: -1,
          },
        },
      ])
    );
  }
}
