import { AI, Input, Position } from '~~/game/components';
import { Emitter, getDistance, System } from '~~/game/utils';

export class AISystem extends System {
  protected readonly requiredComponents = [AI, Input, Position];

  update() {
    const [playerPosition] = Emitter.emit('get-player-position');

    this.entities.forEach((entity) => {
      const ai = entity.get(AI);
      const input = entity.get(Input);
      const position = entity.get(Position).getCenter();

      const distanceFromPlayer = getDistance(
        playerPosition.x,
        playerPosition.y,
        position.x,
        position.y
      );

      switch (ai.state) {
        case 'wander': {
          // Update state
          if (distanceFromPlayer <= ai.detectionRange) {
            ai.state = 'aggro';
            return;
          }

          // Wait
          if (ai.frameWaiter < ai.framesToWait) {
            ai.frameWaiter += 1;
            return;
          }

          // Set new target
          if (!ai.target) {
            ai.target = ai.getWanderTarget();
          }

          // Reset movements
          input.resetMovements();

          // If the target is found, wait a bit and then go to a new target
          if (
            getDistance(ai.target.x, ai.target.y, position.x, position.y) < 1
          ) {
            ai.target = null;
            ai.resetWait();
            return;
          }

          // Set input based on the target
          if (ai.target.x > Math.round(position.x)) {
            input.movements.right = true;
          } else if (ai.target.x < Math.round(position.x)) {
            input.movements.left = true;
          }
          if (ai.target.y > Math.round(position.y)) {
            input.movements.down = true;
          } else if (ai.target.y < Math.round(position.y)) {
            input.movements.up = true;
          }

          return;
        }
        case 'aggro':
          // Update state
          if (distanceFromPlayer >= ai.abortAggroRange) {
            ai.state = 'wander';
            ai.target = null;
            ai.resetWait();
            return;
          }

          // TODO: Aggro behaviour
          input.resetMovements();

          return;
        default:
          throw new Error(`Invalid AI state: '${ai.state}'`);
      }
    });
  }
}
