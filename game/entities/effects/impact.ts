import {
  AnimationComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Impact extends Entity {
  constructor(x: number, y: number) {
    super();
    const row = Math.random() > 0.5 ? 1 : 0;
    this.add(
      new AnimationComponent(
        {
          frameStart: 1,
          frameNumber: 3,
          framesPerSecond: 16,
          then: 'despawn',
        },
        row
      )
    );
    this.add(new PositionComponent(x, y, 32, 32));
    this.add(new SpriteComponent('/sprites/impact.png', 0, 0, 32, 32));
  }
}
