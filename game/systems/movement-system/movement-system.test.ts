import { describe, expect, it } from 'vitest';
import {
  PositionComponent,
  MovementComponent,
  StateMachineComponent,
  DashComponent,
  MeleeAttackComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';
import { MovementSystem } from './movement-system';

class MovingEntity extends Entity {
  constructor() {
    super();
    this.add(new DashComponent(8, 10, 1, false));
    this.add(new PositionComponent(0, 0));
    this.add(new MeleeAttackComponent(4, 1, false));
    this.add(new MovementComponent(2, 0.1, 0.2));
    this.add(new StateMachineComponent());
  }
}

describe('movement system', () => {
  const entity = new MovingEntity();
  const position = entity.get(PositionComponent);
  const movement = entity.get(MovementComponent);
  const stateMachine = entity.get(StateMachineComponent);

  const movementSystem = new MovementSystem();
  movementSystem.check(entity);

  const resetMovement = () => {
    movement.angle = 45;
    movement.speed = 0;
    position.x = 0;
    position.y = 0;
  };

  it("should change the entity's position when running", () => {
    stateMachine.set('run');
    resetMovement();

    movementSystem.update();

    expect(position.x).toBeGreaterThan(0);
    expect(position.y).toBeGreaterThan(0);
  });

  it("should change the entity's position when dashing", () => {
    stateMachine.set('dash');
    resetMovement();

    movementSystem.update();

    expect(position.x).toBeGreaterThan(0);
    expect(position.y).toBeGreaterThan(0);
  });

  it("should change the entity's position when performing melee attack", () => {
    stateMachine.set('melee-attack');
    resetMovement();

    movementSystem.update();

    expect(position.x).toBeGreaterThan(0);
    expect(position.y).toBeGreaterThan(0);
  });
});
