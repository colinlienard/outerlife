import { Input } from '~~/game/components';

export class PlayerInput extends Input {
  constructor() {
    super();
    window.addEventListener('keydown', (event) => this.bindKeys(event));
    window.addEventListener('keyup', (event) => this.bindKeys(event));
  }

  bindKeys(event: KeyboardEvent) {
    const inputState = event.type === 'keydown';

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
}
