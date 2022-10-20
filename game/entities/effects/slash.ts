import {
  AnimationComponent,
  Collision,
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Slash extends Entity {
  private readonly row: number;

  constructor(x: number, y: number, row: number) {
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
            action: () =>
              this.add(new CollisionComponent([this.getCollision()])),
            frame: 2,
          },
          {
            action: () => this.delete(CollisionComponent),
            frame: 3,
          },
        ]
      )
    );

    // let effectX = 0;
    // let effectY = 0;
    // switch (row) {
    //   case 0:
    //     effectY -= range;
    //     break;
    //   case 1:
    //     effectY += range;
    //     break;
    //   case 2:
    //     effectX -= range;
    //     break;
    //   case 3:
    //     effectX += range;
    //     break;
    //   default:
    //     break;
    // }

    this.add(new PositionComponent(x - 20, y - 20));
    this.add(new SpriteComponent('/sprites/slash.png', 0, 0, 40, 40));

    this.row = row;
  }

  getCollision(): Collision {
    switch (this.row) {
      case 0:
        return {
          type: 'damage-ai',
          x: 0,
          y: 0,
          width: 40,
          height: 32,
        };
      case 1:
        return {
          type: 'damage-ai',
          x: 0,
          y: 8,
          width: 40,
          height: 32,
        };
      case 2:
        return {
          type: 'damage-ai',
          x: 0,
          y: 0,
          width: 32,
          height: 40,
        };
      case 3:
        return {
          type: 'damage-ai',
          x: 8,
          y: 0,
          width: 32,
          height: 40,
        };
      default:
        throw new Error(`Invalid row '${this.row}' in Slash entity.`);
    }
  }
}
