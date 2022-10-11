import { MovementComponent } from '~~/game/components';
import { Player } from '~~/game/entities';
import { Emitter, getAngleFromPoints, Settings, System } from '~~/game/utils';

const defaultInput = {
  up: false,
  down: false,
  left: false,
  right: false,
};

export class PlayerSystem extends System {
  protected readonly requiredComponents = null;

  private player: Player;

  private input = defaultInput;

  constructor(player: Player) {
    super();

    this.player = player;

    const keyListener = (event: KeyboardEvent) => this.bindKeys(event);
    const clickListener = (event: MouseEvent) => this.handleClick(event);
    const contextMenuListener = (event: MouseEvent) => event.preventDefault();

    window.addEventListener('keydown', keyListener);
    window.addEventListener('keyup', keyListener);
    window.addEventListener('mousedown', clickListener);
    window.addEventListener('contextmenu', contextMenuListener);

    // Remove event listeners when changing scene
    Emitter.on('switch-map', () => {
      window.removeEventListener('keydown', keyListener);
      window.removeEventListener('keyup', keyListener);
      window.removeEventListener('mousedown', clickListener);
      window.removeEventListener('contextmenu', contextMenuListener);
    });
  }

  bindKeys(event: KeyboardEvent) {
    const inputState = event.type === 'keydown';

    this.input = defaultInput;

    switch (event.key) {
      case 'z':
      case 'ArrowUp':
        this.input.up = inputState;
        break;

      case 's':
      case 'ArrowDown':
        this.input.down = inputState;
        break;

      case 'q':
      case 'ArrowLeft':
        this.input.left = inputState;
        break;

      case 'd':
      case 'ArrowRight':
        this.input.right = inputState;
        break;

      default:
        break;
    }
  }

  handleClick(event: MouseEvent) {
    const movement = this.player.get(MovementComponent);

    if (
      movement.state === 'dash' &&
      (event.target as HTMLElement).tagName !== 'CANVAS'
    ) {
      return;
    }

    // Get direction of the click based on the player's position
    const cursorX = Math.round(
      Math.abs(Settings.cameraOffset.x) + event.clientX / Settings.ratio
    );
    const cursorY = Math.round(
      Math.abs(Settings.cameraOffset.y) + event.clientY / Settings.ratio
    );
    const [{ x, y }] = Emitter.emit('get-player-position');
    const angle = getAngleFromPoints(cursorX, cursorY, x, y);

    // Perform melee attack
    if (event.button === 0) {
      return;
    }

    // Perform dash
    movement.state = 'dash';
    movement.angle = angle;

    // Store position of the dash target if right click
    // The target is further from the cursor to avoid dashing not far enough
    // if (event.button === 2) {
    //   this.dash.target = {
    //     x: cursorX + (cursorX - x) * 10,
    //     y: cursorY + (cursorY - y) * 10,
    //   };
    // }
  }

  update() {
    const movement = this.player.get(MovementComponent);

    if (movement.state === 'dash') {
      return;
    }

    const isMoving = Object.values(this.input).reduce(
      (previous, current) => previous || current
    );

    // Set movement state
    movement.state = isMoving ? 'run' : 'still';

    // Set movement angle
    if (isMoving) {
      if (this.input.down) {
        if (this.input.left) {
          movement.angle = 135;
          return;
        }

        if (this.input.right) {
          movement.angle = 45;
          return;
        }

        movement.angle = 90;
        return;
      }

      if (this.input.up) {
        if (this.input.left) {
          movement.angle = 225;
          return;
        }

        if (this.input.right) {
          movement.angle = 315;
          return;
        }

        movement.angle = 270;
        return;
      }

      if (this.input.left) {
        movement.angle = 180;
        return;
      }

      movement.angle = 0;
    }
  }
}
