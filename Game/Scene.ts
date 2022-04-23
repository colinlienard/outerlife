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
      if (sprite.frameWaiter >= 60 / sprite.currentAnimation.framePerSecond) {
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
    const keyDown = Object.values(keys).reduce(
      (previous, current) => previous || current
    );
    this.#player.sprite.currentAnimation = keyDown
      ? this.#player.animations.run
      : this.#player.animations.idle;

    if (keys.up) {
      this.#player.sprite.row = 1;
    } else if (keys.down) {
      this.#player.sprite.row = 0;
    }

    if (keys.left) {
      this.#player.sprite.row = 3;
    } else if (keys.right) {
      this.#player.sprite.row = 2;
    }
  }
}

export default Scene;
