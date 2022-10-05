import {
  Animation,
  MeleeAttack,
  Input,
  Position,
  Velocity,
  Sprite,
} from '~~/game/components';
import { DashDust } from '~~/game/entities';
import { Emitter, System } from '~~/game/utils';

export class MeleeAttacker extends System {
  protected readonly requiredComponents = [
    Animation,
    MeleeAttack,
    Input,
    Sprite,
    Velocity,
  ];

  update() {
    this.entities.forEach((entity) => {
      const attack = entity.get(MeleeAttack);
      const animation = entity.get(Animation);
      const { attack: input } = entity.get(Input);
      const position = entity.get(Position);
      const { width, height } = entity.get(Sprite);
      const velocity = entity.get(Velocity);

      if (attack.attacking) {
        if (attack.speed <= 0) {
          return;
        }

        // Update speed
        attack.speed -= attack.deceleration;

        // Update the position
        switch (input.direction) {
          case 'up':
            position.y -= attack.speed;
            break;
          case 'down':
            position.y += attack.speed;
            break;
          case 'left':
            position.x -= attack.speed;
            break;
          case 'right':
            position.x += attack.speed;
            break;
          default:
            break;
        }

        return;
      }

      // Cannot attack if blocked
      if (velocity.blocked) {
        return;
      }

      if (input.doing) {
        input.doing = false;

        // Start the slash animation
        attack.attacking = true;
        if (animation.animations['melee-attack']) {
          animation.current = animation.animations['melee-attack'];
        }

        // Set the entity's speed to 0
        velocity.blocked = true;
        velocity.speed = 0;

        // Set animation direction
        velocity.direction.current = input.direction;

        let effectX = 0;
        let effectY = 0;
        switch (input.direction) {
          case 'up':
            effectY -= attack.range;
            animation.row = 0;
            break;
          case 'down':
            effectY += attack.range;
            animation.row = 1;
            break;
          case 'left':
            effectX -= attack.range;
            animation.row = 2;
            break;
          case 'right':
            effectX += attack.range;
            animation.row = 3;
            break;
          default:
            break;
        }

        // Spawn effects
        if (attack.effect) {
          Emitter.emit(
            'spawn',
            // eslint-disable-next-line new-cap
            new attack.effect(
              position.x + width / 2 + effectX,
              position.y + height / 2 + effectY,
              animation.row
            )
          );
        }

        Emitter.emit(
          'spawn',
          new DashDust(position.x + 8, position.y + 24, animation.row)
        );
      }
    });
  }
}
