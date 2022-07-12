import {
  Animation,
  // Collider,
  Movements,
  Position,
  Sprite,
} from '~~/game/components';
import { Entity } from '~~/game/utils';
import { Events } from './components';

export class Player extends Entity {
  constructor() {
    const animation = {
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
    };
    // const collider = new Box(10, 26, 12, 8);

    super();
    this.add(new Sprite('/sprites/player.png', 0, 0, 32, 32));
    this.add(new Position(100, 100));
    this.add(new Animation(animation));
    this.add(new Events());
    this.add(new Movements(this, 1.5, 0.1, 0.15));
    // this.add(new Collider(collider));
  }
}
