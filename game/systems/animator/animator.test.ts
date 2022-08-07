import { describe, expect, it } from 'vitest';
import { Animation, Sprite } from '~~/game/components';
import { Entity } from '~~/game/utils';
import { Animator } from './animator';

class AnimatedEntity extends Entity {
  constructor() {
    super();
    this.add(
      new Animation(
        {
          frameStart: 1,
          frameNumber: 3,
          framesPerSecond: 16,
        },
        0,
        [
          {
            action: () => this.delete(Sprite),
            frame: 2,
          },
        ]
      )
    );
    this.add(new Sprite('', 0, 0, 0, 0));
  }
}

describe('animator system', () => {
  const entity = new AnimatedEntity();
  const animation = entity.get(Animation);

  const animator = new Animator();
  animator.setEntities([entity]);

  const updateAnimator = (times: number) => {
    [...new Array(times)].forEach(() => animator.update());
  };

  it('should have waited one frame', () => {
    animator.update();

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

    expect(entity.has(Sprite)).toBe(false);
  });

  it('should reach the end of the animation and restart', () => {
    updateAnimator(5);

    expect(animation.frameWaiter).toBe(0);
    expect(animation.column).toBe(0);
  });
});
