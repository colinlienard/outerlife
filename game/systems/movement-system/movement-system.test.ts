import { describe, expect, it } from 'vitest';
import {
  AnimationComponent,
  PositionComponent,
  MovementComponent,
  SpriteLayersComponent,
  StateMachineComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';
import { MovementSystem } from './movement-system';

class MovingEntity extends Entity {
  constructor() {
    const spriteAnimation = {
      x: 0,
      y: 0,
      rotation: 0,
      depth: 1,
    };

    super();
    this.add(
      new AnimationComponent({
        idle: {
          frameStart: 1,
          frameNumber: 3,
          framesPerSecond: 16,
        },
        run: {
          frameStart: 4,
          frameNumber: 3,
          framesPerSecond: 16,
        },
        'melee-attack': {
          frameStart: 7,
          frameNumber: 3,
          framesPerSecond: 16,
        },
        dash: {
          frameStart: 10,
          frameNumber: 1,
          framesPerSecond: 16,
        },
        'dash-recovery': {
          frameStart: 10,
          frameNumber: 1,
          framesPerSecond: 16,
        },
      })
    );
    this.add(new PositionComponent(0, 0));
    this.add(new MovementComponent(2, 0.1, 0.2));
    this.add(
      new SpriteLayersComponent([
        {
          source: '',
          sourceX: 0,
          sourceY: 0,
          width: 16,
          height: 16,
          x: 0,
          y: 0,
          rotation: 0,
          depth: 1,
          animation: {
            idle: {
              up: spriteAnimation,
              down: spriteAnimation,
              left: spriteAnimation,
              right: spriteAnimation,
            },
            run: {
              up: spriteAnimation,
              down: spriteAnimation,
              left: spriteAnimation,
              right: {
                rotation: 45,
                depth: -1,
              },
            },
            'melee-attack': {
              up: spriteAnimation,
              down: spriteAnimation,
              left: spriteAnimation,
              right: spriteAnimation,
            },
            dash: {
              up: {},
              down: {},
              left: {},
              right: {},
            },
            'dash-recovery': {
              up: {},
              down: {},
              left: {},
              right: {},
            },
          },
        },
      ])
    );
    this.add(new StateMachineComponent());
  }
}

describe('movement system', () => {
  const entity = new MovingEntity();
  const position = entity.get(PositionComponent);
  const movement = entity.get(MovementComponent);
  const stateMachine = entity.get(StateMachineComponent);

  const movementSystem = new MovementSystem();
  movementSystem.setEntities([entity]);

  it("should change the entity's position", () => {
    stateMachine.set('run');
    movement.angle = 45;

    movementSystem.update();

    expect(position.x).toBeGreaterThan(0);
    expect(position.y).toBeGreaterThan(0);
  });
});
