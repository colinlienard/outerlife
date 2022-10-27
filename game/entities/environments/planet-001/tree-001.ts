import { Entity } from '~~/game/utils';
import {
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
  LayersComponent,
} from '~~/game/components';

export class Tree001 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(
      new CollisionComponent([
        {
          type: 'environment',
          x: 20,
          y: 68,
          width: 14,
          height: 12,
        },
      ])
    );
    this.add(new PositionComponent(x, y, 64, 80));
    this.add(
      new SpriteComponent('/sprites/environments-001.png', 0, 0, 64, 80)
    );
    this.add(
      new LayersComponent([
        {
          type: 'sprite',
          source: '/sprites/environments-001.png',
          sourceX: 0,
          sourceY: 80,
          width: 64,
          height: 16,
          render: true,
          data: {
            x: 0,
            y: 68,
            rotation: 0,
            depth: -1,
          },
        },
      ])
    );
  }
}
