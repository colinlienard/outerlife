import {
  AI,
  Animation,
  Input,
  MeleeAttack,
  Position,
  Velocity,
} from '~~/game/components';
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
      const animation = entity.get(Animation);

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
          // Perform attack
          if (distanceFromPlayer <= ai.attackRange) {
            ai.state = 'attackAnticipation';
            const { direction, row } = getDirectionFromPoint(
              playerPosition.x,
              playerPosition.y,
              position.x,
              position.y
            );
            input.attack.direction = direction;
            animation.row = row;
            ai.resetWait();

            if (animation.animations['anticipation-attack']) {
              animation.current = animation.animations['anticipation-attack'];
              velocity.blocked = true;
            }

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

          // Follow player
          this.followTarget(playerPosition, position, input);

          return;
        case 'attackAnticipation':
          if (ai.frameWaiter < ai.attackAnticipationTime) {
            ai.frameWaiter += 1;
            return;
          }

          ai.state = 'attack';
          velocity.blocked = false;

          return;
        case 'attack':
          if (attack.attacking) {
            return;
          }

          input.attack.doing = true;
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
