import { Animation, Sprite } from '~~/game/components';
import { System } from '~~/game/utils';

export class Animator extends System {
  readonly requiredComponents = [Animation, Sprite];

  update() {
    this.entities.forEach((entity) => {
      const animation = entity.get(Animation);

      // Execute the following every {specified number} frames per second
      if (
        animation.frameWaiter >=
        60 / animation.currentAnimation.framesPerSecond
      ) {
        animation.frameWaiter = 0;

        // Move forward in the animation
        if (animation.column < animation.currentAnimation.frameNumber - 1) {
          animation.column += 1;
        }

        // Delete instance after its animation
        // else if (this.currentAnimation.once) {
        //   delete this.entities[this.entities.indexOf(entity)];
        // }

        // Reset animation
        else {
          animation.column = 0;
        }
      } else {
        animation.frameWaiter += 1;
      }
    });
  }
}
