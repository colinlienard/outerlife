import { Animation, Sprite } from '~~/game/components';
import { Emitter, System } from '~~/game/utils';

export class Animator extends System {
  protected readonly requiredComponents = [Animation, Sprite];

  update() {
    this.entities.forEach((entity) => {
      const animation = entity.get(Animation);

      // Execute the following every {specified number} frames per second
      if (animation.frameWaiter >= 60 / animation.current.framesPerSecond) {
        animation.frameWaiter = 0;

        // Move forward in the animation
        if (animation.column < animation.current.frameNumber - 1) {
          animation.column += 1;
        }

        // Delete instance after its animation
        else if (animation.current.once) {
          Emitter.emit('despawn', entity);
        }

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
