import { Animation, Attack, Input, Position } from '~~/game/components';
import { Dust, Slash } from '~~/game/entities';
import { Emitter, System } from '~~/game/utils';

export class Attacker extends System {
  protected readonly requiredComponents = [Attack, Animation, Input];

  update() {
    this.entities.forEach((entity) => {
      const attack = entity.get(Attack);
      const animation = entity.get(Animation);
      const { attack: input } = entity.get(Input);
      const position = entity.get(Position);

      if (attack.attacking) {
        if (attack.moved < attack.movement) {
          position.y += attack.speed;
          attack.moved += attack.speed;
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
        Emitter.emit('spawn', new Slash(position.x, position.y + 10));
      }
    });
  }
}
