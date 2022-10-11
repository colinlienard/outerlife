import {
  PositionComponent,
  MovementComponent,
  StateMachineComponent,
} from '~~/game/components';
import { DashDust } from '~~/game/entities';
import { Emitter, getDirectionFromAngle, System } from '~~/game/utils';

export class MovementSystem extends System {
  protected readonly requiredComponents = [
    PositionComponent,
    MovementComponent,
    StateMachineComponent,
  ];

  update() {
    this.entities.forEach((entity) => {
      const position = entity.get(PositionComponent);
      const movement = entity.get(MovementComponent);
      const stateMachine = entity.get(StateMachineComponent);

      stateMachine.on({
        idle: () => {
          if (movement.speed > 0) {
            movement.speed -= movement.deceleration;
            return;
          }
          movement.speed = 0;
        },

        run: () => {
          if (movement.speed < movement.maxSpeed) {
            movement.speed += movement.acceleration;
            return;
          }
          movement.speed = movement.maxSpeed;
        },

        dash: ({ stateChanged }) => {
          if (stateChanged) {
            movement.speed = movement.dash.speed;
            stateMachine.timer(movement.dash.duration);

            // Spawn effects
            Emitter.emit(
              'spawn',
              new DashDust(
                position.x + 8,
                position.y + 24,
                getDirectionFromAngle(movement.angle).animationRow
              )
            );

            return;
          }

          if (stateMachine.timer()) {
            stateMachine.set('dash-recovery');
          }
        },

        'dash-recovery': ({ stateChanged }) => {
          if (stateChanged) {
            stateMachine.timer(movement.dash.recoveryDuration);
          }

          movement.speed -= movement.dash.recoveryDeceleration;

          if (stateMachine.timer()) {
            stateMachine.set('idle');
            movement.speed = 0;
          }
        },
      });

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
