import { MovementComponent, StateMachineComponent } from '~~/game/components';
import { Player } from '~~/game/entities';
import { DialogueManager, EventManager } from '~~/game/managers';
import { getAngleFromPoints, Settings, System } from '~~/game/utils';

const defaultInput = {
  movement: {
    up: false,
    down: false,
    left: false,
    right: false,
  },
  interact: false,
};

export class PlayerSystem extends System {
  protected readonly requiredComponents = [];

  private player!: {
    movement: MovementComponent;
    stateMachine: StateMachineComponent;
  };

  private input = defaultInput;

  private prompting: (() => void) | null = null;

  constructor() {
    super();

    const keyListener = (event: KeyboardEvent) => this.bindKeys(event);
    const clickListener = (event: MouseEvent) => this.handleClick(event);
    const contextMenuListener = (event: MouseEvent) => event.preventDefault();

    window.addEventListener('keydown', keyListener);
    window.addEventListener('keyup', keyListener);
    window.addEventListener('mousedown', clickListener);
    window.addEventListener('contextmenu', contextMenuListener);

    EventManager.on('show-prompt', (_prompt, accept) => {
      this.prompting = accept;
    });

    EventManager.on('hide-prompt', () => {
      this.prompting = null;
    });
  }

  private bindKeys(event: KeyboardEvent) {
    const inputState = event.type === 'keydown';

    this.input = defaultInput;

    switch (event.key) {
      case 'z':
      case 'ArrowUp':
        this.input.movement.up = inputState;
        break;

      case 's':
      case 'ArrowDown':
        this.input.movement.down = inputState;
        break;

      case 'q':
      case 'ArrowLeft':
        this.input.movement.left = inputState;
        break;

      case 'd':
      case 'ArrowRight':
        this.input.movement.right = inputState;
        break;

      case 'e':
        this.input.interact = inputState;
        break;

      default:
        break;
    }
  }

  private handleClick(event: MouseEvent) {
    if (
      !this.player.stateMachine.is(['idle', 'run']) ||
      (event.target as HTMLElement).tagName !== 'CANVAS' ||
      DialogueManager.isOpen()
    ) {
      return;
    }

    // Get angle of the click based on the player's position
    const cursorX = Math.round(
      -Settings.cameraOffset.x + event.clientX / Settings.ratio
    );
    const cursorY = Math.round(
      -Settings.cameraOffset.y + event.clientY / Settings.ratio
    );
    const [{ x, y }] = EventManager.emit('get-player-position');
    const angle = getAngleFromPoints(cursorX, cursorY, x, y);

    this.player.movement.angle = angle;

    // Perform melee attack
    if (event.button === 0) {
      this.player.stateMachine.set('melee-attack');
      return;
    }

    // Perform dash
    if (event.button === 2) {
      this.player.stateMachine.set('dash');
    }
  }

  setPlayer(player: Player) {
    this.player = {
      movement: player.get(MovementComponent),
      stateMachine: player.get(StateMachineComponent),
    };
  }

  update() {
    if (DialogueManager.isOpen()) {
      return;
    }

    // Handle prompt
    if (this.prompting && this.input.interact) {
      this.prompting();
      this.prompting = null;
      EventManager.emit('hide-prompt');
      this.player.stateMachine.set('idle');
      return;
    }

    if (!this.player.stateMachine.is(['idle', 'run'])) {
      return;
    }

    const entry = Object.values(this.input.movement).reduce(
      (previous, current) => previous || current
    );

    // Set movement state
    this.player.stateMachine.set(entry ? 'run' : 'idle');

    if (!entry) {
      return;
    }

    // Set movement angle
    const { up, down, left, right } = this.input.movement;
    if (down) {
      if (left) {
        this.player.movement.angle = 135;
        return;
      }

      if (right) {
        this.player.movement.angle = 45;
        return;
      }

      this.player.movement.angle = 90;
      return;
    }

    if (up) {
      if (left) {
        this.player.movement.angle = 225;
        return;
      }

      if (right) {
        this.player.movement.angle = 315;
        return;
      }

      this.player.movement.angle = 270;
      return;
    }

    if (left) {
      this.player.movement.angle = 180;
      return;
    }

    this.player.movement.angle = 0;
  }
}
