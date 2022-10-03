import { AI, Input, MeleeAttack, Position, Velocity } from '~~/game/components';
import {
  Emitter,
  getDistance,
  Horizontal,
  Point,
  System,
  Vertical,
} from '~~/game/utils';
import { getDirectionFromPoint } from '~~/game/utils/helpers/getDirectionFromPoint';

export class AISystem extends System {
  protected readonly requiredComponents = [AI, Input, Position];

  update() {
    const [playerPosition] = Emitter.emit('get-player-position');

    this.entities.forEach((entity) => {
      const ai = entity.get(AI);
      const input = entity.get(Input);
      const position = entity.get(Position).getCenter();
      const velocity = entity.get(Velocity);
      const attack = entity.get(MeleeAttack);

      const distanceFromPlayer = getDistance(
        playerPosition.x,
        playerPosition.y,
        position.x,
        position.y
      );

      // Reset movements
      input.resetMovements();

      switch (ai.state) {
        case 'wander': {
          // Update state
          if (
            distanceFromPlayer <= ai.detectionRange &&
            this.canSee(velocity.direction.current, position, playerPosition)
          ) {
            ai.state = 'aggro';
            ai.resetWait(20);
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

          // If the target is found, wait a bit and then go to a new target
          if (
            getDistance(ai.target.x, ai.target.y, position.x, position.y) < 1
          ) {
            ai.target = null;
            ai.resetWait();
            return;
          }

          this.followTarget(ai.target, position, input);

          return;
        }
        case 'aggro':
          if (attack.attacking) {
            return;
          }

          // Perform attack
          if (distanceFromPlayer <= 50) {
            input.attack.doing = true;
            input.attack.direction = getDirectionFromPoint(
              playerPosition.x,
              playerPosition.y,
              position.x,
              position.y
            );
            return;
          }

          // Update state
          if (distanceFromPlayer >= ai.abortAggroRange) {
            ai.state = 'wander';
            ai.target = null;
            ai.resetWait();
            return;
          }

          // Wait
          if (ai.frameWaiter < ai.framesToWait) {
            ai.frameWaiter += 1;
            return;
          }

          // TODO: Aggro behaviour
          this.followTarget(playerPosition, position, input);

          return;
        default:
          throw new Error(`Invalid AI state: '${ai.state}'`);
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  followTarget(target: Point, position: Point, input: Input) {
    // Set input based on the target
    if (Math.round(target.x) > Math.round(position.x)) {
      input.movements.right = true;
    } else if (Math.round(target.x) < Math.round(position.x)) {
      input.movements.left = true;
    }
    if (Math.round(target.y) > Math.round(position.y)) {
      input.movements.down = true;
    } else if (Math.round(target.y) < Math.round(position.y)) {
      input.movements.up = true;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  canSee(direction: Horizontal | Vertical, position: Point, target: Point) {
    switch (direction) {
      case 'up':
        return position.y > target.y;
      case 'down':
        return position.y < target.y;
      case 'left':
        return position.x > target.x;
      case 'right':
        return position.x < target.x;
      default:
        throw new Error(`Invalid direction: ${direction}`);
    }
  }
}
