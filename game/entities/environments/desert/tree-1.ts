import {
  LayersComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Tree1 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new PositionComponent(x, y));
    this.add(
      new SpriteComponent('/sprites/desert-environments.png', 51, 34, 15, 19)
    );
    this.add(
      new LayersComponent([
        {
          type: 'sprite',
          source: '/sprites/desert-environments.png',
          sourceX: 58,
          sourceY: 53,
          width: 15,
          height: 8,
          render: true,
          data: {
            x: 9,
            y: 14,
            rotation: 0,
            depth: -1,
          },
        },
      ])
    );
  }
}
