import {
  Animation,
  Velocity,
  Position,
  Input,
  SpriteLayers,
  MeleeAttack,
} from '~~/game/components';
import { Dust } from '~~/game/entities';
import { Emitter, System } from '~~/game/utils';

export class Mover extends System {
  protected readonly requiredComponents = [
    Position,
    Velocity,
    Animation,
    Input,
  ];

  update() {
    this.entities.forEach((entity) => {
      const animation = entity.get(Animation);
      const position = entity.get(Position);
      const velocity = entity.get(Velocity);
      const { movements: input } = entity.get(Input);
      if (!entity.get(MeleeAttack).attacking) {
        // If a key is pressed
        const moving = Object.values(input).reduce(
          (previous, current) => previous || current
        );
        animation.current = moving
          ? animation.animations.run
          : animation.animations.idle;

        // Handle easing of the speed (acceleration and deceleration)
        if (moving) {
          if (velocity.speed < velocity.maxSpeed) {
            velocity.speed += velocity.acceleration;
          } else {
            velocity.speed = velocity.maxSpeed;
          }
        } else if (velocity.speed > 0) {
          velocity.speed -= velocity.deceleration;
        } else {
          velocity.speed = 0;
        }

        // TODO: only for the player
        // Spawn a dust when running
        if (
          moving &&
          animation.frameWaiter === 0 &&
          (animation.column === 0 || animation.column === 4)
        ) {
          Emitter.emit('spawn', new Dust(position.x + 8, position.y + 24));
        }

        // Avoid player going too fast when running diagonally
        let { speed } = velocity;
        if (
          speed > 0 &&
          (input.up || input.down) &&
          (input.left || input.right)
        ) {
          speed /= 1.25;
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
      if (entity.has(SpriteLayers)) {
        const spriteLayers = entity.get(SpriteLayers);

        spriteLayers.setAnimated(
          spriteLayers.getAnimated().map((layer) => {
            if (!layer.animation) {
              return layer;
            }

            const data =
              layer.animation[animation.getCurrentAnimationType()][
                velocity.direction.current || 'down'
              ];
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
