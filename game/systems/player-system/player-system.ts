import { MovementComponent, StateMachineComponent } from '~~/game/components';
import { Player } from '~~/game/entities';
import { DialogueManager, EventManager } from '~~/game/managers';
import {
  Controller,
  getAngleFromPoints,
  getDegreeFromRadian,
  Settings,
  System,
} from '~~/game/utils';
import { Keyboard, PlayerInput } from './types';

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

  private input: PlayerInput = {
    angle: 90,
    interact: false,
    running: false,
  };

  private keyboard: Keyboard = defaultKeyboard;

  private passiveController = new Controller();

  private activeController = new Controller();

  private interact = false;

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

    this.setupControllerListeners();

    EventManager.on('show-prompt', (_prompt, accept) => {
      this.prompting = accept;
    });

    EventManager.on('hide-prompt', () => {
      this.prompting = null;
    });
  }

  private bindKeys(event: KeyboardEvent) {
    Settings.usingGamepad = false;

    const inputState = event.type === 'keydown';
    this.keyboard = defaultKeyboard;

    switch (event.key) {
      case 'w':
      case 'z':
      case 'ArrowUp':
        this.keyboard.up = inputState;
        break;

      case 's':
      case 'ArrowDown':
        this.keyboard.down = inputState;
        break;

      case 'a':
      case 'q':
      case 'ArrowLeft':
        this.keyboard.left = inputState;
        break;

      case 'd':
      case 'ArrowRight':
        this.keyboard.right = inputState;
        break;

      case 'e':
        this.interact = inputState;
        break;

      default:
        break;
    }
  }

  private handleClick(event: MouseEvent) {
    Settings.usingGamepad = false;

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

  private updateKeyboard() {
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

  private setupControllerListeners() {
    this.passiveController
      .on('joystick-left', ({ x, y }) => {
        this.input.angle = getDegreeFromRadian(Math.atan2(y, x));
        this.input.running = true;
      })
      .on(3, () => {
        this.interact = true;
      });

    this.activeController
      .startWatching()
      .on(0, () => {
        this.player.stateMachine.set('dash');
      })
      .on(2, () => {
        this.player.stateMachine.set('melee-attack');
      })
      .onAny(() => {
        Settings.usingGamepad = true;
      })
      .if(
        () =>
          !Settings.paused &&
          !DialogueManager.isOpen() &&
          this.player.stateMachine.is(['idle', 'run'])
      );
  }

  setPlayer(player: Player) {
    this.player = {
      movement: player.get(MovementComponent),
      stateMachine: player.get(StateMachineComponent),
    };
    this.input.angle = this.player.movement.angle;
  }

  update() {
    if (DialogueManager.isOpen()) {
      return;
    }

    // Handle prompt
    if (this.prompting && this.interact) {
      this.prompting();
      this.prompting = null;
      EventManager.emit('hide-prompt');
      this.player.stateMachine.set('idle');
      return;
    }

    if (!this.player.stateMachine.is(['idle', 'run'])) {
      return;
    }

    if (Settings.usingGamepad) {
      this.input.running = false;
      this.interact = false;
      this.passiveController.update();
    } else {
      this.updateKeyboard();
    }

    this.player.movement.angle = this.input.angle;
    this.player.stateMachine.set(this.input.running ? 'run' : 'idle');
  }
}
