import { Settings, System } from '~~/game/utils';
import { Player } from '~~/game/entities';
import { PositionComponent, SpriteComponent } from '~~/game/components';
import { EventManager } from '~~/game/managers';

export class CameraSystem extends System {
  protected readonly requiredComponents = [];

  private readonly shakeAmount = 1.5;

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

  private shaking = false;

  private overflows = false;

  private getCameraX(): number {
    // Easing
    this.x += (this.getTargetX() - this.x) * Settings.cameraEasing;

    // Camera shake
    if (this.shaking) {
      this.x += Math.random() > 0.5 ? this.shakeAmount : -this.shakeAmount;
    }

    return this.x;
  }

  private getCameraY(): number {
    // Easing
    this.y += (this.getTargetY() - this.y) * Settings.cameraEasing;

    // Camera shake
    if (this.shaking) {
      this.y += Math.random() > 0.5 ? this.shakeAmount : -this.shakeAmount;
    }

    return this.y;
  }

  private getTargetX(): number {
    const target =
      (this.viewport.width - this.player.get(SpriteComponent).width) / 2 -
      this.player.get(PositionComponent).x;

    if (this.overflows) {
      return target;
    }

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
      (this.viewport.height - this.player.get(SpriteComponent).height) / 2 -
      this.player.get(PositionComponent).y;

    if (this.overflows) {
      return target;
    }

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
    this.map.width = Settings.scene.width;
    this.map.height = Settings.scene.height;

    this.overflows =
      this.map.width * Settings.ratio < window.innerWidth ||
      this.map.height * Settings.ratio < window.innerHeight;

    this.resize();

    this.x = this.getTargetX();
    this.y = this.getTargetY();

    // Shake camera on hit
    EventManager.on('hit', () => {
      if (this.shaking) {
        return;
      }
      this.shaking = true;
      setTimeout(() => {
        this.shaking = false;
      }, 100);
    });
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
