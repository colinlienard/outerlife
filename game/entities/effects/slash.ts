import { Animation, Position, Sprite } from '~~/game/components';
import { Emitter, Entity } from '~~/game/utils';
import { Damage } from '../misc/damage';

export class Slash extends Entity {
  private readonly row: number;

  private collision: Damage | null = null;

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
            action: () => this.spawnCollision(),
            frame: 1,
          },
          {
            action: () => this.despawnCollision(),
            frame: 2,
          },
        ]
      )
    );
    this.add(new Position(x - 20, y - 20));
    this.add(new Sprite('/sprites/slash.png', 0, 0, 40, 40));

    this.row = row;
  }

  getCollision(): Damage {
    const { x, y } = this.get(Position);

    switch (this.row) {
      case 0:
        return new Damage(x, y + 4, 40, 20);
      case 1:
        return new Damage(x, y + 16, 40, 20);
      case 2:
        return new Damage(x + 4, y, 20, 40);
      case 3:
        return new Damage(x + 16, y, 20, 40);
      default:
        throw new Error(`Wrong row provided: '${this.row}'`);
    }
  }

  spawnCollision() {
    this.collision = this.getCollision();
    Emitter.emit('spawn', this.collision);
  }

  despawnCollision() {
    Emitter.emit('despawn', this.collision as Damage);
  }
}
