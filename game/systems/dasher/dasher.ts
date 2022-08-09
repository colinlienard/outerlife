import { Animation, Dash, Input, Position, Velocity } from '~~/game/components';
import { System } from '~~/game/utils';

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
      const velocity = entity.get(Velocity);

      if (dash.dashing) {
        if (dash.moved >= dash.distance) {
          // End the dash
          dash.reset();

          setTimeout(() => {
            input.doing = false;
            velocity.blocked = false;
          }, dash.recoveryTime);

          return;
        }

        // Update the position
        switch (input.direction) {
          case 'up':
            position.y -= dash.speed;
            break;
          case 'down':
            position.y += dash.speed;
            break;
          case 'left':
            position.x -= dash.speed;
            break;
          case 'right':
            position.x += dash.speed;
            break;
          default:
            break;
        }

        dash.moved += dash.speed;

        return;
      }

      // Cannot dash if blocked
      if (velocity.blocked) {
        return;
      }

      if (input.doing) {
        input.doing = false;

        dash.dashing = true;

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
      }
    });
  }
}
