import { Settings, System } from '~~/game/utils';
import { Player } from '~~/game/entities';
import { Position, Sprite } from '~~/game/components';

export class Camera extends System {
  protected readonly requiredComponents = null;

  private player!: Player;

  private map = {
    width: 0,
    height: 0,
  };

  private viewport = {
    width: 0,
    height: 0,
  };

  private x = 0;

  private y = 0;

  private getCameraX(): number {
    // Easing
    this.x += (this.getTargetX() - this.x) * Settings.cameraEasing;

    return this.x;
  }

  private getCameraY(): number {
    // Easing
    this.y += (this.getTargetY() - this.y) * Settings.cameraEasing;

    return this.y;
  }

  private getTargetX(): number {
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

  private getTargetY(): number {
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

  init() {
    this.map.width = Settings.scene.columns * Settings.tileSize;
    this.map.height = Settings.scene.rows * Settings.tileSize;

    this.resize();

    this.x = this.getTargetX();
    this.y = this.getTargetY();
  }

  resize() {
    this.viewport.width = window.innerWidth / Settings.ratio;
    this.viewport.height = window.innerHeight / Settings.ratio;
  }

  setPlayer(player: Player) {
    this.player = player;
  }

  update() {
    Settings.cameraOffset = {
      x: this.getCameraX(),
      y: this.getCameraY(),
    };
  }
}
