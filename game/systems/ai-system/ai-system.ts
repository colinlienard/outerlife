import {
  AIComponent,
  MovementComponent,
  PositionComponent,
  StateMachineComponent,
} from '~~/game/components';
import {
  Emitter,
  getAngleFromPoints,
  getDirectionFromAngle,
  getDistance,
  getRandomNumber,
  Point,
  System,
} from '~~/game/utils';

export class AISystem extends System {
  protected readonly requiredComponents = [
    AIComponent,
    PositionComponent,
    StateMachineComponent,
  ];

  update() {
    const entities = this.get();
    if (entities.size === 0) {
      return;
    }

    const [playerPosition] = Emitter.emit('get-player-position');

    entities.forEach((entity) => {
      const ai = entity.get(AIComponent);
      const position = entity.get(PositionComponent).getCenter();
      const movement = entity.get(MovementComponent);
      const stateMachine = entity.get(StateMachineComponent);

      const distanceFromPlayer = getDistance(
        playerPosition.x,
        playerPosition.y,
        position.x,
        position.y
      );

      const shouldChase = stateMachine.is(['idle', 'run'])
        ? distanceFromPlayer <= ai.detectionRange &&
          this.canSee(movement.angle, position, playerPosition)
        : false;

      stateMachine.interact({
        idle({ stateChanged }) {
          if (shouldChase) {
            stateMachine.set('chase');
            return;
          }

          if (stateChanged) {
            stateMachine.timer(getRandomNumber(200, 400));
            return;
          }

          if (stateMachine.timer()) {
            stateMachine.set('run');
          }
        },

        run({ stateChanged }) {
          if (shouldChase) {
            stateMachine.set('chase');
            return;
          }

          if (stateChanged || ai.target === null) {
            ai.setWanderTarget();
            return;
          }

          // If the target is found, set idle state
          if (
            getDistance(ai.target.x, ai.target.y, position.x, position.y) < 1
          ) {
            stateMachine.set('idle');
            return;
          }

          // Follow target
          movement.angle = getAngleFromPoints(
            ai.target.x,
            ai.target.y,
            position.x,
            position.y
          );
        },

        chase() {
          if (distanceFromPlayer >= ai.abortAggroRange) {
            stateMachine.set('idle');
            return;
          }

          // Follow player
          movement.angle = getAngleFromPoints(
            playerPosition.x,
            playerPosition.y,
            position.x,
            position.y
          );

          if (distanceFromPlayer <= ai.attackRange) {
            stateMachine.set('melee-attack-anticipation');
          }
        },
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  canSee(angle: number, position: Point, target: Point) {
    switch (getDirectionFromAngle(angle).direction) {
      case 'up':
        return position.y > target.y;
      case 'down':
        return position.y < target.y;
      case 'left':
        return position.x > target.x;
      case 'right':
        return position.x < target.x;
      default:
        return false;
    }
  }
}
