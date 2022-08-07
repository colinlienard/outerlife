import { Animation, Collision, Position, Sprite } from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Slash extends Entity {
  constructor(x: number, y: number, row: number) {
    super();
    this.add(
      new Animation(
        {
          frameStart: 1,
          frameNumber: 4,
          framesPerSecond: 20,
          once: 'despawn',
        },
        row,
        [
          {
            action: () => this.delete(Collision),
            frame: 2,
          },
        ]
      )
    );
    this.add(new Position(x - 20, y - 20));
    this.add(new Sprite('/sprites/slash.png', 0, 0, 40, 40));

    switch (row) {
      case 0:
        this.add(new Collision('damage', 0, 4, 40, 20));
        break;
      case 1:
        this.add(new Collision('damage', 0, 16, 40, 20));
        break;
      case 2:
        this.add(new Collision('damage', 4, 0, 20, 40));
        break;
      case 3:
        this.add(new Collision('damage', 16, 0, 20, 40));
        break;
      default:
        break;
    }
  }
}
