import { Animation, Movements, Position } from '~~/game/components';
import { Events } from '~~/game/organisms/player/components';
import { Entity, System } from '~~/game/utils';

export class Mover extends System {
  readonly requiredComponents = [Position, Movements, Animation];

  constructor(entities: Entity[]) {
    super();
    super.setEntities(entities);
  }

  // eslint-disable-next-line class-methods-use-this
  updateEntity(entity: Entity): void {
    const animator = entity.get(Animation);
    const position = entity.get(Position);
    const movements = entity.get(Movements);
    const { keys } = entity.get(Events);

    // If a key is pressed
    const keyDown = Object.values(keys).reduce(
      (previous, current) => previous || current
    );
    animator.currentAnimation = keyDown
      ? animator.animations.run
      : animator.animations.idle;

    // Handle easing of the speed (acceleration and deceleration)
    if (keyDown) {
      if (movements.speed < movements.maxSpeed) {
        movements.speed += movements.acceleration;
      } else {
        movements.speed = movements.maxSpeed;
      }
    } else if (movements.speed > 0) {
      movements.speed -= movements.deceleration;
    } else {
      movements.speed = 0;
    }

    // Spawn a dust when running
    // if (
    //   keyDown &&
    //   animator.frameWaiter === 0 &&
    //   (animator.column === 0 || animator.column === 4)
    // ) {
    //   spawn(
    //     new Dust(position.x + 8, position.y + this.sprite.height - 8)
    //   );
    // }

    // Avoid player going too fast when running diagonally
    let { speed } = movements;
    if (speed > 0 && (keys.up || keys.down) && (keys.left || keys.right)) {
      speed /= 1.25;
    }

    // Handle the direction of the player
    if (keys.up) {
      movements.direction.y = 'up';
      animator.row = 0;
    } else if (keys.down) {
      movements.direction.y = 'down';
      animator.row = 1;
    } else if (keyDown) {
      movements.direction.y = null;
    }
    if (keys.left) {
      movements.direction.x = 'left';
      animator.row = 2;
    } else if (keys.right) {
      movements.direction.x = 'right';
      animator.row = 3;
    } else if (keyDown) {
      movements.direction.x = null;
    }

    // Update the position of the player
    switch (movements.direction.y) {
      case 'up':
        position.changeY(-speed);
        break;
      case 'down':
        position.changeY(speed);
        break;
      default:
        break;
    }
    switch (movements.direction.x) {
      case 'left':
        position.changeX(-speed);
        break;
      case 'right':
        position.changeX(speed);
        break;
      default:
        break;
    }
  }
}
