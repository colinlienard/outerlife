import {
  Animation,
  Attack,
  Input,
  Position,
  Velocity,
} from '~~/game/components';
import { Dust, Slash } from '~~/game/entities';
import { Emitter, System } from '~~/game/utils';

export class Attacker extends System {
  protected readonly requiredComponents = [Attack, Animation, Input, Velocity];

  update() {
    this.entities.forEach((entity) => {
      const attack = entity.get(Attack);
      const animation = entity.get(Animation);
      const { attack: input } = entity.get(Input);
      const position = entity.get(Position);
      const velocity = entity.get(Velocity);

      if (attack.attacking) {
        if (attack.speed <= 0) {
          return;
        }

        attack.speed -= attack.deceleration;
        let { speed } = attack;
        if (velocity.direction.x && velocity.direction.y) {
          speed /= 1.25;
        }

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
        animation.current = animation.animations.slash;
        animation.reset();
        attack.attacking = true;

        // Spawn effects
        Emitter.emit('spawn', new Dust(position.x + 8, position.y + 24));
        Emitter.emit('spawn', new Slash(position.x, position.y + 12));
      }
    });
  }
}
