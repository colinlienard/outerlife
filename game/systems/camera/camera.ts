import { CAMERA_EASING, TILE_SIZE } from '~~/game/globals';
import { System } from '~~/game/utils';
import { Settings } from '~~/game/settings';
import { Player } from '~~/game/entities';
import { Position, Sprite } from '~~/game/components';

export class Camera extends System {
  readonly requiredComponents = null;

  player!: Player;

  map = {
    width: 0,
    height: 0,
  };

  viewport = {
    width: 0,
    height: 0,
  };

  x = 0;

  y = 0;

  init() {
    this.map.width = Settings.scene.columns * TILE_SIZE;
    this.map.height = Settings.scene.rows * TILE_SIZE;

    this.updateViewport();

    this.x = this.getTargetX();
    this.y = this.getTargetY();
  }

  update() {
    Settings.cameraOffset = {
      x: this.getCameraX(),
      y: this.getCameraY(),
    };
  }

  getTargetX(): number {
    const target =
      (this.viewport.width - this.player.get(Sprite).width) / 2 -
      this.player.get(Position).x;

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
      (this.viewport.height - this.player.get(Sprite).height) / 2 -
      this.player.get(Position).y;

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

  updateViewport() {
    this.viewport.width = window.innerWidth / Settings.ratio;
    this.viewport.height = window.innerHeight / Settings.ratio;
  }

  setPlayer(player: Player) {
    this.player = player;
  }
}
