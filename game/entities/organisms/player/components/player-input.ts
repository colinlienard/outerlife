import { Input } from '~~/game/components';
import { Emitter, Settings } from '~~/game/utils';

export class PlayerInput extends Input {
  constructor() {
    super();

    const keyListener = (event: KeyboardEvent) => this.bindKeys(event);
    const clickListener = (event: MouseEvent) => this.handleClick(event);

    window.addEventListener('keydown', keyListener);
    window.addEventListener('keyup', keyListener);
    window.addEventListener('mousedown', clickListener);

    // Remove event listeners when changing scene
    Emitter.on('switch-map', () => {
      window.removeEventListener('keydown', keyListener);
      window.removeEventListener('keyup', keyListener);
      window.removeEventListener('mousedown', clickListener);
    });
  }

  bindKeys(event: KeyboardEvent) {
    const inputState = event.type === 'keydown';

    switch (event.key) {
      case 'z':
      case 'ArrowUp':
        this.movements.up = inputState;
        break;

      case 's':
      case 'ArrowDown':
        this.movements.down = inputState;
        break;

      case 'q':
      case 'ArrowLeft':
        this.movements.left = inputState;
        break;

      case 'd':
      case 'ArrowRight':
        this.movements.right = inputState;
        break;

      default:
        break;
    }
  }

  handleClick(event: MouseEvent) {
    if (
      (event.target as HTMLElement).tagName === 'CANVAS' &&
      event.button === 0
    ) {
      // Get direction of the click based on the player's position
      const cursorX = Math.round(
        Math.abs(Settings.cameraOffset.x) + event.clientX / Settings.ratio
      );
      const cursorY = Math.round(
        Math.abs(Settings.cameraOffset.y) + event.clientY / Settings.ratio
      );
      const [{ x, y }] = Emitter.emit('get-player-position');
      const angle = (Math.atan2(cursorX - x, cursorY - y) * 180) / Math.PI;

      // Set direction
      if (angle > -45 && angle < 45) {
        this.attack.direction = 'down';
      } else if (angle > 45 && angle < 135) {
        this.attack.direction = 'right';
      } else if (angle > 135 || angle < -135) {
        this.attack.direction = 'up';
      } else {
        this.attack.direction = 'left';
      }

      this.attack.attacking = true;
    }
  }
}
