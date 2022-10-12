import {
  AnimationComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Emitter, Entity } from '~~/game/utils';
import { Damage } from '../misc/damage';

export class Slash extends Entity {
  private readonly row: number;

  private collision: Damage | null = null;

  constructor(x: number, y: number, row: number, range: number) {
    super();
    this.add(
      new AnimationComponent(
        {
          frameStart: 1,
          frameNumber: 4,
          framesPerSecond: 20,
          then: 'despawn',
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

    let effectX = 0;
    let effectY = 0;
    switch (row) {
      case 0:
        effectY -= range;
        break;
      case 1:
        effectY += range;
        break;
      case 2:
        effectX -= range;
        break;
      case 3:
        effectX += range;
        break;
      default:
        break;
    }

    this.add(new PositionComponent(x - 20 + effectX, y - 20 + effectY));
    this.add(new SpriteComponent('/sprites/slash.png', 0, 0, 40, 40));

    this.row = row;
  }

  getCollision(): Damage {
    const { x, y } = this.get(PositionComponent);

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
