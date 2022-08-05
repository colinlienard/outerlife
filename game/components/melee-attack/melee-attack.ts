import { Component } from '~~/game/utils';

export class MeleeAttack implements Component {
  readonly deceleration: number;

  readonly maxSpeed: number;

  readonly range: number;

  attacking = false;

  speed: number;

  constructor(range: number, maxSpeed: number, deceleration: number) {
    this.deceleration = deceleration;
    this.maxSpeed = maxSpeed;
    this.range = range;
    this.speed = maxSpeed;
  }

  reset() {
    this.attacking = false;
    this.speed = this.maxSpeed;
  }
}
