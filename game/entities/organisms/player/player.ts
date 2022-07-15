import {
  Animation,
  Collision,
  Position,
  Shadow,
  Sprite,
  Velocity,
} from '~~/game/components';
import { Entity } from '~~/game/utils';
import { PlayerInput } from './components';

export class Player extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(
      new Animation({
        idle: {
          frameStart: 1,
          frameNumber: 7,
          framesPerSecond: 8,
        },
        run: {
          frameStart: 8,
          frameNumber: 8,
          framesPerSecond: 12,
        },
      })
    );
    this.add(new Collision('organism', 10, 26, 12, 8));
    this.add(new PlayerInput());
    this.add(new Position(x, y, 32, 32));
    this.add(new Shadow(0, 128, 12, 4, 10, 30));
    this.add(new Sprite('/sprites/player.png', 0, 0, 32, 32));
    this.add(new Velocity(1.5, 0.1, 0.15));
  }
}
