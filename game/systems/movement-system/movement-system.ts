import {
  AnimationComponent,
  PositionComponent,
  InputComponent,
  SpriteLayersComponent,
  SpriteAnimations,
  MovementComponent,
} from '~~/game/components';
import { System } from '~~/game/utils';

export class MovementSystem extends System {
  protected readonly requiredComponents = [
    AnimationComponent,
    InputComponent,
    PositionComponent,
    MovementComponent,
  ];

  update() {
    this.entities.forEach((entity) => {
      const animation = entity.get(AnimationComponent);
      const position = entity.get(PositionComponent);
      const velocity = entity.get(MovementComponent);
      const { movements: input } = entity.get(InputComponent);

      if (!velocity.blocked) {
        const moving = Object.values(input).reduce(
          (previous, current) => previous || current
        );

        // Update animation
        animation.current = moving
          ? animation.animations.run
          : animation.animations.idle;

        if (moving) {
          // Handle acceleration of the speed
          if (velocity.speed < velocity.maxSpeed) {
            velocity.speed += velocity.acceleration;
          } else {
            velocity.speed = velocity.maxSpeed;
          }

          // Handle the direction of the player
          if (input.up) {
            velocity.direction.y = 'up';
            animation.row = 0;
          } else if (input.down) {
            velocity.direction.y = 'down';
            animation.row = 1;
          } else if (moving) {
            velocity.direction.y = null;
          }
          if (input.left) {
            velocity.direction.x = 'left';
            animation.row = 2;
          } else if (input.right) {
            velocity.direction.x = 'right';
            animation.row = 3;
          } else if (moving) {
            velocity.direction.x = null;
          }
          velocity.direction.current =
            velocity.direction.x || velocity.direction.y || 'down';
        }

        // Handle deceleration of the speed
        else if (velocity.speed > 0) {
          velocity.speed -= velocity.deceleration;
        } else {
          velocity.speed = 0;
        }

        // Avoid entity going too fast when running diagonally
        let { speed } = velocity;
        if (
          speed > 0 &&
          (input.up || input.down) &&
          (input.left || input.right)
        ) {
          speed /= 1.25;
        }

        // Update the position
        switch (velocity.direction.y) {
          case 'up':
            position.y -= speed;
            break;
          case 'down':
            position.y += speed;
            break;
          default:
            break;
        }
        switch (velocity.direction.x) {
          case 'left':
            position.x -= speed;
            break;
          case 'right':
            position.x += speed;
            break;
          default:
            break;
        }
      }

      // Update sprite layers
      if (entity.has(SpriteLayersComponent)) {
        const spriteLayers = entity.get(SpriteLayersComponent);

        spriteLayers.setAnimated(
          spriteLayers.getAnimated().map((layer) => {
            if (!layer.animation) {
              return layer;
            }

            const layerAnimation = layer.animation[
              animation.getCurrentAnimationType()
            ] as SpriteAnimations;
            const data = layerAnimation[velocity.direction.current || 'down'];
            if (Array.isArray(data)) {
              return { ...layer, ...data[animation.column] };
            }
            return { ...layer, ...data };
          })
        );
      }
    });
  }
}