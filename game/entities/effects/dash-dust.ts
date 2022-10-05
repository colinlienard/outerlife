import { Animation, Position, Sprite } from '~~/game/components';
import { Entity } from '~~/game/utils';

export class DashDust extends Entity {
  constructor(x: number, y: number, row: number) {
    super();
    this.add(
      new Animation(
        {
          frameStart: 1,
          frameNumber: 7,
          framesPerSecond: 16,
          once: 'despawn',
        },
        row
      )
    );
    this.add(new Position(x, y, 10, 6));
    this.add(new Sprite('/sprites/dash-dust.png', 0, 0, 10, 6));
  }
}
