import { Entity } from '~~/game/utils';
import {
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
  SpriteLayersComponent,
} from '~~/game/components';

export class Tree001 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new CollisionComponent('environment', 20, 68, 14, 12));
    this.add(new PositionComponent(x, y, 64, 80));
    this.add(
      new SpriteComponent('/sprites/environments-001.png', 0, 0, 64, 80)
    );
    this.add(
      new SpriteLayersComponent([
        {
          source: '/sprites/environments-001.png',
          sourceX: 0,
          sourceY: 80,
          width: 64,
          height: 16,
          x: 0,
          y: 68,
          rotation: 0,
          depth: -1,
        },
      ])
    );
  }
}
