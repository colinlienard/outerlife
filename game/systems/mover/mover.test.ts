import { describe, expect, it } from 'vitest';
import {
  Animation,
  Input,
  Position,
  SpriteLayers,
  Velocity,
} from '~~/game/components';
import { Entity } from '~~/game/utils';
import { Mover } from './mover';

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
      new Animation({
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
    this.add(new Input());
    this.add(new Position(0, 0));
    this.add(
      new SpriteLayers([
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
    this.add(new Velocity(2, 0.1, 0.2));
  }
}

describe('mover system', () => {
  const entity = new MovingEntity();
  const animation = entity.get(Animation);
  const input = entity.get(Input);
  const position = entity.get(Position);
  const spriteLayers = entity.get(SpriteLayers);

  const mover = new Mover();
  mover.setEntities([entity]);

  it("should change the entity's position", () => {
    input.movements.down = true;
    input.movements.right = true;
    mover.update();

    expect(position.x).toBeGreaterThan(0);
    expect(position.y).toBeGreaterThan(0);
  });

  it('should change the current animation', () => {
    expect(animation.getCurrentAnimationType()).toBe('run');

    input.movements.down = false;
    input.movements.right = false;
    mover.update();

    expect(animation.getCurrentAnimationType()).toBe('idle');
  });

  it('should update sprite layers', () => {
    expect(spriteLayers.getBack().length).toBe(0);
    expect(spriteLayers.getFront().length).toBe(1);

    input.movements.up = true;
    input.movements.right = true;
    mover.update();

    expect(spriteLayers.layers[0].rotation).toBe(45);
    expect(spriteLayers.getBack().length).toBe(1);
    expect(spriteLayers.getFront().length).toBe(0);
  });
});
