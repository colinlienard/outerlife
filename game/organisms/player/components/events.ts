import { Component } from '~~/game/utils';

export class Events implements Component {
  keys = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  constructor() {
    window.addEventListener('keydown', (event) => this.bindKeys(event));
    window.addEventListener('keyup', (event) => this.bindKeys(event));
  }

  bindKeys(event: KeyboardEvent) {
    const keyState = event.type === 'keydown';

    switch (event.key) {
      case 'z':
      case 'ArrowUp':
        this.keys.up = keyState;
        break;

      case 's':
      case 'ArrowDown':
        this.keys.down = keyState;
        break;

      case 'q':
      case 'ArrowLeft':
        this.keys.left = keyState;
        break;

      case 'd':
      case 'ArrowRight':
        this.keys.right = keyState;
        break;

      default:
        break;
    }
  }

  update() {
    return this.keys;
  }
}
