import { MovementComponent } from '~~/game/components';
import { Player } from '~~/game/entities';
import {
  Emitter,
  // getDirectionFromPoint,
  // Settings,
  System,
} from '~~/game/utils';

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
    // const clickListener = (event: MouseEvent) => this.handleClick(event);
    const contextMenuListener = (event: MouseEvent) => event.preventDefault();

    window.addEventListener('keydown', keyListener);
    window.addEventListener('keyup', keyListener);
    // window.addEventListener('mousedown', clickListener);
    window.addEventListener('contextmenu', contextMenuListener);

    // Remove event listeners when changing scene
    Emitter.on('switch-map', () => {
      window.removeEventListener('keydown', keyListener);
      window.removeEventListener('keyup', keyListener);
      // window.removeEventListener('mousedown', clickListener);
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

  // handleClick(event: MouseEvent) {
  //   if ((event.target as HTMLElement).tagName === 'CANVAS') {
  //     // Get direction of the click based on the player's position
  //     const cursorX = Math.round(
  //       Math.abs(Settings.cameraOffset.x) + event.clientX / Settings.ratio
  //     );
  //     const cursorY = Math.round(
  //       Math.abs(Settings.cameraOffset.y) + event.clientY / Settings.ratio
  //     );
  //     const [{ x, y }] = Emitter.emit('get-player-position');

  //     const type = event.button === 0 ? this.attack : this.dash;

  //     // Set direction
  //     type.direction = getDirectionFromPoint(cursorX, cursorY, x, y).direction;

  //     type.doing = true;

  //     // Store position of the dash target if right click
  //     // The target is further from the cursor to avoid dashing not far enough
  //     if (event.button === 2) {
  //       this.dash.target = {
  //         x: cursorX + (cursorX - x) * 10,
  //         y: cursorY + (cursorY - y) * 10,
  //       };
  //     }
  //   }
  // }

  update() {
    const isMoving = Object.values(this.input).reduce(
      (previous, current) => previous || current
    );

    const movement = this.player.get(MovementComponent);

    movement.isMoving = isMoving;

    if (isMoving && movement.state !== 'dash') {
      if (this.input.down) {
        if (this.input.left) {
          movement.angle = 135;
        } else if (this.input.right) {
          movement.angle = 45;
        } else {
          movement.angle = 90;
        }
      } else if (this.input.up) {
        if (this.input.left) {
          movement.angle = 225;
        } else if (this.input.right) {
          movement.angle = 315;
        } else {
          movement.angle = 270;
        }
      } else if (this.input.left) {
        movement.angle = 180;
      } else if (this.input.right) {
        movement.angle = 0;
      }
    }
  }
}
