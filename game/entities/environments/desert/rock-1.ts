import {
  LayersComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Rock1 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new PositionComponent(x, y));
    this.add(
      new SpriteComponent('/sprites/desert-environments.png', 37, 3, 5, 4)
    );
    this.add(
      new LayersComponent([
        {
          type: 'sprite',
          source: '/sprites/desert-environments.png',
          sourceX: 36,
          sourceY: 9,
          width: 7,
          height: 3,
          render: true,
          data: {
            x: 1,
            y: 3,
            rotation: 0,
            depth: -1,
          },
        },
      ])
    );
  }
}
