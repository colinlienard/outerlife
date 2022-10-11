import {
  AnimationComponent,
  PositionComponent,
  MovementComponent,
} from '~~/game/components';
import { System } from '~~/game/utils';

export class MovementSystem extends System {
  protected readonly requiredComponents = [
    AnimationComponent,
    PositionComponent,
    MovementComponent,
  ];

  update() {
    this.entities.forEach((entity) => {
      const position = entity.get(PositionComponent);
      const movement = entity.get(MovementComponent);

      switch (movement.state) {
        case 'still':
          // Handle deceleration
          if (movement.speed > 0) {
            movement.speed -= movement.deceleration;
            break;
          }
          movement.speed = 0;
          break;

        case 'run':
          // Handle acceleration
          if (movement.speed < movement.maxSpeed) {
            movement.speed += movement.acceleration;
            break;
          }
          movement.speed = movement.maxSpeed;
          break;

        case 'dash':
          movement.speed = 8;
          break;

        default:
          break;
      }

      // Update position
      if (movement.speed > 0) {
        position.x +=
          Math.cos((Math.PI / 180) * movement.angle) * movement.speed;
        position.y +=
          Math.sin((Math.PI / 180) * movement.angle) * movement.speed;
      }
    });
  }
}
