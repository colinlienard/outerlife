import { Animation, Position, Sprite } from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Dust extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(
      new Animation({
        frameStart: 1,
        frameNumber: 6,
        framesPerSecond: 16,
        once: 'despawn',
      })
    );
    this.add(new Position(x, y, 7, 3));
    this.add(new Sprite('/sprites/dust.png', 0, 0, 7, 3));
  }
}
