import {
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Damage extends Entity {
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    damages: number
  ) {
    super();
    this.add(
      new CollisionComponent([
        {
          type: 'damage-player',
          x: 0,
          y: 0,
          width,
          height,
          damages,
        },
      ])
    );
    this.add(new PositionComponent(x - width / 2, y - height / 2));
    this.add(new SpriteComponent('/sprites/player.png', 0, 0, 0, 0)); // Fake sprite so that its collision can be rendered
  }
}
