import {
  AnimationComponent,
  DashComponent,
  InputComponent,
  PositionComponent,
  SpriteComponent,
  MovementComponent,
} from '~~/game/components';
import { DashDust } from '~~/game/entities';
import { Emitter, System } from '~~/game/utils';

export class DashSystem extends System {
  protected readonly requiredComponents = [
    AnimationComponent,
    DashComponent,
    InputComponent,
    PositionComponent,
    MovementComponent,
  ];

  update() {
    this.entities.forEach((entity) => {
      const animation = entity.get(AnimationComponent);
      const dash = entity.get(DashComponent);
      const { dash: input } = entity.get(InputComponent);
      const position = entity.get(PositionComponent);
      const { width, height } = entity.get(SpriteComponent);
      const movement = entity.get(MovementComponent);

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
      if (movement.blocked) {
        return;
      }

      if (input.doing) {
        input.doing = false;

        // Start the dash animation
        dash.dashing = true;
        if (animation.animations.dash) {
          animation.current = animation.animations.dash;
        }

        // Set the entity's speed to 0
        movement.blocked = true;
        movement.speed = 0;

        // Set animation direction
        movement.direction.current = input.direction;

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
        Emitter.emit(
          'spawn',
          new DashDust(position.x + 8, position.y + 24, animation.row)
        );
      }
    });
  }
}
