import Player from './Entities/Organisms/Player';
import { CAMERA_EASING, TILE_SIZE } from './globals';
import Scene from './Scene';

class Camera {
  map = {
    width: 0,
    height: 0,
  };

  player!: Player;

  viewport = {
    width: 0,
    height: 0,
  };

  x = 0;

  y = 0;

  constructor(scene: Scene) {
    window.addEventListener('end-scene-switch', () => this.init(scene));
  }

  destructor(scene: Scene) {
    window.removeEventListener('end-scene-switch', () => this.init(scene));
  }

  getTargetX(): number {
    const target =
      (this.viewport.width - this.player.sprite.width) / 2 -
      this.player.position.x;

    // No overflow on the left
    if (target > 0) {
      return 0;
    }

    // No overflow on the right
    if (target < -this.map.width + this.viewport.width) {
      return -this.map.width + this.viewport.width;
    }

    return target;
  }

  getTargetY(): number {
    const target =
      (this.viewport.height - this.player.sprite.height) / 2 -
      this.player.position.y;

    // No overflow on the top
    if (target > 0) {
      return 0;
    }

    // No overflow on the bottom
    if (target < -this.map.height + this.viewport.height) {
      return -this.map.height + this.viewport.height;
    }

    return target;
  }

  getCameraX(): number {
    // Easing
    this.x += (this.getTargetX() - this.x) * CAMERA_EASING;

    return this.x;
  }

  getCameraY(): number {
    // Easing
    this.y += (this.getTargetY() - this.y) * CAMERA_EASING;

    return this.y;
  }

  init(scene: Scene) {
    this.player = scene.player;

    this.map.width = scene.tilemap.columns * TILE_SIZE;
    this.map.height = scene.tilemap.rows * TILE_SIZE;

    this.x = this.getTargetX();
    this.y = this.getTargetY();
  }

  updateViewPort(viewport: { width: number; height: number }) {
    this.viewport = viewport;
  }
}

export default Camera;
