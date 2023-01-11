/* eslint-disable class-methods-use-this */
import { ControllerEvent, ControllerEventCallback, Events } from './types';

export class Controller {
  private readonly deadzone = 0.2;

  private events: Events<ControllerEvent> = new Map();

  private runOnAny: () => void = () => null;

  private runIf: () => boolean = () => true;

  private buttons = new Array(16).map(() => false);

  private loopId = 0;

  private loop() {
    this.update();
    this.loopId = requestAnimationFrame(() => this.loop());
  }

  update() {
    const gamepad = navigator.getGamepads()[0];
    if (!gamepad) {
      return this;
    }

    // Handle all buttons
    this.buttons = gamepad.buttons.map((button, index) => {
      if (button.pressed && !this.buttons[index] && this.runIf()) {
        this.events
          .get(index)
          ?.forEach((callback) => (callback as () => void)());
        this.runOnAny();
      }

      return button.pressed;
    });

    if (!this.runIf()) {
      return this;
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
      this.runOnAny();
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
      this.runOnAny();
    }

    return this;
  }

  on<C extends ControllerEvent>(
    event: C,
    callback: ControllerEventCallback<C>
  ) {
    this.events.set(event, [...(this.events.get(event) || []), callback]);
    return this;
  }

  onAny(callback: () => void) {
    this.runOnAny = callback;
    return this;
  }

  if(callback: () => boolean) {
    this.runIf = callback;
    return this;
  }

  unbind(event: ControllerEvent) {
    this.events.delete(event);
    return this;
  }

  startWatching() {
    this.loop();
    return this;
  }

  stopWatching() {
    cancelAnimationFrame(this.loopId);
    return this;
  }
}
