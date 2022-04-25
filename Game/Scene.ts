import Player from './SceneElements/Organisms/Player';
import SceneElement from './SceneElements/SceneElement';
import { Keys } from './types';

class Scene {
  elements: SceneElement[] = [];

  #player;

  constructor() {
    this.#player = new Player((element: SceneElement) => this.spawn(element));
    this.elements.push(this.#player);
  }

  animate() {
    this.elements.forEach((element) => {
      const { sprite } = element;

      // Execute the following every {specified number} frames per second
      if (sprite.frameWaiter >= 60 / sprite.currentAnimation.framesPerSecond) {
        sprite.frameWaiter = 0;

        // Move forward in the animation
        if (sprite.column < sprite.currentAnimation.frameNumber - 1) {
          sprite.column += 1;

          // Delete instance after its animation
        } else if (sprite.currentAnimation.once) {
          delete this.elements[this.elements.indexOf(element)];

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

  spawn(element: SceneElement) {
    this.elements.push(element);
  }

  ySort() {
    this.elements.sort((previous, current) =>
      previous.position.y + previous.sprite.height >
      current.position.y + current.sprite.height
        ? 1
        : -1
    );
  }
}

export default Scene;
