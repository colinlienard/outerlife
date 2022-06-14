import Player from './Entities/Organisms/Player';
import { TILE_SIZE } from './globals';
import Scene from './Scene';

const EASING = 0.08;

class Camera {
  mapHeight = 0;

  mapWidth = 0;

  player = new Player(0, 0);

  viewPortWidth = 0;

  viewPortHeight = 0;

  x = 0;

  y = 0;

  constructor(scene: Scene) {
    window.addEventListener('scene-switch', () => this.init(scene));
  }

  destructor(scene: Scene) {
    window.removeEventListener('scene-switch', () => this.init(scene));
  }

  getTargetX(): number {
    return (
      (this.viewPortWidth - this.player.sprite.width) / 2 -
      this.player.position.x
    );
  }

  getTargetY(): number {
    return (
      (this.viewPortHeight - this.player.sprite.height) / 2 -
      this.player.position.y
    );
  }

  getOffsetX(): number {
    let target = this.getTargetX();

    // No overflow on the left
    if (target > 0) {
      target = 0;
    }

    // No overflow on the right
    else if (target < -this.mapWidth + this.viewPortWidth) {
      target = -this.mapWidth + this.viewPortWidth;
    }

    // Easing
    this.x += (target - this.x) * EASING;

    return this.x;
  }

  getOffsetY(): number {
    let target = this.getTargetY();

    // No overflow on the top
    if (target > 0) {
      target = 0;
    }

    // No overflow on the bottom
    else if (target < -this.mapHeight + this.viewPortHeight) {
      target = -this.mapHeight + this.viewPortHeight;
    }

    // Easing
    this.y += (target - this.y) * EASING;

    return this.y;
  }

  init(scene: Scene) {
    this.player = scene.player;

    this.mapWidth = scene.tilemap.columns * TILE_SIZE;
    this.mapHeight = scene.tilemap.rows * TILE_SIZE;

    this.x = this.getTargetX();
    this.y = this.getTargetY();
  }

  updateViewPort(viewPortWidth: number, viewPortHeight: number) {
    this.viewPortWidth = viewPortWidth;
    this.viewPortHeight = viewPortHeight;
  }
}

export default Camera;
