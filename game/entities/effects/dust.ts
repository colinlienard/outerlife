import {
  AnimationComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Dust extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(
      new AnimationComponent({
        frameStart: 1,
        frameNumber: 6,
        framesPerSecond: 16,
        once: 'despawn',
      })
    );
    this.add(new PositionComponent(x, y, 7, 3));
    this.add(new SpriteComponent('/sprites/dust.png', 0, 0, 7, 3));
  }
}
