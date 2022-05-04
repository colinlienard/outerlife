import Player from './Entities/Organisms/Player';

class Camera {
  #viewPortX = 0;

  #viewPortY = 0;

  #player;

  constructor(player: Player, ratio: number) {
    this.#player = player;
    this.updateViewPort(ratio);
  }

  getOffsetX(): number {
    return (
      (this.#viewPortX - this.#player.sprite.width) / 2 -
      this.#player.position.x
    );
  }

  getOffsetY(): number {
    return (
      (this.#viewPortY - this.#player.sprite.height) / 2 -
      this.#player.position.y
    );
  }

  updateViewPort(ratio: number) {
    this.#viewPortX = window.innerWidth / ratio;
    this.#viewPortY = window.innerHeight / ratio;
  }
}

export default Camera;
