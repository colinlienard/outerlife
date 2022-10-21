import { Entity } from '~~/game/utils';
import {
  HealthComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';

export class Grass001 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new HealthComponent(1));
    this.add(new PositionComponent(x, y, 16, 16));
    this.add(
      new SpriteComponent('/sprites/environments-001.png', 0, 160, 16, 16)
    );
  }
}
