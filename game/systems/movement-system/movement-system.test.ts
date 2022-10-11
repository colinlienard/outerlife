import { describe, expect, it } from 'vitest';
import {
  AnimationComponent,
  InputComponent,
  PositionComponent,
  SpriteLayersComponent,
  MovementComponent,
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
        recovery: {
          frameStart: 10,
          frameNumber: 1,
          framesPerSecond: 16,
        },
      })
    );
    this.add(new InputComponent());
    this.add(new PositionComponent(0, 0));
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
            recovery: {
              up: {},
              down: {},
              left: {},
              right: {},
            },
          },
        },
      ])
    );
    this.add(new MovementComponent(2, 0.1, 0.2));
  }
}

describe('movementSystem system', () => {
  const entity = new MovingEntity();
  const animation = entity.get(AnimationComponent);
  const input = entity.get(InputComponent);
  const position = entity.get(PositionComponent);
  const spriteLayers = entity.get(SpriteLayersComponent);

  const movementSystem = new MovementSystem();
  movementSystem.setEntities([entity]);

  it("should change the entity's position", () => {
    input.movements.down = true;
    input.movements.right = true;
    movementSystem.update();

    expect(position.x).toBeGreaterThan(0);
    expect(position.y).toBeGreaterThan(0);
  });

  it('should change the current animation', () => {
    expect(animation.getCurrent()).toBe('run');

    input.movements.down = false;
    input.movements.right = false;
    movementSystem.update();

    expect(animation.getCurrent()).toBe('idle');
  });

  it('should update sprite layers', () => {
    expect(spriteLayers.getBack().length).toBe(0);
    expect(spriteLayers.getFront().length).toBe(1);

    input.movements.up = true;
    input.movements.right = true;
    movementSystem.update();

    expect(spriteLayers.layers[0].rotation).toBe(45);
    expect(spriteLayers.getBack().length).toBe(1);
    expect(spriteLayers.getFront().length).toBe(0);
  });
});
