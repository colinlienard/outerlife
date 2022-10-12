import { MovementComponent, StateMachineComponent } from '~~/game/components';
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

  private player!: {
    movement: MovementComponent;
    stateMachine: StateMachineComponent;
  };

  private input = defaultInput;

  constructor() {
    super();

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

  private bindKeys(event: KeyboardEvent) {
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

  private handleClick(event: MouseEvent) {
    if (
      !this.player.stateMachine.is(['idle', 'run']) ||
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
      this.player.stateMachine.set('melee-attack');
      this.player.movement.angle = angle;
      return;
    }

    // Perform dash
    if (event.button === 2) {
      this.player.stateMachine.set('dash');
      this.player.movement.angle = angle;
    }
  }

  setPlayer(player: Player) {
    this.player = {
      movement: player.get(MovementComponent),
      stateMachine: player.get(StateMachineComponent),
    };
  }

  update() {
    if (!this.player.stateMachine.is(['idle', 'run'])) {
      return;
    }

    const isMoving = Object.values(this.input).reduce(
      (previous, current) => previous || current
    );

    // Set movement state
    this.player.stateMachine.set(isMoving ? 'run' : 'idle');

    // Set movement angle
    if (isMoving) {
      if (this.input.down) {
        if (this.input.left) {
          this.player.movement.angle = 135;
          return;
        }

        if (this.input.right) {
          this.player.movement.angle = 45;
          return;
        }

        this.player.movement.angle = 90;
        return;
      }

      if (this.input.up) {
        if (this.input.left) {
          this.player.movement.angle = 225;
          return;
        }

        if (this.input.right) {
          this.player.movement.angle = 315;
          return;
        }

        this.player.movement.angle = 270;
        return;
      }

      if (this.input.left) {
        this.player.movement.angle = 180;
        return;
      }

      this.player.movement.angle = 0;
    }
  }
}
