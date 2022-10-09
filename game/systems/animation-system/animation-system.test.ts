import { describe, expect, it } from 'vitest';
import { AnimationComponent, SpriteComponent } from '~~/game/components';
import { Entity } from '~~/game/utils';
import { AnimationSystem } from './animation-system';

class AnimatedEntity extends Entity {
  constructor() {
    super();
    this.add(
      new AnimationComponent(
        {
          frameStart: 1,
          frameNumber: 3,
          framesPerSecond: 16,
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
    this.add(new SpriteComponent('', 0, 0, 0, 0));
  }
}

describe('animationSystem system', () => {
  const entity = new AnimatedEntity();
  const animation = entity.get(AnimationComponent);

  const animationSystem = new AnimationSystem();
  animationSystem.setEntities([entity]);

  const updateAnimator = (times: number) => {
    [...new Array(times)].forEach(() => animationSystem.update());
  };

  it('should have waited one frame', () => {
    animationSystem.update();

    expect(animation.frameWaiter).toBe(1);
    expect(animation.column).toBe(0);
  });

  it('should move forward in the animation', () => {
    updateAnimator(4);

    expect(animation.frameWaiter).toBe(0);
    expect(animation.column).toBe(1);
  });

  it('should do an action on a specific frame', () => {
    updateAnimator(5);

    expect(entity.has(SpriteComponent)).toBe(false);
  });

  it('should reach the end of the animation and restart', () => {
    updateAnimator(5);

    expect(animation.frameWaiter).toBe(0);
    expect(animation.column).toBe(0);
  });
});
