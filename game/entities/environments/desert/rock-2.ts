import {
  LayersComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Rock2 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new PositionComponent(x, y));
    this.add(
      new SpriteComponent('/sprites/desert-environments.png', 36, 18, 7, 6)
    );
    this.add(
      new LayersComponent([
        {
          type: 'sprite',
          source: '/sprites/desert-environments.png',
          sourceX: 35,
          sourceY: 26,
          width: 9,
          height: 4,
          render: true,
          data: {
            x: 0,
            y: 3,
            rotation: 0,
            depth: -1,
          },
        },
      ])
    );
  }
}
