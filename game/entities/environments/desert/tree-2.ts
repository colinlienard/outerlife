import {
  CollisionComponent,
  LayersComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Tree2 extends Entity {
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
      new SpriteComponent('/sprites/desert-environments.png', 2, 34, 43, 39)
    );
    this.add(
      new LayersComponent([
        {
          type: 'sprite',
          source: '/sprites/desert-environments.png',
          sourceX: 16,
          sourceY: 72,
          width: 27,
          height: 14,
          render: true,
          data: {
            x: 15,
            y: 31,
            rotation: 0,
            depth: -1,
          },
        },
      ])
    );
  }
}
