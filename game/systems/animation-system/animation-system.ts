import {
  AnimationComponent,
  MovementComponent,
  SpriteComponent,
  SpriteLayersComponent,
  StateMachineComponent,
} from '~~/game/components';
import {
  Emitter,
  entityDies,
  getDirectionFromAngle,
  System,
} from '~~/game/utils';

export class AnimationSystem extends System {
  protected readonly requiredComponents = [AnimationComponent, SpriteComponent];

  update() {
    this.get().forEach((entity) => {
      const animation = entity.get(AnimationComponent);

      // Handle actions
      if (animation.frameWaiter === 0 && animation.actions) {
        for (const action of animation.actions) {
          if (
            action.frame === animation.column + 1 &&
            (action.on ? action.on === animation.getCurrent() : true)
          ) {
            action.action();
          }
        }
      }

      // Execute the following every {specified number} frames per second
      if (animation.frameWaiter >= 60 / animation.current.framesPerSecond) {
        animation.frameWaiter = 0;

        // Move forward in the animation
        if (animation.column < animation.current.frameNumber - 1) {
          animation.column += 1;

          // When the animation ends
        } else if (animation.current.then) {
          switch (animation.current.then) {
            case 'despawn':
              Emitter.emit('despawn', entity.id);
              break;
            case 'die':
              entityDies(entity);
              break;
            default:
              entity.get(StateMachineComponent).set(animation.current.then);
              break;
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
        if (state === 'dead') {
          animation.row = 1;
        } else if (state !== 'hit') {
          animation.row = animationRow;
        }

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
