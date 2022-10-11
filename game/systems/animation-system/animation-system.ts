import {
  AnimationComponent,
  MovementComponent,
  SpriteComponent,
  SpriteLayersComponent,
} from '~~/game/components';
import { Emitter, System } from '~~/game/utils';
import { getDirectionFromAngle } from '~~/game/utils/helpers/getDirectionFromAngle';

export class AnimationSystem extends System {
  protected readonly requiredComponents = [AnimationComponent, SpriteComponent];

  update() {
    this.entities.forEach((entity) => {
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

      // Update animation based on movements
      if (entity.has(MovementComponent)) {
        const movement = entity.get(MovementComponent);

        const { direction, animationRow } = getDirectionFromAngle(
          movement.angle
        );

        // Update animation row
        animation.row = animationRow;

        // Update animation type
        const currentAnimation = animation.getCurrentAnimationType();
        switch (movement.state) {
          case 'still':
            if (currentAnimation === 'run') {
              animation.set('idle');
            }
            break;
          case 'run':
            if (currentAnimation === 'idle') {
              animation.set('run');
            }
            break;
          case 'dash':
            if (currentAnimation !== 'dash') {
              animation.set('dash');
            }
            break;
          default:
            break;
        }

        // Update sprite layers
        if (entity.has(SpriteLayersComponent)) {
          const spriteLayers = entity.get(SpriteLayersComponent);

          spriteLayers.setAnimated(
            spriteLayers.getAnimated().map((layer) => {
              if (!layer.animation) {
                return layer;
              }

              const layerAnimation =
                layer.animation[animation.getCurrentAnimationType()];

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
