import Scene from './Scene';

class Camera {
  #mapHeight = 0;

  #mapWidth = 0;

  #player;

  #viewPortX = 0;

  #viewPortY = 0;

  constructor(scene: Scene, ratio: number) {
    this.#player = scene.player;

    this.#mapWidth = scene.tilemap.map.columns * 16;
    this.#mapHeight = scene.tilemap.map.rows * 16;

    this.updateViewPort(ratio);
  }

  getOffsetX(): number {
    const x =
      (this.#viewPortX - this.#player.sprite.width) / 2 -
      this.#player.position.x;

    // No overflow on the left
    if (x > 0) {
      return 0;
    }

    // No overflow on the right
    if (x < -this.#mapWidth + this.#viewPortX) {
      return -this.#mapWidth + this.#viewPortX;
    }

    return x;
  }

  getOffsetY(): number {
    const y =
      (this.#viewPortY - this.#player.sprite.height) / 2 -
      this.#player.position.y;

    // No overflow on the top
    if (y > 0) {
      return 0;
    }

    // No overflow on the bottom
    if (y < -this.#mapHeight + this.#viewPortY) {
      return -this.#mapHeight + this.#viewPortY;
    }

    return y;
  }

  updateViewPort(ratio: number) {
    this.#viewPortX = window.innerWidth / ratio;
    this.#viewPortY = window.innerHeight / ratio;
  }
}

export default Camera;
