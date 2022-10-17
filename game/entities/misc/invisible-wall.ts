import {
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class InvisibleWall extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super();
    this.add(new CollisionComponent('environment', 0, 0, width, height));
    this.add(new PositionComponent(x, y));
    this.add(new SpriteComponent('/sprites/player.png', 0, 0, 0, 0)); // Fake sprite so that its collision can be rendered
  }
}
