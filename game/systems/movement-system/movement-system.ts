import {
  PositionComponent,
  MovementComponent,
  StateMachineComponent,
  DashComponent,
  MeleeAttackComponent,
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
        idle() {
          if (movement.speed > 0) {
            movement.speed -= movement.deceleration;
            return;
          }
          movement.speed = 0;
        },

        run() {
          if (movement.speed < movement.maxSpeed) {
            movement.speed += movement.acceleration;
            return;
          }
          movement.speed = movement.maxSpeed;
        },

        chase() {
          if (movement.speed < movement.maxSpeed) {
            movement.speed += movement.acceleration;
            return;
          }
          movement.speed = movement.maxSpeed;
        },

        'melee-attack-anticipation': () => {
          movement.speed = 0;
        },

        'dash-recovery': () => {
          movement.speed -= entity.get(DashComponent).deceleration;

          if (movement.speed < 0) {
            movement.speed = 0;
          }
        },
      });

      stateMachine.interact({
        dash({ stateChanged }) {
          if (stateChanged) {
            const dash = entity.get(DashComponent);

            movement.speed = dash.speed;
            stateMachine.timer(dash.duration);

            // Spawn dash dust
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

        'melee-attack': ({ stateChanged }) => {
          if (stateChanged) {
            movement.speed = entity.get(MeleeAttackComponent).speed;

            // Spawn dash dust
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

          movement.speed -= entity.get(MeleeAttackComponent).deceleration;

          if (movement.speed < 0) {
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
