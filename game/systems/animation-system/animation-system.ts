import {
  AnimationComponent,
  MovementComponent,
  SpriteComponent,
  SpriteLayersComponent,
  StateMachineComponent,
} from '~~/game/components';
import { Emitter, System } from '~~/game/utils';
import { getDirectionFromAngle } from '~~/game/utils/helpers/getDirectionFromAngle';

export class AnimationSystem extends System {
  protected readonly requiredComponents = [AnimationComponent, SpriteComponent];

  update() {
    this.get().forEach((entity) => {
      const animation = entity.get(AnimationComponent);

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
                (action.on ? action.on === animation.getCurrent() : true)
              ) {
                action.action();
              }
            }
          }

          // When the animation ends
        } else if (animation.current.then) {
          if (animation.current.then === 'despawn') {
            Emitter.emit('despawn', entity.id);
          } else {
            entity.get(StateMachineComponent).set(animation.current.then);
          }

          // Reset animation
        } else {
          animation.column = 0;
        }
      } else {
        animation.frameWaiter += 1;
      }

      // Update animation based on state
      if (entity.has(StateMachineComponent)) {
        const movement = entity.get(MovementComponent);
        const state = entity.get(StateMachineComponent).get();

        const { direction, animationRow } = getDirectionFromAngle(
          movement.angle
        );

        // Update animation row
        animation.row = animationRow;

        // Update animation type
        if (animation.getCurrent() !== state) {
          animation.set(state);
        }

        // Update sprite layers
        if (entity.has(SpriteLayersComponent)) {
          const spriteLayers = entity.get(SpriteLayersComponent);

          spriteLayers.setAnimated(
            spriteLayers.getAnimated().map((layer) => {
              if (!layer.animation) {
                return layer;
              }

              const layerAnimation = layer.animation[animation.getCurrent()];

              if (!layerAnimation) {
                return layer;
              }

              const data = layerAnimation[direction];
              if (Array.isArray(data)) {
                return { ...layer, ...data[animation.column] };
              }
              return { ...layer, ...data };
            })
          );
        }
      }
    });
  }
}
