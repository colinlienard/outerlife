import {
  AnimationComponent,
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Slash extends Entity {
  private readonly row: number;

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
            action: () => this.addCollision(),
            frame: 1,
          },
          {
            action: () => this.delete(CollisionComponent),
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

  addCollision() {
    switch (this.row) {
      case 0:
        this.add(new CollisionComponent('damage', 0, 4, 40, 20));
        break;
      case 1:
        this.add(new CollisionComponent('damage', 0, 16, 40, 20));
        break;
      case 2:
        this.add(new CollisionComponent('damage', 4, 0, 20, 40));
        break;
      case 3:
        this.add(new CollisionComponent('damage', 16, 0, 20, 40));
        break;
      default:
        break;
    }
  }
}
