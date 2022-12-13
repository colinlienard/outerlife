import {
  AnimationComponent,
  Collision,
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { AudioManager, Entity } from '~~/game/utils';

export class Slash extends Entity {
  private readonly row: number;

  constructor(x: number, y: number, row: number, damages: number) {
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
              this.add(new CollisionComponent([this.getCollision(damages)])),
            frame: 2,
          },
          {
            action: () => this.delete(CollisionComponent),
            frame: 3,
          },
        ]
      )
    );
    this.add(new PositionComponent(x - 20, y - 20));
    this.add(new SpriteComponent('/sprites/slash.png', 0, 0, 40, 40));

    this.row = row;

    AudioManager.playEffect('/sounds/sword-slash.wav', 200);
  }

  getCollision(damages: number): Collision {
    switch (this.row) {
      case 0:
        return {
          type: 'damage-ai',
          x: 0,
          y: 0,
          width: 40,
          height: 32,
          damages,
        };
      case 1:
        return {
          type: 'damage-ai',
          x: 0,
          y: 8,
          width: 40,
          height: 32,
          damages,
        };
      case 2:
        return {
          type: 'damage-ai',
          x: 0,
          y: 0,
          width: 32,
          height: 40,
          damages,
        };
      case 3:
        return {
          type: 'damage-ai',
          x: 8,
          y: 0,
          width: 32,
          height: 40,
          damages,
        };
      default:
        throw new Error(`Invalid row '${this.row}' in Slash entity.`);
    }
  }
}
