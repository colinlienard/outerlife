import { Input } from '~~/game/components';

export class PlayerInput extends Input {
  constructor() {
    super();

    window.addEventListener('keydown', (event) => this.bindKeys(event));
    window.addEventListener('keyup', (event) => this.bindKeys(event));

    window.addEventListener('mousedown', (event) => this.handleClick(event));
  }

  handleClick(event: MouseEvent) {
    if (
      (event.target as HTMLElement).tagName === 'CANVAS' &&
      event.button === 0
    ) {
      this.attack.attacking = true;
    }
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
}
