import {
  AnimationComponent,
  CollisionComponent,
  DashComponent,
  MeleeAttackComponent,
  MovementComponent,
  PositionComponent,
  SpriteComponent,
  SpriteLayersComponent,
  StateMachineComponent,
} from '~~/game/components';
import { Emitter, Entity } from '~~/game/utils';
import { Dust, Slash } from '../../effects';

export class Player extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(
      new AnimationComponent(
        {
          idle: {
            frameStart: 1,
            frameNumber: 8,
            framesPerSecond: 8,
          },
          run: {
            frameStart: 9,
            frameNumber: 8,
            framesPerSecond: 12,
          },
          'melee-attack': {
            frameStart: 17,
            frameNumber: 5,
            framesPerSecond: 20,
            then: 'idle',
          },
          dash: {
            frameStart: 22,
            frameNumber: 2,
            framesPerSecond: 12,
          },
          'dash-recovery': {
            frameStart: 24,
            frameNumber: 3,
            framesPerSecond: 8,
            then: 'idle',
          },
        },
        1,
        [
          {
            action: () => this.spawnDust(),
            frame: 1,
            on: 'run',
          },
          {
            action: () => this.spawnDust(),
            frame: 5,
            on: 'run',
          },
          {
            action: () => {
              const position = this.get(PositionComponent);
              const animation = this.get(AnimationComponent);

              Emitter.emit(
                'spawn',
                new Slash(position.x + 16, position.y + 16, animation.row, 18)
              );
            },
            frame: 1,
            on: 'melee-attack',
          },
        ]
      )
    );
    this.add(
      new CollisionComponent([
        {
          type: 'hitbox',
          x: 10,
          y: 26,
          width: 12,
          height: 8,
        },
      ])
    );
    this.add(new DashComponent(7, 4, 0.5));
    this.add(new MeleeAttackComponent(3, 0.3));
    this.add(new MovementComponent(1.5, 0.1, 0.15));
    this.add(new PositionComponent(x, y, 32, 32));
    this.add(new SpriteComponent('/sprites/player.png', 0, 0, 32, 32));
    this.add(
      new SpriteLayersComponent([
        {
          source: '/sprites/player.png',
          sourceX: 0,
          sourceY: 128,
          width: 12,
          height: 5,
          x: 10,
          y: 29,
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
            'melee-attack': {
              up: [
                {
                  x: 0,
                  y: 16,
                  rotation: 40,
                  depth: -1,
                },
                {
                  x: 20,
                  y: 4,
                  rotation: 190,
                  depth: -1,
                },
                {
                  x: 22,
                  y: 9,
                  rotation: 240,
                  depth: -1,
                },
                {
                  x: 22,
                  y: 9,
                  rotation: 240,
                  depth: -1,
                },
                {
                  x: 16,
                  y: 8,
                  rotation: 190,
                  depth: -1,
                },
              ],
              down: [
                {
                  x: 18,
                  y: 4,
                  rotation: -150,
                  depth: -1,
                },
                {
                  x: -8,
                  y: 5,
                  rotation: 60,
                  depth: -1,
                },
                {
                  x: -2,
                  y: -5,
                  rotation: 100,
                  depth: -1,
                },
                {
                  x: -2,
                  y: -5,
                  rotation: 100,
                  depth: -1,
                },
                {
                  x: 4,
                  y: 20,
                  rotation: -20,
                  depth: 1,
                },
              ],
              left: [
                {
                  x: 14,
                  y: 6,
                  rotation: -120,
                  depth: 1,
                },
                {
                  x: 10,
                  y: 0,
                  rotation: 140,
                  depth: -1,
                },
                {
                  x: 16,
                  y: 2,
                  rotation: 190,
                  depth: -1,
                },
                {
                  x: 16,
                  y: 2,
                  rotation: 190,
                  depth: -1,
                },
                {
                  x: 6,
                  y: 14,
                  rotation: 80,
                  depth: -1,
                },
              ],
              right: [
                {
                  x: 4,
                  y: 4,
                  rotation: 120,
                  depth: -1,
                },
                {
                  x: -5,
                  y: 8,
                  rotation: 40,
                  depth: 1,
                },
                {
                  x: -5,
                  y: 0,
                  rotation: 100,
                  depth: -1,
                },
                {
                  x: -5,
                  y: 0,
                  rotation: 100,
                  depth: -1,
                },
                {
                  x: 8,
                  y: 18,
                  rotation: -50,
                  depth: 1,
                },
              ],
            },
            dash: {
              up: {
                x: 8,
                y: 5,
                rotation: -80,
                depth: 1,
              },
              down: {
                depth: -1,
                rotation: 0,
                x: 8,
                y: 8,
              },
              left: {
                depth: -1,
                rotation: 0,
                x: 8,
                y: 8,
              },
              right: {
                depth: -1,
                rotation: 0,
                x: 8,
                y: 8,
              },
            },
            'dash-recovery': {
              up: [
                {
                  x: 8,
                  y: 5,
                  rotation: -80,
                  depth: 1,
                },
                {
                  x: 8,
                  y: 6,
                  rotation: -70,
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
                  depth: -1,
                  rotation: 0,
                  x: 8,
                  y: 8,
                },
                {
                  depth: -1,
                  rotation: 0,
                  x: 8,
                  y: 8,
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
                  depth: -1,
                  rotation: 0,
                  x: 8,
                  y: 8,
                },
                {
                  x: 10,
                  y: 9,
                  rotation: 20,
                  depth: -1,
                },
                {
                  x: 12,
                  y: 8,
                  rotation: 20,
                  depth: -1,
                },
              ],
              right: [
                {
                  depth: -1,
                  rotation: 0,
                  x: 8,
                  y: 8,
                },
                {
                  x: 4,
                  y: 9,
                  rotation: 15,
                  depth: -1,
                },
                {
                  x: 2,
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
    this.add(new StateMachineComponent());

    // Add an event to get the center position
    Emitter.on('get-player-position', () =>
      this.get(PositionComponent).getCenter()
    );

    // Remove the event when changing scene
    Emitter.on('switch-map', () => {
      Emitter.unbind('get-player-position');
    });
  }

  spawnDust() {
    const { x: xPos, y: yPos } = this.get(PositionComponent);
    Emitter.emit('spawn', new Dust(xPos + 8, yPos + 24));
  }
}
