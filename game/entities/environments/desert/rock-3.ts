import {
  CollisionComponent,
  LayersComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Rock3 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(
      new CollisionComponent([
        {
          type: 'environment',
          x: 0,
          y: 9,
          width: 22,
          height: 8,
        },
      ])
    );
    this.add(new PositionComponent(x, y));
    this.add(
      new SpriteComponent('/sprites/desert-environments.png', 53, 1, 22, 17)
    );
    this.add(
      new LayersComponent([
        {
          type: 'sprite',
          source: '/sprites/desert-environments.png',
          sourceX: 52,
          sourceY: 20,
          width: 25,
          height: 11,
          render: true,
          data: {
            x: 1,
            y: 9,
            rotation: 0,
            depth: -1,
          },
        },
      ])
    );
  }
}
