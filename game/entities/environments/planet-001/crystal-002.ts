import { Entity } from '~~/game/utils';
import {
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
  SpriteLayersComponent,
} from '~~/game/components';

export class Crystal002 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(
      new CollisionComponent([
        {
          type: 'environment',
          x: 4,
          y: 22,
          width: 26,
          height: 10,
        },
      ])
    );
    this.add(new PositionComponent(x, y, 32, 32));
    this.add(
      new SpriteComponent('/sprites/environments-001.png', 48, 112, 32, 32)
    );
    this.add(
      new SpriteLayersComponent([
        {
          source: '/sprites/environments-001.png',
          sourceX: 48,
          sourceY: 144,
          width: 32,
          height: 16,
          x: 0,
          y: 22,
          rotation: 0,
          depth: -1,
        },
      ])
    );
  }
}
