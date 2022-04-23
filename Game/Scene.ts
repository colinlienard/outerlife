import Player from './Player/Player';
import { Keys } from './types';

class Scene {
  elements: any[] = [];

  #player;

  constructor() {
    this.#player = new Player();
    this.elements.push(this.#player);
  }

  animate() {
    this.elements.forEach(({ sprite }) => {
      if (sprite.frameWaiter >= 60 / sprite.currentAnimation.framesPerSecond) {
        sprite.frameWaiter = 0;

        if (sprite.column < sprite.currentAnimation.frameNumber - 1) {
          sprite.column += 1;
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
}

export default Scene;
