import { Animation, Position, Sprite } from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Slash extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(
      new Animation({
        frameStart: 1,
        frameNumber: 4,
        framesPerSecond: 16,
        once: 'despawn',
      })
    );
    this.add(new Position(x, y));
    this.add(new Sprite('/sprites/slash.png', 0, 0, 40, 40));
  }
}
