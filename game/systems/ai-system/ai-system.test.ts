import { describe, expect, it } from 'vitest';
import {
  AIComponent,
  MovementComponent,
  PositionComponent,
  StateMachineComponent,
} from '~~/game/components';
import { EventManager } from '~~/game/managers';
import { Entity } from '~~/game/utils';
import { AISystem } from './ai-system';

class AI extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new AIComponent(x, y, 100, 125, 50, 75, 20, 10));
    this.add(new PositionComponent(x, y, 32, 32));
    this.add(new MovementComponent(2, 0.1, 0.2));
    this.add(new StateMachineComponent());
  }
}

describe('ai system', () => {
  const ai = new AI(100, 100);
  const position = ai.get(PositionComponent);
  const movement = ai.get(MovementComponent);
  const stateMachine = ai.get(StateMachineComponent);

  const aiSystem = new AISystem();
  aiSystem.check(ai);

  const updateAISystem = (times: number) => {
    [...new Array(times)].forEach(() => aiSystem.update());
  };

  EventManager.on('get-player-position', () => ({
    x: 200,
    y: 200,
  }));

  it('should start with idle state', () => {
    expect(stateMachine.get()).toBe('idle');
  });

  it('should wander to a random target position', () => {
    updateAISystem(400);

    expect(stateMachine.get()).toBe('run');
  });

  it('should not detect the player', () => {
    position.x = 200;
    position.y = 350;
    movement.angle = 90;

    updateAISystem(2);

    expect(stateMachine.is(['chase'])).toBeFalsy();
  });

  it('should detect the player', () => {
    position.x = 200;
    position.y = 160;
    movement.angle = 90;

    updateAISystem(2);

    expect(stateMachine.get()).toBe('chase');
  });

  it('should perform melee attack', () => {
    position.y = 190;

    updateAISystem(2);

    expect(stateMachine.get()).toBe('melee-attack-anticipation');
  });
});
