import { Settings, System } from '~~/game/utils';
import { Player } from '~~/game/entities';
import { PositionComponent, SpriteComponent } from '~~/game/components';
import { EventManager } from '~~/game/managers';

export class CameraSystem extends System {
  protected readonly requiredComponents = [];

  private readonly shakeAmount = 1.5;

  private readonly cursorDiffReductor = 12;

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

  private cursorDiffX = 0;

  private cursorDiffY = 0;

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
      return target - this.cursorDiffX;
    }

    // No overflow on the left
    if (target > this.cursorDiffX) {
      return Math.min(0, -this.cursorDiffX);
    }

    // No overflow on the right
    const maxCameraX = -this.map.width + this.viewport.width;
    if (target < maxCameraX + this.cursorDiffX) {
      return Math.max(maxCameraX, maxCameraX - this.cursorDiffX);
    }

    return target - this.cursorDiffX;
  }

  private getTargetY(): number {
    const target =
      (this.viewport.height - this.player.get(SpriteComponent).height) / 2 -
      this.player.get(PositionComponent).y;

    if (this.overflows) {
      return target - this.cursorDiffY;
    }

    // No overflow on the top
    if (target > this.cursorDiffY) {
      return Math.min(0, -this.cursorDiffY);
    }

    // No overflow on the bottom
    const maxCameraY = -this.map.height + this.viewport.height;
    if (target < maxCameraY + this.cursorDiffY) {
      return Math.max(maxCameraY, maxCameraY - this.cursorDiffY);
    }

    return target - this.cursorDiffY;
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

    window.addEventListener(
      'mousemove',
      useThrottle((event: MouseEvent) => {
        const cursorX = Math.round(event.clientX / Settings.ratio);
        const cursorY = Math.round(event.clientY / Settings.ratio);
        this.cursorDiffX =
          (cursorX - this.viewport.width / 2) / this.cursorDiffReductor;
        this.cursorDiffY =
          (cursorY - this.viewport.height / 2) / this.cursorDiffReductor;
      }, 16)
    );
  }

  resize() {
    this.viewport.width = window.innerWidth / Settings.ratio;
    this.viewport.height = window.innerHeight / Settings.ratio;
  }

  setPlayer(player: Player) {
    this.player = player;
  }

  update() {
    if (Settings.usingGamepad) {
      this.cursorDiffX = 0;
      this.cursorDiffY = 0;
    }

    Settings.cameraOffset = {
      x: this.getCameraX(),
      y: this.getCameraY(),
    };
  }
}
