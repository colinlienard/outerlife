import {
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class CaveEntrance extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(
      new CollisionComponent([
        {
          type: 'environment',
          x: 0,
          y: 0,
          width: 32,
          height: 32,
        },
        {
          type: 'environment',
          x: 0,
          y: 32,
          width: 4,
          height: 32,
        },
        {
          type: 'environment',
          x: 28,
          y: 32,
          width: 4,
          height: 32,
        },
      ])
    );
    this.add(new PositionComponent(x, y));
    this.add(
      new SpriteComponent('/sprites/desert-environments.png', 0, 96, 32, 64)
    );
  }
}
