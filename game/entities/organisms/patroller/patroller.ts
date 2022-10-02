import {
  AI,
  Animation,
  Collision,
  Input,
  Position,
  Sprite,
  SpriteLayers,
  Velocity,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Patroller extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new AI(x, y, 100, 150));
    this.add(
      new Animation(
        {
          idle: {
            frameStart: 1,
            frameNumber: 6,
            framesPerSecond: 4,
          },
          run: {
            frameStart: 7,
            frameNumber: 4,
            framesPerSecond: 5,
          },
        },
        1
      )
    );
    this.add(new Collision('organism', 10, 26, 12, 8));
    this.add(new Input());
    this.add(new Position(x, y, 32, 32));
    this.add(new Sprite('/sprites/patroller.png', 0, 0, 32, 32));
    this.add(
      new SpriteLayers([
        {
          source: '/sprites/patroller.png',
          sourceX: 0,
          sourceY: 128,
          width: 12,
          height: 5,
          x: 10,
          y: 29,
          rotation: 0,
          depth: -1,
        },
      ])
    );
    this.add(new Velocity(0.4, 0.02, 0.04));
  }
}
