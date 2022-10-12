import {
  AnimationComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class DashDust extends Entity {
  constructor(x: number, y: number, row: number) {
    super();
    this.add(
      new AnimationComponent(
        {
          frameStart: 1,
          frameNumber: 7,
          framesPerSecond: 16,
          then: 'despawn',
        },
        row
      )
    );
    this.add(new PositionComponent(x, y, 10, 6));
    this.add(new SpriteComponent('/sprites/dash-dust.png', 0, 0, 10, 6));
  }
}
