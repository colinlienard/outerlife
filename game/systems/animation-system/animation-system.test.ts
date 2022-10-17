import { describe, expect, it } from 'vitest';
import {
  AnimationComponent,
  MovementComponent,
  SpriteComponent,
  SpriteLayersComponent,
  StateMachineComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';
import { AnimationSystem } from './animation-system';

class AnimatedEntity extends Entity {
  constructor() {
    const spriteAnimation = {
      x: 0,
      y: 0,
      rotation: 0,
      depth: 1,
    };

    super();
    this.add(
      new AnimationComponent(
        {
          idle: {
            frameStart: 1,
            frameNumber: 3,
            framesPerSecond: 16,
          },
          run: {
            frameStart: 1,
            frameNumber: 3,
            framesPerSecond: 16,
          },
        },
        0,
        [
          {
            action: () => this.delete(SpriteComponent),
            frame: 2,
          },
        ]
      )
    );
    this.add(new MovementComponent(2, 0.1, 0.2));
    this.add(new SpriteComponent('', 0, 0, 0, 0));

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
          },
        },
      ])
    );
    this.add(new StateMachineComponent());
  }
}

describe('animation system', () => {
  const entity = new AnimatedEntity();
  const animation = entity.get(AnimationComponent);
  const movement = entity.get(MovementComponent);
  const spriteLayers = entity.get(SpriteLayersComponent);
  const stateMachine = entity.get(StateMachineComponent);

  const animationSystem = new AnimationSystem();
  animationSystem.check(entity);

  const updateAnimationSystem = (times: number) => {
    [...new Array(times)].forEach(() => animationSystem.update());
  };

  it('should have waited one frame', () => {
    animationSystem.update();

    expect(animation.frameWaiter).toBe(1);
    expect(animation.column).toBe(0);
  });

  it('should move forward in the animation', () => {
    updateAnimationSystem(4);

    expect(animation.frameWaiter).toBe(0);
    expect(animation.column).toBe(1);
  });

  it('should do an action on a specific frame', () => {
    updateAnimationSystem(5);

    expect(entity.has(SpriteComponent)).toBe(false);
  });

  it('should reach the end of the animation and restart', () => {
    updateAnimationSystem(5);

    expect(animation.frameWaiter).toBe(0);
    expect(animation.column).toBe(0);
  });

  it('should change the current animation', () => {
    stateMachine.set('run');
    updateAnimationSystem(1);

    expect(animation.getCurrent()).toBe('run');

    stateMachine.set('idle');
    updateAnimationSystem(1);

    expect(animation.getCurrent()).toBe('idle');
  });

  it('should update sprite layers', () => {
    expect(spriteLayers.getBack().length).toBe(0);
    expect(spriteLayers.getFront().length).toBe(1);

    stateMachine.set('run');
    movement.angle = 0;
    updateAnimationSystem(1);

    expect(spriteLayers.layers[0].rotation).toBe(45);
    expect(spriteLayers.getBack().length).toBe(1);
    expect(spriteLayers.getFront().length).toBe(0);
  });
});
