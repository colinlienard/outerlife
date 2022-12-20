import {
  AnimationComponent,
  MovementComponent,
  SpriteComponent,
  LayersComponent,
  StateMachineComponent,
} from '~~/game/components';
import { EventManager } from '~~/game/managers';
import {
  entityDies,
  getDirectionFromAngle,
  getDirectionFromRow,
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
              EventManager.emit('despawn', entity.id);
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

        const { animationRow } = getDirectionFromAngle(movement.angle);

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
        if (entity.has(LayersComponent)) {
          entity.get(LayersComponent).getAndSet((layers) =>
            layers.map((l) => {
              const layer = l;

              if (!layer.animation) {
                return layer;
              }

              // Get the animation
              const layerAnimation = layer.animation[animation.getCurrent()];
              if (!layerAnimation) {
                layer.render = false;
                return layer;
              }

              // Get the direction
              const data = layerAnimation[getDirectionFromRow(animation.row)];

              if (!data) {
                layer.render = false;
                return layer;
              }
              layer.render = true;

              // Set data based on current animation frame
              if (Array.isArray(data)) {
                const frame = data[animation.column];
                if (frame) {
                  layer.data = frame;
                  return layer;
                }

                layer.render = false;
                return layer;
              }

              layer.data = data;
              return layer;
            })
          );

          // const layers = entity.get(LayersComponent);

          // layers.setAnimatedSprites(
          //   layers.getAnimatedSprites().map((layer) => {
          //     const layerAnimation = (layer.animation as LayerAnimations)[
          //       animation.getCurrent()
          //     ];

          //     if (!layerAnimation) {
          //       return { ...layer, render: false };
          //     }

          //     const data = layerAnimation[direction];

          //     if (!data) {
          //       return { ...layer, render: false };
          //     }

          //     if (Array.isArray(data)) {
          //       return { ...layer, ...data[animation.column], render: true };
          //     }
          //     return { ...layer, ...data, render: true };
          //   })
          // );
        }
      }
    });
  }
}
