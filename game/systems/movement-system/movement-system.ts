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

      // Handle acceleration/deceleration of the speed
      if (movement.isMoving) {
        if (movement.speed < movement.maxSpeed) {
          movement.speed += movement.acceleration;
        } else {
          movement.speed = movement.maxSpeed;
        }
      } else if (movement.speed > 0) {
        movement.speed -= movement.deceleration;
      } else {
        movement.speed = 0;
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
