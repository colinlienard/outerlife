import { Entity } from '~~/game/utils';
import {
  CollisionComponent,
  LifeComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';

export class Grass001 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new CollisionComponent('alive', 0, 0, 16, 16));
    this.add(new LifeComponent());
    this.add(new PositionComponent(x, y, 16, 16));
    this.add(
      new SpriteComponent('/sprites/environments-001.png', 0, 160, 16, 16)
    );
  }
}
