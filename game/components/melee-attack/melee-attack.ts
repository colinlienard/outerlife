import { Component, EntityConstructor } from '~~/game/utils';

export class MeleeAttack implements Component {
  readonly deceleration: number;

  readonly effect: EntityConstructor | undefined = undefined;

  readonly maxSpeed: number;

  readonly range: number;

  attacking = false;

  speed: number;

  constructor(
    range: number,
    maxSpeed: number,
    deceleration: number,
    effect?: EntityConstructor
  ) {
    this.deceleration = deceleration;
    this.effect = effect;
    this.maxSpeed = maxSpeed;
    this.range = range;
    this.speed = maxSpeed;
  }

  reset() {
    this.attacking = false;
    this.speed = this.maxSpeed;
  }
}
