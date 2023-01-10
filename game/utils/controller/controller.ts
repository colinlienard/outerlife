import { ControllerEvent, ControllerEventCallback, Events } from './types';

export abstract class Controller {
  private static readonly deadzone = 0.2;

  private static events: Events<ControllerEvent> = new Map();

  private static buttons = new Array(16).map(() => false);

  private static update() {
    const gamepad = navigator.getGamepads()[0];
    if (!gamepad) {
      return;
    }

    // Handle left joystick
    const joystickLeftX = gamepad.axes[0];
    const joystickLeftY = gamepad.axes[1];
    if (
      Math.abs(joystickLeftX) > this.deadzone ||
      Math.abs(joystickLeftY) > this.deadzone
    ) {
      this.events.get('joystick-left')?.forEach((callback) => {
        callback({ x: joystickLeftX, y: joystickLeftY });
      });
    }

    // Handle right joystick
    const joystickRightX = gamepad.axes[2];
    const joystickRightY = gamepad.axes[3];
    if (
      Math.abs(joystickRightX) > this.deadzone ||
      Math.abs(joystickRightY) > this.deadzone
    ) {
      this.events.get('joystick-right')?.forEach((callback) => {
        callback({ x: joystickRightX, y: joystickRightY });
      });
    }

    // Handle all buttons
    this.buttons = gamepad.buttons.map((button, index) => {
      if (button.pressed && !this.buttons[index]) {
        this.events
          .get(index)
          ?.forEach((callback) => (callback as () => void)());
      }

      return button.pressed;
    });
  }

  static loop() {
    this.update();
    requestAnimationFrame(() => this.loop());
  }

  static on<C extends ControllerEvent>(
    event: C,
    callback: ControllerEventCallback<C>
  ) {
    this.events.set(event, [...(this.events.get(event) || []), callback]);
  }

  static unbind(event: ControllerEvent) {
    this.events.delete(event);
  }
}

Controller.loop();
