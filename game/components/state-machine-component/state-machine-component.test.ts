import { describe, expect, it } from 'vitest';
import { Entity } from '~~/game/utils';
import { StateMachineComponent } from './state-machine-component';

class StateEntity extends Entity {
  constructor() {
    super();
    this.add(new StateMachineComponent());
  }
}

describe('state machine component', () => {
  const entity = new StateEntity();
  const stateMachine = entity.get(StateMachineComponent);

  const updateState = (times: number) => {
    [...new Array(times)].forEach(() => {
      stateMachine.on({
        idle: () => {},
        run: () => {},
      });
      stateMachine.interact({
        idle: ({ stateChanged }) => {
          if (stateChanged) {
            stateMachine.timer(4);
            return;
          }

          if (stateMachine.timer()) {
            stateMachine.set('run');
          }
        },
        run: ({ stateChanged }) => {
          if (stateChanged) {
            stateMachine.timer(8);
            return;
          }

          if (stateMachine.timer()) {
            stateMachine.set('idle');
          }
        },
      });
    });
  };

  it('should start with the idle state', () => {
    expect(stateMachine.get()).toBe('idle');
  });

  it('should idle for a bit and then run', () => {
    updateState(4);
    expect(stateMachine.get()).toBe('idle');

    updateState(1);
    expect(stateMachine.get()).toBe('run');
  });

  it('should run for a bit and then idle', () => {
    updateState(8);
    expect(stateMachine.get()).toBe('run');

    updateState(1);
    expect(stateMachine.get()).toBe('idle');
  });
});
