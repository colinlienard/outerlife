import {
  Animation,
  MeleeAttack,
  Input,
  Position,
  Velocity,
  Sprite,
} from '~~/game/components';
import { Dust, Slash } from '~~/game/entities';
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
        animation.current = animation.animations['melee-attack'];
        animation.reset();

        // Set the entity's speed to 0
        velocity.blocked = true;
        velocity.speed = 0;

        // Set animation direction
        velocity.direction.current = input.direction;

        let slashX = 0;
        let slashY = 0;
        switch (input.direction) {
          case 'up':
            slashY -= attack.range;
            animation.row = 0;
            break;
          case 'down':
            slashY += attack.range;
            animation.row = 1;
            break;
          case 'left':
            slashX -= attack.range;
            animation.row = 2;
            break;
          case 'right':
            slashX += attack.range;
            animation.row = 3;
            break;
          default:
            break;
        }

        // Spawn effects
        Emitter.emit(
          'spawn',
          new Slash(
            position.x + width / 2 + slashX,
            position.y + height / 2 + slashY,
            animation.row
          )
        );
        Emitter.emit('spawn', new Dust(position.x + 8, position.y + 24));
      }
    });
  }
}
