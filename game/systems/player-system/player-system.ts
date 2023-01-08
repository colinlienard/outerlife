import { MovementComponent, StateMachineComponent } from '~~/game/components';
import { Player } from '~~/game/entities';
import { DialogueManager, EventManager } from '~~/game/managers';
import {
  getAngleFromPoints,
  getDegreeFromRadian,
  Settings,
  System,
} from '~~/game/utils';
import { Keyboard, PlayerInput } from './types';

const defaultInput: PlayerInput = {
  angle: 0,
  running: false,
  interact: false,
};

const defaultKeyboard: Keyboard = {
  up: false,
  down: false,
  left: false,
  right: false,
};

export class PlayerSystem extends System {
  protected readonly requiredComponents = [];

  private player!: {
    movement: MovementComponent;
    stateMachine: StateMachineComponent;
  };

  private input: PlayerInput = defaultInput;

  private keyboard: Keyboard = defaultKeyboard;

  private usingGamepad = false;

  private prompting: (() => void) | null = null;

  constructor() {
    super();

    const keyListener = (event: KeyboardEvent) => this.bindKeys(event);
    const clickListener = (event: MouseEvent) => this.handleClick(event);
    const contextMenuListener = (event: MouseEvent) => event.preventDefault();
    const gamepadConnectedListener = () => {
      this.usingGamepad = true;
    };
    const gamepadDisconnectedListener = () => {
      this.usingGamepad = false;
    };

    window.addEventListener('keydown', keyListener);
    window.addEventListener('keyup', keyListener);
    window.addEventListener('mousedown', clickListener);
    window.addEventListener('contextmenu', contextMenuListener);
    window.addEventListener('gamepadconnected', gamepadConnectedListener);
    window.addEventListener('gamepaddisconnected', gamepadDisconnectedListener);

    EventManager.on('show-prompt', (_prompt, accept) => {
      this.prompting = accept;
    });

    EventManager.on('hide-prompt', () => {
      this.prompting = null;
    });
  }

  private bindKeys(event: KeyboardEvent) {
    this.usingGamepad = false;
    const inputState = event.type === 'keydown';

    this.keyboard = defaultKeyboard;

    switch (event.key) {
      case 'z':
      case 'ArrowUp':
        this.keyboard.up = inputState;
        break;

      case 's':
      case 'ArrowDown':
        this.keyboard.down = inputState;
        break;

      case 'q':
      case 'ArrowLeft':
        this.keyboard.left = inputState;
        break;

      case 'd':
      case 'ArrowRight':
        this.keyboard.right = inputState;
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

    this.input.angle = angle;
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

  private handleKeyboard() {
    const entry = Object.values(this.keyboard).reduce(
      (previous, current) => previous || current
    );
    this.input.running = entry;

    if (!entry) {
      return;
    }

    // Set movement angle
    const { up, down, left, right } = this.keyboard;
    if (down) {
      if (left) {
        this.input.angle = 135;
        return;
      }

      if (right) {
        this.input.angle = 45;
        return;
      }

      this.input.angle = 90;
      return;
    }

    if (up) {
      if (left) {
        this.input.angle = 225;
        return;
      }

      if (right) {
        this.input.angle = 315;
        return;
      }

      this.input.angle = 270;
      return;
    }

    if (left) {
      this.input.angle = 180;
      return;
    }

    this.input.angle = 0;
  }

  private handleGamepad() {
    const gamepad = navigator.getGamepads()[0];
    if (!gamepad) {
      this.usingGamepad = false;
      return;
    }

    const x = gamepad.axes[0];
    const y = gamepad.axes[1];

    if (Math.abs(x) < 0.2 && Math.abs(y) < 0.2) {
      this.input.running = false;
      return;
    }

    this.input.running = true;
    this.input.angle = getDegreeFromRadian(Math.atan2(y, x));
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

    // Reset input
    this.input = defaultInput;

    // Set input
    if (this.usingGamepad) {
      this.handleGamepad();
    } else {
      this.handleKeyboard();
    }

    // Apply input to the player
    this.player.stateMachine.set(this.input.running ? 'run' : 'idle');
    this.player.movement.angle = this.input.angle;
  }
}
