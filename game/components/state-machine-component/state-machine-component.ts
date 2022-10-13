import { Component, EntityState } from '~~/game/utils';

export class StateMachineComponent implements Component {
  private state: EntityState = 'idle';

  private hasChanged = true;

  private frameWaiter = 0;

  private framesToWait = 0;

  on(actions: Partial<Record<EntityState, () => void>>) {
    for (const [state, action] of Object.entries(actions)) {
      if (state === this.state) {
        action();
        return;
      }
    }
  }

  interact(
    actions: Partial<
      Record<EntityState, ({ stateChanged }: { stateChanged: boolean }) => void>
    >
  ) {
    for (const [state, action] of Object.entries(actions)) {
      if (state === this.state) {
        const stateChanged = this.hasChanged;
        this.hasChanged = false;
        action({ stateChanged });
        return;
      }
    }
  }

  is(states: EntityState[]) {
    for (const state of states) {
      if (state === this.state) {
        return true;
      }
    }
    return false;
  }

  get() {
    return this.state;
  }

  set(state: EntityState) {
    if (state !== this.state) {
      this.state = state;
      this.hasChanged = true;
    }
  }

  timer(framesToWait?: number) {
    // Start
    if (framesToWait) {
      this.frameWaiter = 0;
      this.framesToWait = framesToWait;
      return false;
    }

    // Update
    this.frameWaiter += 1;

    // Return true is the timer is ended
    return this.frameWaiter >= this.framesToWait;
  }
}
