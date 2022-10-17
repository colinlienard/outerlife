import { Entity } from '~~/game/utils';
import {
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
  SpriteLayersComponent,
} from '~~/game/components';

export class Tree002 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new CollisionComponent('environment', 24, 74, 16, 12));
    this.add(new PositionComponent(x, y, 64, 86));
    this.add(
      new SpriteComponent('/sprites/environments-001.png', 64, 0, 64, 86)
    );
    this.add(
      new SpriteLayersComponent([
        {
          source: '/sprites/environments-001.png',
          sourceX: 64,
          sourceY: 96,
          width: 64,
          height: 16,
          x: 0,
          y: 74,
          rotation: 0,
          depth: -1,
        },
      ])
    );
  }
}
