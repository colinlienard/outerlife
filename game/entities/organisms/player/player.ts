import {
  Animation,
  Collision,
  Input,
  Position,
  Sprite,
  SpriteLayers,
  Velocity,
} from '~~/game/components';
import { Entity } from '~~/game/utils';
import { PlayerInput } from './components';

export class Player extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(
      new Animation(
        {
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
        },
        1
      )
    );
    this.add(new Collision('organism', 10, 26, 12, 8));
    this.add(new PlayerInput(), Input);
    this.add(new Position(x, y, 32, 32));
    this.add(new Sprite('/sprites/player.png', 0, 0, 32, 32));
    this.add(
      new SpriteLayers([
        {
          source: '/sprites/player.png',
          sourceX: 0,
          sourceY: 128,
          width: 12,
          height: 4,
          x: 10,
          y: 30,
          rotation: 0,
          depth: -1,
        },
        {
          source: '/sprites/items.png',
          sourceX: 0,
          sourceY: 0,
          width: 16,
          height: 16,
          x: 8,
          y: 8,
          rotation: 45,
          depth: -1,
          animation: {
            idle: {
              up: {
                x: 8,
                y: 8,
                rotation: -45,
                depth: 1,
              },
              down: {
                x: 8,
                y: 8,
                rotation: 45,
                depth: -1,
              },
              left: {
                x: 12,
                y: 8,
                rotation: 20,
                depth: -1,
              },
              right: {
                x: 2,
                y: 8,
                rotation: 15,
                depth: -1,
              },
            },
            run: {
              up: [
                {
                  x: 8,
                  y: 9,
                  rotation: -45,
                  depth: 1,
                },
                {
                  x: 8,
                  y: 7,
                  rotation: -45,
                  depth: 1,
                },
                {
                  x: 8,
                  y: 7,
                  rotation: -45,
                  depth: 1,
                },
                {
                  x: 8,
                  y: 8,
                  rotation: -45,
                  depth: 1,
                },
                {
                  x: 8,
                  y: 9,
                  rotation: -45,
                  depth: 1,
                },
                {
                  x: 8,
                  y: 7,
                  rotation: -45,
                  depth: 1,
                },
                {
                  x: 8,
                  y: 7,
                  rotation: -45,

                  depth: 1,
                },
                {
                  x: 8,
                  y: 8,
                  rotation: -45,
                  depth: 1,
                },
              ],
              down: [
                {
                  x: 8,
                  y: 9,
                  rotation: 45,
                  depth: -1,
                },
                {
                  x: 8,
                  y: 7,
                  rotation: 45,
                  depth: -1,
                },
                {
                  x: 8,
                  y: 7,
                  rotation: 45,
                  depth: -1,
                },
                {
                  x: 8,
                  y: 8,
                  rotation: 45,
                  depth: -1,
                },
                {
                  x: 8,
                  y: 9,
                  rotation: 45,
                  depth: -1,
                },
                {
                  x: 8,
                  y: 7,
                  rotation: 45,
                  depth: -1,
                },
                {
                  x: 8,
                  y: 7,
                  rotation: 45,
                  depth: -1,
                },
                {
                  x: 8,
                  y: 8,
                  rotation: 45,
                  depth: -1,
                },
              ],
              left: [
                {
                  x: 11,
                  y: 9,
                  rotation: 20,

                  depth: -1,
                },
                {
                  x: 11,
                  y: 7,
                  rotation: 20,
                  depth: -1,
                },
                {
                  x: 11,
                  y: 7,
                  rotation: 20,
                  depth: -1,
                },
                {
                  x: 11,
                  y: 8,
                  rotation: 20,
                  depth: -1,
                },
                {
                  x: 11,
                  y: 9,
                  rotation: 20,
                  depth: -1,
                },
                {
                  x: 11,
                  y: 7,
                  rotation: 20,
                  depth: -1,
                },
                {
                  x: 11,
                  y: 7,
                  rotation: 20,
                  depth: -1,
                },
                {
                  x: 11,
                  y: 8,
                  rotation: 20,
                  depth: -1,
                },
              ],
              right: [
                {
                  x: 3,
                  y: 9,
                  rotation: 15,
                  depth: -1,
                },
                {
                  x: 3,
                  y: 7,
                  rotation: 15,
                  depth: -1,
                },
                {
                  x: 3,
                  y: 7,
                  rotation: 15,
                  depth: -1,
                },
                {
                  x: 3,
                  y: 8,
                  rotation: 15,
                  depth: -1,
                },
                {
                  x: 3,
                  y: 9,
                  rotation: 15,
                  depth: -1,
                },
                {
                  x: 3,
                  y: 7,
                  rotation: 15,
                  depth: -1,
                },
                {
                  x: 3,
                  y: 7,
                  rotation: 15,
                  depth: -1,
                },
                {
                  x: 3,
                  y: 8,
                  rotation: 15,
                  depth: -1,
                },
              ],
            },
          },
        },
      ])
    );
    this.add(new Velocity(1.5, 0.1, 0.15));
  }
}
