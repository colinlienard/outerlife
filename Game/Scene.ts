import Player from './Entities/Organisms/Player';
import Entity from './Entities/Entity';
import { Keys } from './types';

class Scene {
  entities: Entity[] = [];

  #player;

  constructor() {
    this.#player = new Player((entity: Entity) => this.spawn(entity));
    this.entities.push(this.#player);
  }

  animate() {
    this.entities.forEach((entity) => {
      const { sprite } = entity;

      // Execute the following every {specified number} frames per second
      if (sprite.frameWaiter >= 60 / sprite.currentAnimation.framesPerSecond) {
        sprite.frameWaiter = 0;

        // Move forward in the animation
        if (sprite.column < sprite.currentAnimation.frameNumber - 1) {
          sprite.column += 1;

          // Delete instance after its animation
        } else if (sprite.currentAnimation.once) {
          delete this.entities[this.entities.indexOf(entity)];

          // Reset animation
        } else {
          sprite.column = 0;
        }
      } else {
        sprite.frameWaiter += 1;
      }
    });
  }

  updatePlayer(keys: Keys) {
    this.#player.update(keys);
  }

  spawn(entity: Entity) {
    this.entities.push(entity);
  }

  ySort() {
    this.entities.sort((previous, current) =>
      previous.position.y + previous.sprite.height >
      current.position.y + current.sprite.height
        ? 1
        : -1
    );
  }
}

export default Scene;
