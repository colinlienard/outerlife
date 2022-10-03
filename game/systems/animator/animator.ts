import { Animation, Sprite } from '~~/game/components';
import { Emitter, System } from '~~/game/utils';

export class Animator extends System {
  protected readonly requiredComponents = [Animation, Sprite];

  update() {
    this.entities.forEach((entity) => {
      const animation = entity.get(Animation);

      // Set animation to the begining if it changes
      if (animation.current !== animation.old) {
        animation.column = 0;
        animation.old = animation.current;
      }

      // Execute the following every {specified number} frames per second
      if (animation.frameWaiter >= 60 / animation.current.framesPerSecond) {
        animation.frameWaiter = 0;

        // Move forward in the animation
        if (animation.column < animation.current.frameNumber - 1) {
          animation.column += 1;

          // Handle actions
          if (animation.actions) {
            for (const action of animation.actions) {
              if (
                action.frame === animation.column &&
                (action.onType
                  ? action.onType === animation.getCurrentAnimationType()
                  : true)
              ) {
                action.action();
                return;
              }
            }
          }
        }

        // Delete instance after its animation
        else if (animation.current.once) {
          if (animation.current.once === 'despawn') {
            Emitter.emit('despawn', entity);
          } else {
            animation.current.once();
          }
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
