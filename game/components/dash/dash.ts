import { Component } from '~~/game/utils';

export class Dash implements Component {
  readonly deceleration: number;

  readonly maxSpeed: number;

  readonly recoveryTime: number;

  dashing = false;

  speed: number;

  constructor(maxSpeed: number, deceleration: number, recoveryTime: number) {
    this.deceleration = deceleration;
    this.maxSpeed = maxSpeed;
    this.recoveryTime = recoveryTime;
    this.speed = maxSpeed;
  }

  reset() {
    this.dashing = false;
    this.speed = this.maxSpeed;
  }
}
