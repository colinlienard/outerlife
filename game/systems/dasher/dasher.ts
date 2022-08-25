import {
  Animation,
  Dash,
  Input,
  Position,
  Sprite,
  Velocity,
} from '~~/game/components';
import { Dust } from '~~/game/entities';
import { Emitter, System } from '~~/game/utils';

export class Dasher extends System {
  protected readonly requiredComponents = [
    Animation,
    Dash,
    Input,
    Position,
    Velocity,
  ];

  update() {
    this.entities.forEach((entity) => {
      const animation = entity.get(Animation);
      const dash = entity.get(Dash);
      const { dash: input } = entity.get(Input);
      const position = entity.get(Position);
      const { width, height } = entity.get(Sprite);
      const velocity = entity.get(Velocity);

      if (dash.dashing) {
        if (dash.speed <= 0) {
          // End the dash
          dash.reset();

          if (animation.animations.recovery) {
            animation.current = animation.animations.recovery;
          }

          return;
        }

        // Update speed
        dash.speed -= dash.deceleration;

        // Update the position
        let dx = input.target.x - (position.x + width / 2);
        let dy = input.target.y - (position.y + height / 2);
        const length = Math.sqrt(dx * dx + dy * dy);
        dx /= length;
        dy /= length;

        position.x += dx * dash.speed;
        position.y += dy * dash.speed;

        return;
      }

      // Cannot dash if blocked
      if (velocity.blocked) {
        return;
      }

      if (input.doing) {
        input.doing = false;

        // Start the dash animation
        dash.dashing = true;
        if (animation.animations.dash) {
          animation.current = animation.animations.dash;
        }
        animation.reset();

        // Set the entity's speed to 0
        velocity.blocked = true;
        velocity.speed = 0;

        // Set animation direction
        velocity.direction.current = input.direction;

        switch (input.direction) {
          case 'up':
            animation.row = 0;
            break;
          case 'down':
            animation.row = 1;
            break;
          case 'left':
            animation.row = 2;
            break;
          case 'right':
            animation.row = 3;
            break;
          default:
            break;
        }

        // Spawn effects
        Emitter.emit('spawn', new Dust(position.x + 8, position.y + 24));
      }
    });
  }
}
