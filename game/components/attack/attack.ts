import { Component } from '~~/game/utils';

export class Attack implements Component {
  readonly deceleration: number;

  readonly maxSpeed: number;

  attacking = false;

  speed: number;

  constructor(maxSpeed: number, deceleration: number) {
    this.deceleration = deceleration;
    this.maxSpeed = maxSpeed;
    this.speed = maxSpeed;
  }

  reset() {
    this.attacking = false;
    this.speed = this.maxSpeed;
  }
}
