import {
  Animation,
  MeleeAttack,
  Input,
  Position,
  Velocity,
} from '~~/game/components';
import { Dust, Slash } from '~~/game/entities';
import { Emitter, System } from '~~/game/utils';

export class MeleeAttacker extends System {
  protected readonly requiredComponents = [
    MeleeAttack,
    Animation,
    Input,
    Velocity,
  ];

  update() {
    this.entities.forEach((entity) => {
      const attack = entity.get(MeleeAttack);
      const animation = entity.get(Animation);
      const { attack: input } = entity.get(Input);
      const position = entity.get(Position);
      const velocity = entity.get(Velocity);

      if (attack.attacking) {
        if (attack.speed <= 0) {
          return;
        }

        // Update speed
        attack.speed -= attack.deceleration;
        let { speed } = attack;
        if (velocity.direction.x && velocity.direction.y) {
          speed /= 1.25;
        }

        // Update the position
        switch (velocity.direction.x) {
          case 'left':
            position.x -= speed;
            break;
          case 'right':
            position.x += speed;
            break;
          default:
            break;
        }
        switch (velocity.direction.y) {
          case 'up':
            position.y -= speed;
            break;
          case 'down':
            position.y += speed;
            break;
          default:
            break;
        }

        return;
      }

      if (input.attacking) {
        input.attacking = false;

        // Start the slash animation
        animation.current = animation.animations['melee-attack'];
        animation.reset();
        attack.attacking = true;

        // Spawn effects
        let slashX = 0;
        let slashY = 0;
        switch (velocity.direction.current) {
          case 'left':
            slashX -= attack.range;
            break;
          case 'right':
            slashX += attack.range;
            break;
          case 'up':
            slashY -= attack.range;
            break;
          case 'down':
            slashY += attack.range;
            break;
          default:
            break;
        }
        Emitter.emit(
          'spawn',
          new Slash(position.x + slashX, position.y + slashY, animation.row)
        );
        Emitter.emit('spawn', new Dust(position.x + 8, position.y + 24));
      }
    });
  }
}
