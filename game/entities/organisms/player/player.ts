import {
  AnimationComponent,
  CollisionComponent,
  DashComponent,
  HealthComponent,
  MeleeAttackComponent,
  MovementComponent,
  PositionComponent,
  SpriteComponent,
  LayersComponent,
  StateMachineComponent,
  AudioComponent,
} from '~~/game/components';
import { AudioManager, EventManager } from '~~/game/managers';
import {
  Direction,
  Entity,
  getAngleFromDirection,
  getPointFromAngle,
} from '~~/game/utils';
import { Dust, Slash } from '../../effects';

export class Player extends Entity {
  constructor(x: number, y: number, direction: Direction) {
    super();
    this.add(
      new AnimationComponent(
        {
          idle: {
            frameStart: 1,
            frameNumber: 8,
            framesPerSecond: 8,
          },
          hit: {
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
          dead: {
            frameStart: 27,
            frameNumber: 5,
            framesPerSecond: 6,
            then: 'die',
          },
        },
        0,
        [
          {
            action: () => this.footstep(),
            frame: 2,
            on: 'run',
          },
          {
            action: () => this.footstep(),
            frame: 6,
            on: 'run',
          },
          {
            action: () =>
              AudioManager.playEffect('/sounds/effects/dash.wav', {
                pitchVariance: 200,
              }),
            frame: 1,
            on: 'dash',
          },
          {
            action: () =>
              AudioManager.playEffect('/sounds/effects/desert-footsteps.wav', {
                pitchVariance: 200,
              }),
            frame: 1,
            on: 'dash-recovery',
          },
          {
            action: () =>
              AudioManager.playEffect('/sounds/effects/player-hit.wav', {
                pitchVariance: 200,
              }),
            frame: 1,
            on: 'hit',
          },
          {
            action: () => {
              const position = this.get(PositionComponent).getCenter();
              const { row } = this.get(AnimationComponent);
              const { angle } = this.get(MovementComponent);

              const point = getPointFromAngle(
                angle,
                position.x,
                position.y,
                16
              );

              EventManager.emit('spawn', new Slash(point.x, point.y, row, 30));
              AudioManager.playEffect('/sounds/effects/sword-slash.wav', {
                pitchVariance: 200,
              });
            },
            frame: 2,
            on: 'melee-attack',
          },
        ]
      )
    );
    this.add(
      new AudioComponent([
        '/sounds/effects/desert-footsteps.wav',
        '/sounds/effects/player-hit.wav',
        '/sounds/effects/sword-slash.wav',
        '/sounds/effects/dash.wav',
        '/sounds/effects/player-hit.wav',
      ])
    );
    this.add(
      new CollisionComponent([
        {
          type: 'hitbox',
          x: 7,
          y: 26,
          width: 18,
          height: 8,
        },
        {
          type: 'player-hurtbox',
          x: 11,
          y: 2,
          width: 10,
          height: 30,
        },
      ])
    );
    this.add(new DashComponent(7, 4, 0.5));
    this.add(new HealthComponent(this.id, 100));

    const layerItemIdle = {
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
    };
    this.add(
      new LayersComponent([
        {
          type: 'sprite',
          source: '/sprites/player.png',
          sourceX: 0,
          sourceY: 128,
          width: 12,
          height: 5,
          render: true,
          data: {
            x: 10,
            y: 29,
            rotation: 0,
            depth: -1,
          },
        },
        {
          type: 'sprite',
          source: '/sprites/items.png',
          sourceX: 0,
          sourceY: 0,
          width: 16,
          height: 16,
          animation: {
            idle: layerItemIdle,
            hit: layerItemIdle,
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
          render: true,
          data: {
            x: 8,
            y: 8,
            rotation: -45,
            depth: 1,
          },
        },
        {
          type: 'glow',
          color: [1, 1, 1],
          opacity: 0.1,
          data: {
            x: -48,
            y: -48,
          },
          render: true,
          size: 128,
        },
      ])
    );
    this.add(new MeleeAttackComponent(3, 0.3));
    this.add(
      new MovementComponent(1.5, 0.1, 0.15, getAngleFromDirection(direction))
    );
    this.add(new PositionComponent(x, y, 32, 32));
    this.add(new SpriteComponent('/sprites/player.png', 0, 0, 32, 32));
    this.add(new StateMachineComponent());

    // Add an event to get the center position
    EventManager.on('get-player-position', () =>
      this.get(StateMachineComponent).get() === 'dead'
        ? {
            x: 9999,
            y: 9999,
          }
        : this.get(PositionComponent).getCenter()
    );

    // Remove the event when changing scene
    EventManager.on('switch-map', () => {
      EventManager.unbind('get-player-position');
    });
  }

  footstep() {
    // Spawn dust effect
    const { x: xPos, y: yPos } = this.get(PositionComponent);
    EventManager.emit('spawn', new Dust(xPos, yPos + 16));

    // Play footstep
    AudioManager.playEffect('/sounds/effects/desert-footsteps.wav', {
      pitchVariance: 200,
    });
  }
}
