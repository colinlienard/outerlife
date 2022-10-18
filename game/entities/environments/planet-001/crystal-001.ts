import { Entity } from '~~/game/utils';
import {
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
  SpriteLayersComponent,
} from '~~/game/components';

export class Crystal001 extends Entity {
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
    this.add(new PositionComponent(x, y, 48, 48));
    this.add(
      new SpriteComponent('/sprites/environments-001.png', 0, 96, 48, 48)
    );
    this.add(
      new SpriteLayersComponent([
        {
          source: '/sprites/environments-001.png',
          sourceX: 0,
          sourceY: 144,
          width: 48,
          height: 10,
          x: 0,
          y: 40,
          rotation: 0,
          depth: -1,
        },
      ])
    );
  }
}
